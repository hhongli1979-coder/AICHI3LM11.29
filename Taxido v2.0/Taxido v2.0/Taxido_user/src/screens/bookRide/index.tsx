import { Text, View, FlatList, TouchableOpacity, TextInput, Pressable, BackHandler, Modal, ActivityIndicator, Alert, Keyboard, AppState, Vibration, Platform, ScrollView, Image, Dimensions } from "react-native";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { commonStyles } from "../../styles/commonStyle";
import { external } from "../../styles/externalStyle";
import { Button, notificationHelper, RadioButton, SolidLine } from "@src/commonComponent";
import { styles } from "./styles";
import { BookRideItem } from "./bookRideItem/index";
import { ModalContainers } from "./modalContainer/index";
import { useValues } from "@src/utils/context";
import { appColors, appFonts, windowWidth } from "@src/themes";
import { fontSizes, windowHeight } from "@src/themes";
import { Back, NewContact, UserFill, Forword, Card, User, Close, CloseCircle, Coupon, ArrowDown, Preference } from "@utils/icons";
import { useRoute } from "@react-navigation/native";
import { CancelRender } from "../cancelFare/cancelRenderItem/index";
import { useDispatch, useSelector } from "react-redux";
import { allDriver, allRides, couponVerifyData } from "../../api/store/actions/index";
import { AppDispatch } from "../../api/store/index";
import { updateRideRequest } from "../../api/store/actions/index";
import { clearValue, getValue, setValue } from "@src/utils/localstorage";
import Images from "@src/utils/images";
import { useAppNavigation } from "@src/utils/navigation";
import FastImage from "react-native-fast-image";
import { URL } from "@src/api/config";
import { noserviceData } from "@src/data/unavailableVehicleData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, { BottomSheetModal, BottomSheetView, BottomSheetModalProvider, BottomSheetFlatList, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, getDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { firebaseConfig } from "../../../firebase";
import { check, request, PERMISSIONS, RESULTS, openSettings } from "react-native-permissions";
import { RideRequestData } from "./type";
import MapScreen from "./map/index";
import PaymentItem from "./component/paymentRender";
import CouponsBottomSheet from "./component/couponSheet";
import Checkbox from "@src/commonComponent/checkBox";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function BookRide() {
  const navigation = useAppNavigation();
  const route = useRoute<RideRequestData | any>();
  const { pickupLocation, stops, destination, service_ID, zoneValue, service_category_ID, receiverName, countryCode, phoneNumber, scheduleDate, filteredLocations,
    descriptionText, otherContect, otherName, pickupCoords, destinationCoords, selectedImage, parcelWeight } = route.params;
  const { countinueRide = false } = route.params ?? {};
  const { countinueRideId = '' } = route.params ?? {};
  const { vehicleIdValue = null } = route.params ?? {};
  const { textColorStyle, bgContainer, textRTLStyle, isDark, viewRTLStyle, Google_Map_Key } = useValues();
  const { translateData, taxidoSettingData, settingData } = useSelector((state: any) => state.setting);
  const [mapType, _setMapType] = useState<string>(taxidoSettingData?.taxido_values?.location?.map_provider);
  const dispatch = useDispatch<AppDispatch>();
  const [seletedPayment, setSeletedPayment] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedItemData, setSelectedItemData] = useState<string | null | any>(
    null,
  );
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [stopsCoords, setStopsCoords] = useState<
    Array<{ lat: number; lng: number }>
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [serviceVisible, setServiceVisible] = useState<boolean>(false);
  const ZoneArea = zoneValue?.locations || null;
  const { vehicleTypedata } = useSelector(
    (state: any) => state?.vehicleType || {},
  );
  const activePaymentMethods = zoneValue?.payment_method;
  const [fareValue, setFareValue] = useState<any>(0);
  const [Warning, setWarning] = useState<boolean>(false);
  const [distance, _setDistance] = useState<boolean | any>(false);
  const [isExpanding, setIsExpanding] = useState<boolean>(countinueRide);
  const [warningMessage, setWarningMessage] = useState<string>();
  const [rideID, setRideId] = useState(countinueRideId);
  const [driverId, setDriverId] = useState([]);
  const [riderequestId, setRideRequestId] = useState();
  const mapRef = useRef<any>(null);
  const [bookLoading, setBookLoading] = useState<boolean>(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const [isPulsing, setIsPulsing] = useState<boolean>(countinueRide);
  const TIMER_DURATION =
    taxidoSettingData?.taxido_values?.ride?.find_driver_time_limit * 60 * 1000;
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const intervalTimeRef = useRef<NodeJS.Timeout | null>(null);
  const [_currentNearestDriver, _setCurrentNearestDriver] = useState<any>([]);
  const dataList = vehicleTypedata && vehicleTypedata.length > 0
    ? vehicleTypedata
    : noserviceData;
  const [isValid, setIsValid] = useState<boolean>(true);
  const { goBack } = useAppNavigation();
  const [coupon, setCoupon] = useState<string | null | any>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>(coupon?.code || "");

  const increaseAmount = parseFloat(
    taxidoSettingData?.taxido_values?.ride?.increase_amount_range ?? 10,
  );

  const minFare = parseFloat(
    selectedItemData?.charges?.min_bidding_faire_amount,
  );
  const maxFare = parseFloat(
    selectedItemData?.charges?.max_bidding_faire_amount,
  );
  const numericFare = parseFloat(fareValue) || minFare;
  const [couponValue, setCouponValue] = useState<any>();
  const [finalPrices, setFinalPrices] = useState<{ [key: string]: string }>({});
  const mainSheetRef = useRef<BottomSheet>(null);
  const vehicleDetailsSheetRef = useRef<BottomSheetModal>(null);
  const noVehicleSheetRef = useRef<BottomSheetModal>(null);
  const paymentSheetRef = useRef<BottomSheetModal>(null);
  const riderSheetRef = useRef<BottomSheetModal>(null);
  const couponsSheetRef = useRef<BottomSheetModal>(null);
  const preferenceSheetRef = useRef<BottomSheetModal>(null);
  const [mapBottomPadding, setMapBottomPadding] = useState<number>(0);
  const mainSnapPoints = useMemo(() => {
    const bidding = Number(
      taxidoSettingData?.taxido_values?.activation?.bidding ?? 0,
    );
    return bidding === 0 ? ["44%", "53%"] : ["55%", "65%"];
  }, [taxidoSettingData?.taxido_values?.activation?.bidding]);
  const vehicleDetailSnapPoints = useMemo(() => ["75%"], ['70%']);
  const noVehicleSnapPoints = useMemo(() => ["30%"], []);
  const paymentSnapPoints = useMemo(() => ["60%"], []);
  const riderSnapPoints = useMemo(() => ["40%"], []);
  const couponsSnapPoints = useMemo(() => ["30%"], []);
  const preferanceSnapPoints = useMemo(() => ["40%"], []);
  const webViewRef = useRef<any>(null);
  const [_bids, _setBids] = useState<any>([]);
  const [driverbidValue, setDriverBidValue] = useState<string>();
  const [selectedItem1, setSelectedItem1] = useState<number | null>(null);

  const [selectedPrefs, setSelectedPrefs] = useState<{
    [vehicleId: string]: any[];
  }>({});
  const [selectedFinalPrice, setSelectedFinalPrice] = useState<string>("");

  // Declare all useCallback wrapped functions at the beginning
  const sendToWebView = useCallback((action: any, data = {}) => {
    const payload = JSON.stringify({ action, ...data });
    webViewRef.current?.postMessage(payload);
  }, [webViewRef]);

  const cancelTimer = useCallback(async () => {
    setIsPulsing(false);
    timerCancelledRef.current = true;

    if (intervalTimeRef.current) {
      clearInterval(intervalTimeRef.current);
      intervalTimeRef.current = null;
    }

    await AsyncStorage.removeItem("ride_timer_start");
    setIsTimerRunning(false);
    setRemainingTime(0);
    setIsExpanding(false);
  }, [intervalTimeRef, timerCancelledRef]);


  const handleTimerComplete = useCallback(async () => {
    if (timerCancelledRef.current) return;

    handleCancelRide();
    await stopPulseAnimation();
    setBookLoading(false);

    if (riderequestId) {
      dispatch(
        updateRideRequest({
          payload: { status: "cancelled" },
          ride_id: riderequestId,
        }),
      );
    }
  }, [dispatch, handleCancelRide, riderequestId, stopPulseAnimation]);

  const checkTimer = useCallback(async () => {
    if (timerCancelledRef.current) return;

    const storedStart = await AsyncStorage.getItem("ride_timer_start");
    if (storedStart) {
      const elapsed = Date.now() - parseInt(storedStart, 10);
      const remaining = TIMER_DURATION - elapsed;

      if (remaining <= 0) {
        setRemainingTime(0);
        await handleTimerComplete();
      } else {
        setRemainingTime(remaining);
      }
    }
  }, [TIMER_DURATION, handleTimerComplete]);

  const timerCancelledRef = useRef(false);

  const togglePreference = (item: any) => {
    if (!selectedItemData?.id) return;

    const vehicleId = selectedItemData.id.toString();
    setSelectedPrefs(prev => {
      const currentVehiclePrefs = prev[vehicleId] || [];
      const isAlreadySelected = currentVehiclePrefs.some(p => p.id === item.id);

      if (isAlreadySelected) {
        return {
          ...prev,
          [vehicleId]: currentVehiclePrefs.filter(p => p.id !== item.id),
        };
      } else {
        return {
          ...prev,
          [vehicleId]: [...currentVehiclePrefs, item],
        };
      }
    });
  };

  const preferences = selectedItemData?.vehicle_type_zone?.preferences || [];

  useEffect(() => {
    if (pickupCoords && destinationCoords) {
      sendToWebView("setMarkers", {
        pickup: pickupCoords,
        destination: destinationCoords,
        apiKey: Google_Map_Key,
      });
    }
  }, [pickupCoords, destinationCoords, Google_Map_Key, sendToWebView]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("MyTabs");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [isExpanding, isTimerRunning, bookLoading, navigation]);

  useEffect(() => {
    if (selectedItemData?.id && finalPrices[selectedItemData.id]) {
      setSelectedFinalPrice(`${finalPrices[selectedItemData.id]}`);
    }
  }, [selectedItemData, finalPrices]);

  useEffect(() => {
    if (
      selectedItemData?.id &&
      !taxidoSettingData?.taxido_values?.activation?.bidding
    ) {
      const vehicleId = selectedItemData.id.toString();
      const vehiclePrefs = selectedPrefs[vehicleId] || [];
      const basePrice = Number(selectedItemData?.charges?.total ?? 0);
      const prefsTotal = Array.isArray(vehiclePrefs)
        ? vehiclePrefs.reduce((sum, pref) => sum + Number(pref.price ?? 0), 0)
        : 0;
      const finalPrice = basePrice + prefsTotal;
      setSelectedFinalPrice(`${finalPrice}`);
      setFinalPrices(prev => ({ ...prev, [selectedItemData.id]: finalPrice }));
    }
  }, [selectedPrefs, selectedItemData?.id, taxidoSettingData?.taxido_values?.activation?.bidding, selectedItemData?.charges?.total]);

  const handleIncrease = () => {
    Vibration.vibrate(42);
    const newFare = numericFare + increaseAmount;

    if (newFare >= maxFare) {
      setFareValue(String(maxFare.toFixed(2)));
    } else {
      setFareValue(String(newFare.toFixed(2)));
    }
  };

  const handleDecrease = () => {
    Vibration.vibrate(42);
    const newFare = numericFare - increaseAmount;

    if (newFare <= minFare) {
      setFareValue(String(minFare.toFixed(2)));
    } else {
      setFareValue(String(newFare.toFixed(2)));
    }
  };

  const isPlusDisabled = numericFare >= maxFare;
  const isMinusDisabled = numericFare <= minFare;

  useEffect(() => {
    if (selectedItemData?.charges?.total) {
      setFareValue(selectedItemData.charges.total);
    }
  }, [selectedItemData]);

  useEffect(() => {
    setInputValue(coupon?.code || "");
  }, [coupon]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        mainSheetRef.current?.snapToIndex(2);
      }, 100);
    }
  }, [loading]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const renderNullBackdrop = useCallback(() => null, []);

  const fitMapToRoute = useCallback(
    (bottomPadding = 0) => {
      if (mapRef.current && pickupCoords && destinationCoords) {
        const coordinates = [
          { latitude: pickupCoords.lat, longitude: pickupCoords.lng },
          ...stopsCoords.map(stop => ({
            latitude: stop.lat,
            longitude: stop.lng,
          })),
          { latitude: destinationCoords.lat, longitude: destinationCoords.lng },
        ];

        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 100,
            right: 50,
            bottom: bottomPadding + 50,
            left: 50,
          },
          animated: true,
        });
      }
    },
    [pickupCoords, destinationCoords, stopsCoords],
  );

  const handleMainSheetChange = useCallback(
    (index: number) => {
      if (index === 0) {
        mainSheetRef.current?.snapToIndex(1);
        return;
      }

      let padding = 0;
      if (index > 0) {
        const snapPoint = mainSnapPoints[index];
        if (typeof snapPoint === "string" && snapPoint.endsWith("%")) {
          padding = Dimensions.get("window").height * (parseInt(snapPoint, 10) / 100);
        } else if (typeof snapPoint === "number") {
          padding = snapPoint;
        }
      }
      setMapBottomPadding(padding);
    },
    [mainSnapPoints],
  );

  const handlePaymentSheetChange = useCallback(
    (index: number) => {
      let padding = 0;
      if (index > -1) {
        const snapPoint = paymentSnapPoints[index];
        if (typeof snapPoint === "string" && snapPoint.endsWith("%")) {
          padding = Dimensions.get("window").height * (parseInt(snapPoint, 10) / 100);
        } else if (typeof snapPoint === "number") {
          padding = snapPoint;
        }
      }
      setMapBottomPadding(padding);
    },
    [paymentSnapPoints],
  );

  useEffect(() => {
    fitMapToRoute(mapBottomPadding);
  }, [mapBottomPadding, fitMapToRoute]);

  useEffect(() => {
    if (dataList.length > 0 && !selectedItem) {
      const firstItem = dataList[0];
      setSelectedItem(firstItem.id);
      setSelectedItemData(firstItem);

      if (taxidoSettingData?.taxido_values?.activation?.bidding == 0) {
        setFareValue(`${firstItem?.min_per_unit_charge * distance}`);
      }
    }
  }, [dataList, distance, selectedItem, taxidoSettingData?.taxido_values?.activation?.bidding]);

  useEffect(() => {
    const toRad = (value: any) => (value * Math.PI) / 180;

    const getDistanceFromLatLonInKm = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    let ____isCurrent = true;

    const fetchDrivers = async () => {
      try {
        _setCurrentNearestDriver([]);

        const snapshot = await getDocs(collection(db, "driverTrack"));

        const filteredDrivers: any = [];

        snapshot.forEach(doc => {
          const data = doc.data();

          if (
            data.is_online === "1" &&
            data.vehicle_type_id === selectedItem &&
            data.lat &&
            data.lng
          ) {
            const driverLat = parseFloat(data.lat);
            const driverLng = parseFloat(data.lng);

            const distanceInKm = getDistanceFromLatLonInKm(
              pickupCoords?.lat,
              pickupCoords?.lng,
              driverLat,
              driverLng,
            );

            if (distanceInKm <= 3) {
              filteredDrivers.push({ id: doc.id, ...data });
            }
          }
        });

        _setCurrentNearestDriver(filteredDrivers);
      } catch (error) { }
    };

    if (pickupCoords?.lat && pickupCoords?.lng) {
      fetchDrivers();
    }

    return () => {
      ____isCurrent = false;
    };
  }, [selectedItem, pickupCoords?.lat, pickupCoords?.lng]);

  const startTimer = useCallback(async () => {
    await AsyncStorage.setItem("ride_timer_start", Date.now().toString());
    setIsTimerRunning(true);
    timerCancelledRef.current = false;
    checkTimer();
    intervalTimeRef.current = setInterval(checkTimer, 1000);
  }, [checkTimer, intervalTimeRef, timerCancelledRef]);

  // Functions are already declared with useCallback above

  useEffect(() => {
    const listener = AppState.addEventListener("change", nextState => {
      if (nextState === "active") {
        checkTimer();
      }
    });

    return () => {
      listener.remove();
      if (intervalTimeRef.current) {
        clearInterval(intervalTimeRef.current);
      }
    };
  }, [checkTimer]);

  const minutes = Math.floor(remainingTime / 60000);
  const seconds = Math.floor((remainingTime % 60000) / 1000);

  const renderItemRequest = ({ item }: any) => (
    <CancelRender item={item} pickupLocation={pickupLocation} />
  );

  const formatScheduleDate = ({ DateValue, TimeValue }: any) => {
    if (!DateValue || !TimeValue) return "";
    const [day, month, year] = DateValue.split(" ");
    const monthMap: Record<string, number> = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };

    const monthIndex = monthMap[month];
    if (!monthIndex) {
      return translateData.bookRideInvalidDate;
    }

    const timeParts = TimeValue.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/);
    if (!timeParts) {
      return translateData.bookRideInvalidTime;
    }

    let [_, hours, minutes, period] = timeParts;
    hours =
      period === "PM" && hours !== "12"
        ? +hours + 12
        : hours === "12" && period === "AM"
          ? "00"
          : hours;
    const formattedDate = `${year}-${String(monthIndex).padStart(
      2,
      "0",
    )}-${String(day).padStart(2, "0")} ${String(hours).padStart(
      2,
      "0",
    )}:${minutes}`;
    return formattedDate;
  };

  const scheduleDates = {
    DateValue: scheduleDate?.DateValue,
    TimeValue: scheduleDate?.TimeValue,
  };

  useEffect(() => {
    if (vehicleTypedata?.length > 0) {
      setSelectedItem(vehicleTypedata[0].id);
    }
  }, [vehicleTypedata]);

  const allLocations = [pickupLocation, ...(stops || []), destination];
  const allLocationCoords = [pickupCoords, ...stopsCoords, destinationCoords];
  const selectedVehicleData = Array.isArray(vehicleTypedata)
    ? vehicleTypedata.find(item => item?.id === selectedItem)
    : null;
  const minimumCharge = selectedVehicleData?.min_per_unit_charge || null;
  const minChargeRide = minimumCharge * distance;

  useEffect(() => {
    if (!Array.isArray(ZoneArea) || ZoneArea.length < 2) {
      setServiceVisible(true);
    }
  }, [ZoneArea]);

  const handlePress = () => {
    const payload = {
      coupon: inputValue,
      service_id: service_ID,
      vehicle_type_id: selectedItemData?.vehicle_type_zone?.vehicle_type_id,
      locations: filteredLocations,
      service_category_id: service_category_ID.toString(),
      weight: parcelWeight,
    };

    dispatch(couponVerifyData(payload)).then((res: any) => {
      if (res.payload?.success !== true) {
        notificationHelper("", res?.payload?.message, "error");
      } else {
        setCouponValue(res?.payload);
        const isCouponValid = coupon && coupon.code === inputValue;
        setIsValid(isCouponValid);
        if (isCouponValid) {
          const totalBill = selectedItemData?.charges?.sub_total;
          Math.round(settingData?.values?.activation?.platform_fees);
          if (totalBill < coupon?.min_spend) {
            setSuccessMessage(
              `${translateData.minimumSpend} ${coupon?.min_spend} ${translateData.requiredCoupons}`,
            );
          } else {
            setSuccessMessage(`${translateData.couponsApply}`);
          }
        } else {
          setSuccessMessage("");
          setCoupon(null);
        }
      }
    });
  };

  const gotoCoupon = () => {
    navigation.navigate("PromoCodeScreen", { from: "payment", getCoupon });
  };

  const removeCoupon = () => {
    setInputValue("");
    setCouponValue("");
  };

  const getCoupon = (val: string) => {
    setCoupon(val);
  };

  useEffect(() => {
    dispatch(
      allDriver({
        zones: zoneValue?.data?.[0]?.id,
        is_online: 1,
        is_on_ride: 0,
      }),
    );
  }, [dispatch, zoneValue?.data]);

  const requestContactsPermission = async () => {
    const isSimulator = Platform.OS === "ios" && !process.env.IS_DEVICE;
    try {
      const permission =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.CONTACTS
          : PERMISSIONS.ANDROID.READ_CONTACTS;

      const goToChooseRider = () =>
        navigation.navigate("ChooseRiderScreen", {
          destination,
          stops,
          pickupLocation,
          service_ID,
          zoneValue,
          scheduleDate,
          service_category_ID,
          selectedImage,
          parcelWeight,
          pickupCoords,
          destinationCoords,
        });

      const status = await check(permission);

      if (status === RESULTS.GRANTED || status === RESULTS.LIMITED) {
        goToChooseRider();
        return;
      }

      if (status === RESULTS.DENIED) {
        const reqResult = await request(permission);
        if (reqResult === RESULTS.GRANTED || reqResult === RESULTS.LIMITED) {
          goToChooseRider();
        } else {
          Alert.alert(
            "Contacts Permission",
            "Permission is required to pick a contact. You can enable it from Settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => openSettings() },
            ],
          );
        }
        return;
      }

      if (status === RESULTS.BLOCKED) {
        Alert.alert(
          "Contacts Permission Blocked",
          "You have permanently denied contacts permission. Please enable it from Settings.",
          [
            { text: "Open Settings", onPress: () => openSettings() },
            { text: "Cancel", style: "cancel" },
          ],
        );
        return;
      }

      if (status === RESULTS.UNAVAILABLE) {
        if (isSimulator) {
          goToChooseRider();
          return;
        }
        Alert.alert(
          "Contacts Unavailable",
          "Contacts permission is not available on this device.",
        );
        return;
      }
    } catch (err) {
      console.warn("requestContactsPermission error:", err);
    }
  };

  useEffect(() => {
    const geocodeAddress = async (address: string) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address,
          )}&key=${Google_Map_Key}`,
        );
        const dataMap = await response.json();
        if (dataMap.results.length > 0) {
          const location = dataMap.results[0].geometry.location;
          return {
            lat: location.lat,
            lng: location.lng,
          };
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
      return null;
    };

    const fetchCoordinates = async () => {
      try {
        const stopsCoordsPromises = stops.map(geocodeAddress);
        const stopsResults = await Promise.all(stopsCoordsPromises);
        setStopsCoords(
          stopsResults.filter(coords => coords !== null) as Array<{
            lat: number;
            lng: number;
          }>,
        );
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [pickupLocation, stops, destination, Google_Map_Key]);

  const radioPress = () => {
    setIsChecked(!isChecked);
  };

  const chooseRider = () => {
    requestContactsPermission();
  };

  const renderItem = useCallback(
    ({ item }: any) => {
      const vehicleId = item.id.toString();
      const vehiclePrefs = selectedPrefs[vehicleId] || [];

      return (
        <BookRideItem
          couponsData={couponValue}
          item={item}
          isDisabled={isExpanding}
          selectedPrefsValue={vehiclePrefs}
          isSelected={(vehicleIdValue ?? selectedItemData?.id) === item.id}
          onPress={() => {
            if (!isExpanding) {
              setSelectedItemData(item);
              if (taxidoSettingData?.taxido_values?.activation?.bidding === 0) {
                const basePrice = Number(item?.charges?.total ?? 0);
                const prefsTotal = Array.isArray(vehiclePrefs)
                  ? vehiclePrefs.reduce(
                    (sum, pref) => sum + Number(pref.price ?? 0),
                    0,
                  )
                  : 0;
                const finalPrice = basePrice + prefsTotal;
                setFareValue(`${finalPrice}`);
                setSelectedFinalPrice(`${finalPrice}`);
              }
            }
          }}
          onPressAlternate={() => {
            if (!isExpanding) {
              setSelectedItemData(item);
              vehicleDetailsSheetRef.current?.present();
            }
          }}
          onPriceCalculated={(id: number, price: number | string) => {
            setFinalPrices(prev => ({ ...prev, [id]: price }));
          }}
        />
      );
    },
    [
      selectedPrefs,
      selectedItemData?.id,
      isExpanding,
      couponValue,
      taxidoSettingData?.taxido_values?.activation?.bidding,
    ],
  );


  const paymentData = (index: number) => {
    setSelectedItem1(index);
    setSeletedPayment(activePaymentMethods[index].name);
    paymentSheetRef.current?.close();
    mainSheetRef.current?.snapToIndex(1);
  };

  const formattedData =
    allLocationCoords && allLocationCoords.length > 0
      ? `[${allLocationCoords
        .map(coord =>
          coord?.lat !== undefined && coord?.lng !== undefined
            ? `{"lat": ${coord.lat}, "lng": ${coord.lng}}`
            : null,
        )
        .filter(Boolean)
        .join(", ")}]`
      : "[]";

  if (formattedData !== "[]") {
    try {
      const _parsedData = JSON.parse(formattedData);
    } catch (error) {
      console.error("Failed to parse formattedData:", error);
    }
  } else {
  }

  const forms = {
    location_coordinates: JSON.parse(formattedData),
    locations: allLocations,
    ride_fare:
      taxidoSettingData?.taxido_values?.activation?.bidding == 1
        ? String(fareValue)
        : String(selectedFinalPrice),
    service_id: service_ID,
    service_category_id: service_category_ID,
    vehicle_type_id: selectedItemData?.id,
    distance: selectedItemData?.charges?.total_distance,
    distance_unit: zoneValue?.distance_type,
    payment_method: seletedPayment || "cash",
    wallet_balance: null,
    coupon: coupon || null,
    description: descriptionText ?? null,
    weight: parcelWeight,
    name: receiverName,
    currency_code: zoneValue?.currency_code,
    country_code: countryCode,
    phone: phoneNumber,
    new_rider:
      otherName?.trim() && otherContect?.trim()
        ? {
          name: otherName,
          phone: otherContect,
        }
        : null,

    schedule_time: formatScheduleDate(scheduleDates),
    ...(selectedImage &&
      selectedImage[0] && {
      selectedImage: {
        uri: selectedImage[0]?.uri || null,
        type: selectedImage[0]?.type || null,
        fileName: selectedImage[0]?.fileName || null,
      },
    }),
  };

  const newRiderName = forms.new_rider?.name?.trim();
  const newRiderPhone = forms.new_rider?.phone?.trim();

  const handleBookRide = async () => {
    startTimer();
    Keyboard.dismiss();
    setBookLoading(true);
    sendToWebView("focusPickup");

    if (!selectedVehicleData) {
      noVehicleSheetRef.current?.present(1);
      setBookLoading(false);
      return;
    }

    const startRideProcess = async () => {
      if (!isExpanding) {
        setIsExpanding(true);
        setIsPulsing(true);
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript("startPulsingAnimation();");
        }
        await BookRideRequest(forms);
        startPulseAnimation();
        setIsPulsing(true);
        focusOnPickup();
        paymentSheetRef.current?.close();
        mainSheetRef.current?.snapToIndex(1);
      }
    };

    if (taxidoSettingData?.taxido_values?.activation?.bidding == 1) {
      const roundedMaxFare = Math.round(maxFare * 100) / 100;
      if (fareValue < minFare) {
        setWarning(true);
        setWarningMessage(`${translateData?.maxtobe}  ${minFare.toFixed(2)}`);
        setBookLoading(false);
        return;
      }
      if (fareValue > roundedMaxFare) {
        setWarning(true);
        setWarningMessage(`${translateData?.maxtobe} ${maxFare.toFixed(2)}`);
        setBookLoading(false);
        return;
      }
      setWarning(false);
      await startRideProcess();
    } else {
      await startRideProcess();
    }
  };

  const BookRideRequest = async (forms: any) => {
    const token = await getValue("token");
    try {
      const formData = new FormData();
      forms.location_coordinates.forEach((coord: any, index: number) => {
        formData.append(`location_coordinates[${index}][lat]`, coord.lat);
        formData.append(`location_coordinates[${index}][lng]`, coord.lng);
      });
      forms.locations.forEach((loc: any, index: number) => {
        formData.append(`locations[${index}]`, loc);
      });
      formData.append("ride_fare", forms.ride_fare);
      formData.append("service_id", forms.service_id);
      formData.append("service_category_id", forms.service_category_id);
      formData.append("vehicle_type_id", forms.vehicle_type_id);
      formData.append("distance", forms.distance);
      formData.append("distance_unit", forms.distance_unit);
      formData.append("payment_method", forms.payment_method);
      formData.append("wallet_balance", forms.wallet_balance || "");
      formData.append("coupon", forms.coupon || "");
      formData.append("description", forms.description);
      formData.append("weight", forms.weight || "");
      formData.append("parcel_receiver[name]", forms.name || "");
      formData.append("parcel_receiver[phone]", forms.phone || "");
      formData.append(
        "parcel_receiver[country_code]",
        forms.country_code || "",
      );
      formData.append("currency_code", forms.currency_code || "");
      Object.values(selectedPrefs).forEach((prefArray: any) => {
        prefArray.forEach((item: any, index: number) => {
          formData.append(`preferences[${index}]`, item?.id);
        });
      });
      if (newRiderName && newRiderPhone) {
        formData.append("new_rider[name]", newRiderName || "");
        formData.append("new_rider[phone]", newRiderPhone || "");
      }
      formData.append("schedule_time", forms.schedule_time || "");
      if (forms.selectedImage) {
        formData.append("cargo_image", {
          uri: forms.selectedImage.uri || {},
          type: forms.selectedImage.type || {},
          name: forms.selectedImage.fileName || {},
        });
      }

      const response = await fetch(`${URL}/api/rideRequest`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();

      // Store ride request ID in local storage

      if (responseData?.id) {
        await setValue("current_ride_request_id", JSON.stringify(responseData.id));

        //  MUST await this
        const saved = await getValue("current_ride_request_id");


        if (!saved) {
          console.warn(" Ride ID NOT saved!");
        } else {
        }
      }

      if (responseData?.id && service_category_ID == 4) {
        navigation.navigate("MyTabs");
        notificationHelper("", translateData.reqBook, "success");
      }

      if (response.status == 403) {
        await clearValue();
        navigation.reset({
          index: 0,
          routes: [{ name: "SignIn" }],
        });
        return;
      }

      if (response?.ok) {
        setRideRequestId(responseData?.id);
        setRideId(responseData?.id);
        setDriverId(responseData?.drivers);
        setRideRequestId(responseData?.id);
      } else if (responseData) {
        notificationHelper("", responseData?.message, "error");
        setBookLoading(false);
      }
    } catch (error) { }
  };

  const prevBidsRef = useRef<any>([]);
  const listenToBids = (
    rideRequestId: string,
    callback: (data: any[]) => void,
  ) => {
    const bidsQuery = query(
      collection(db, "ride_requests", rideRequestId.toString(), "bids"),
      orderBy("created_at", "desc"),
    );

    return onSnapshot(
      bidsQuery,
      snapshot => {
        const bidsValue: any = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const prevBids = JSON.stringify(prevBidsRef.current);
        const currentBids = JSON.stringify(bidsValue);

        if (prevBids !== currentBids) {
          setDriverBidValue(bidsValue);
          prevBidsRef.current = bidsValue;
          if (bidsValue.length > 0) {
            Vibration.vibrate(1000);
          }
        }
        callback(bidsValue);
      },
      error => {
        console.error("❌ Listener error:", error);
      },
    );
  };

  useEffect(() => {
    if (!rideID) return;
    const unsubscribe = listenToBids(rideID, _setBids);
    return () => unsubscribe();
  }, [rideID, countinueRideId]);

  const handleCancelRide = useCallback(async () => {
    await AsyncStorage.removeItem("current_ride_request_id");

    if (webViewRef.current) {
      webViewRef.current.injectJavaScript("drawRouteAndMarkers();");
    }
    setIsPulsing(false);
    stopPulseAnimation();
    setBookLoading(false);
    sendToWebView("fitRoute");

    const payload = {
      status: "cancelled",
    };

    dispatch(updateRideRequest({ payload: payload, ride_id: riderequestId }))
      .then((_res) => {
      })
      .catch((_err) => {
      });

    try {
      if (taxidoSettingData?.taxido_values?.activation?.bidding == 0) {
        if (!riderequestId) {
          setBookLoading(false);
          return;
        }
      } else if (taxidoSettingData?.taxido_values?.activation?.bidding == 1) {
        try {
          if (!rideID || !driverId || !Array.isArray(driverId)) {
            setBookLoading(false);
            return;
          }
        } catch (error) {
          Alert.alert("Error", "Could not cancel ride properly.");
          setBookLoading(false);
        }
      } else {
      }
    } catch (error) {
      console.error("Failed to cancel ride:", error);
    }
    setIsExpanding(false);
    setBookLoading(false);
    paymentSheetRef.current?.close();
    mainSheetRef.current?.snapToIndex(2);
  }, [dispatch, riderequestId, stopPulseAnimation, taxidoSettingData?.taxido_values?.activation?.bidding, rideID, driverId, webViewRef, sendToWebView, paymentSheetRef, mainSheetRef, countinueRideId]);

  const backScreen = () => {
    goBack();
  };

  const gotoHome = () => {
    navigation.navigate("MyTabs");
  };

  const confirmBack = () => {
    goBack();
  };



  const startPulseAnimation = () => {
    setBookLoading(false);
    setIsPulsing(true);
  };

  const stopPulseAnimation = useCallback(async () => {
    cancelTimer();
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsPulsing(false);
  }, [animationRef, cancelTimer]);

  useEffect(() => {
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (!riderequestId || !isPulsing) return;
    const instantRideRef = doc(
      db,
      "ride_requests",
      String(riderequestId),
      "instantRide",
      String(riderequestId),
    );

    const waitForRideDoc = async (
      rideId: string,
      retries = 5,
      delay = 1000,
    ) => {
      for (let i = 0; i < retries; i++) {
        const rideRef = doc(db, "rides", rideId.toString());
        const rideSnap = await getDoc(rideRef);

        if (rideSnap.exists()) {
          return rideSnap.data();
        }

        await new Promise(res => setTimeout(res, delay));
      }
      throw new Error(
        `❌ Ride doc ${rideId} not found after ${retries} retries`,
      );
    };

    const unsubscribe = onSnapshot(
      instantRideRef,
      async snapshot => {
        if (!snapshot.exists()) {
          console.warn("⚠️ instantRide doc missing:", riderequestId);
          return;
        }

        const data = snapshot.data();

        const { status, ride_id } = data || {};
        if (!status || !ride_id) {
          console.warn("⚠️ Invalid snapshot data:", data);
          return;
        }

        if (status === "cancelled") {
          notificationHelper("", translateData.rideCancelled, "error");
          navigation.goBack();
          return;
        }

        if (status === "accepted") {
          try {
            const rideData = await waitForRideDoc(ride_id.toString());

            if (!rideData) {
              console.error("❌ No ride data after retries:", ride_id);
              return;
            }

            dispatch(allRides());

            if (
              rideData?.service_category?.service_category_type === "schedule"
            ) {
              navigation.reset({
                index: 0,
                routes: [{ name: "MyTabs" as never }],
              });
              notificationHelper("", translateData.rideScheduled, "success");
            } else {
              const cleanedData = JSON.parse(JSON.stringify(rideData));
              navigation.navigate("RideActive", {
                activeRideOTP: cleanedData,
                filteredLocations: filteredLocations

              });
            }
          } catch (err) {
            console.error("❌ Error fetching ride:", err);
          }
        } else {
        }
      },
      error => {
        console.error("🔥 Snapshot listener error:", error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [riderequestId, isPulsing, dispatch, navigation, translateData.rideCancelled, translateData.rideScheduled]);

  useEffect(() => {
    const checkForOngoingRide = async () => {
      try {
        // Check if there's a stored ride request ID
        const storedRideId = await AsyncStorage.getItem("current_ride_request_id");
        if (storedRideId) {
          // Check the status of this ride request in Firestore
          const rideRef = doc(db, "ride_requests", storedRideId);
          const rideSnap = await getDoc(rideRef);

          if (rideSnap.exists()) {
            const rideData = rideSnap.data();
            // If the ride is still in requested status, continue the booking process
            if (rideData?.status === "requested") {
              // Set the ride ID and start the timer
              setRideId(storedRideId);
              setRideRequestId(storedRideId);
              setIsExpanding(true);
              setIsTimerRunning(true);
              startTimer();
            } else {
              // If the ride is no longer requested, remove the stored ID
              await AsyncStorage.removeItem("current_ride_request_id");
            }
          } else {
            // If the ride doesn't exist, remove the stored ID
            await AsyncStorage.removeItem("current_ride_request_id");
          }
        }
      } catch (error) {
        console.error("Error checking for ongoing ride:", error);
      }
    };

    checkForOngoingRide();
  }, [startTimer]);

  if (!pickupCoords || !destinationCoords) {
    return null;
  }

  const focusOnPickup = () => {
    if (pickupCoords?.lat && pickupCoords?.lng && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: pickupCoords?.lat,
          longitude: pickupCoords?.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      );
    }
  };

  const renderPaymentItem = ({ item, index }: any) => (
    <PaymentItem
      item={item}
      index={index}
      isDark={isDark}
      viewRTLStyle={viewRTLStyle}
      textColorStyle={textColorStyle}
      textRTLStyle={textRTLStyle}
      selectedItem1={selectedItem1}
      paymentData={paymentData}
      activePaymentMethodsLength={activePaymentMethods.length}
    />
  );


  return (
    <BottomSheetModalProvider>
      <View style={[external.fx_1, { backgroundColor: bgContainer }]}>
        <Modal
          transparent={true}
          visible={serviceVisible}
          animationType="slide"
          onRequestClose={goBack}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FastImage
                source={isDark ? Images.noServiceDark : Images.noService}
                style={styles.serviceImg}
              />
              <Text
                style={[
                  styles.modalText,
                  {
                    color: isDark
                      ? appColors.whiteColor
                      : appColors.primaryText,
                  },
                ]}>
                {translateData.noService}
              </Text>
              <Text
                style={[
                  styles.modalDetail,
                  {
                    color: isDark
                      ? appColors.whiteColor
                      : appColors.primaryText,
                  },
                ]}>
                {translateData.noServiceDes}
              </Text>
              <View
                style={[styles.buttonContainer, { flexDirection: viewRTLStyle }]}>
                <Button title={translateData.goBack} onPress={confirmBack} />
              </View>
            </View>
          </View>
        </Modal>

        {loading ? (
          <View>
            <ActivityIndicator size="large" color={appColors.primary} />
          </View>
        ) : (
          <>
            <View style={[commonStyles.flexContainer]}>
              {isPulsing ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.backBtn,

                    { backgroundColor: bgContainer },
                    {
                      borderColor: isDark
                        ? appColors.darkBorder
                        : appColors.border,
                    },
                  ]}
                  onPress={gotoHome}>
                  <ArrowDown />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.backBtn,

                    { backgroundColor: bgContainer },
                    {
                      borderColor: isDark
                        ? appColors.darkBorder
                        : appColors.border,
                    },
                  ]}
                  onPress={backScreen}>
                  <Back />
                </TouchableOpacity>
              )}
              <View style={styles.ridekm}>
                <View style={styles.ridekmView}>
                  <>
                    <Text style={styles.ridekmText}>
                      {selectedItemData?.charges?.total_distance}
                    </Text>
                    <Text style={styles.ridekmText}>
                      {selectedItemData?.charges?.distance_unit}
                    </Text>
                  </>
                </View>
                <View
                  style={[
                    styles.ridekmMainView,
                    { backgroundColor: bgContainer },
                  ]}>
                  <Text>
                    <Text style={styles.rideMinText}>
                      {" "}
                      {selectedItemData?.charges?.duration}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={{ flex: 0.55 }}>
                <MapScreen
                  mapType={mapType}
                  pickupCoords={pickupCoords}
                  stopsCoords={stopsCoords}
                  destinationCoords={destinationCoords}
                  isDark={isDark}
                  Google_Map_Key={Google_Map_Key}
                  isPulsing={isPulsing}
                />
              </View>
            </View>

            {driverbidValue ? (
              <View
                style={[external.mt_10, external.mh_15, styles.bidContainer]}>
                <FlatList
                  renderItem={renderItemRequest}
                  data={driverbidValue?.length > 0 ? [driverbidValue[0]] : []}
                  removeClippedSubviews={true}
                />
              </View>
            ) : null}
          </>
        )}

        <BottomSheet
          ref={mainSheetRef}
          index={1}
          snapPoints={mainSnapPoints}
          onChange={handleMainSheetChange}
          enablePanDownToClose={false}
          backgroundStyle={{ backgroundColor: bgContainer }}
          handleIndicatorStyle={styles.mainBottomSheet}>
          <View>
            <View
              style={[
                styles.selectedOptionView,
                { flexDirection: viewRTLStyle },
              ]}>
              <Text
                style={[
                  styles.carType,
                  { color: textColorStyle, textAlign: textRTLStyle },
                ]}>
                {isExpanding
                  ? translateData.searchDriver
                  : translateData.vehicletype}
              </Text>
              {isExpanding && (
                <View style={[styles.mainSheet, { flexDirection: viewRTLStyle }]}>
                  {isTimerRunning ? (
                    <View style={styles.timerContainer}>
                      <Text style={styles.timerText}>
                        {minutes}:{seconds.toString().padStart(2, "0")}s
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator />
                    </View>
                  )}
                </View>
              )}
            </View>
            <View style={styles.vehicleContainer}>
              <BottomSheetFlatList
                nestedScrollEnabled={true}
                data={
                  vehicleTypedata && vehicleTypedata.length > 0
                    ? vehicleTypedata
                    : noserviceData
                }
                renderItem={renderItem}
                keyExtractor={(item: any) => item?.id?.toString()}
                extraData={selectedPrefs}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
                windowSize={5}
                maxToRenderPerBatch={5}
                removeClippedSubviews={true}
                contentContainerStyle={{ backgroundColor: "transparent" }}
                style={{ maxHeight: windowHeight(180) }}
              />
            </View>

            {taxidoSettingData?.taxido_values?.activation?.bidding == 1 && (
              <View style={[external.mh_10]}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: isDark
                        ? appColors.whiteColor
                        : appColors.primaryText,
                      textAlign: textRTLStyle,
                    },
                  ]}>
                  {translateData.offerYourFare}
                </Text>
                <View
                  style={[
                    styles.inputcontainer,
                    {
                      backgroundColor: isDark
                        ? appColors.darkBorder
                        : appColors.lightGray,
                      flexDirection: viewRTLStyle,
                    },
                  ]}>
                  <TouchableOpacity
                    style={[styles.plusBtn, isMinusDisabled && { opacity: 0.4 }]}
                    onPress={handleDecrease}
                    disabled={isMinusDisabled}>
                    <Text>-{increaseAmount}</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.textInput, { color: textColorStyle }]}
                    value={String(fareValue)}
                    onChangeText={text => setFareValue(text)}
                    keyboardType="number-pad"
                    placeholder={String(minFare)}
                    placeholderTextColor={appColors.regularText}
                  />
                  <TouchableOpacity
                    style={[styles.plusBtn, isPlusDisabled && { opacity: 0.4 }]}
                    onPress={handleIncrease}
                    disabled={isPlusDisabled}>
                    <Text>+{increaseAmount}</Text>
                  </TouchableOpacity>
                </View>
                {Warning && (
                  <Text style={styles.warningText}>{warningMessage}</Text>
                )}
              </View>
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.cardView,
                { flexDirection: viewRTLStyle },
              ]}
              style={{ maxHeight: windowHeight(80) }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (bookLoading || isTimerRunning) {
                    notificationHelper("", translateData.waitBooking, "error");
                    return;
                  }
                  // paymentSheetRef.current?.close();
                  preferenceSheetRef.current?.present();
                }}
                style={[
                  styles.switchUser,
                  {
                    flexDirection: viewRTLStyle,
                    minWidth: windowWidth(120),
                    marginRight: windowWidth(8),
                    backgroundColor: isDark
                      ? appColors.darkHeader
                      : appColors.lightGray,
                  },
                ]}>
                <View style={styles.userIcon}>
                  <Preference />
                </View>
                <Text style={[styles.selectText, { color: textColorStyle }]}>
                  {translateData?.preference}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (bookLoading || isTimerRunning) {
                    notificationHelper("", translateData.waitBooking, "error");
                    return;
                  }
                  paymentSheetRef.current?.present();
                }}
                style={[
                  styles.switchUser,
                  {
                    flexDirection: viewRTLStyle,
                    minWidth: windowWidth(120),
                    marginRight: windowWidth(8),
                    backgroundColor: isDark
                      ? appColors.darkHeader
                      : appColors.lightGray,
                  },
                ]}>
                <View style={styles.userIcon}>
                  <Card />
                </View>
                <Text style={[styles.selectText, { color: textColorStyle }]}>
                  {seletedPayment
                    ? seletedPayment.length > 6
                      ? `${seletedPayment.substring(0, 6)}...`
                      : seletedPayment
                    : translateData.payment}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (bookLoading || isTimerRunning) {
                    notificationHelper("", translateData.waitBooking, "error");
                    return;
                  }
                  // paymentSheetRef?.current?.close();
                  riderSheetRef?.current?.present();
                }}
                style={[
                  styles.switchUser,
                  {
                    flexDirection: viewRTLStyle,
                    minWidth: windowWidth(120),
                    marginRight: windowWidth(8),
                    backgroundColor: isDark
                      ? appColors.darkHeader
                      : appColors.lightGray,
                  },
                ]}>
                <View style={styles.userIcon}>
                  <User />
                </View>
                <Text style={[styles.selectText, { color: textColorStyle }]}>
                  {otherName
                    ? otherName.length > 5
                      ? `${otherName.substring(0, 5)}...`
                      : otherName
                    : translateData.myself}
                </Text>
              </TouchableOpacity>
              {taxidoSettingData?.taxido_values?.activation?.coupon_enable ==
                1 &&
                taxidoSettingData?.taxido_values?.activation?.bidding == 0 && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      if (bookLoading || isTimerRunning) {
                        notificationHelper(
                          "",
                          translateData.waitBooking,
                          "error",
                        );
                        return;
                      }
                      // paymentSheetRef.current?.close();
                      couponsSheetRef.current?.present();
                    }}
                    style={[
                      styles.switchUser,
                      {
                        flexDirection: viewRTLStyle,
                        minWidth: windowWidth(120),
                        marginRight: windowWidth(8),
                        backgroundColor: isDark
                          ? appColors.darkHeader
                          : appColors.lightGray,
                      },
                    ]}>
                    <View style={styles.userIcon}>
                      <Coupon />
                    </View>
                    <Text style={[styles.selectText, { color: textColorStyle }]}>
                      {translateData.coupons}
                    </Text>
                  </TouchableOpacity>
                )}
            </ScrollView>

            <View style={[external.mh_10, external.mv_13]}>
              {!isExpanding ? (
                <Button
                  title={`Book ${selectedItemData?.name}`}
                  onPress={handleBookRide}
                  loading={bookLoading}
                  disabled={bookLoading}
                />
              ) : (
                <Button
                  title={translateData.cancelRide}
                  onPress={handleCancelRide}
                  loading={bookLoading}
                  disabled={bookLoading}
                  backgroundColor={
                    isDark ? appColors.darkHeader : appColors.primaryGray
                  }
                  textColor={appColors.regularText}
                />
              )}
            </View>
          </View>
        </BottomSheet>

        <BottomSheetModal
          ref={vehicleDetailsSheetRef}
          snapPoints={vehicleDetailSnapPoints}
          backgroundStyle={{ backgroundColor: isDark ? bgContainer : appColors.lightGray }}
          handleIndicatorStyle={{
            backgroundColor: isDark
              ? appColors.whiteColor
              : appColors.primaryText,
            width: windowWidth(40),
          }}
          backdropComponent={renderBackdrop}>
          <BottomSheetView style={external.fx_1}>
            <ModalContainers
              distance={distance}
              selectedItemData={selectedItemData}
              onPress={() => vehicleDetailsSheetRef.current?.close()}
              minChargeRide={minChargeRide}
              couponsData={couponValue}
            />
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={noVehicleSheetRef}
          snapPoints={noVehicleSnapPoints}
          backgroundStyle={{ backgroundColor: bgContainer }}
          handleIndicatorStyle={{
            backgroundColor: isDark
              ? appColors.whiteColor
              : appColors.primaryText,
            width: windowWidth(40),
          }}
          backdropComponent={renderBackdrop}>
          <View
            style={{
              flex: 1,
              padding: 20,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text style={[styles.modalText, { color: textColorStyle }]}>
              {translateData.selectVehicleType}
            </Text>
            <View
              style={[
                styles.buttonContainer,
                { justifyContent: "center", marginTop: windowHeight(18) },
              ]}>
              <Button
                title={translateData.modelCloseBtn}
                onPress={() => noVehicleSheetRef.current?.close()}
              />
            </View>
          </View>
        </BottomSheetModal>

        <BottomSheetModal
          ref={paymentSheetRef}
          index={0}
          snapPoints={paymentSnapPoints}
          onChange={handlePaymentSheetChange}
          enablePanDownToClose={false}
          backgroundStyle={{ backgroundColor: bgContainer }}
          handleIndicatorStyle={{
            backgroundColor: isDark
              ? appColors.whiteColor
              : appColors.primaryText,
            width: windowWidth(40),
          }}
          backdropComponent={renderBackdrop}>
          <View style={external.fx_1}>
            <View style={styles.selectPaymentView}>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginHorizontal: windowWidth(15),
                }}
                onPress={() => {
                  paymentSheetRef.current?.close();
                }}>
                <CloseCircle />
              </TouchableOpacity>
              <Text
                style={[
                  styles.payment,
                  { color: textColorStyle, textAlign: textRTLStyle },
                ]}>
                {translateData.paymentMethodSelect}
              </Text>
            </View>
            <BottomSheetFlatList
              data={activePaymentMethods}
              renderItem={renderPaymentItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </BottomSheetModal>

        <BottomSheetModal
          ref={riderSheetRef}
          snapPoints={riderSnapPoints}
          backgroundStyle={{ backgroundColor: bgContainer }}
          handleIndicatorStyle={{
            backgroundColor: isDark
              ? appColors.whiteColor
              : appColors.primaryText,
            width: windowWidth(40),
          }}
          backdropComponent={renderBackdrop}>
          <BottomSheetView style={[styles.switchContainer]}>
            <View>
              <View
                style={[styles.switchRiderView, { flexDirection: viewRTLStyle }]}>
                <Text
                  style={[
                    commonStyles.mediumText23,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}>
                  {translateData.talkingRide}
                </Text>
                <TouchableOpacity
                  onPress={() => riderSheetRef.current?.close()}
                  activeOpacity={0.7}
                  style={{ bottom: windowHeight(1.7) }}>
                  <Close />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  commonStyles.regularText,
                  external.mt_3,
                  {
                    fontSize: fontSizes.FONT16,
                    lineHeight: windowHeight(14),
                    textAlign: textRTLStyle,
                  },
                ]}>
                {translateData.notice}
              </Text>
            </View>
            <View style={[external.mt_20]}>
              <View
                style={[
                  external.fd_row,
                  external.ai_center,
                  external.js_space,
                  { flexDirection: viewRTLStyle },
                ]}>
                <View
                  style={[
                    { flexDirection: viewRTLStyle, right: windowWidth(3) },
                  ]}>
                  <UserFill />
                  <Text
                    style={[
                      commonStyles.mediumTextBlack12,
                      {
                        fontSize: fontSizes.FONT19,
                        marginHorizontal: windowWidth(8),
                      },
                      {
                        color: isDark
                          ? appColors.whiteColor
                          : appColors.primaryText,
                      },
                    ]}>
                    {translateData.myself}
                  </Text>
                </View>
                <Pressable style={styles.pressable}>
                  <RadioButton
                    onPress={radioPress}
                    checked={isChecked}
                    color={appColors.primary}
                  />
                </Pressable>
              </View>
              <SolidLine marginVertical={14} />
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  external.fd_row,
                  external.js_space,
                  { flexDirection: viewRTLStyle, marginTop: windowHeight(1) },
                ]}
                onPress={chooseRider}>
                <View style={[external.fd_row, external.ai_center]}>
                  <NewContact />
                  <Text
                    style={[
                      styles.chooseAnotherAccount,
                      { marginLeft: windowWidth(10) },
                    ]}>
                    {translateData.contact}
                  </Text>
                </View>
                <Forword />
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
        <BottomSheetModal
          ref={preferenceSheetRef}
          snapPoints={preferanceSnapPoints}
          backgroundStyle={{ backgroundColor: bgContainer }}
          handleIndicatorStyle={{
            backgroundColor: isDark
              ? appColors.whiteColor
              : appColors.primaryText,
            width: windowWidth(40),
          }}
          backdropComponent={renderBackdrop}>
          <BottomSheetView style={[styles.switchContainer]}>
            <View>
              <View
                style={[styles.switchRiderView, { flexDirection: viewRTLStyle }]}>
                <Text
                  style={[
                    commonStyles.mediumText23,
                    { color: textColorStyle, textAlign: textRTLStyle },
                  ]}>
                  {translateData.selectPreference}
                </Text>
                <TouchableOpacity
                  onPress={() => preferenceSheetRef.current?.close()}
                  activeOpacity={0.7}
                  style={{ bottom: windowHeight(1.7) }}>
                  <Close />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: windowHeight(10) }}>
                <FlatList
                  data={preferences}
                  keyExtractor={item => item?.id.toString()}
                  ListEmptyComponent={
                    <View
                      style={{ padding: windowHeight(10), alignItems: "center" }}>
                      <Text
                        style={{
                          fontFamily: appFonts.medium,
                          color: appColors.primaryText,
                        }}>
                        {translateData.noPreference}
                      </Text>
                    </View>
                  }
                  renderItem={({ item }) => {
                    const vehicleId = selectedItemData?.id?.toString();
                    const vehiclePrefs = vehicleId
                      ? selectedPrefs[vehicleId] || []
                      : [];
                    const isChecked = vehiclePrefs.some(p => p.id === item.id);

                    return (
                      <TouchableOpacity
                        style={styles.itemContainer}
                        onPress={() => togglePreference(item)}
                        activeOpacity={0.7}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginVertical: windowHeight(5),
                          }}>
                          <View
                            style={[
                              styles.round,
                              {
                                backgroundColor: isDark
                                  ? appColors.darkHeader
                                  : appColors.lightGray,
                              },
                            ]}>
                            <Image
                              source={{ uri: item?.icon_image_url }}
                              style={{
                                height: windowHeight(40),
                                width: windowWidth(40),
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                          <View style={{ marginHorizontal: windowWidth(12) }}>
                            <Text style={[styles.prefName, { color: textColorStyle }]}>{item?.name}</Text>
                            <Text style={styles.prefPrice}>{zoneValue?.currency_symbol}{item?.price}</Text>
                          </View>
                        </View>
                        <Checkbox
                          isChecked={isChecked}
                          onPress={() => togglePreference(item)}
                          label=""
                          style={
                            isChecked
                              ? styles.check
                              : isDark
                                ? styles.radioBox1
                                : styles.radioBox
                          }
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
        <CouponsBottomSheet
          ref={couponsSheetRef}
          couponsSnapPoints={couponsSnapPoints}
          bgContainer={bgContainer}
          isDark={isDark}
          textColorStyle={textColorStyle}
          textRTLStyle={textRTLStyle}
          viewRTLStyle={viewRTLStyle}
          translateData={translateData}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handlePress={handlePress}
          isValid={isValid}
          couponValue={couponValue}
          successMessage={successMessage}
          removeCoupon={removeCoupon}
          gotoCoupon={gotoCoupon}
        />
      </View >
    </BottomSheetModalProvider >
  );
}
