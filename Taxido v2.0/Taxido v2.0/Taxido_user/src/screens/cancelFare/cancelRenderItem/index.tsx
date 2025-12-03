import React, {useEffect, useRef, useState} from "react";
import {Image, Text, View} from "react-native";
import {external} from "../../../styles/externalStyle";
import {styles} from "../style";
import {commonStyles} from "../../../styles/commonStyle";
import {Button, notificationHelper, ProgressBar} from "@src/commonComponent";
import {useValues} from "@src/utils/context/index";
import {Star, Verification} from "@utils/icons";
import {useDispatch, useSelector} from "react-redux";
import {allRides, bidUpdate} from "../../../api/store/actions/index";
import {fontSizes, appColors, windowWidth, windowHeight, appFonts} from "@src/themes";
import {useAppNavigation} from "@src/utils/navigation";
import firestore, {firebase} from "@react-native-firebase/firestore";

export function CancelRender({item}: {item: any; pickupLocation: any}) {
  const {navigate} = useAppNavigation();
  const {
    linearColorStyle,
    bgFullStyle,
    textColorStyle,
    viewRTLStyle,
    textRTLStyle,
    isDark,
  } = useValues();
  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const {translateData} = useSelector(state => state.setting);
  const {zoneValue} = useSelector((state: any) => state.zone);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectedLoading, setRejectedLoading] = useState(false);
  const timersRef = useRef<{
    interval?: NodeJS.Timeout;
    timeout?: NodeJS.Timeout;
  }>({});

  const clearTimers = () => {
    if (timersRef.current.interval) {
      clearInterval(timersRef.current.interval);
      timersRef.current.interval = undefined;
    }
    if (timersRef.current.timeout) {
      clearTimeout(timersRef.current.timeout);
      timersRef.current.timeout = undefined;
    }
  };

  const handleAccept = () => {
    clearTimers();
    setAcceptLoading(true);
    const bid_id = item.id;
    const ride_request_id = item.ride_request_id;

    let payload = {
      status: "accepted",
    };

    dispatch(bidUpdate({payload, bid_id}))
      .unwrap()
      .then((res: any) => {
        if (res?.service_category_type === "schedule") {
          navigate("MyTabs");
          notificationHelper("", translateData.rideScheduled, "success");
          dispatch(allRides());
          setAcceptLoading(false);
        } else {
          acceptBidRequest(ride_request_id, bid_id, res);
          navigate("RideActive", {activeRideOTP: res});
          setAcceptLoading(false);
        }
      })
      .catch((error: any) => {
        console.error("Bid update error:", error);
        setAcceptLoading(false);
      });
  };

  const acceptBidRequest = async (
    rideRequestId,
    acceptedBidId,
    rideDetails,
  ) => {
    if (rideDetails?.id) {
      try {
        const bidsRef = firestore()
          .collection("ride_requests")
          .doc(rideRequestId.toString())
          .collection("bids");

        const snapshot = await bidsRef.get();
        const batch = firestore().batch();

        snapshot.forEach(doc => {
          const ref = doc.ref;
          if (doc.id == acceptedBidId.toString()) {
            batch.set(
              ref,
              {status: "accepted", ride_id: rideDetails?.id},
              {merge: true},
            );
          } else {
            batch.delete(ref);
          }
        });
        await firestore()
          .collection("rides")
          .doc(rideDetails?.id.toString())
          .set(rideDetails);

        await batch.commit();
        clearRideRequestFields(rideRequestId);
        clearDriverRequest(rideRequestId, rideDetails?.driver?.id);
      } catch (error) {
        console.error("❌ Error in handleAccept:", error);
      }
    } else {
      notificationHelper("", translateData.tryAgainOtp, "error");
    }
  };

  const clearRideRequestFields = async (rideRequestId: string) => {
    try {
      const rideRef = firestore()
        .collection("ride_requests")
        .doc(rideRequestId);
      const rideDoc = await rideRef.get();

      if (rideDoc.exists) {
        const data = rideDoc.data();

        const fieldsToDelete = {};
        Object.keys(data).forEach(key => {
          fieldsToDelete[key] = firebase.firestore.FieldValue.delete();
        });

        await rideRef.update(fieldsToDelete);
      } else {
      }
    } catch (error) {
      console.error("❌ Error clearing ride request fields:", error);
    }
  };

  const clearDriverRequest = async (
    rideRequestId: string,
    driver_id: string,
  ) => {
    const driverRideRequestsRef = firestore().collection(
      "driver_ride_requests",
    );

    try {
      const snapshot = await driverRideRequestsRef.get();
      const batch = firestore().batch();
      snapshot.forEach(doc => {
        const data = doc.data();
        const rideRequests = data.ride_requests || [];

        const hasRide = rideRequests.some(r => r.id === rideRequestId);
        if (!hasRide) return;

        const updatedRides = rideRequests.filter(r => r.id !== rideRequestId);

        batch.update(doc.ref, {ride_requests: updatedRides});
      });

      await batch.commit();
    } catch (error) {
      console.error("❌ Error clearing driver requests:", error);
    }
  };

  const handleReject = () => {
    clearTimers();
    setRejectedLoading(true);
    const bid_id = item.id;
    const ride_request_id = item.ride_request_id;

    let payload = {
      status: "rejected",
    };
    dispatch(bidUpdate({payload, bid_id}))
      .unwrap()
      .then((res: any) => {
        rejectBidRequest(ride_request_id, bid_id);
        setRejectedLoading(false);
      })
      .catch((error: any) => {
        console.error("Bid update error:", error);
        setRejectedLoading(false);
      });
  };

  const rejectBidRequest = async (
    rideRequestId: string | number,
    rejectedBidId: string | number,
  ) => {
    try {
      const bidRef = firestore()
        .collection("ride_requests")
        .doc(rideRequestId.toString())
        .collection("bids")
        .doc(rejectedBidId.toString());

      await bidRef.set({status: "rejected"}, {merge: true});
      await bidRef.delete();
    } catch (error) {
      console.error("❌ Error in handleReject:", error);
    }
  };

  useEffect(() => {
    const totalDuration = 30;
    timersRef.current.interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 100 / totalDuration;
        return next > 100 ? 100 : next;
      });
    }, 1000);

    timersRef.current.timeout = setTimeout(() => {
      clearTimers();
      handleReject();
    }, totalDuration * 1000);

    return clearTimers;
  }, []);

  return (
    <View>
      <View style={[styles.container, {backgroundColor: bgFullStyle}]}>
        <ProgressBar value={progress} />
        <View style={[external.ph_10]}>
          <View>
            <View
              style={[
                external.ai_center,
                external.mt_15,
                external.js_space,
                {
                  flexDirection: viewRTLStyle,
                },
              ]}>
              <View style={[external.ai_center, {flexDirection: viewRTLStyle}]}>
                {item?.driver?.profile_image_url ? (
                  <Image
                    style={styles.img}
                    source={{uri: item?.driver?.profile_image_url}}
                  />
                ) : (
                  <View
                    style={[
                      styles.img1,
                      {
                        backgroundColor: appColors.primary
                      },
                    ]}>
                    <Text
                      style={{
                        color: appColors.whiteColor,
                        fontFamily:appFonts.semiBold,
                        fontSize:fontSizes.FONT21
                      }}>
                      {item?.driver?.name?.charAt(0)?.toUpperCase() || ""}
                    </Text>
                  </View>
                )}

                <View style={{marginHorizontal: windowWidth(5)}}>
                  <View style={{flexDirection: "row"}}>
                    <Text
                      style={[
                        styles.titleText,
                        {
                          color: textColorStyle,
                          textAlign: textRTLStyle,
                          fontSize: fontSizes.FONT20,
                        },
                      ]}>
                      {item?.driver?.name}.  
                    </Text>

                    <View style={{marginHorizontal: windowWidth(3)}}>
                      <Verification />
                    </View>
                  </View>
                  <View
                    style={{flexDirection: viewRTLStyle, alignItems: "center"}}>
                    <View style={styles.rating}>
                      <Star />
                    </View>
                    <Text
                      style={[
                        commonStyles.regularText,
                        {color: textColorStyle},
                      ]}>
                      {item?.driver?.rating_count}
                    </Text>
                    <Text
                      style={[styles.totalRating, {textAlign: textRTLStyle}]}>
                      ({item?.driver?.review_count})
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                style={[
                  commonStyles.mediumTextBlack12,
                  {color: appColors.primary, fontSize: fontSizes.FONT23},
                ]}>
                {zoneValue.currency_symbol}
                {item?.amount}
              </Text>
            </View>
          </View>
          <View
            style={[
              external.mt_10,
              external.js_space,
              {flexDirection: viewRTLStyle},
            ]}>
            <Button
              title={translateData.skip}
              width={"48%"}
              height={35}
              backgroundColor={linearColorStyle}
              textColor={textColorStyle}
              onPress={handleReject}
              loading={rejectedLoading}
            />
            <Button
              title={translateData.accept}
              width={"48%"}
              height={35}
              backgroundColor={appColors.primary}
              onPress={handleAccept}
              loading={acceptLoading}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
