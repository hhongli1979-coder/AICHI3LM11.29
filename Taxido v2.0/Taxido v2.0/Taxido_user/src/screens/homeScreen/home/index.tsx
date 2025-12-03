import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { SafeAreaView, ScrollView, View, BackHandler, Text, StyleSheet, Image } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { commonStyles } from "../../../styles/commonStyle";
import { TodayOfferContainer } from "../../../components/homeScreen/todaysOffer";
import { TopCategory } from "../../../components/homeScreen/topCategory";
import { HomeSlider } from "../../../components/homeScreen/slider";
import { HeaderContainer } from "../../../components/homeScreen/headerContainer";
import styles from "./styles";
import { useValues } from '@src/utils/context/index';
import { Button } from "@src/commonComponent";
import { external } from "../../../styles/externalStyle";
import { appColors, appFonts, fontSizes, windowHeight } from "@src/themes";
import { useDispatch, useSelector } from "react-redux";
import { vehicleData } from "../../../api/store/actions/vehicleTypeAction";
import { useAppNavigation } from "@src/utils/navigation";
import { Recentbooking } from "@src/screens/recentBooking";
import { BottomTitle } from "@src/components";
import { allRides, notificationDataGet, paymentsData, serviceDataGet, taxidosettingDataGet, userSaveLocation, walletData } from "@src/api/store/actions";
import { HomeLoader } from "../HomeLoader";
import useStoredLocation from "@src/components/helper/useStoredLocation";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { deleteValue, getValue } from "@src/utils/localstorage";
import { userZone } from "@src/api/store/actions";
import Images from "@src/utils/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DynamicIceland from "../../../components/homeScreen/DynamicIceland";
import firestore from '@react-native-firebase/firestore';

export function HomeScreen() {
  const dispatch = useDispatch();
  const { textColorStyle, viewRTLStyle, isDark, bgFullStyle, setIsRTL, isRTL } = useValues();
  const isFocused = useIsFocused();
  const [isScrolling, setIsScrolling] = useState(true);
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);
  const { reset } = useAppNavigation();
  const { self } = useSelector((state: any) => state.account);
  const { homeScreenDataPrimary, loading } = useSelector((state: any) => state.home);
  const { latitude, longitude } = useStoredLocation();
  const exitBottomSheetRef = useRef<BottomSheet>(null);
  const exitSnapPoints = useMemo(() => ["1%", "22%"], []);
  const [serviceAvilable, setServiceAvailable] = useState<null | boolean>(null);
  const [currentRideReqData, setCurrentRideReqData] = useState<any>(null);
  const [acceptedRideId, setAcceptedRideId] = useState<string | null>(null);
  const listenerRef = useRef<any>(null);


  const getVehicleTypes = useCallback(async () => {
    dispatch(vehicleData() as any);
  }, [dispatch]);

  // Function to fetch ride data - available for external use
  const checkrideData = useCallback(async () => {
    try {
      const rideId = self?.active_rides_ids;

      if (!rideId) {
        return null;
      }

      const rideDoc = await firestore()
        .collection("rides")
        .doc(String(rideId))
        .get();

      if (rideDoc.exists) {
        const rideData = rideDoc.data();
        return rideData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching ride data:", error);
      return null;
    }
  }, [self?.active_rides_ids]);

  // Setup real-time listener for ride request data
  useEffect(() => {
    const setupRealTimeListener = async () => {
      const rideId = await getValue("current_ride_request_id");

      if (!rideId) {
        // Clear current ride data if no ride ID
        setCurrentRideReqData(null);
        return;
      }

      try {
        // Remove existing listener if any
        if (listenerRef.current) {
          listenerRef.current();
          listenerRef.current = null;
        }

        // Set up real-time listener
        listenerRef.current = firestore()
          .collection('ride_requests')
          .doc(rideId)
          .onSnapshot((docSnap) => {
            if (docSnap.exists) {
              const rideData = docSnap.data();

              // If status is no longer "requested", clean up
              if (rideData?.status == "cancelled") {
                deleteValue("current_ride_request_id");
                setCurrentRideReqData(null);
              } else if (rideData?.status == "accepted") {
                deleteValue("current_ride_request_id");
                setCurrentRideReqData(null);
                if (rideData?.ride_id) {
                  setAcceptedRideId(String(rideData?.ride_id));
                }
              } else if (rideData?.status == "completed") {
                checkrideData();
                setCurrentRideReqData(null); // Clear request data if completed
                deleteValue("current_ride_request_id");
              } else {
                setCurrentRideReqData(rideData);
              }
            } else {
              console.warn(" No ride document found for ID:", rideId);
              deleteValue("current_ride_request_id"); // Clear local storage if doc doesn't exist
              setCurrentRideReqData(null);
            }
          }, (error) => {
            console.error("Error in real-time listener:", error);
          });
      } catch (error) {
        console.error("Error setting up real-time listener:", error);
      }
    };

    setupRealTimeListener();

    // Cleanup listener on unmount or when focus changes
    return () => {
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
      }
    };
  }, [isFocused, checkrideData]); // Add isFocused and checkrideData dependencies


  // for ride data 
  useEffect(() => {


    const rideId = acceptedRideId
      ? String(acceptedRideId)
      : self?.active_rides_ids
        ? String(self.active_rides_ids)
        : null;


    if (!rideId) {
      setCurrentRideReqData(null);
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
      }
      return;
    }

    // Clean previous listener
    if (listenerRef.current) {
      listenerRef.current();
      listenerRef.current = null;
    }

    // Start new listener
    listenerRef.current = firestore()
      .collection("rides")
      .doc(rideId.toString())
      .onSnapshot(
        (docSnap) => {
          // Always log the snapshot update regardless of whether document exists

          if (!docSnap.exists) {
            deleteValue("current_ride_request_id");
            setCurrentRideReqData(null);
            return;
          }

          const ride = docSnap.data();
          const status = ride?.ride_status?.slug;

          if (status == "cancelled" || status == "completed") {
            deleteValue("current_ride_request_id");
            setCurrentRideReqData(null);
            return;
          }

          // Store valid ride data for any other status
          setCurrentRideReqData(ride);
        },
        (error) => console.error(" Ride Listener Error:", error)
      );

    // Cleanup listener on unmount
    return () => {
      if (listenerRef.current) {
        listenerRef.current();
        listenerRef.current = null;
      }
    };
  }, [self?.active_rides_ids, isFocused, acceptedRideId]); // Added isFocused dependency

  useEffect(() => {
    const loadLanguageFromStorage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
        if (savedLanguage == "ar") {
          setIsRTL(true);
        } else if (isRTL) {
          setIsRTL(true);
        } else {
          setIsRTL(false);
        }
      } catch (error) {
        console.error("Error loading language from storage:", error);
      }
    };
    loadLanguageFromStorage();
  }, [isRTL, setIsRTL]);

  const [loaderService, setLoaderService] = useState(false);

  useEffect(() => {
    dispatch(taxidosettingDataGet() as any);
    dispatch(allRides() as any);
    dispatch(serviceDataGet() as any);
    dispatch(vehicleData() as any);
    dispatch(walletData() as any);
    dispatch(paymentsData() as any);
    dispatch(notificationDataGet() as any);
    dispatch(userSaveLocation() as any);
    getVehicleTypes();
  }, [dispatch, getVehicleTypes]);

  useEffect(() => {
    const getAddress = async () => {
      let lat = await getValue("user_latitude_Selected");
      let lng = await getValue("user_longitude_Selected");
      let finalLat = lat ? parseFloat(lat) : latitude;
      let finalLng = lng ? parseFloat(lng) : longitude;

      if (!finalLat || !finalLng) return;

      try {
        setLoaderService(true);
        dispatch(
          userZone({ lat: finalLat.toString(), lng: finalLng.toString() }) as any,
        ).then(async (res: any) => {
          if (!res?.payload?.id) {
            setServiceAvailable(false);
            setLoaderService(false);
          } else {
            setServiceAvailable(true);
            setLoaderService(false);
          }
        });
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    getAddress();
  }, [dispatch, latitude, longitude, taxidoSettingData]);

  useEffect(() => {
    const backAction = () => {
      exitBottomSheetRef.current?.expand();
      return true;
    };
    if (isFocused) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );
      return () => backHandler.remove();
    }
  }, [isFocused]);

  const exitAndRestart = useCallback(() => {
    exitBottomSheetRef.current?.close();
    setTimeout(() => {
      BackHandler.exitApp();
      reset({
        index: 0,
        routes: [{ name: "Splash" }],
      });
    }, 500);
  }, [reset]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  const isDataEmpty =
    !homeScreenDataPrimary ||
    Object.keys(homeScreenDataPrimary).length === 0 ||
    homeScreenDataPrimary === null;


  return (
    <View
      style={[
        commonStyles.flexContainer,
        { backgroundColor: appColors.lightGray },
      ]}>
      <SafeAreaView style={styles.container}>
        <HeaderContainer />
      </SafeAreaView>
      {loading || isDataEmpty ? (
        <HomeLoader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          nestedScrollEnabled={true}
          scrollEnabled={isScrolling}
          contentContainerStyle={[
            styles.containerStyle,
            {
              backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
            },
          ]}>
          {loaderService || serviceAvilable === null ? (
            <HomeLoader />
          ) : serviceAvilable ? (
            <>
              {homeScreenDataPrimary?.banners?.length > 0 && (
                <HomeSlider
                  onSwipeStart={() => setIsScrolling(false)}
                  onSwipeEnd={() => setIsScrolling(true)}
                  bannerData={homeScreenDataPrimary.banners}
                />
              )}
              {homeScreenDataPrimary?.service_categories?.length > 0 && (
                <TopCategory
                  categoryData={homeScreenDataPrimary.service_categories}
                />
              )}

              {homeScreenDataPrimary?.recent_rides?.length > 0 && (
                <Recentbooking
                  recentRideData={homeScreenDataPrimary.recent_rides}
                />
              )}
              {homeScreenDataPrimary?.coupons?.length > 0 &&
                taxidoSettingData?.taxido_values?.activation?.coupon_enable ==
                1 && (
                  <View style={styles.todayOfferContainer}>
                    <TodayOfferContainer
                      couponsData={homeScreenDataPrimary.coupons}
                    />
                  </View>
                )}
            </>
          ) : (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Image
                source={
                  isDark ? Images.noServiceDark : Images.noServices
                }
                resizeMode="contain"
                style={styles.image}
              />
              <Text
                style={[
                  styles.titles,
                  {
                    color: isDark
                      ? appColors.whiteColor
                      : appColors.primaryText,
                  },
                ]}>
                {translateData.ServiceUnavailableNo}
              </Text>
            </View>
          )}

          <BottomTitle />
        </ScrollView>
      )}

      {/* Dynamic Iceland Component with real-time data */}
      {currentRideReqData && <DynamicIceland rideData={currentRideReqData} />}

      <BottomSheet
        ref={exitBottomSheetRef}
        index={-1}
        snapPoints={exitSnapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        style={{ zIndex: 2 }}
        handleIndicatorStyle={{
          backgroundColor: appColors.primary,
          width: "13%",
        }}
        backgroundStyle={{ backgroundColor: bgFullStyle }}>
        <BottomSheetView
          style={[
            bottomSheetStyles.contentContainer,
            {
              backgroundColor: isDark
                ? appColors.darkHeader
                : appColors.whiteColor,
            },
          ]}>
          <View style={styles.modelView}>
            <Text
              style={[
                external.ti_center,
                {
                  color: textColorStyle,
                  fontFamily: appFonts.medium,
                  fontSize: fontSizes.FONT22,
                  paddingVertical: windowHeight(10),
                },
              ]}>
              {translateData?.exitTitle}
            </Text>
          </View>
          <View
            style={[
              external.ai_center,
              external.js_space,

              { flexDirection: viewRTLStyle, marginTop: windowHeight(8) },
            ]}>
            <Button
              width={"47%" as any}
              title={translateData.no}
              onPress={() => exitBottomSheetRef.current?.close()}
            />
            <Button
              width={"47%" as any}
              backgroundColor={
                isDark ? appColors.darkPrimary : appColors.lightGray
              }
              title={translateData.yes}
              textColor={isDark ? appColors.darkText : appColors.primaryText}
              onPress={exitAndRestart}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const bottomSheetStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: windowHeight(15),
    backgroundColor: appColors.whiteColor,
  },
});