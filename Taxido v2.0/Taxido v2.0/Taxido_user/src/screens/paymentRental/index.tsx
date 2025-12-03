import { View, Text, Image, TouchableOpacity, Modal, TextInput, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, notificationHelper } from "@src/commonComponent";
import styles from "./styles";
import Images from "@utils/images";
import { Back, Shield, StarEmpty, StarFill } from "@utils/icons";
import { appColors, appFonts, windowHeight, windowWidth } from "@src/themes";
import { DriverData } from "./component/driverData/index";
import { TotalFare } from "./component/totalFare/index";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import MapScreen from "@src/screens/bookRide/map/index";
import { allRides, paymentsData } from "@src/api/store/actions";
import { CustomBackHandler } from "@src/components";
import { useAppNavigation } from "@src/utils/navigation";
import { external } from "@src/styles/externalStyle";
import { clearValue } from "@src/utils/localstorage";
import firestore from '@react-native-firebase/firestore';
import { useValues } from "@src/utils/context/index";

interface Location {
  latitude: number;
  longitude: number;
}

interface RouteLeg {
  distance: {
    value: number;
  };
}

interface RouteData {
  legs: RouteLeg[];
  overview_polyline: {
    points: string;
  };
}

interface DriverTrackData {
  lat?: string;
  lng?: string;
}

// calculateBearing function removed as it's no longer used

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance * 1000;
};

export function PaymentRental() {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const { linearColorStyle, bgFullStyle, textColorStyle, textRTLStyle, viewRTLStyle, Google_Map_Key } = useValues();
  const route = useRoute();
  const { rideId } = route.params as { rideId: string };
  const { navigate, goBack } = useAppNavigation();
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [distanceCovered, setDistanceCovered] = useState(0);
  const previousLocation = useRef<{ latitude: number; longitude: number } | null>(null);
  const { translateData } = useSelector((state: any) => state.setting);
  const navigation = useNavigation()
  const [rideDatas, setRideData] = useState<any>(null);
  const [_duration, _setDuration] = useState(null);
  const origin = rideDatas?.location_coordinates?.[0];
  const ridePath = rideDatas?.ride_path;


  useEffect(() => {
    if (!rideId) return;
    const unsubscribe = firestore()
      .collection('rides')
      .doc(rideId.toString())
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          setRideData(data);
        } else {
        }
      });

    return () => unsubscribe();
  }, [rideId]);

  // New useEffect for tracking driver location in real-time
  useEffect(() => {
    if (!rideDatas?.driver?.id) return;

    const driverId = rideDatas.driver.id;
    const unsubscribe = firestore()
      .collection('driverTrack')
      .doc(driverId.toString())
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data() as DriverTrackData;
          if (data?.lat && data?.lng) {
            const newLocation = {
              latitude: parseFloat(data.lat),
              longitude: parseFloat(data.lng),
            };

            // MapScreen handles animation automatically

            // Calculate distance if we have previous location
            if (previousLocation.current) {
              const distance = calculateDistance(
                previousLocation.current.latitude,
                previousLocation.current.longitude,
                newLocation.latitude,
                newLocation.longitude
              );
              setDistanceCovered(prev => prev + distance);
            }

            // Update previous location
            previousLocation.current = newLocation;
          }
        }
      });

    return () => unsubscribe();
  }, [rideDatas?.driver?.id]);

  // Store interval reference to properly clear it
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (rideDatas?.updated_at || rideDatas?.start_time) {

      const updateTimer = () => {
        const now = new Date();
        // Use updated_at if available (more accurate), otherwise fall back to start_time
        let startTime: Date;

        if (rideDatas.updated_at) {
          // Firebase timestamp format
          if (typeof rideDatas.updated_at === 'object' && rideDatas.updated_at._seconds) {
            startTime = new Date(rideDatas.updated_at._seconds * 1000);
          } else if (typeof rideDatas.updated_at === 'string') {
            // String format
            startTime = new Date(rideDatas.updated_at);
          } else {
            startTime = new Date(rideDatas.updated_at);
          }
        } else if (rideDatas.start_time) {
          // Handle different time formats for start_time
          if (rideDatas.start_time.includes('T')) {
            // ISO format
            startTime = new Date(rideDatas.start_time);
          } else {
            // HH:MM:SS format
            const [hours, minutes, seconds] = rideDatas.start_time
              .split(":")
              .map(Number);
            startTime = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              hours,
              minutes,
              seconds
            );
          }
        } else {
          console.error("No valid start time found in ride data");
          return;
        }


        if (!isNaN(startTime.getTime())) {
          const secondsGap = Math.floor(
            (now.getTime() - startTime.getTime()) / 1000
          );


          // Only update if positive time
          if (secondsGap >= 0) {
            setElapsedSeconds(secondsGap);

            const hrs = Math.floor(secondsGap / 3600)
              .toString()
              .padStart(2, "0");
            const mins = Math.floor((secondsGap % 3600) / 60)
              .toString()
              .padStart(2, "0");
            const secs = (secondsGap % 60).toString().padStart(2, "0");

            setElapsedTime(`${hrs}:${mins}:${secs}`);
          } else {
            setElapsedSeconds(0);
            setElapsedTime('00:00:00');
          }
        } else {
          console.error("Invalid start time format:", rideDatas.updated_at || rideDatas.start_time);
        }
      };

      // Run immediately and then every second
      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);
    } else {
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [rideDatas]);

  const fetchOnRoadPath = useCallback(async () => {
    try {
      if (!origin || !ridePath || ridePath.length === 0) return;

      const originStr = `${origin.lat},${origin.lng}`;
      const dest = ridePath[ridePath.length - 1];
      const destinationStr = `${dest.latitude},${dest.longitude}`;
      const waypointsStr = ridePath
        .slice(0, -1)
        .map((p: Location) => `${p.latitude},${p.longitude}`)
        .join('|');

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&waypoints=${waypointsStr}&key=${Google_Map_Key}`;
      const res = await fetch(url);
      const json: { routes: RouteData[] } = await res.json();

      if (json.routes.length) {
        // Route coordinates handled by MapScreen component

      } else {
        console.warn('No route found');
      }
    } catch (e) {
      console.error('Error fetching directions:', e);
    }
  }, [origin, ridePath, Google_Map_Key]);

  // decodePolyline function removed as we're using MapScreen component

  useEffect(() => {
    const origin = rideDatas?.location_coordinates?.[0];
    const ridePath = rideDatas?.ride_path;

    if (origin && ridePath?.length > 0) {
      fetchOnRoadPath();
    }
  }, [rideDatas, fetchOnRoadPath]);

  useEffect(() => {
    dispatch(paymentsData() as any)
      .unwrap()
      .then((res: any) => {

        if (res?.status == 403) {
          notificationHelper('', translateData.loginAgain, 'error');
          clearValue();
        }
      })
      .catch((error: any) => {
        console.error("Error in paymentsData:", error);
      });
  }, [dispatch, navigation, translateData.loginAgain]);

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handlePress = (_rideData: any) => {
    navigate("PaymentMethod");
    dispatch(allRides() as any)
  };

  const review = () => {
    setModalVisible(false);
    navigate("MyTabs");
  };

  // Calculate used distance in the correct unit
  const calculateUsedDistance = () => {
    if (!distanceCovered) return "0.00";

    const isMile = rideDatas?.hourly_packages?.distance_type?.toLowerCase() === 'mile';
    const convertedDistance = isMile
      ? (distanceCovered / 1000 * 0.621371).toFixed(2)
      : (distanceCovered / 1000).toFixed(2);

    return convertedDistance;
  };

  // Get total distance limit from package
  const getTotalDistanceLimit = () => {
    return rideDatas?.hourly_packages?.distance || 0;
  };

  // Get total time limit from package (in seconds)
  const getTotalTimeLimit = () => {
    return (rideDatas?.hourly_packages?.hour || 0) * 3600;
  };

  // Check if distance limit is exceeded
  const isDistanceLimitExceeded = () => {
    const usedDistance = parseFloat(calculateUsedDistance());
    const totalDistance = getTotalDistanceLimit();
    return usedDistance > totalDistance;
  };

  // Check if time limit is exceeded
  const isTimeLimitExceeded = () => {
    const totalTime = getTotalTimeLimit();
    return elapsedSeconds > totalTime;
  };

  return (
    <View style={external.main}>
      <CustomBackHandler />
      <TouchableOpacity style={{ position: 'absolute', zIndex: 1, height: windowHeight(30), width: windowWidth(110), backgroundColor: appColors.whiteColor, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', top: windowHeight(15), right: windowWidth(15), borderRadius: windowHeight(5), paddingLeft: windowHeight(5) }} >
        <Shield color={appColors.primary} />
        <Text style={{ fontFamily: appFonts.medium, color: appColors.primaryText, marginHorizontal: windowWidth(8) }}>Safety</Text>
      </TouchableOpacity>
      <View style={styles.mapSection}>
        {rideDatas?.location_coordinates?.length > 0 &&
          rideDatas?.location_coordinates[0]?.lat &&
          rideDatas?.location_coordinates[0]?.lng &&
          !isNaN(parseFloat(rideDatas?.location_coordinates[0]?.lat)) &&
          !isNaN(parseFloat(rideDatas?.location_coordinates[0]?.lng)) ? (
          <MapScreen
            mapType="google_map"
            pickupCoords={{
              lat: parseFloat(rideDatas.location_coordinates[0].lat) || 0,
              lng: parseFloat(rideDatas.location_coordinates[0].lng) || 0
            }}
            stopsCoords={[]}
            destinationCoords={{
              lat: parseFloat(rideDatas.location_coordinates[0].lat) || 0,
              lng: parseFloat(rideDatas.location_coordinates[0].lng) || 0
            }}
            isDark={false}
            Google_Map_Key={Google_Map_Key}
            isPulsing={false}
          />
        ) : (
          <View style={[external.ai_center, external.js_center, external.main]}>
            <ActivityIndicator size="large" color={appColors.primary} />
          </View>

        )}
      </View>
      <View style={{ flex: 0.3, backgroundColor: linearColorStyle }} />
      <TouchableOpacity onPress={() => goBack()} style={styles.backIconView} activeOpacity={0.7}>
        <Back />
      </TouchableOpacity>
      <View style={[styles.viewMain, { flexDirection: viewRTLStyle }]}>
        <View
          style={[
            styles.usedView,
            { flexDirection: viewRTLStyle },
            {
              backgroundColor: isTimeLimitExceeded()
                ? appColors.alertRed
                : appColors.primary,
            },
          ]}
        >
          <View style={styles.totalView}>
            <Text style={{ color: appColors.categoryTitle }}>
              {translateData.used}
            </Text>
            <Text style={{ color: appColors.whiteColor }}>{elapsedTime}</Text>
          </View>
          <View style={styles.totalMainView} />
          <View style={styles.totalView}>
            <Text style={{ color: appColors.categoryTitle }}>
              {translateData.total}
            </Text>
            <Text style={{ color: appColors.whiteColor }}>
              {rideDatas?.hourly_packages?.hour?.toString().padStart(2, '0')}:00:00
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.usedView,
            { flexDirection: viewRTLStyle },
            {
              backgroundColor: isDistanceLimitExceeded()
                ? appColors.alertRed
                : appColors.primary,
            },
          ]}
        >
          <View style={styles.totalView}>
            <Text style={{ color: appColors.categoryTitle }}>
              {translateData.used}
            </Text>
            <Text style={{ color: appColors.whiteColor }}>
              {calculateUsedDistance()} {rideDatas?.hourly_packages?.distance_type || 'km'}
            </Text>
          </View>
          <View style={styles.totalMainView} />
          <View style={styles.totalView}>
            <Text style={{ color: appColors.categoryTitle }}>
              {translateData.total}
            </Text>
            <Text style={{ color: appColors.whiteColor }}>
              {rideDatas?.hourly_packages?.distance}{" "}
              {rideDatas?.hourly_packages?.distance_type}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.mainView}>
        <DriverData driverDetails={rideDatas} />
        <View style={[styles.card2, { backgroundColor: bgFullStyle }]}>
          <TotalFare
            handlePress={() => handlePress(rideDatas)}
            fareAmount={rideDatas?.total || 0}
            rideStatus={rideDatas?.ride_status?.slug || ""}
          />
          <Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.bgmodal}>
              <View
                style={[styles.background, { backgroundColor: bgFullStyle }]}
              >
                <Text style={[styles.title, { color: textColorStyle }]}>
                  {translateData.modalTitle}
                </Text>
                <View style={styles.userAlign}>
                  <Image
                    source={Images.profileUser}
                    style={styles.modalImage}
                  />
                  <Text style={[styles.modalName, { color: textColorStyle }]}>
                    {translateData.name}
                  </Text>
                  <Text style={[styles.modalMail, { color: textColorStyle }]}>
                    {translateData.mailID}
                  </Text>
                </View>
                <Image source={Images.lineBottom} style={styles.lineImage} />
                <Text
                  style={[
                    styles.rate,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}
                >
                  {translateData.driverRating}
                </Text>
                <View
                  style={[
                    styles.containerReview,
                    { flexDirection: viewRTLStyle },
                  ]}
                >
                  {[1, 2, 3, 4, 5]?.map((index) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      key={index}
                      onPress={() => handleStarPress(index)}
                      style={styles.starIcon}
                    >
                      {index <= rating ? <StarFill /> : <StarEmpty />}
                    </TouchableOpacity>
                  ))}
                  <View
                    style={[styles.ratingView, { flexDirection: viewRTLStyle }]}
                  >
                    <View style={styles.borderVertical} />
                    <Text style={[styles.rating, { color: textColorStyle }]}>
                      {rating}/5
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.comment,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}
                >
                  {translateData.addComments}
                </Text>
                <TextInput
                  style={[
                    styles.textinput,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}
                  multiline={true}
                  textAlignVertical="top"
                />
                <View style={styles.border2} />
                <View style={styles.buttonView}>
                  <Button
                    width={330}
                    backgroundColor={appColors.primary}
                    textColor={appColors.whiteColor}
                    title={translateData.submit}
                    onPress={review}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}