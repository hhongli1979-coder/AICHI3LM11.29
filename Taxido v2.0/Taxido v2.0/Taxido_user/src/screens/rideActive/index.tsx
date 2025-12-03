import { View, Text, TouchableOpacity, Modal, Linking, ActivityIndicator, Image } from "react-native";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { SolidLine, Button, notificationHelper, Map } from "@src/commonComponent";
import styles from "./styles";
import { Call, Message, CloseIcon, Shield, ClockSmall, DollarCoin, Info } from "@utils/icons";
import { useRoute } from "@react-navigation/native";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { useValues } from '@src/utils/context/index';
import { ModalContect } from "./component/modalContect/index";
import { TexiDetail } from "./component/texiDetails/index";
import { DriverData } from "./component/driverData/index";
import { useDispatch, useSelector } from "react-redux";
import { cancelationDataGet } from "../../api/store/actions/cancelationAction";
import { sosData } from "../../api/store/actions/sosAction";
import { CustomBackHandler } from "@src/components";
import { allRides, rideDataPut } from "@src/api/store/actions/allRideAction";
import { useAppNavigation } from "@src/utils/navigation";
import GetLocation from "react-native-get-location";
import { external } from "@src/styles/externalStyle";
import Sound from "react-native-sound";
import { requestLocationPermission } from "@src/components/helper/permissionHelper";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { AppDispatch } from "@src/api/store";
import NativeAdComponent from "@src/commonComponent/ads/google/NativeAdCard";

// Define types for location objects
interface Location {
  latitude: number;
  longitude: number;
}

// Define type for cancel data item
interface CancelDataItem {
  id: number;
  title: string;
}

const db = getFirestore();

export function RideActive() {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
  const [isArriving, setIsArriving] = useState(true);
  const [_driverArrivedTime, setDriverArrivedTime] = useState<string | undefined>();
  const { activeRideOTP, filteredLocations }: any = route?.params;
  const { textColorStyle, linearColorStyle, bgFullStyle, textRTLStyle, viewRTLStyle, notificationValue, isDark } = useValues();
  const [modalVisible, setModalVisible] = useState(false);
  const { navigate }: any = useAppNavigation();
  const { rideData } = useSelector((state: any) => state.allRide);
  const { canceldata } = useSelector((state: any) => state.cancelationReason);
  const { sosValue } = useSelector((state: any) => state.sos);
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);
  const [location, setLocation] = useState<Location | null>(null);
  const [_heading, setHeading] = useState(0);
  const markerRef = useRef<any>(null);
  const previousLocation = useRef<Location | null>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPointsMain = useMemo(() => {
    // Base height - slightly increased from 42 to 45
    let baseHeight = 48; // Percentage

    const adsHeight = (taxidoSettingData?.taxido_values?.ads?.native_enable == 1) ? 35 : 0; // 32% for ads

    // Calculate total height
    const totalHeight = baseHeight + adsHeight;

    // Ensure minimum and maximum bounds - increased max from 75 to 80
    const finalHeight = Math.min(Math.max(totalHeight, 53), 85); // Between 45% and 80%

    return [`${finalHeight}%`];
  }, [taxidoSettingData?.taxido_values?.ads?.native_enable]);
  const ambulanceRef = useRef<BottomSheetModal>(null);
  const sosSheetRef = useRef<BottomSheetModal>(null);
  const driverWaitSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["38%"], []);
  const sosSnapPoints = useMemo(() => ["40%"], []);
  const driverWaitSnappoints = useMemo(() => ["29%"], []);
  const isSoundPlayingRef = useRef(false);
  const { zoneValue } = useSelector((state: any) => state.zone);


  useEffect(() => {
    if (rideData?.ride_status?.slug == "arrived") {
      setIsArriving(false);
      if (rideData?.updated_at && typeof rideData.updated_at === 'object' && 'seconds' in rideData.updated_at) {
        const timestamp = rideData.updated_at;
        const date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
        setDriverArrivedTime(date.toISOString());
      } else {
        setDriverArrivedTime(rideData?.updated_at);
      }
    } else if (rideData?.ride_status?.slug == "accepted") {
      setIsArriving(true);
    }
  }, [rideData])

  useEffect(() => {
    // @ts-ignore - sosData accepts zone_id parameter
    dispatch(sosData({ zone_id: zoneValue.id } as any));

    bottomSheetRef.current?.present();
  }, [dispatch, zoneValue.id]);

  const playArrivalSound = useCallback(() => {
    if (isSoundPlayingRef.current) return;
    isSoundPlayingRef.current = true;
    try {
      const sound = new Sound(
        "https://res.cloudinary.com/dwsbvqylx/video/upload/v1748766815/mixkit-happy-bells-notification-937_tbin83.wav",
        undefined,
        error => {
          if (error) {
            isSoundPlayingRef.current = false;
            return;
          }
          sound.play(success => {
            if (success) {
            } else {
            }
            sound.release();
            isSoundPlayingRef.current = false;
          });
          setTimeout(() => {
            sound.stop(() => {
              sound.release();
              isSoundPlayingRef.current = false;
            });
          }, 5000);
        },
      );
    } catch (err) {
      isSoundPlayingRef.current = false;
    }
  }, []);

  const hasNavigatedRef = useRef(false);

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setWaitingTime('0 min');
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const { vehicleTypedata } = useSelector(
    (state: any) => state?.vehicleType || {},
  );

const selectedVehicle = vehicleTypedata?.find((v:any) =>
  v?.name?.trim()?.toLowerCase() === activeRideOTP?.vehicle_type?.name?.trim()?.toLowerCase() ||
  v?.slug?.trim()?.toLowerCase() === activeRideOTP?.vehicle_type?.name?.trim()?.toLowerCase()
);



  useEffect(() => {
    hasNavigatedRef.current = false;
    if (!activeRideOTP?.id) return;
    const rideRef = doc(db, "rides", activeRideOTP.id.toString());
    const unsubscribe = onSnapshot(rideRef, docSnap => {
      if (!docSnap.exists() || hasNavigatedRef.current) return;

      const data = docSnap.data();
      const status = data?.ride_status?.slug;

      if (status === "started") {
        hasNavigatedRef.current = true;

        if (data?.service_category?.service_category_type === "package") {
          stopTimer();
          navigate("StopTimer", { rideId: activeRideOTP?.id });
        } else {
          resetTimer();
          navigate("Payment", { rideId: activeRideOTP?.id });
        }
      } else if (status === "arrived") {
        notificationHelper("", translateData.driverArrived, "success");
        setIsArriving(false);

        // Handle Firestore timestamp object
        if (data?.updated_at && typeof data.updated_at === 'object' && 'seconds' in data.updated_at) {
          // Convert Firestore timestamp to ISO string
          const timestamp = data.updated_at;
          const date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
          setDriverArrivedTime(date.toISOString());
        } else {
          setDriverArrivedTime(data?.updated_at);
        }

        playArrivalSound();
      } else if (status === "cancelled") {
        notificationHelper("", translateData.rideCancelled, "error");
        dispatch(allRides());
        resetTimer();
        navigate("MyTabs");
      }
    });

    return () => unsubscribe();
  }, [activeRideOTP?.id, notificationValue, dispatch, navigate, playArrivalSound, translateData.driverArrived, translateData.rideCancelled]);

  const calculateBearing = useCallback((startLat: number, startLng: number, endLat: number, endLng: number) => {
    const toRadians = (degree: number) => degree * (Math.PI / 180);
    const toDegrees = (radian: number) => radian * (180 / Math.PI);

    const lat1 = toRadians(startLat);
    const lat2 = toRadians(endLat);
    const dLng = toRadians(endLng - startLng);

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    const bearing = toDegrees(Math.atan2(y, x));
    return (bearing + 360) % 360;
  }, []);

  const getCurrentLocation = useCallback(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(loc => {
        const newLocation: Location = {
          latitude: loc.latitude,
          longitude: loc.longitude,
        };

        if (previousLocation.current) {
          const newHeading = calculateBearing(
            previousLocation.current.latitude,
            previousLocation.current.longitude,
            newLocation.latitude,
            newLocation.longitude,
          );
          setHeading(newHeading);
        }

        animateMarker(newLocation);
        setLocation(newLocation);
        previousLocation.current = newLocation;
      })
      .catch((_error) => { // Prefix with _ to indicate unused
        // const { code, message } = error;
      });
  }, [calculateBearing]);

  const startTrackingLocation = useCallback(() => {
    getCurrentLocation();
    const locationInterval = setInterval(() => {
      getCurrentLocation();
    }, 1000);
    return () => clearInterval(locationInterval);
  }, [getCurrentLocation]);

  const requestAndTrackLocation = useCallback(async () => {
    const granted = await requestLocationPermission();
    if (granted) {
      startTrackingLocation();
    } else {
      console.warn("Location permission denied");
    }
  }, [startTrackingLocation]);

  const animateMarker = (newLocation: Location) => {
    if (markerRef.current) {
      markerRef.current.animateMarkerToCoordinate(newLocation, 500);
    }
  };


  useEffect(() => {
    requestAndTrackLocation();
  }, [requestAndTrackLocation]);

  useEffect(() => {
    // Call sosData with proper parameter or remove if not needed
    const zoneId = rideData?.zone?.id || activeRideOTP?.zone?.id;
    if (zoneId) {
      dispatch(sosData({ zone_id: zoneId } as any)); // Using any type to avoid type errors
    }
    dispatch(cancelationDataGet());
  }, [dispatch, rideData, activeRideOTP]);

  // Simple distance calculation using Haversine formula
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Calculate arrival time based on distance
  const calculateArrivalTime = useCallback((distanceKm: number) => {
    const avgSpeed = 25; // km/h average city speed
    const timeHours = distanceKm / avgSpeed;
    const timeMinutes = Math.ceil(timeHours * 60);
    return Math.max(1, timeMinutes); // Minimum 1 minute
  }, []);

  // Function to calculate estimated arrival time
  const calculateEstimatedArrivalTime = useCallback((arrivalTimeString: string) => {
    // Check if we're still calculating
    if (arrivalTimeString === 'Calculating...') {
      return '...';
    }

    // Extract minutes from the string (e.g., "5 min" -> 5)
    const minutesMatch = arrivalTimeString.match(/(\d+)/);
    if (!minutesMatch) {
      return '...';
    }

    const minutes = parseInt(minutesMatch[1]);
    const now = new Date();
    const estimatedArrival = new Date(now.getTime() + minutes * 60000); // Add minutes to current time

    // Format time in 12-hour format with AM/PM
    let hours = estimatedArrival.getHours();
    const minutesFormatted = estimatedArrival.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${hours}:${minutesFormatted} ${ampm}`;
  }, []);

  // Update the arrival time calculation to also set estimated arrival time
  const updateArrivalTime = useCallback(() => {
    if (!driverLocation || !location) return;

    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      driverLocation.latitude,
      driverLocation.longitude
    );

    const minutes = calculateArrivalTime(distance);
    setArrivalTime(`${minutes} min`);
  }, [driverLocation, location, calculateDistance, calculateArrivalTime]);

  useEffect(() => {
    updateArrivalTime();
  }, [driverLocation, location, updateArrivalTime]);



  const handlePreeCancel = () => {
    ambulanceRef.current?.present();
  };

  const driverData = () => {
    navigate("DriverInfos", { driverInfo: activeRideOTP?.driver });
  };

  const gotoChat = (activeRideOTP: any) => {
    navigate("ChatScreen", {
      driverId: activeRideOTP?.driver?.id,
      riderId: activeRideOTP?.rider?.id,
      rideId: activeRideOTP?.id,
      driverName: activeRideOTP?.driver?.name,
      driverImage: activeRideOTP?.driver?.profile_image_url,
    });
  };

  const handleCall = (activeRideOTP: any) => {
    const phoneNumber = `${activeRideOTP?.driver?.phone}`;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSOSPress = () => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      sosSheetRef.current?.present();
    }, 100);
  };

  const handleContactPress = (item: any) => {
    Linking.openURL(`tel:${item?.phone}`);
  };



  const [loader, setLoader] = useState<boolean>(false)

  const gotoHome = (selectedItem: any) => {

    setLoader(true)

    const ride_id = activeRideOTP.id;
    let payload: any = {
      status: "cancelled",
      cancellation_reason: selectedItem.title,
      end_time: "",
      distance: 8,
      distance_unit: "km",
    };


    dispatch(rideDataPut({ payload, ride_id }))
      .unwrap()
      .then((res: any) => {

        if (res?.ride_status?.slug == "cancelled") {
          const rideId = activeRideOTP?.id;
          if (rideId) {
            setLoader(false)
            ambulanceRef.current?.close();
            resetTimer();
            navigate("MyTabs");
            dispatch(allRides());
          } else {
            setLoader(false)
            console.warn("rideId not found");
          }
        }
      })
      .catch((_error) => { // Prefix with _ to indicate unused
        setLoader(false)
        ambulanceRef.current?.close();
      })
  };

  const bottomSheetClose = () => {
    setLoader(false)
    ambulanceRef.current?.close();
  };
  const [selectedId, setSelectedId] = useState(null);
  const [selectedItem, setSelectedItem] = useState<CancelDataItem | null>(null);
  const [arrivalTime, setArrivalTime] = useState('Calculating...');

  const handleSelect = (item: any) => {
    if (selectedId === item.id) {
      setSelectedId(null);
    } else {
      setSelectedId(item.id);
    }
    setSelectedItem(item)
  };

  const handleConfirm = () => {
    gotoHome(selectedItem);
  }




  const [waitingTime, setWaitingTime] = useState('1 min');
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    const status = rideData?.ride_status?.slug;
    const updatedAt = rideData?.updated_at;

    // Clear previous timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start timer if arrived
    if (status === 'arrived' && updatedAt) {
      // Handle Firestore timestamp object
      let arrivalTimeMs: number;

      if (typeof updatedAt === 'object' && updatedAt !== null && 'seconds' in updatedAt) {
        // Firestore timestamp format
        arrivalTimeMs = updatedAt.seconds * 1000 + (updatedAt.nanoseconds || 0) / 1000000;
      } else if (typeof updatedAt === 'string') {
        // ISO string format
        arrivalTimeMs = new Date(updatedAt).getTime();
      } else {
        // Unknown format
        console.error('Unknown timestamp format:', updatedAt);
        setWaitingTime('1 min');
        return;
      }

      // Check if arrivalTime is valid
      if (isNaN(arrivalTimeMs)) {
        console.error('Invalid arrival time:', updatedAt);
        setWaitingTime('1 min');
        return;
      }

      // Set initial waiting time
      const initialDiffMs = Date.now() - arrivalTimeMs;
      const initialTotalMinutes = Math.max(1, Math.floor(initialDiffMs / (1000 * 60)));
      let formattedInitial: string;
      if (initialTotalMinutes < 60) {
        formattedInitial = `${initialTotalMinutes} min`;
      } else {
        const hours = Math.floor(initialTotalMinutes / 60);
        const minutes = initialTotalMinutes % 60;
        if (minutes === 0) {
          formattedInitial = `${hours} hr`;
        } else {
          formattedInitial = `${hours} hr ${minutes} min`;
        }
      }
      setWaitingTime(formattedInitial);

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const diffMs = now - arrivalTimeMs;

        // Handle negative time differences
        if (diffMs < 0) {
          setWaitingTime('1 min');
          return;
        }

        // Convert milliseconds to minutes, with minimum of 1
        const totalMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));

        // Format as "X min" or "X hr Y min" for longer waits
        let formatted: string;
        if (totalMinutes < 60) {
          formatted = `${totalMinutes} min`;
        } else {
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          if (minutes === 0) {
            formatted = `${hours} hr`;
          } else {
            formatted = `${hours} hr ${minutes} min`;
          }
        }

        setWaitingTime(formatted);
      }, 1000);
    } else {
      // if not arrived or ride completed, stop timer
      setWaitingTime('1 min');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [rideData?.ride_status?.slug, rideData?.updated_at]);


  const handleDriverTime = () => {
    bottomSheetRef.current?.close();
    driverWaitSheetRef.current?.present();
  };

  return (
    <View style={external.main}>
      <CustomBackHandler />
      <TouchableOpacity onPress={handleSOSPress} style={{ height: windowHeight(30), width: windowWidth(110), zIndex: 1, backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor, top: windowHeight(10), right: windowHeight(15), position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: windowHeight(5), borderWidth: 1, borderColor: isDark ? appColors.darkBorder : appColors.border }}>
        <Shield color={appColors.primary} />
        <Text style={{ fontFamily: appFonts.medium, color: isDark ? appColors.whiteColor : appColors.primaryText, marginHorizontal: windowWidth(8) }}>{translateData?.safety}</Text>
      </TouchableOpacity>
      <View style={styles.mapSection}>
        {activeRideOTP?.location_coordinates?.[0] ? (

          <Map
            markerImage={rideData?.vehicle_type?.vehicle_map_icon_url}
            userLocation={activeRideOTP?.location_coordinates?.[0] || ""}
            driverId={activeRideOTP?.driver?.id || ""}
            driverLocation={driverLocation}
            setDriverLocation={setDriverLocation}
          />

        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor,
            }}>
            <ActivityIndicator size="large" color={appColors.primary} />
          </View>
        )}

      </View>
      <View style={{ flex: 0.3, backgroundColor: linearColorStyle }} />
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPointsMain}
          enablePanDownToClose={false}
          enableDismissOnClose={false}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: "13%",
          }}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor,
          }}>
          <BottomSheetView>
            <View style={{ width: '100%', height: windowHeight(45), justifyContent: 'flex-end', }}>
              {isArriving ? (
                <View style={{ marginHorizontal: windowWidth(15), height: windowHeight(45), borderRadius: windowHeight(6), alignItems: 'center' }}>
                  <Text style={{ fontFamily: appFonts.bold, fontSize: fontSizes.FONT22, color: isDark ? appColors.whiteColor : appColors.primaryText }}>{translateData?.PickupIn} {arrivalTime}</Text>
                  <Text style={{ fontFamily: appFonts.regular, color: appColors.regularText, marginTop: windowHeight(5) }}>{translateData?.departBy} {calculateEstimatedArrivalTime(arrivalTime)} {translateData?.tomet} {activeRideOTP?.driver?.name}</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={handleDriverTime} activeOpacity={0.7} style={{ marginHorizontal: windowWidth(15), height: windowHeight(45), borderRadius: windowHeight(6), alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontFamily: appFonts.bold, fontSize: fontSizes.FONT22, color: isDark ? appColors.whiteColor : appColors.primaryText }}>{translateData?.driverWait} {waitingTime}</Text>
                    <View style={{ justifyContent: 'center', marginHorizontal: windowHeight(5) }}><Info color={isDark ? appColors.whiteColor : appColors.blackColor} /></View>
                  </View>
                  <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.regularText, marginTop: windowHeight(5) }}>{translateData?.driverNote}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.card}>
              <View
                style={[
                  styles.subContainer,
                  {
                    backgroundColor: isDark
                      ? appColors.bgDark
                      : appColors.whiteColor,
                  },
                ]}>

                <TexiDetail
                  otp={activeRideOTP?.otp}
                  vehicleData={activeRideOTP}
                />
                <SolidLine color={isDark ? appColors.darkBorder : appColors.border} />
                <View
                  style={[
                    styles.profileContainer,
                    { flexDirection: viewRTLStyle },
                  ]}>
                  <DriverData
                    driverData={driverData}
                    driverDetail={activeRideOTP?.driver}
                    rideData={activeRideOTP}
                  />
                  <Modal
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      setModalVisible(false);
                    }}>
                    <ModalContect onpress={() => setModalVisible(false)} />
                  </Modal>
                </View>
                <View style={{ flexDirection: viewRTLStyle, marginHorizontal: windowWidth(15), justifyContent: 'space-between', marginTop: windowHeight(8) }}>
                  <TouchableOpacity
                    style={[
                      styles.message,
                      {
                        backgroundColor: isDark
                          ? appColors.darkHeader
                          : appColors.lightGray,
                        height: windowHeight(40),
                        width: windowWidth(365),
                      },
                    ]}
                    onPress={() => gotoChat(activeRideOTP)}
                    activeOpacity={0.7}>
                    <Text style={{ marginHorizontal: windowWidth(10), fontFamily: appFonts.regular, color: appColors.regularText }}>{translateData.sendMessage}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.call,
                      {
                        backgroundColor: appColors.primary,
                      },
                    ]}
                    onPress={() => handleCall(activeRideOTP)}>
                    <Call color={appColors.whiteColor} />
                  </TouchableOpacity>
                </View>
                {taxidoSettingData?.taxido_values?.ads?.native_enable == 1 && (
                  <NativeAdComponent heights={windowHeight(150)} adsHeight={windowHeight(60)} />
                )}                <View style={styles.cancelBtnView}>
                  <Button
                    title={translateData.cancelRide}
                    backgroundColor={isDark ? appColors.darkHeader : appColors.primaryGray}
                    textColor={appColors.regularText}
                    onPress={handlePreeCancel}
                  />
                </View>

              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={ambulanceRef}
          index={1}
          enablePanDownToClose
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: "13%",
          }}
          snapPoints={snapPoints}
          backdropComponent={props => (
            <BottomSheetBackdrop {...props} pressBehavior="close" />
          )}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
          }}>
          <BottomSheetView>
            <View style={[styles.subContainer, { backgroundColor: bgFullStyle }]}>
              <View
                style={[
                  styles.profileContainer,
                  { flexDirection: viewRTLStyle },
                ]}>
                <DriverData
                  driverData={driverData}
                  driverDetail={activeRideOTP?.driver}
                  rideData={activeRideOTP}
                />
                <View style={{ flexDirection: viewRTLStyle }}>
                  <TouchableOpacity
                    style={styles.message}
                    onPress={() => gotoChat(activeRideOTP)}
                    activeOpacity={0.7}>
                    <Message />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.call}
                    onPress={handlePreeCancel}>
                    <Call />
                  </TouchableOpacity>
                </View>
                <Modal
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(false);
                  }}>
                  <ModalContect onpress={() => setModalVisible(false)} />
                </Modal>
              </View>
              <SolidLine />
              <TexiDetail
                otp={activeRideOTP?.otp}
                vehicleData={activeRideOTP}
              />
              <SolidLine />
              <View
                style={[
                  styles.cancelBtnView,
                  {
                    flexDirection: viewRTLStyle,
                  },
                ]}>
                <Button
                  title={translateData.cancelRide}
                  width={350}
                  backgroundColor={isDark ? appColors.darkHeader : appColors.primaryGray}
                  textColor={appColors.regularText}
                  onPress={handlePreeCancel}
                />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={ambulanceRef}
          index={1}
          enablePanDownToClose
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: "13%",
          }}
          snapPoints={snapPoints}
          backdropComponent={props => (
            <BottomSheetBackdrop {...props} pressBehavior="close" />
          )}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor,
          }}>
          <BottomSheetView>
            <View style={styles.modalBg}>
              <View style={[styles.modalBgMain]}>
                <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: viewRTLStyle }}>
                  <Text style={[styles.cancelTitle, { color: textColorStyle }]}>
                    {translateData.whyCancel}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}

                    style={styles.closeIcon}
                    onPress={bottomSheetClose}
                  >
                    <CloseIcon fill={appColors.blackColor} />
                  </TouchableOpacity>
                </View>
                {canceldata?.data?.map((item: CancelDataItem) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    key={item.id}
                    style={[
                      styles.container2,
                      {
                        backgroundColor:
                          selectedId === item.id
                            ? appColors.dotLight
                            : isDark
                              ? appColors.darkHeader
                              : appColors.lightGray,
                        flexDirection: viewRTLStyle,
                        borderWidth: selectedId === item.id ? 1 : 0,
                        borderColor:
                          selectedId === item.id
                            ? appColors.primary
                            : "transparent",
                      },
                    ]}
                    onPress={() => handleSelect(item)}>
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.text,
                          {
                            color: textColorStyle,
                            textAlign: textRTLStyle,
                          },
                        ]}>
                        {item?.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <View style={{ marginTop: windowHeight(8) }}>
                  <Button
                    backgroundColor={appColors.primary}
                    width={350}
                    title={translateData.confirm}
                    onPress={handleConfirm}
                    loading={loader}
                  />
                </View>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={sosSheetRef}
          index={1}
          snapPoints={sosSnapPoints}
          enablePanDownToClose={true}
          onDismiss={() => bottomSheetRef.current?.snapToIndex(1)}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
            />
          )}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: "13%",
          }}
          backgroundStyle={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor,
          }}>
          <BottomSheetView style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: fontSizes.FONT22,
                color: isDark ? appColors.whiteColor : appColors.blackColor,
                fontFamily: appFonts.bold,
                textAlign: "center",
              }}>
              {translateData.keepYourselfSafe}
            </Text>
          </BottomSheetView>
          <View style={{ marginTop: windowHeight(20) }}>
            {sosValue?.data?.map((item: any) => (
              <View
                key={item.id.toString()}
                style={{
                  marginHorizontal: windowWidth(18),
                  borderRadius: windowHeight(5),
                }}>
                <TouchableOpacity
                  style={[
                    {
                      marginTop: windowHeight(10),
                      padding: windowHeight(10),
                      backgroundColor: isDark
                        ? appColors.darkHeader
                        : appColors.lightGray,
                    },
                  ]}
                  onPress={() => handleContactPress(item)}>
                  <View style={{ flexDirection: viewRTLStyle }}>
                    <Image source={{ uri: item.sos_image_url }} style={{ height: windowHeight(17), width: windowHeight(17), resizeMode: 'contain' }} />
                    <View
                      style={{
                        height: windowHeight(15),
                        width: windowWidth(1.5),
                        backgroundColor: isDark
                          ? appColors.darkBorder
                          : appColors.border,
                        marginHorizontal: windowWidth(12)
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: appFonts.medium,
                        color: isDark ? appColors.darkText : appColors.primaryText,
                      }}>
                      {item?.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={driverWaitSheetRef}
          index={1}
          snapPoints={driverWaitSnappoints}
          enablePanDownToClose={true}
          onDismiss={() => bottomSheetRef.current?.snapToIndex(1)}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
            />
          )}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: "13%",
          }}
          backgroundStyle={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor,
          }}>
          <BottomSheetView style={{ width: "100%", paddingHorizontal: windowWidth(15) }}>
            <View>
              <Text style={{ fontFamily: appFonts.medium, fontSize: fontSizes.FONT23, textAlign: 'center', color: isDark ? appColors.whiteColor : appColors.blackColor }}>{translateData.driverWaits}</Text>
              <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.regularText, textAlign: 'center', marginTop: windowHeight(5) }}>{translateData.driverWaitDetail}</Text>
            </View>
            <View style={{ borderWidth: 1, borderColor: isDark ? appColors.darkBorder : appColors.border, borderRadius: windowHeight(5), marginTop: windowHeight(18) }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: windowHeight(12) }}>
                <View style={{ flexDirection: 'row' }}>
                  <ClockSmall color={isDark ? appColors.darkText : appColors.gray} />
                  <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.gray, marginHorizontal: windowWidth(10) }}>{translateData.freeTimes}:</Text>
                </View>
                <Text style={{ fontFamily: appFonts.medium, color: appColors.primary }}>{selectedVehicle?.vehicle_type_zone?.free_waiting_time_before_start_ride} {translateData?.minute}</Text>
              </View>
              <View style={{ borderBottomWidth: 1, borderColor: isDark ? appColors.darkBorder : appColors.border }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: windowHeight(12) }}>
                <View style={{ flexDirection: 'row' }}>
                  <DollarCoin color={isDark ? appColors.darkText : appColors.gray} />
                  <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.gray, marginHorizontal: windowWidth(10) }}>{translateData.chargePerMin}:</Text>
                </View>
                <Text style={{ fontFamily: appFonts.medium, color: appColors.primary }}>{selectedVehicle?.currency_symbol} {selectedVehicle?.vehicle_type_zone?.per_minute_charge} {translateData?.perminute}</Text>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
}
export default RideActive;