import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Ac, Back, Bag, Right, Star1 } from "@src/utils/icons";
import { CarType } from "@src/assets/icons/carType";
import { FuelType } from "@src/assets/icons/fuelType";
import { Milage } from "@src/assets/icons/milage";
import { GearType } from "@src/assets/icons/gearType";
import { Seat } from "@src/assets/icons/seat";
import { Speed } from "@src/assets/icons/speed";
import { styles } from "./styles";
import { external } from "@src/styles/externalStyle";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RentalBookinginterface } from "@src/api/interface/rentalinterface";
import { rentalRideRequests, updateRideRequest } from "@src/api/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { Button, notificationHelper } from "@src/commonComponent";
import { useValues } from "@src/utils/context/index";;
import { appColors, appFonts, windowHeight } from "@src/themes";
import { clearValue } from "@src/utils/localstorage";
import { getFirestore, doc, onSnapshot, getDoc, deleteDoc } from "firebase/firestore";
import { firebaseConfig } from "../../../firebase";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { initializeApp } from "@firebase/app";

// Define route params type
type RentalCarDetailsRouteProp = RouteProp<{
  RentalCarDetails: {
    startDate: string;
    pickUpCoords: { lat: number; lng: number };
    pickupLocation: string;
    dropLocation: string;
    dropCoords: { lat: number; lng: number };
    endDate: string;
    convertedStartTime: string;
    convertedEndTime: string;
    getDriver: boolean;
  };
}, 'RentalCarDetails'>;

// Define state types
interface RootState {
  setting: {
    translateData: any;
  };
  zone: {
    zoneValue: any;
  };
  rentalVehicle: {
    rentalVehicleListsDetails: any;
  };
}

// Memoized components to prevent unnecessary re-renders
const CarDetailItem = React.memo(({ detail, isDark }: { detail: any; isDark: boolean }) => (
  <View style={[styles.detailIcon, { flexDirection: isDark ? 'row-reverse' : 'row' }, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray }]}>
    <detail.Icon color={isDark ? appColors.darkText : appColors.regularText} />
    <Text style={[styles.detailTitle, { color: isDark ? appColors.darkText : appColors.primaryText }]}>{detail.title}</Text>
  </View>
));

const SubImageItem = React.memo(({ img, index, mainImage, setMainImage }: { img: string; index: number; mainImage: string; setMainImage: (img: string) => void }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    key={index}
    style={[
      styles.subImgView,
      mainImage === img && styles.selectedSubImg,
    ]}
    onPress={() => setMainImage(img)}
  >
    <Image source={{ uri: img }} style={styles.subImg} />
  </TouchableOpacity>
));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function RentalCarDetails() {
  const route = useRoute<RentalCarDetailsRouteProp>();
  const { startDate, pickUpCoords, pickupLocation, dropLocation, dropCoords, endDate, convertedStartTime, convertedEndTime, getDriver } = route.params;
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { rentalVehicleListsDetails } = useSelector((state: RootState) => state.rentalVehicle);
  const { zoneValue } = useSelector((state: RootState) => state.zone);
  const { translateData } = useSelector((state: RootState) => state.setting);
  const { viewRTLStyle, isDark } = useValues();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [bookLoading, setBookloading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [rideCancelLoading, setRideCancelLoading] = useState(false);
  const [ride_req_id, setRideReqId] = useState<any>(null);
  const totalSeconds = 60;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  const [mainImage, setMainImage] = useState('');
  const imageIndexRef = useRef(0);
  const imageChangeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized function to prevent recreation on every render
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsBottomSheetVisible(false);
    }
  }, []);

  // Memoized function to prevent recreation on every render
  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand();
    setIsBottomSheetVisible(true);
  }, []);

  // Memoized function to prevent recreation on every render
  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.close();
    setIsBottomSheetVisible(false);
  }, []);

  // Memoized function to prevent recreation on every render
  const modelClose = useCallback(async () => {
    setRideCancelLoading(true);
    handleCloseModalPress();
    setBookloading(false);
    // @ts-ignore
    dispatch(updateRideRequest({ payload: '', ride_id: ride_req_id }))
      .then((res: any) => {
        setRideCancelLoading(false);
        if (res?.payload?.id) {
          notificationHelper("", translateData.rideReqCancel, "error")
        }
      })
  }, [dispatch, handleCloseModalPress, ride_req_id, translateData.rideReqCancel]);

  useEffect(() => {
    if (!ride_req_id) return;

    const rideReqId = String(ride_req_id);
    const rentalRequestRef = doc(db, "ride_requests", rideReqId, "rental_requests", rideReqId);

    const unsubscribe = onSnapshot(rentalRequestRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        if (data?.status == "canceled") {
          modelClose();
          notificationHelper("", translateData.driverRejectReq, "error");
        }
        else if (data?.status == "accepted") {
          handleCloseModalPress();

          await deleteDoc(rentalRequestRef);

          const rideDocRef = doc(db, "rides", String(data.ride_id));
          const rideDoc = await getDoc(rideDocRef);

          if (rideDoc.exists()) {
            const fullRideData = rideDoc.data();
            notificationHelper("", translateData.driverAcceptReq, "success");
            navigation.navigate("PaymentMethod", { rideData: fullRideData });
          } else {
            console.warn("Ride data not found for ride_id:", data.ride_id);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [ride_req_id, handleCloseModalPress, navigation, translateData.driverAcceptReq, translateData.driverRejectReq, modelClose]);

  // Memoized car details array to prevent recreation on every render
const capitalizeFirst = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const carDetails = useMemo(
  () => [
    { Icon: CarType, title: capitalizeFirst(rentalVehicleListsDetails.vehicle_subtype) },
    { Icon: FuelType, title: capitalizeFirst(rentalVehicleListsDetails.fuel_type) },
    { Icon: Milage, title: `${rentalVehicleListsDetails.mileage}` },
    { Icon: GearType, title: capitalizeFirst(rentalVehicleListsDetails.gear_type) },
    { Icon: Seat, title: `${rentalVehicleListsDetails?.seatingCapacity || 1} Seat` },
    { Icon: Speed, title: `${rentalVehicleListsDetails.vehicle_speed}` },
    { Icon: Ac, title: rentalVehicleListsDetails.is_ac == 1 ? "AC" : "Non AC" },
    { Icon: Bag, title: `${rentalVehicleListsDetails.bag_count}` },
  ],
  [rentalVehicleListsDetails]
);


  // Set initial main image
  useEffect(() => {
    if (rentalVehicleListsDetails?.rental_vehicle_galleries?.length > 0) {
      setMainImage(rentalVehicleListsDetails.rental_vehicle_galleries[0]);
    } else if (rentalVehicleListsDetails?.normal_image_url) {
      setMainImage(rentalVehicleListsDetails.normal_image_url);
    }
  }, [rentalVehicleListsDetails]);

  // Auto-change main image every 3 seconds
  useEffect(() => {
    // Clear any existing interval
    if (imageChangeIntervalRef.current) {
      clearInterval(imageChangeIntervalRef.current);
    }

    // Only start interval if there are multiple images
    const images = rentalVehicleListsDetails?.rental_vehicle_galleries || [];
    if (images.length > 1) {
      imageIndexRef.current = 0;

      imageChangeIntervalRef.current = setInterval(() => {
        imageIndexRef.current = (imageIndexRef.current + 1) % images.length;
        setMainImage(images[imageIndexRef.current]);
      }, 3000); // Change image every 3 seconds
    }

    // Cleanup interval on unmount or when images change
    return () => {
      if (imageChangeIntervalRef.current) {
        clearInterval(imageChangeIntervalRef.current);
      }
    };
  }, [rentalVehicleListsDetails?.rental_vehicle_galleries]);

  // Memoized function to prevent recreation on every render
  const toUTCDateTime = useCallback((dateStr: string, timeStr: string) => {
    const [day, monthName, year] = dateStr.split(" ");
    const [hours, minutes] = timeStr.split(":").map(Number);

    const months: Record<string, number> = {
      January: 0, February: 1, March: 2, April: 3,
      May: 4, June: 5, July: 6, August: 7,
      September: 8, October: 9, November: 10, December: 11
    };

    const month = months[monthName];
    const localDate = new Date(Number(year), month, Number(day), hours, minutes, 0);

    const yyyy = localDate.getUTCFullYear();
    const mm = String(localDate.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(localDate.getUTCDate()).padStart(2, "0");
    const hh = String(localDate.getUTCHours()).padStart(2, "0");
    const mi = String(localDate.getUTCMinutes()).padStart(2, "0");
    const ss = String(localDate.getUTCSeconds()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
  }, []);

  const start_time = useMemo(() => toUTCDateTime(startDate, convertedStartTime), [startDate, convertedStartTime, toUTCDateTime]);
  const end_time = useMemo(() => toUTCDateTime(endDate, convertedEndTime), [endDate, convertedEndTime, toUTCDateTime]);

  // Memoized function to prevent recreation on every render
  const bookRental = useCallback(async () => {
    setBookloading(true);
    const is_with_driver = getDriver ? "1" : "0";
    let dropLocations =
      dropLocation && dropLocation.trim() ? dropLocation : pickupLocation;

    let payload: RentalBookinginterface = {
      locations: [`${pickupLocation}`, `${dropLocations}`],
      location_coordinates: [
        {
          lat: `${pickUpCoords.lat}`,
          lng: `${pickUpCoords.lng}`,
        },
        {
          lat: `${dropCoords?.lat ?? pickUpCoords.lat}`,
          lng: `${dropCoords?.lng ?? pickUpCoords.lng}`,
        },
      ],
      service_id: '1',
      service_category_id: "5",
      vehicle_type_id: `${rentalVehicleListsDetails.vehicle_type_id}`,
      rental_vehicle_id: `${rentalVehicleListsDetails.id}`,
      is_with_driver: `${is_with_driver}`,
      payment_method: "cash",
      start_time: start_time,
      end_time: end_time,
      currency_code: zoneValue?.currency_code,
    };

    // @ts-ignore
    dispatch(rentalRideRequests(payload))
      .unwrap()
      .then(async (res: any) => {
        setBookloading(false);
        if (res.status == 403) {
          notificationHelper('', translateData.loginAgain, 'error');
          clearValue().then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          });
          return;
        }
        if (res?.id) {
          setRideReqId(res?.id);
          handlePresentModalPress();
          notificationHelper("", translateData.rentalReqSend, "success");
          try {
          } catch (err) {
            console.error('❌ Firestore error:', err);
            notificationHelper("", translateData.failedSendReq, "error");
            handleCloseModalPress();
          }
        } else {
          notificationHelper("", res.message, "error");
        }
      })
      .catch((error: any) => {
        console.error("Error in booking rental:", error);
        notificationHelper("", translateData.unexpectedError, "error");
        setBookloading(false);
      });
  }, [
    getDriver,
    dropLocation,
    pickupLocation,
    pickUpCoords,
    dropCoords,
    rentalVehicleListsDetails,
    start_time,
    end_time,
    zoneValue?.currency_code,
    dispatch,
    translateData,
    handlePresentModalPress,
    handleCloseModalPress,
    navigation,
  ]);

  useEffect(() => {
    if (!isBottomSheetVisible) return;
    setSecondsLeft(60);
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (isBottomSheetVisible) {
            modelClose();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBottomSheetVisible, modelClose]);

  // Memoized function to prevent recreation on every render
  const formatTime = useCallback((sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, []);

  // Memoized formatted time to prevent unnecessary recalculations
  const formattedTime = useMemo(() => formatTime(secondsLeft), [secondsLeft, formatTime]);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={[
          styles.backBtn,
          { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor },
          { borderColor: isDark ? appColors.darkBorder : appColors.border },
        ]}
        onPress={() => navigation.goBack()}
      >
        <Back />
      </TouchableOpacity>

      <ScrollView style={{ backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor }} showsVerticalScrollIndicator={false}>
        <View>
          <Image source={{ uri: mainImage }} style={styles.mainImg} />
        </View>
        <View style={[styles.subImgContainer, { flexDirection: viewRTLStyle }, { backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor }]}>
          {rentalVehicleListsDetails?.rental_vehicle_galleries
            ?.map((img: string, index: number) => (
              <SubImageItem
                key={index}
                img={img}
                index={index}
                mainImage={mainImage}
                setMainImage={setMainImage}
              />
            ))}
        </View>
        <View style={[styles.container]}>
          <View style={[styles.subContainer, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
            <View style={[styles.titleView, { flexDirection: viewRTLStyle }]}>
              <Text style={[styles.title, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{rentalVehicleListsDetails.name}</Text>
              <View style={[styles.rateContainer, { flexDirection: viewRTLStyle }]}>
                <Star1 />
                <Text style={styles.rating}>
                  {(rentalVehicleListsDetails?.driver?.rating_count ?? 0).toFixed(1)}
                </Text>
              </View>
            </View>

            <View style={[styles.detailContainer, { flexDirection: viewRTLStyle }]}>
              <Text style={styles.detail}>{rentalVehicleListsDetails.description}</Text>
              <View style={external.fd_row}>
                <Text style={styles.price}>
                  {zoneValue?.currency_symbol}{rentalVehicleListsDetails.vehicle_per_day_price}
                  <Text style={styles.day}>/{translateData.day}</Text>
                </Text>
              </View>
            </View>
            <View style={[styles.border, { borderBottomColor: isDark ? appColors.darkBorder : appColors.border }]} />
            <View style={[styles.driverContainer, { flexDirection: viewRTLStyle }]}>
              <Text style={[styles.title, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData.driverPriceText}</Text>
              <View style={external.fd_row}>
                <Text style={styles.price}>
                  {zoneValue?.currency_symbol}{rentalVehicleListsDetails.driver_per_day_charge}
                  <Text style={styles.day}>/{translateData.day}</Text>
                </Text>
              </View>
            </View>

            <View style={[styles.carDetails, { flexDirection: viewRTLStyle }]}>
              {carDetails?.map((detail, index) => (
                <CarDetailItem key={index} detail={detail} isDark={isDark} />
              ))}
            </View>
            <Text style={[styles.title, external.mt_5, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData.moreInfoText}</Text>
            {rentalVehicleListsDetails?.interior?.map((detail: any, index: number) => (
              <Text key={index} style={styles.description}>
                <Right /> {` ${detail}`}
              </Text>
            ))}
            <Text style={[styles.title, external.mt_15, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData.billSummary}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight(5) }}>
              <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.primaryText }}>{translateData.vehicleFare}</Text>
              <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.primaryText }}>{rentalVehicleListsDetails?.currency_symbol}{rentalVehicleListsDetails?.charge?.vehicle_rent} ({`${rentalVehicleListsDetails?.charge?.no_of_days} ${translateData.day}`})</Text>
            </View>
            {getDriver && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight(3) }}>
                <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.primaryText }}>{translateData.driverFare}</Text>
                <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.primaryText }}>{rentalVehicleListsDetails?.currency_symbol}{rentalVehicleListsDetails?.charge?.driver_rent} ({`${rentalVehicleListsDetails?.charge?.no_of_days} ${translateData.day}`})</Text>
              </View>
            )}
            {rentalVehicleListsDetails?.charge?.platform_fee > 0 && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight(3) }}>
                <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.primaryText }}>{translateData.platformFees}</Text>
                <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.primaryText }}>{rentalVehicleListsDetails?.currency_symbol}{rentalVehicleListsDetails?.charge?.platform_fee}</Text>
              </View>
            )}
            {rentalVehicleListsDetails?.charge?.tax && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight(3) }}>
                <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.primaryText }}>{translateData.tax}</Text>
                <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.primaryText }}>{rentalVehicleListsDetails?.currency_symbol}{rentalVehicleListsDetails?.charge?.tax}</Text>
              </View>
            )}
            {rentalVehicleListsDetails?.charge?.commission && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight(3) }}>
                <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.primaryText }}>{translateData.commission}</Text>
                <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.darkText : appColors.primaryText }}>{rentalVehicleListsDetails?.currency_symbol}{rentalVehicleListsDetails?.charge?.commission}</Text>
              </View>
            )}
            <View style={{ borderBottomWidth: 1, borderColor: isDark ? appColors.darkBorder : appColors.border, borderStyle: 'dashed', marginVertical: windowHeight(5) }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: appFonts.medium, color: isDark ? appColors.darkText : appColors.primaryText }}>{translateData.total}</Text>
              <Text style={{ color: appColors.primary, fontFamily: appFonts.medium }}>{rentalVehicleListsDetails?.currency_symbol}{rentalVehicleListsDetails?.charge?.total}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[external.mv_15]}
            activeOpacity={0.7}
            disabled={bookLoading}
          >
            <Button title={translateData.bookNow} onPress={bookRental} loading={bookLoading} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {isBottomSheetVisible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
          enablePanDownToClose={true}
          backdropComponent={({ style }) => (
            <View style={[style, { backgroundColor: appColors.modelBg }]} />
          )}
          backgroundStyle={{ backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor }}
        >
          <BottomSheetView style={{ paddingHorizontal: windowHeight(14) }}>
            <View style={styles.imageWrapper}>
              <AnimatedCircularProgress
                size={100}
                width={10}
                fill={(1 - secondsLeft / totalSeconds) * 100}
                tintColor={appColors.primary}
                backgroundColor={appColors.loaderBackground}
                rotation={0}
                lineCap="round"
              >
                {
                  () => (
                    <Text style={styles.timerText}>
                      {formattedTime}
                    </Text>
                  )
                }
              </AnimatedCircularProgress>
            </View>

            <Text
              style={[styles.requestSuccess, {
                color: isDark ? appColors.whiteColor : appColors.primaryText,
              }]}
            >
              {translateData.requestSuccessfullySent}
            </Text>
            <Text
              style={styles.modelSuccess}
            >
              {translateData.requestSentSuccess}
            </Text>
            <View
              style={styles.modelButtonView}
            >
              <Button title={translateData.cancel} onPress={modelClose} backgroundColor={appColors.alertRed} loading={rideCancelLoading} />
            </View>
          </BottomSheetView>
        </BottomSheet>
      )}
    </View>
  );
}