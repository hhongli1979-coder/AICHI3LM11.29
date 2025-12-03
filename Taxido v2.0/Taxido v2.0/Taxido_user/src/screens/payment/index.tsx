import { View, Text, TouchableOpacity, Linking, StyleSheet, Image } from "react-native";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Map, notificationHelper } from "@src/commonComponent";
import styles from "./styles";
import { useValues } from "@src/utils/context/index";
import { DriverData } from "./component/driverData/index";
import { TotalFare } from "./component/totalFare/index";
import { useRoute } from "@react-navigation/native";
import { CustomBackHandler } from "@src/components";
import { useAppNavigation } from "@src/utils/navigation";
import { external } from "@src/styles/externalStyle";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView, BottomSheetFlatList, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { useDispatch, useSelector } from "react-redux";
import { allRides, sosData } from "@src/api/store/actions";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { firebaseConfig } from "../../../firebase";
import { Edit, Shield } from "@src/utils/icons";
import NativeAdComponent from "@src/commonComponent/ads/google/NativeAdCard";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function Payment() {
  const { bgFullStyle } = useValues();
  const { navigate, reset } = useAppNavigation();
  const route = useRoute();
  const { rideId } = route.params as { rideId: string };
  const [rideDatas, setRideData] = useState<any>(null);
  const [duration, setDuration] = useState(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const sosSheetRef = useRef<BottomSheetModal>(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const { taxidoSettingData } = useSelector((state: any) => state.setting);

  const waypoints = useMemo(() => {
    if (!rideDatas?.location_coordinates || rideDatas.location_coordinates.length <= 2) return [];
    const stops = rideDatas.location_coordinates.slice(1, -1).map((coord: any) => ({
      lat: parseFloat(coord.lat),
      lng: parseFloat(coord.lng)
    }));
    return stops;
  }, [rideDatas?.location_coordinates]);

  const snapPoints = useMemo(
    () => {
      // Base height - slightly decreased from 45 to 42
      let baseHeight = 42; // Percentage

      // Add height for service category other than 'ride'
      if (rideDatas?.service?.service_category != 'ride') {
        baseHeight = 37.5; // Decreased from 50 to 45
      }

      // Add height for each stop (max 3 stops) - decreased from 12 to 10% per stop
      const locationsCount = rideDatas?.locations?.length || 0;
      const stopsCount = Math.max(0, locationsCount - 2); // Exclude pickup and destination
      const stopsHeight = Math.min(stopsCount, 3) * 10; // 10% per stop, max 30%

      // Add height for ads if enabled - decreased from 32 to 25 for smaller size
      const adsHeight = (taxidoSettingData?.taxido_values?.ads?.native_enable == 1) ? 25 : 0; // 25% for ads

      // Calculate total height
      const totalHeight = baseHeight + stopsHeight + adsHeight;

      // Ensure minimum and maximum bounds - decreased max from 90 to 85
      const finalHeight = Math.min(Math.max(totalHeight, 42), 85); // Between 42% and 85%

      return [`${finalHeight}%`];
    },
    [rideDatas?.service?.service_category, rideDatas?.locations?.length, taxidoSettingData?.taxido_values?.ads?.native_enable]
  );
  const sosSnapPoints = useMemo(() => ["35%"], []);
  const dispatch = useDispatch();
  const { zoneValue } = useSelector((state: any) => state.zone);
  const { sosValue } = useSelector((state: any) => state.sos);
  const { isDark, viewRTLStyle } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);


  useEffect(() => {
    if (!rideId) return;
    const rideDocRef = doc(db, "rides", rideId.toString());
    const unsubscribe = onSnapshot(
      rideDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const updatedData = snapshot.data();
          setRideData(updatedData);

          // Check if payment status is COMPLETED and navigate to MyTab
          if (updatedData?.payment_status == "COMPLETED") {
            notificationHelper('', 'Payment Complete', 'success')
            reset({
              index: 0,
              routes: [{ name: "MyTabs" }],
            });
          }
        } else {
          console.warn('⚠️ Ride document not found');
        }
      },
      (error) => {
        console.error("❌ Error listening to ride updates:", error);
      }
    );
    return () => unsubscribe();
  }, [rideId, reset]);

  useEffect(() => {
    bottomSheetRef.current?.present();
    if (zoneValue?.id) {
      // @ts-ignore - sosData accepts zone_id parameter
      dispatch(sosData(zoneValue.id));
    }
  }, [zoneValue, dispatch]);

  const handlePress = (rideDatas: any) => {
    navigate("PaymentMethod" as any, { rideData: rideDatas } as any);
    dispatch(allRides() as any);
  };

  const handleDurationChange = (newDuration: any) => {
    setDuration(newDuration);
  };

  const handleSOSPress = () => {
    sosSheetRef.current?.present();
  };

  const handleContactPress = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleAddressChange = (locationIndex: number) => {
    navigate("AddressChange" as any, { rideId, rideDatas, locationIndex } as any);
  };

  const renderSosItem = useCallback(
    ({ item }: { item: any }) => (
      <View
        style={{
          marginHorizontal: windowWidth(18),
          borderRadius: windowHeight(5),
        }}>
        <TouchableOpacity
          style={[
            componentStyles.sosItem,
            {
              backgroundColor: isDark
                ? appColors.darkHeader
                : appColors.lightGray,
            },
          ]}
          onPress={() => handleContactPress(item.number)}>
          <View style={{ flexDirection: viewRTLStyle }}>
            <Image source={{ uri: item.sos_image_url }} style={styles.sosImage} />
            <View
              style={[
                styles.sideLine,
                {
                  backgroundColor: isDark
                    ? appColors.darkBorder
                    : appColors.border,
                },
              ]}
            />
            <Text
              style={[
                componentStyles.sosName,
                { color: isDark ? appColors.darkText : appColors.primaryText },
              ]}>
              {item?.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    ),
    [isDark, viewRTLStyle],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <BottomSheetModalProvider>
      <View style={external.main}>
        <CustomBackHandler />
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={handleSOSPress} style={{ position: 'absolute', zIndex: 1, height: windowHeight(30), width: windowWidth(110), backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', top: windowHeight(15), right: windowWidth(15), borderRadius: windowHeight(5), paddingLeft: windowHeight(5), borderWidth: 1, borderColor: isDark ? appColors.darkBorder : appColors.border }} >
            <Shield color={appColors.primary} />
            <Text style={{ fontFamily: appFonts.medium, color: isDark ? appColors.whiteColor : appColors.primaryText, marginHorizontal: windowWidth(8) }}>Safety</Text>
          </TouchableOpacity>
          <Map
            markerImage={rideDatas?.vehicle_type?.vehicle_map_icon_url}
            userLocation={rideDatas?.location_coordinates?.[rideDatas?.location_coordinates?.length - 1] || {}}
            waypoints={waypoints}
            onDurationChange={handleDurationChange}
            driverId={rideDatas?.driver?.id || ""}
            driverLocation={driverLocation}
            setDriverLocation={setDriverLocation}
          />
        </View>

        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          enableDismissOnClose={false}
          handleComponent={null}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: "13%",
          }}
          backgroundStyle={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: isDark
              ? appColors.darkHeader
              : appColors.whiteColor,
          }}>
          <BottomSheetView style={{ paddingHorizontal: 16 }}>
            <View style={styles.mainView}>
              <DriverData
                driverDetails={rideDatas}
                duration={duration}
              />
              <View style={{ marginTop: windowHeight(4) }}>
                {rideDatas?.locations?.length > 2 && rideDatas.locations.slice(1, -1).map((location: string, index: number) => {
                  const actualIndex = index + 1;
                  return (
                    <View key={`stop-${index}`} style={[external.fd_row, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray, borderRadius: windowHeight(5), padding: windowHeight(10), marginBottom: windowHeight(6), justifyContent: 'space-between', alignItems: 'center' }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: appFonts.semiBold, fontSize: fontSizes.FONT18, color: isDark ? appColors.whiteColor : appColors.primaryText, marginBottom: windowHeight(4) }}>{translateData.stop} {index + 1}</Text>
                        <Text style={{ fontFamily: appFonts.regular, fontSize: fontSizes.FONT13, color: appColors.regularText }} numberOfLines={1}>
                          {location}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => handleAddressChange(actualIndex)} style={{ marginLeft: windowWidth(10), paddingLeft: windowWidth(10), borderLeftWidth: 1, borderLeftColor: isDark ? appColors.darkBorder : appColors.border }}>
                        <Edit color={appColors.primary} />
                      </TouchableOpacity>
                    </View>
                  );
                })}

                {rideDatas?.locations?.[rideDatas?.locations?.length - 1] && (
                  rideDatas?.service_category?.slug === 'ride' ||
                  rideDatas?.service_category?.slug === 'intercity' ||
                  rideDatas?.service_category?.slug === 'schedule'
                ) && (
                    <TouchableOpacity onPress={() => handleAddressChange(rideDatas.locations.length - 1)} style={[external.fd_row, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray, borderRadius: windowHeight(5), padding: windowHeight(10), justifyContent: 'space-between', alignItems: 'center' }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: appFonts.semiBold, fontSize: fontSizes.FONT18, color: isDark ? appColors.whiteColor : appColors.primaryText, marginBottom: windowHeight(4) }}>{translateData.destination}</Text>
                        <Text style={{ fontFamily: appFonts.regular, fontSize: fontSizes.FONT15, color: appColors.regularText }} numberOfLines={1}>
                          {rideDatas.locations[rideDatas.locations.length - 1]}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => handleAddressChange(rideDatas.locations.length - 1)} style={{ marginLeft: windowWidth(10), paddingLeft: windowWidth(10), borderLeftWidth: 1, borderLeftColor: isDark ? appColors.darkBorder : appColors.border }}>
                        <Edit color={appColors.primary} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                {rideDatas?.service?.service_type == 'freight' && (
                  <View style={[external.fd_row, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray, borderRadius: windowHeight(5), padding: windowHeight(10), justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: appFonts.semiBold, fontSize: fontSizes.FONT18, color: isDark ? appColors.whiteColor : appColors.primaryText, marginBottom: 4 }}>{translateData.destination}</Text>
                      <Text style={{ fontFamily: appFonts.regular, fontSize: fontSizes.FONT15, color: appColors.regularText }} numberOfLines={1}>
                        {rideDatas.locations[rideDatas.locations.length - 1]}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: isDark ? appColors.darkBorder : appColors.border,
                  marginVertical: windowHeight(1.5),
                  marginTop: windowHeight(10),
                }}
              />
              {taxidoSettingData?.taxido_values?.ads?.native_enable == 1 && (
                <NativeAdComponent heights={windowHeight(150)} adsHeight={windowHeight(60)} />
              )}
              <View style={[styles.card2, { backgroundColor: bgFullStyle }]}>
                <TotalFare
                  handlePress={() => handlePress(rideDatas)}
                  fareAmount={rideDatas?.total || 0}
                  rideStatus={rideDatas?.ride_status?.slug || ""}
                />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={sosSheetRef}
          index={1}
          snapPoints={sosSnapPoints}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: "13%",
          }}
          backgroundStyle={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor,
          }}>
          <BottomSheetView style={componentStyles.contentContainer}>
            <Text
              style={[
                componentStyles.title,
                { color: isDark ? appColors.whiteColor : appColors.blackColor },
              ]}>
              {translateData.keepYourselfSafe}
            </Text>
          </BottomSheetView>
          <BottomSheetFlatList
            data={sosValue?.data}
            keyExtractor={item => item.id.toString()}
            renderItem={renderSosItem}
            style={{ marginTop: windowHeight(20) }}
          />
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}

const componentStyles = StyleSheet.create({
  contentContainer: {
    width: "100%",
  },
  title: {
    fontSize: fontSizes.FONT22,
    color: appColors.primaryText,
    fontFamily: appFonts.bold,
    textAlign: "center",
  },
  sosItem: {
    marginTop: windowHeight(10),
    padding: windowHeight(10),
  },
  sosName: {
    fontFamily: appFonts.medium,
  },
});

export default Payment;
