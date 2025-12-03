"use strict";

const {logger} = require("firebase-functions");
const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {getMessaging} = require("firebase-admin/messaging");

initializeApp();

/**
 * Converts Firestore Map field to array if needed.
 * @param {any} value - The field value (array or map).
 * @return {Array} - Always returns an array.
 */
function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (value && typeof value === "object") {
    return Object.values(value).filter((v) => typeof v === "number");
  }
  return [];
}

/**
 * Handles the timer for a newly created ride request in the instantRide subcollection,
 * managing driver assignments and reassignments.
 * @param {functions.firestore.Event} event - The event triggered by document creation.
 * @return {Promise<null>} A promise that resolves when the operation is complete.
 */
exports.handleDriverRideRequestTimer = onDocumentCreated(
  "ride_requests/{rideId}",
  async (event) => {
    const rideId = event.params.rideId;
    const snap = event.data;

    logger.info("FUNCTION_START", {rideId, event: "onDocumentCreated"});

    if (!snap.exists) {
      logger.warn("NO_SNAPSHOT", {rideId});
      return null;
    }

    const rideData = snap.data();
    if (!rideData) {
      logger.error("No ride data found for rideId:", rideId);
      return null;
    }

    logger.debug("RIDE_DATA_RECEIVED", {rideId, rideData});

    // === 1. BIDDING CHECK ===
    const isBidding = rideData.is_bidding === "1";
    if (isBidding && rideData.service_category.service_category_type !== "package") {
      logger.info("BIDDING_ENABLED_SKIP", {rideId, isBidding: true});
      return null;
    }

    // === 2. DETERMINE ACCEPT TIME & SUBREF ===
    let acceptTimeMs = parseInt(rideData.driver_ride_request_accept_time || 3, 10) * 1000;
    const rideRef = getFirestore().collection("ride_requests").doc(rideId);
    let subRef = null;

    try {
      if (rideData.service.service_type === "cab") {
        const cat = rideData.service_category.service_category_type;
        if (cat === "rental") {
          acceptTimeMs = parseInt(rideData.driver_amb_rent_ride_req_time || 3, 10) * 1000;
          subRef = rideRef.collection("rental_requests").doc(rideId);
          logger.info("RENTAL_MODE", {rideId, acceptTimeMs});
        } else if (["package", "ride", "intercity", "schedule"].includes(cat)) {
          subRef = rideRef.collection("instantRide").doc(rideId);
          logger.info("INSTANT_RIDE_MODE", {rideId, acceptTimeMs, category: cat});
        } else {
          throw new Error(`Unknown category: ${cat}`);
        }
      } else if (rideData.service.service_type === "parcel") {
        subRef = rideRef.collection("instantRide").doc(rideId);
        logger.info("PARCEL_MODE", {rideId, acceptTimeMs});
      } else {
        throw new Error(`Unknown service type: ${rideData.service.service_type}`);
      }
    } catch (err) {
      logger.error("INVALID_SERVICE_CONFIG", {rideId, error: err.message});
      return null;
    }

    if (!subRef) {
      logger.error("SUBREF_NULL", {rideId});
      return null;
    }

    // === 3. WAIT FOR SUBDOC ===
    let subSnap = await subRef.get();
    let retry = 0;
    while (!subSnap.exists && retry < 3) {
      retry++;
      logger.warn("SUBDOC_NOT_FOUND_RETRY", {rideId, path: subRef.path, retry});
      await new Promise((r) => setTimeout(r, 1000));
      subSnap = await subRef.get();
    }

    if (!subSnap.exists) {
      logger.error("SUBDOC_MISSING_PERMANENT", {rideId, path: subRef.path});
      return null;
    }

    let subData = subSnap.data();
    logger.info("SUBDOC_LOADED", {
      rideId,
      path: subRef.path,
      current_driver_id: subData.current_driver_id,
      eligible_count: toArray(subData.eligible_driver_ids).length,
      queue_count: toArray(subData.queue_driver_id).length,
    });

    let currentDriverId = subData.current_driver_id;
    if (!currentDriverId) {
      logger.error("NO_CURRENT_DRIVER_ID", {rideId, subData});
      return null;
    }

    // === 4. MAIN PER-DRIVER LOOP ===
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const timerExpiresAt = Date.now() + acceptTimeMs;

      logger.info("TIMER_START", {
        rideId,
        currentDriverId,
        acceptTimeMs,
        expiresAt: new Date(timerExpiresAt).toISOString(),
      });

      try {
        await subRef.update({
          timer_expires_at: new Date(timerExpiresAt).toISOString(),
          status: subData.status || "pending",
        });
        logger.debug("TIMER_UPDATED", {rideId, currentDriverId});
      } catch (err) {
        logger.error("TIMER_UPDATE_FAILED", {rideId, error: err.message});
        break;
      }

      await new Promise((r) => setTimeout(r, acceptTimeMs));

      subSnap = await subRef.get();
      subData = subSnap.data();
      logger.info("TIMER_EXPIRED_CHECK_STATUS", {
        rideId,
        currentDriverId,
        newStatus: subData.status,
        accepted: subData.status === "accepted",
        rejected: subData.status === "rejected",
      });

      if (subData.status === "accepted" || subData.status === "rejected") {
        logger.info("DRIVER_RESPONDED_EXIT", {
          rideId,
          driverId: currentDriverId,
          status: subData.status,
        });
        break;
      }

      logger.warn("DRIVER_IGNORED_REJECTING", {rideId, driverId: currentDriverId});

      const rejected = toArray(subData.rejected_driver_ids);
      if (!rejected.includes(currentDriverId)) rejected.push(currentDriverId);

      let nextDriverId = null;
      try {
        nextDriverId = await getFirestore().runTransaction(async (tx) => {
          const freshSnap = await tx.get(subRef);
          const fresh = freshSnap.data();

          const eligibleRaw = toArray(fresh.eligible_driver_ids);
          const queueRaw = toArray(fresh.queue_driver_id);

          let eligible = eligibleRaw.filter((id) => id !== currentDriverId);
          const queue = [...queueRaw];
          logger.debug("TRANSACTION_START", {
            rideId,
            eligible_count: eligible.length,
            queue_count: queue.length,
          });

          while (eligible.length > 0) {
            const cand = eligible[Math.floor(Math.random() * eligible.length)];
            const drvRef = getFirestore().collection("driver_ride_requests").doc(cand.toString());
            const drvSnap = await tx.get(drvRef);

            if (!drvSnap.exists) {
              logger.info("DRIVER_IDLE_ASSIGNING", {rideId, driverId: cand});
              tx.set(
                drvRef,
                {ride_requests: [{id: rideId, driver_id: cand}]},
                {merge: true},
              );
              tx.update(subRef, {
                current_driver_id: cand,
                rejected_driver_ids: rejected,
                eligible_driver_ids: eligible.filter((e) => e !== cand),
              });
              return cand;
            }

            logger.info("DRIVER_BUSY_QUEUING", {rideId, driverId: cand});
            if (!queue.includes(cand)) queue.push(cand);
            eligible = eligible.filter((e) => e !== cand);
          }

          while (queue.length > 0) {
            const cand = queue.shift();
            const drvRef = getFirestore().collection("driver_ride_requests").doc(cand.toString());
            const drvSnap = await tx.get(drvRef);

            if (!drvSnap.exists) {
              logger.info("QUEUE_DRIVER_NOW_IDLE_ASSIGN", {rideId, driverId: cand});
              tx.set(
                drvRef,
                {ride_requests: [{id: rideId, driver_id: cand}]},
                {merge: true},
              );
              tx.update(subRef, {
                current_driver_id: cand,
                rejected_driver_ids: rejected,
                queue_driver_id: queue,
              });
              return cand;
            }
            logger.info("QUEUE_DRIVER_STILL_BUSY_REJECT", {rideId, driverId: cand});
            rejected.push(cand);
          }

          logger.warn("ALL_DRIVERS_EXHAUSTED_CANCELLING", {rideId});
          tx.update(subRef, {
            status: "cancelled",
            rejected_driver_ids: rejected,
          });
          tx.update(rideRef, {
            cancellation_reason: "System cancelled automatically.",
          });
          return null;
        });
      } catch (err) {
        logger.error("TRANSACTION_FAILED", {rideId, error: err.message});
        nextDriverId = null;
      }

      if (!nextDriverId) {
        logger.info("RIDE_CANCELLED_NO_DRIVERS", {rideId});
        break;
      }

      currentDriverId = nextDriverId;
      logger.info("NEXT_DRIVER_ASSIGNED", {rideId, nextDriverId});
    }

    logger.info("FUNCTION_END", {rideId});
    return null;
  },
);

/**
 * Global timer to cancel ride if no driver assigned within user limit.
 * @param {functions.firestore.Event} event - The event triggered by document creation.
 * @return {Promise<null>}
 */
exports.handleDriverRideRequestTimer = onDocumentCreated(
  "ride_requests/{rideId}",
  async (event) => {
    const rideId = event.params.rideId;
    const snap = event.data;

    logger.info("FUNCTION_START", {rideId, event: "onDocumentCreated"});

    if (!snap.exists) {
      logger.warn("NO_SNAPSHOT", {rideId});
      return null;
    }

    const rideData = snap.data();
    logger.debug("RIDE_DATA_RECEIVED", {rideId, rideData});

    // === 1. BIDDING CHECK ===
    const isBidding = rideData.is_bidding === "1";
    if (isBidding && rideData.service_category.service_category_type !== "package") {
      logger.info("BIDDING_ENABLED_SKIP", {rideId, isBidding: true});
      return null;
    }

    // === 2. DETERMINE ACCEPT TIME & SUBREF ===
    let acceptTimeMs = parseInt(rideData.driver_ride_request_accept_time || 3, 10) * 1000;
    const rideRef = getFirestore().collection("ride_requests").doc(rideId);
    let subRef = null;

    try {
      if (rideData.service.service_type === "cab") {
        const cat = rideData.service_category.service_category_type;
        if (cat === "rental") {
          acceptTimeMs = parseInt(rideData.driver_amb_rent_ride_req_time || 3, 10) * 1000;
          subRef = rideRef.collection("rental_requests").doc(rideId);
          logger.info("RENTAL_MODE", {rideId, acceptTimeMs});
        } else if (["package", "ride", "intercity", "schedule"].includes(cat)) {
          subRef = rideRef.collection("instantRide").doc(rideId);
          logger.info("INSTANT_RIDE_MODE", {rideId, acceptTimeMs, category: cat});
        } else {
          throw new Error(`Unknown category: ${cat}`);
        }
      } else if (rideData.service.service_type === "parcel") {
        subRef = rideRef.collection("instantRide").doc(rideId);
        logger.info("PARCEL_MODE", {rideId, acceptTimeMs});
      } else {
        throw new Error(`Unknown service type: ${rideData.service.service_type}`);
      }
    } catch (err) {
      logger.error("INVALID_SERVICE_CONFIG", {rideId, error: err.message});
      return null;
    }

    if (!subRef) {
      logger.error("SUBREF_NULL", {rideId});
      return null;
    }

    // === 3. WAIT FOR SUBDOC ===
    let subSnap = await subRef.get();
    let retry = 0;
    while (!subSnap.exists && retry < 3) {
      retry++;
      logger.warn("SUBDOC_NOT_FOUND_RETRY", {rideId, path: subRef.path, retry});
      await new Promise((r) => setTimeout(r, 1000));
      subSnap = await subRef.get();
    }

    if (!subSnap.exists) {
      logger.error("SUBDOC_MISSING_PERMANENT", {rideId, path: subRef.path});
      return null;
    }

    let subData = subSnap.data();
    logger.info("SUBDOC_LOADED", {
      rideId,
      path: subRef.path,
      current_driver_id: subData.current_driver_id,
      eligible_count: toArray(subData.eligible_driver_ids).length,
      queue_count: toArray(subData.queue_driver_id).length,
    });

    let currentDriverId = subData.current_driver_id;
    if (!currentDriverId) {
      logger.error("NO_CURRENT_DRIVER_ID", {rideId, subData});
      return null;
    }

    // === 4. MAIN PER-DRIVER LOOP ===
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const timerExpiresAt = Date.now() + acceptTimeMs;

      logger.info("TIMER_START", {
        rideId,
        currentDriverId,
        acceptTimeMs,
        expiresAt: new Date(timerExpiresAt).toISOString(),
      });

      // === ENSURE ONLY CURRENT DRIVER HAS ASSIGNMENT ===
      const drvReqRef = getFirestore().collection("driver_ride_requests").doc(currentDriverId.toString());
      try {
        const drvSnap = await drvReqRef.get();
        if (!drvSnap.exists) {
          await drvReqRef.set(
            {ride_requests: [{id: rideId, driver_id: currentDriverId}]},
            {merge: true},
          );
          logger.info("ASSIGNMENT_CREATED", {rideId, driverId: currentDriverId});
        }
      } catch (err) {
        logger.error("ASSIGNMENT_CREATE_FAILED", {rideId, driverId: currentDriverId, error: err.message});
      }

      try {
        await subRef.update({
          timer_expires_at: new Date(timerExpiresAt).toISOString(),
          status: subData.status || "pending",
        });
        logger.debug("TIMER_UPDATED", {rideId, currentDriverId});
      } catch (err) {
        logger.error("TIMER_UPDATE_FAILED", {rideId, error: err.message});
        break;
      }

      await new Promise((r) => setTimeout(r, acceptTimeMs));

      subSnap = await subRef.get();
      subData = subSnap.data();
      logger.info("TIMER_EXPIRED_CHECK_STATUS", {
        rideId,
        currentDriverId,
        newStatus: subData.status,
      });

      // === DRIVER ACCEPTED OR REJECTED ===
      if (subData.status === "accepted" || subData.status === "rejected") {
        logger.info("DRIVER_RESPONDED_EXIT", {
          rideId,
          driverId: currentDriverId,
          status: subData.status,
        });
        break;
      }

      // === DRIVER IGNORED → REJECT + CLEANUP ===
      logger.warn("DRIVER_IGNORED_REJECTING", {rideId, driverId: currentDriverId});

      // 1. Delete current assignment
      await drvReqRef.delete().catch((err) =>
        logger.error("DELETE_ASSIGNMENT_FAILED", {rideId, driverId: currentDriverId, error: err.message}),
      );

      // 2. Mark as rejected
      const rejected = toArray(subData.rejected_driver_ids);
      if (!rejected.includes(currentDriverId)) rejected.push(currentDriverId);

      // === PICK NEXT DRIVER (TRANSACTION) ===
      let nextDriverId = null;
      try {
        nextDriverId = await getFirestore().runTransaction(async (tx) => {
          const freshSnap = await tx.get(subRef);
          const fresh = freshSnap.data();

          const eligibleRaw = toArray(fresh.eligible_driver_ids);
          const queueRaw = toArray(fresh.queue_driver_id);

          let eligible = eligibleRaw.filter((id) => id !== currentDriverId);
          const queue = [...queueRaw];

          logger.debug("TRANSACTION_PICK_NEXT", {
            rideId,
            eligible_count: eligible.length,
            queue_count: queue.length,
          });

          // Try eligible
          while (eligible.length > 0) {
            const cand = eligible[Math.floor(Math.random() * eligible.length)];
            const candRef = getFirestore().collection("driver_ride_requests").doc(cand.toString());
            const candSnap = await tx.get(candRef);

            if (!candSnap.exists) {
              logger.info("NEXT_DRIVER_FOUND_IDLE", {rideId, nextDriverId: cand});
              tx.update(subRef, {
                current_driver_id: cand,
                rejected_driver_ids: rejected,
                eligible_driver_ids: eligible.filter((e) => e !== cand),
              });
              return cand;
            }

            logger.info("DRIVER_BUSY_QUEUING", {rideId, driverId: cand});
            if (!queue.includes(cand)) queue.push(cand);
            eligible = eligible.filter((e) => e !== cand);
          }

          // Try queue
          while (queue.length > 0) {
            const cand = queue.shift();
            const candRef = getFirestore().collection("driver_ride_requests").doc(cand.toString());
            const candSnap = await tx.get(candRef);

            if (!candSnap.exists) {
              logger.info("QUEUE_DRIVER_NOW_IDLE", {rideId, nextDriverId: cand});
              tx.update(subRef, {
                current_driver_id: cand,
                rejected_driver_ids: rejected,
                queue_driver_id: queue,
              });
              return cand;
            }
            rejected.push(cand);
          }

          // All exhausted
          logger.warn("ALL_DRIVERS_EXHAUSTED", {rideId});
          tx.update(subRef, {status: "cancelled", rejected_driver_ids: rejected});
          tx.update(rideRef, {cancellation_reason: "System cancelled automatically."});
          return null;
        });
      } catch (err) {
        logger.error("TRANSACTION_FAILED", {rideId, error: err.message});
      }

      if (!nextDriverId) {
        logger.info("RIDE_CANCELLED_NO_DRIVERS", {rideId});
        break;
      }

      currentDriverId = nextDriverId;
      logger.info("NEXT_DRIVER_ASSIGNED", {rideId, nextDriverId});
    }

    logger.info("FUNCTION_END", {rideId});
    return null;
  },
);

/**
 * Global timer to cancel ride if no driver assigned within user limit.
 * @param {functions.firestore.Event} event - The event triggered by document creation.
 * @return {Promise<null>}
 */
exports.handleUserFindDriverTimer = onDocumentCreated(
  "ride_requests/{rideId}",
  async (event) => {
    const rideId = event.params.rideId;
    const snap = event.data;

    logger.info("USER_TIMER_START", {rideId});

    if (!snap.exists) {
      logger.warn("NO_SNAPSHOT_USER_TIMER", {rideId});
      return null;
    }

    const rideData = snap.data();
    const minutes = parseInt(rideData.find_driver_time_limit || 3, 10);
    const limitMs = minutes * 60 * 1000;

    logger.info("USER_TIMER_CONFIG", {
      rideId,
      minutes,
      limitMs,
      expiresAt: new Date(Date.now() + limitMs).toISOString(),
    });

    const rideRef = getFirestore().collection("ride_requests").doc(rideId);

    try {
      await rideRef.update({
        user_find_driver_timer_expires_at: new Date(Date.now() + limitMs).toISOString(),
      });
      logger.debug("USER_TIMER_SET", {rideId});
    } catch (err) {
      logger.error("USER_TIMER_UPDATE_FAILED", {rideId, error: err.message});
      return null;
    }

    await new Promise((r) => setTimeout(r, limitMs));

    const finalSnap = await rideRef.get();
    if (!finalSnap.exists) {
      logger.warn("RIDE_DELETED_DURING_TIMER", {rideId});
      return null;
    }

    const final = finalSnap.data();
    logger.info("USER_TIMER_EXPIRED_CHECK", {
      rideId,
      status: final.status,
      current_driver_id: final.current_driver_id,
      hasDriver: final.current_driver_id != null,
    });

    if (final.current_driver_id == null && final.status === "pending") {
      logger.warn("USER_TIMER_CANCELLING_NO_DRIVER", {rideId});

      try {
        await rideRef.update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancellation_reason: "No driver assigned within user find driver time limit",
        });
      } catch (err) {
        logger.error("CANCEL_UPDATE_FAILED", {rideId, error: err.message});
      }

      const driverIds = final.driverIds ? Object.values(final.driverIds).filter((v) => typeof v === "number") : [];

      if (driverIds.length > 0) {
        logger.info("CLEANING_STRAY_ASSIGNMENTS", {rideId, driverIds});
        await Promise.all(
          driverIds.map((did) =>
            getFirestore()
              .collection("driver_ride_requests")
              .doc(did.toString())
              .delete()
              .then(() => logger.debug("DELETED_STRAY", {rideId, driverId: did}))
              .catch((err) =>
                logger.error("DELETE_STRAY_FAILED", {rideId, driverId: did, error: err.message}),
              ),
          ),
        );
      }

      logger.info("USER_TIMER_CANCEL_COMPLETE", {rideId});
    } else {
      logger.info("USER_TIMER_NO_ACTION_NEEDED", {
        rideId,
        status: final.status,
        hasDriver: final.current_driver_id != null,
      });
    }

    logger.info("USER_TIMER_END", {rideId});
    return null;
  },
);

/**
 * Sends FCM notification when a new chat message is added.
 * @param {functions.firestore.Event} event - The update event on chats/{chatId}.
 * @return {Promise<null>}
 */
exports.sendChatNotification = onDocumentUpdated("chats/{chatId}", async (event) => {
  const snap = event.data;
  if (!snap) {
    logger.error("NO_SNAPSHOT_CHAT");
    return null;
  }

  const afterData = snap.after.data();
  const beforeData = snap.before.data();

  if (afterData.lastMessage === beforeData.lastMessage) {
    logger.log("NO_NEW_MESSAGE");
    return null;
  }

  const receiverId = afterData.lastMessage.receiverId;
  if (!receiverId) {
    logger.error("RECEIVER_ID_MISSING");
    return null;
  }

  let imageLink = "";
  if (Array.isArray(afterData.lastMessage.images) && afterData.lastMessage.images.length > 0) {
    imageLink = afterData.lastMessage.images[0];
  }

  const payload = {
    notification: {
      title: afterData.lastMessage.senderName,
      body: afterData.lastMessage.message || "You have a new message!",
      image: imageLink,
    },
    topic: `user_${receiverId}`,
  };

  try {
    const response = await getMessaging().send(payload);
    logger.log(`Notification sent to user_${receiverId} successfully:`, response);
  } catch (error) {
    logger.error("FCM_SEND_ERROR", {error: error.message});
  }

  return null;
});

/**
 * Send notification when new ride request is created (non-bidding)
 */
exports.notifyDriversOnNewRequest = onDocumentCreated(
  "ride_requests/{rideId}",
  async (event) => {
    const rideId = event.params.rideId;
    const snap = event.data;
    if (!snap.exists) return;

    const data = snap.data();
    logger.info("NEW_RIDE_REQUEST_CREATED", {rideId, data});

    // Skip bidding rides
    if (data.is_bidding === "1" && data.service_category.service_category_type !== "package") {
      logger.info("BIDDING_RIDE_SKIP_NOTIFICATION", {rideId});
      return;
    }

    // Wait a bit for instantRide subdoc to be created
    await new Promise((r) => setTimeout(r, 2000));

    const instantSnap = await getFirestore()
      .collection("ride_requests")
      .doc(rideId)
      .collection("instantRide")
      .doc(rideId)
      .get();

    if (!instantSnap.exists) {
      logger.warn("INSTANT_RIDE_SUBDOC_MISSING", {rideId});
      return;
    }

    const instantData = instantSnap.data();
    if (instantData.status !== "pending") return;

    const riderName = data.rider.name || "A rider";
    const currency = data.currency_symbol || "";
    const totalFare = data.total || data.ride_fare;
    const locations = data.locations || [];
    const fromTo = locations.length > 1 ? `${locations[0]} to ${locations[locations.length - 1]}` : locations[0] || "unknown location";

    const driverIds = [
      ...(toArray(instantData.eligible_driver_ids) || []),
      instantData.current_driver_id,
    ].filter(Boolean);

    if (driverIds.length === 0) {
      logger.warn("NO_DRIVERS_TO_NOTIFY", {rideId});
      return;
    }

    const messages = driverIds.map((id) => ({
      notification: {
        title: "🚗 New Ride Request Available!",
        body: `🤑 ${currency}${totalFare} ride waiting!\n🚕 ${riderName} from ${fromTo}\n🎯 Grab it before it’s gone!`,
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        type: "service_request",
        service_request_id: rideId,
      },
      topic: `user_${id}`,
    }));

    if (messages.length > 0) {
      for (const message of messages) {
        try {
          const res = await getMessaging().send(message);
          logger.info("DRIVERS_NOTIFIED", {
            rideId,
            sent: res.successCount,
            failed: res.failureCount,
          });
        } catch (err) {
          logger.error("NOTIFY_FAILED", {rideId, error: err.message});
        }
      }
    }
  },
);

/**
 * Notify rider & driver when bid is accepted
 */
exports.notifyBidAccepted = onDocumentUpdated(
  "ride_requests/{rideId}/bids/{bidId}",
  async (event) => {
    const rideId = event.params.rideId;
    const bidId = event.params.bidId;
    const snap = event.data;

    logger.info("TRIGGER_BID_UPDATED", {rideId, bidId});

    const before = snap.before.data();
    const after = snap.after.data();

    if (!after) {
      logger.warn("BID_AFTER_DATA_MISSING", {rideId, bidId});
      return;
    }

    if (before.status === after.status) {
      logger.info("BID_STATUS_NO_CHANGE", {rideId, bidId, status: after.status});
      return;
    }

    if (after.status !== "accepted") {
      logger.info("BID_NOT_ACCEPTED", {rideId, bidId, status: after.status});
      return;
    }

    logger.info("BID_ACCEPTED_DETECTED", {rideId, bidId, driverId: after.driver.id});

    const rideSnap = await getFirestore().collection("ride_requests").doc(rideId).get();
    if (!rideSnap.exists) {
      logger.error("RIDE_REQUEST_NOT_FOUND_ON_BID_ACCEPT", {rideId});
      return;
    }

    const rideData = rideSnap.data();
    const driverId = after.driver.id;
    const riderId = rideData.rider.id;
    const rideNumber = rideData.ride_number || rideId;

    logger.info("BID_ACCEPT_NOTIF_PREPARE", {rideId, rideNumber, driverId, riderId});

    const notifications = [];

    // Notify Driver
    if (driverId) {
      notifications.push(
        getMessaging().send({
          notification: {
            title: "Bid Accepted! You're On!",
            body: "The rider accepted your bid! Gear up and hit the road!",
          },
          data: {
            click_action: "FLUTTER_NOTIFICATION_CLICK",
            type: "accept_bidding",
            ride_id: rideId,
          },
          topic: `user_${driverId}`,
        }),
      );
    } else {
      logger.warn("DRIVER_ID_MISSING_IN_BID", {rideId, bidId});
    }

    // Notify Rider
    if (riderId) {
      notifications.push(
        getMessaging().send({
          notification: {
            title: "Ride Created Successfully!",
            body: "Your ride is confirmed! Your driver is on the way.",
          },
          data: {
            click_action: "FLUTTER_NOTIFICATION_CLICK",
            type: "accept_bidding",
            ride_id: rideId,
          },
          topic: `user_${riderId}`,
        }),
      );
    } else {
      logger.warn("RIDER_ID_MISSING_IN_RIDE_REQUEST", {rideId});
    }

    try {
      const results = await Promise.allSettled(notifications);
      results.forEach((result, idx) => {
        if (result.status === "fulfilled") {
          logger.info("BID_ACCEPT_NOTIF_SENT", {
            rideId,
            target: idx === 0 ? "driver" : "rider",
            targetId: idx === 0 ? driverId : riderId,
          });
        } else {
          logger.error("BID_ACCEPT_NOTIF_FAILED", {
            rideId,
            target: idx === 0 ? "driver" : "rider",
            error: result.reason.message,
          });
        }
      });
    } catch (err) {
      logger.error("BID_ACCEPT_NOTIF_CRITICAL_ERROR", {rideId, error: err.message});
    }
  },
);

/**
 * Notify on ride status change
 */
exports.notifyRideStatusChange = onDocumentUpdated(
  "rides/{rideId}",
  async (event) => {
    const rideId = event.params.rideId;
    const before = event.data.before.data();
    const after = event.data.after.data();

    if (!after) return;

    const oldSlug = before.ride_status.slug;
    const newSlug = after.ride_status.slug;

    if (oldSlug === newSlug) return;

    logger.info("RIDE_STATUS_CHANGED", {rideId, from: oldSlug, to: newSlug});

    const driverId = after.driver.id;
    const riderId = after.rider.id;

    const messages = [];

    const driverTitle = {
      pending: "🚨 New Ride Alert!",
      requested: "🔔 New Ride Request!",
      scheduled: "📅 Ride Locked In!",
      accepted: "🎉 You're On!",
      arrived: "🏠 You've Arrived!",
      started: "🚀 Ride's On!",
      completed: "🥳 Ride Done!",
      cancelled: "😕 Ride Cancelled",
    };

    const riderTitle = {
      pending: "⏳ Ride Pending!",
      requested: "📩 Ride Requested!",
      scheduled: "📅 Ride Confirmed!",
      accepted: "🚗 Driver’s Coming!",
      arrived: "🏠 Driver’s Here!",
      started: "🚙 Ride Started!",
      completed: "🎉 Ride Complete!",
      cancelled: "😕 Ride Cancelled",
    };

    const riderMsg = {
      pending: `Your Ride #${after.ride_number} is being processed. Hang tight! 😄🚖`,
      requested: `We’re working on Ride #${after.ride_number}! 🚗 Stay tuned! 🎉`,
      scheduled: `Your Ride #${after.ride_number} is all set! 🥳 Get ready! 🚙`,
      accepted: `Your driver for Ride #${after.ride_number} is on the way! 🚀😎`,
      arrived: `Your driver for Ride #${after.ride_number} is waiting! 🎈 Hop in! 🚗`,
      started: `Enjoy your Ride #${after.ride_number}! 🎉 Safe travels! 🌟`,
      cancelled: `Your Ride #${after.ride_number} was cancelled. Book another? 🚖`,
      completed: `You’ve arrived with Ride #${after.ride_number}! 😊 How was it? ⭐`,
    };

    const driverMsg = {
      pending: `Ride #${after.ride_number} is waiting for you! 🚖 Check it out! 🏁`,
      requested: `Ride #${after.ride_number} is up for grabs! 🚗 Ready to roll? 🚀`,
      scheduled: `Gear up for Ride #${after.ride_number}! 🛣️ Let's hit the road! 🌟`,
      accepted: `Ride #${after.ride_number} is yours! 🚙 Time to shine! 💨`,
      arrived: `Ready for pickup on Ride #${after.ride_number}! 🎈 Let's go! 🚗`,
      started: `Ride #${after.ride_number} is rolling! Safe travels! 🌟🚙`,
      completed: `"Awesome job on Ride #${after.ride_number}! 🎉 Keep rocking it! 😊`,
      cancelled: `Ride #${after.ride_number} was cancelled. Next one’s coming! 🚖`,
    };

    if (riderId && riderMsg[newSlug] && riderTitle[newSlug]) {
      messages.push({
        notification: {title: riderTitle[newSlug], body: riderMsg[newSlug]},
        data: {type: "ride_status", ride_id: rideId},
        topic: `user_${riderId}`,
      });
    }

    if (driverId && driverMsg[newSlug] && driverTitle[newSlug]) {
      messages.push({
        notification: {title: driverTitle[newSlug], body: driverMsg[newSlug]},
        data: {type: "ride_status", ride_id: rideId},
        topic: `user_${driverId}`,
      });
    }

    if (messages.length > 0) {
      for (const message of messages) {
        try {
          await getMessaging().send(message);
          logger.info("STATUS_NOTIF_SENT", {rideId, to: newSlug});
        } catch (err) {
          if (err.code === "messaging/registration-token-not-registered") {
            logger.warn("STATUS_NOTIF_FAILED", {driverId: message.topic});
          } else {
            logger.error("SINGLE_SEND_FAILED", {driverId: message.topic, error: err.message});
          }
        }
      }
    }
  },
);

/**
 * Notify when ride is cancelled (from ride_requests)
 */
exports.notifyRideCancelled = onDocumentUpdated(
  "ride_requests/{rideId}",
  async (event) => {
    const rideId = event.params.rideId;
    const snap = event.data;

    logger.info("TRIGGER_RIDE_REQUEST_CANCEL_CHECK", {rideId});

    const after = snap.after.data();
    if (!after) {
      logger.warn("RIDE_REQUEST_AFTER_MISSING", {rideId});
      return;
    }

    if (after.status !== "cancelled") {
      logger.info("RIDE_REQUEST_NOT_CANCELLED", {rideId, status: after.status});
      return;
    }

    logger.info("RIDE_CANCELLED_DETECTED", {rideId});

    const riderId = after.rider.id;
    if (!riderId) {
      logger.warn("RIDER_ID_MISSING_ON_CANCEL", {rideId});
      return;
    }

    try {
      await getMessaging().send({
        notification: {
          title: "Ride Cancelled",
          body: "Your ride request was cancelled. Book a new one?",
        },
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          type: "ride_cancelled",
          ride_request_id: rideId,
        },
        topic: `user_${riderId}`,
      });
      logger.info("RIDE_CANCEL_NOTIF_SENT", {rideId, riderId});
    } catch (err) {
      logger.error("RIDE_CANCEL_NOTIF_FAILED", {
        rideId,
        riderId,
        error: err.message,
      });
    }
  },
);

/**
 * Notify ALL drivers in driverIds array when a new BIDDING ride request is created
 */
exports.notifyDriversBiddingRideRequest = onDocumentCreated(
  "ride_requests/{rideId}",
  async (event) => {
    const rideId = event.params.rideId;
    const snap = event.data;

    logger.info("BIDDING_RIDE_REQUEST_TRIGGER", {rideId});

    if (!snap.exists) {
      logger.warn("BIDDING_RIDE_DOC_MISSING", {rideId});
      return;
    }

    const data = snap.data();

    // === 1. Skip if NOT bidding ride ===
    const isBidding = data.is_bidding === "1" || data.is_bidding === true;
    const categoryType = data.service_category.service_category_type;

    if (!isBidding || categoryType === "package") {
      logger.info("NOT_BIDDING_OR_PACKAGE_SKIP", {rideId, isBidding, categoryType});
      return;
    }

    logger.info("BIDDING_RIDE_DETECTED", {rideId, categoryType});

    // === 2. Extract driverIds safely (handles Map or null) ===
    const driverIdsRaw = data.driverIds || data.driver_ids || {};
    const driverIds = toArray(driverIdsRaw); // Uses your existing toArray() helper

    if (driverIds.length === 0) {
      logger.warn("NO_DRIVERS_IN_ARRAY", {rideId});
      return;
    }

    logger.info("DRIVERS_FOUND_FOR_BIDDING", {
      rideId,
      driverCount: driverIds.length,
      driverIds: driverIds.slice(0, 10), // log first 10
    });

    // === 3. Build location string ===
    const locations = data.locations || [];
    const fromTo =
      locations.length > 1 ? `${locations[0]} → ${locations[locations.length - 1]}` : locations[0] || "Unknown location";

    const riderName = data.rider.name || "A rider";
    const currency = data.currency_symbol || "";
    const totalFare = data.total || data.ride_fare;

    // === 4. Send notification to ALL drivers ===
    const messages = driverIds.map((driverId) => ({
      notification: {
        title: "🚗 New Ride Request Available!",
        body: `🤑 ${currency}${totalFare} ride waiting!\n🚕 ${riderName} from ${fromTo}\n🎯 Grab it before it’s gone!`,
      },
      data: {
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        type: "service_request",
        ride_request_id: rideId,
      },
      topic: `user_${driverId}`,
    }));

    try {
      for (const message of messages) {
        try {
          await getMessaging().send(message);
          logger.info("SENT_TO_DRIVER", {rideId, driverId: message.topic});
        } catch (err) {
          if (err.code === "messaging/registration-token-not-registered") {
            logger.warn("TOKEN_EXPIRED", {driverId: message.topic});
          } else {
            logger.error("SINGLE_SEND_FAILED", {driverId: message.topic, error: err.message});
          }
        }
      }
    } catch (err) {
      logger.error("BIDDING_NOTIFY_FAILED", {
        rideId,
        error: err.message,
        stack: err.stack,
      });
    }
  },
);
