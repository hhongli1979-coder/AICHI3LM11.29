import {
  Image,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  FlatList,
  Pressable,
  ScrollView,
  Keyboard,
  TextInput,
  ActivityIndicator,
  AppState,
} from "react-native";
import React, {useState, useEffect, useRef, useMemo, useCallback} from "react";
import {external} from "../../../../../../styles/externalStyle";
import {styles} from "./styles";
import {
  Button,
  SolidLine,
  RadioButton,
  notificationHelper,
} from "@src/commonComponent";
import {KmDetails} from "../packageContainer/index";
import {commonStyles} from "../../../../../../styles/commonStyle";
import {appColors, windowWidth} from "@src/themes";
import * as turf from "@turf/turf";
import {
  UserFill,
  Close,
  Back,
  User,
  Card,
  NewContact,
  Forword,
  CloseCircle,
} from "@utils/icons";
import {ModalContainer} from "../../../../../../components/modalContainer/index";
import {feesPolicies, modelData} from "../../../../../../data/modelData/index";
import Images from "@utils/images";
import {useValues} from "@src/utils/context/index";
import {BookRideItem} from "../../../../../bookRide/bookRideItem/index";
import {fontSizes, windowHeight} from "@src/themes";
import {ModalContainers} from "../../../../../bookRide/modalContainer/index";
import {useDispatch, useSelector} from "react-redux";
import {vehicleTypeDataGet} from "../../../../../../api/store/actions/vehicleTypeAction";
import MapScreen from "../../../../../bookRide/map/index";
import {
  allDriver,
  couponVerifyData,
  updateRideRequest,
} from "@src/api/store/actions";
import {CancelRender} from "@src/screens/cancelFare/cancelRenderItem/index";
import {bidDataGet} from "@src/api/store/actions/bidAction";
import {clearValue, getValue} from "@src/utils/localstorage";
import {useAppNavigation, useAppRoute} from "@src/utils/navigation";
import {URL} from "@src/api/config";
import {useNavigation} from "@react-navigation/native";
import useSmartLocation from "@src/components/helper/locationHelper";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../../../../../../../firebase";
import {
  getFirestore,
  doc,
  getDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {RootState} from "@src/api/store";
import darkMapStyle from "@src/screens/darkMapStyle";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function DetailContainer() {
  const navigation = useNavigation();
  const route = useAppRoute();
  const {
    textColorStyle,
    bgContainer,
    textRTLStyle,
    viewRTLStyle,
    isDark,
    Google_Map_Key,
  } = useValues();
  const routeParams = route.params || {};
  const {
    pickupLocation,
    service_ID,
    zoneValue: routeZoneValue,
    service_category_ID,
  } = routeParams;
  const {zoneValue: reduxZoneValue} = useSelector((state: any) => state.zone);
  const zoneValue = routeZoneValue || reduxZoneValue;
  const dispatch = useDispatch();
  const {navigate, goBack} = useAppNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const {driverData} = useSelector((state: RootState) => state.allDriver);
  const {vehicleTypedata} = useSelector(
    (state: RootState) => state?.vehicleType || {},
  );
  const selectedVehicleData = Array.isArray(vehicleTypedata)
    ? vehicleTypedata.find((item: any) => item?.id === selectedItem)
    : null;
  const [pickupCoords, setPickupCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const ZoneArea = zoneValue?.locations;
  const [subZone, setSubZone] = useState([]);
  const [RideBooked, setRideBooked] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [rideID, setRideId] = useState(null);
  const [selectedPackageDetails, setSelectedPackageDetails] = useState({
    hour: null,
    distance: null,
    id: null,
    distanceType: null,
    currency_symbol: null,
  });
  const [packageVehicle, setPackageVehicle] = useState<any[] | undefined>(
    undefined,
  );
  const [selectedItemData, setSelectedItemData] = useState<any>(null);
  const [radiusPerVertex, setRadiusPerVertex] = useState(null);
  const [incrementDistance, setIncrementDistance] = useState(0.5);
  const intervalRef = useRef(null);
  const [startDriverRequest, setStartDriverRequest] = useState(false);
  const allLocations = [pickupLocation];
  const allLocationCoords = [pickupCoords];
  const {bidValue} = useSelector((state: RootState) => state.bid);
  const [activeRideRequest, setActivateRideRequest] = useState(false);
  const {translateData, taxidoSettingData, settingData} = useSelector(
    (state: RootState) => state.setting,
  );
  const [mapType, setMapType] = useState(
    taxidoSettingData?.taxido_values?.location?.map_provider,
  );
  const filteredVehicle = packageVehicle?.find(
    (vehicle: any) => vehicle?.id === selectedItem,
  );
  const packageTotalMinutes = (selectedPackageDetails?.hour ?? 0) * 60;
  const packageTotalDistance =
    selectedPackageDetails.distanceType == "mile"
      ? (selectedPackageDetails.distance ?? 0) * 1.60934
      : selectedPackageDetails.distance ?? 0;
  const minPerMinCharge = Number(filteredVehicle?.min_per_min_charge) || 0;
  const minPerUnitCharge = Number(filteredVehicle?.min_per_unit_charge) || 0;
  const maxPerMinCharge = Number(filteredVehicle?.max_per_min_charge) || 0;
  const maxPerUnitCharge = Number(filteredVehicle?.max_per_unit_charge) || 0;
  const totalMinutes = Number(packageTotalMinutes) || 0;
  const totalDistance = Number(packageTotalDistance) || 0;
  const minPackageCharge =
    minPerMinCharge * totalMinutes + minPerUnitCharge * totalDistance;
  const maxPackageCharge =
    maxPerMinCharge * totalMinutes + maxPerUnitCharge * totalDistance;
  const recommendedPackageCharge = minPackageCharge;
  const [riderequestId, setRideRequestId] = useState();
  const [bookLoading, setBookLoading] = useState(false);
  const [driverId, setDriverId] = useState([]);
  const {self} = useSelector((state: any) => state.account);
  const pulseCount = 6;
  const pulseDelay = 20;
  const durations = 120;
  const [pulses, setPulses] = useState(
    Array(pulseCount).fill({radius: 1000, opacity: 0}),
  );
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  const mapRef = useRef(null);
  const {currentLatitude, currentLongitude} = useSmartLocation();
  const [seletedPayment, setSeletedPayment] = useState(null);
  const [coupon, setCoupon] = useState<any>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [couponValue, setCouponValue] = useState<any>();
  const [finalPrices, setFinalPrices] = useState<{[key: string]: string}>({});
  const [selectedFinalPrice, setSelectedFinalPrice] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [fareValue, setFareValue] = useState<number>(0);
  const TIMER_DURATION =
    taxidoSettingData?.taxido_values?.ride?.find_driver_time_limit *
      60 *
      1000 || 180000; // 3 minutes default
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const intervalTimeRef = useRef<NodeJS.Timeout | null>(null);
  const timerCancelledRef = useRef(false);

  const mainBottomSheetRef = useRef<BottomSheet>(null);
  const vehicleDetailsBottomSheetRef = useRef<BottomSheet>(null);
  const rentalInfoBottomSheetRef = useRef<BottomSheet>(null);
  const paymentBottomSheetRef = useRef<BottomSheet>(null);
  const riderBottomSheetRef = useRef<BottomSheet>(null);
  const couponBottomSheetRef = useRef<BottomSheet>(null);

  const mainSnapPoints = useMemo(() => ["48.5%"], []);
  const vehicleDetailsSnapPoints = useMemo(() => ["80%"], []);
  const rentalInfoSnapPoints = useMemo(() => ["80%"], []);
  const paymentSnapPoints = useMemo(() => ["50%"], []);
  const riderSnapPoints = useMemo(() => ["34%"], []);
  const couponSnapPoint = useMemo(() => ["20%"], []);

  const handleSubSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      mainBottomSheetRef.current?.snapToIndex(0);
    }
  }, []);

  useEffect(() => {
    if (selectedItemData?.charges?.total) {
      setFareValue(selectedItemData.charges.total);
    }
  }, [selectedItemData]);
  const handleOpenVehicleDetails = useCallback((item: any) => {
    setFareValue(item.charges.total);
    setSelectedItemData(item);
    mainBottomSheetRef.current?.close();
    vehicleDetailsBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleOpenPaymentSheet = useCallback(() => {
    mainBottomSheetRef.current?.close();
    paymentBottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleOpenRiderSheet = useCallback(() => {
    mainBottomSheetRef.current?.close();
    riderBottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handlecloseCouponSheet = useCallback(() => {
    couponBottomSheetRef.current?.close();
  }, []);

  const handleClosePaymentSheet = useCallback(() => {
    paymentBottomSheetRef.current?.close();
  }, []);

  const handleCloseRiderSheet = useCallback(() => {
    riderBottomSheetRef.current?.close();
  }, []);

  const chooseRider = () => {
    navigate("ChooseRider");
  };

  const handleChooseRiderAndClose = () => {
    handleCloseRiderSheet();
    chooseRider();
  };

  const radioPress = () => {
    setIsChecked(!isChecked);
  };

  const [selectedItem1, setSelectedItem1] = useState<number | null>(null);
  const paymentData = (index: number) => {
    setSelectedItem1(index);
    setSeletedPayment(activePaymentMethods[index].name);
  };

  useEffect(() => {
    if (packageVehicle && packageVehicle?.length > 0) {
      setSelectedItem(packageVehicle[0].id);
    }
  }, [packageVehicle]);

  const renderItemRequest = ({item}: {item: any}) => (
    <CancelRender item={item} pickupLocation={pickupLocation} />
  );

  useEffect(() => {
    const showRequest = () => {
      if (
        bidValue &&
        Array.isArray((bidValue as any)?.data) &&
        (bidValue as any).data.length > 0 &&
        activeRideRequest
      ) {
        setRideBooked(true);
      }
    };
    showRequest();
  }, [bidValue]);

  const handlePackageSelection = (details: any) => {
    setSelectedPackageDetails(details);
  };

  const handlepackagevehicle = (vehicleDetails: any) => {
    setPackageVehicle(vehicleDetails);
  };

  useEffect(() => {
    getVehicleTypes();
  }, []);

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
        const pickup = await geocodeAddress(pickupLocation);
        setPickupCoords(pickup);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };
    fetchCoordinates();
  }, [pickupLocation]);

  const driverLocations = driverData?.data
    ?.map((driver: any) => {
      const driverLocation = driver.location?.[0];
      if (driverLocation) {
        return {
          lat: parseFloat(driverLocation.lat),
          lng: parseFloat(driverLocation.lng),
          id: driver.id,
          name: driver.name,
          vehicleId: driver?.vehicle_info?.vehicle_type_id,
        };
      }
      return null;
    })
    ?.filter((driver: any) => driver !== null);

  const filteredDrivers = selectedVehicleData
    ? driverLocations?.filter(
        (driver: any) => driver?.vehicleId === selectedVehicleData?.id,
      )
    : [];

  const getVehicleTypes = () => {
    const payload = {
      locations: [
        {
          lat: currentLatitude,
          lng: currentLongitude,
        },
      ],
      service_id: service_ID,
      service_category_id: service_category_ID,
    };
    dispatch(vehicleTypeDataGet(payload)).then((res: any) => {});
  };

  useEffect(() => {
    const backAction = () => {
      goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, [goBack]);

  const mapCustomStyle = isDark ? darkMapStyle : undefined;

  const handleBookRide = () => {
    if (!selectedItemData) {
      notificationHelper("", translateData.pleaseVehicle, "error");
      return;
    }

    startTimer(); // Start the 3-minute timer
    Keyboard.dismiss();
    setBookLoading(true);
    if (
      Math.round(recommendedPackageCharge) <
      Math.round(minPackageCharge * zoneValue?.exchange_rate)
    ) {
      setBookLoading(false);
      return;
    } else if (
      Math.round(recommendedPackageCharge) >
      Math.round(maxPackageCharge * zoneValue?.exchange_rate)
    ) {
      setBookLoading(false);
      return;
    } else {
      setIsExpanding(!isExpanding);
      if (!isExpanding) {
        BookRideRequest(forms);
        startPulseAnimation();
        setIsPulsing(!isPulsing);
        focusOnPickup();
      }
    }
  };

  const handleCancelRide = async () => {
    await cancelTimer(); // Properly cancel the timer
    setBookLoading(true);
    stopPulseAnimation();

    // Just call the API like in bookRide screen, let backend handle Firebase
    const payload = {
      status: "cancelled",
    };

    dispatch(updateRideRequest({payload: payload, ride_id: riderequestId}));

    setIsExpanding(false);
    setBookLoading(false);
  };

  useEffect(() => {
    if (ZoneArea && ZoneArea?.length > 1) {
      setRadiusPerVertex(new Array(ZoneArea?.length - 1).fill(0.5));
    }
  }, [ZoneArea]);

  useEffect(() => {
    if (isExpanding) {
      intervalRef.current = setInterval(() => {
        setRadiusPerVertex(prevRadii =>
          prevRadii?.map((radius, index) => {
            const currentSubZoneVertex = subZone[index] || pickupCoords;
            const distanceToMainZone = turf.distance(
              turf.point([
                currentSubZoneVertex?.lng,
                currentSubZoneVertex?.lat,
              ]),
              turf.point([ZoneArea[index]?.lng, ZoneArea[index]?.lat]),
              {units: "kilometers"},
            );
            return distanceToMainZone <= incrementDistance
              ? radius
              : radius + incrementDistance;
          }),
        );
        expandSubZone();
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isExpanding, subZone, incrementDistance, pickupCoords]);

  const expandSubZone = () => {
    if (!Array.isArray(ZoneArea) || !pickupCoords?.lat || !pickupCoords?.lng)
      return;
    const expandedPoints = [];
    const newRadiusPerVertex = [];
    for (let i = 0; i < ZoneArea.length - 1; i++) {
      const mainZonePoint = ZoneArea[i];
      if (!mainZonePoint?.lat || !mainZonePoint?.lng) continue;
      const angle = turf.bearing(
        turf.point([pickupCoords.lng, pickupCoords.lat]),
        turf.point([mainZonePoint.lng, mainZonePoint.lat]),
      );
      const currentSubZoneVertex = subZone[i] || {
        lat: pickupCoords.lat,
        lng: pickupCoords.lng,
      };
      const distanceToMainZone = turf.distance(
        turf.point([currentSubZoneVertex.lng, currentSubZoneVertex.lat]),
        turf.point([mainZonePoint.lng, mainZonePoint.lat]),
        {units: "kilometers"},
      );
      const newRadius = radiusPerVertex[i] ?? 0;
      if (distanceToMainZone <= incrementDistance) {
        expandedPoints.push({lat: mainZonePoint.lat, lng: mainZonePoint.lng});
        newRadiusPerVertex.push(distanceToMainZone);
      } else {
        const expandedPoint = turf.destination(
          turf.point([pickupCoords.lng, pickupCoords.lat]),
          newRadius + incrementDistance,
          angle,
          {units: "kilometers"},
        );
        const [lng, lat] = expandedPoint.geometry.coordinates;
        if (!isNaN(lat) && !isNaN(lng)) {
          expandedPoints.push({lat, lng});
          newRadiusPerVertex.push(newRadius + incrementDistance);
        }
      }
    }
    if (expandedPoints.length === 0) return;
    expandedPoints.push(expandedPoints[0]);
    setSubZone(expandedPoints);
    const validPoints = expandedPoints.filter(
      p => typeof p?.lat === "number" && typeof p?.lng === "number",
    );
    if (validPoints.length < 3) return;
    const polygon = turf.polygon([validPoints.map(({lng, lat}) => [lng, lat])]);
    const messages = filteredDrivers
      ?.map(driver => {
        if (!driver?.lat || !driver?.lng) return null;
        const point = turf.point([driver.lng, driver.lat]);
        return turf.booleanPointInPolygon(point, polygon) ? driver.id : null;
      })
      .filter(Boolean);
  };

  useEffect(() => {
    dispatch(
      allDriver({
        zones: zoneValue?.data?.[0]?.id,
        is_online: 1,
        is_on_ride: 0,
      }),
    );
  }, []);

  const formattedData =
    allLocationCoords && allLocationCoords.length > 0
      ? `[${allLocationCoords
          ?.map(coord =>
            coord?.lat !== undefined && coord?.lng !== undefined
              ? `{"lat": ${coord.lat}, "lng": ${coord.lng}}`
              : null,
          )
          .filter(Boolean)
          .join(", ")}]`
      : "[]";

  const forms = {
    location_coordinates:
      formattedData !== "[]" ? JSON.parse(formattedData) : [],
    locations: allLocations,
    ride_fare: fareValue,
    service_id: service_ID,
    service_category_id: service_category_ID,
    vehicle_type_id: filteredVehicle?.id,
    distance: selectedPackageDetails?.distance,
    distance_unit: "km",
    payment_method: "cash",
    currency_code: zoneValue?.currency_code,
    wallet_balance: null,
    coupon: inputValue,
    description: null,
    selectedImage: {uri: null, type: null, fileName: null},
    hourly_package_id: selectedPackageDetails?.id,
  };

  const BookRideRequest = async forme => {
    const token = await getValue("token");
    try {
      const formData = new FormData();
      forme.location_coordinates.forEach((coord, index) => {
        formData.append(`location_coordinates[${index}][lat]`, coord.lat);
        formData.append(`location_coordinates[${index}][lng]`, coord.lng);
      });
      forme.locations.forEach((loc, index) => {
        formData.append(`locations[${index}]`, loc);
      });
      formData.append("ride_fare", forme.ride_fare);
      formData.append("service_id", forme.service_id);
      formData.append("service_category_id", forme.service_category_id);
      formData.append("vehicle_type_id", forme.vehicle_type_id);
      formData.append("distance", forme.distance);
      formData.append("distance_unit", forme.distance_unit);
      formData.append("payment_method", forme.payment_method);
      formData.append("wallet_balance", forme.wallet_balance || "");
      formData.append("currency_code", forme.currency_code || "");
      formData.append("coupon", forme.coupon || "");
      formData.append("description", forme.description);
      formData.append("hourly_package_id", forme.hourly_package_id);

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

      if (response.status == 403) {
        notificationHelper("", translateData.loginAgain, "error");
        await clearValue("token");
        navigation.reset({index: 0, routes: [{name: "SignIn"}]});
        return;
      }

      if (response.ok) {
        setStartDriverRequest(true);
        setRideId(responseData?.id);
        setDriverId(responseData?.drivers);

        if (taxidoSettingData?.taxido_values?.activation?.bidding == 1) {
          try {
          } catch (error) {
            setBookLoading(false);
            console.error("Failed to store driver ride request:", error);
          }
        }

        try {
          const rideData = {
            coupon: forms.coupon,
            created_at: Timestamp.now(),
            currency_symbol: zoneValue?.currency_code,
            description: forms.description,
            distance: forms.distance,
            distance_unit: forms.distance_unit,
            hourly_package_id: "",
            id: responseData?.id,
            locations: forms.locations,
            location_coordinates: forms.location_coordinates.map(coord => ({
              lat: coord.lat,
              lng: coord.lng,
            })),
            payment_method: forms.payment_method,
            ride_fare: forms.ride_fare,
            rider_id: self?.id,
            service_category_id: forms.service_category_id,
            service_id: forms.service_id,
            vehicle_type_id: forms.vehicle_type_id,
            wallet_balance: forms.wallet_balance,
            rider: responseData?.data?.rider,
            service: responseData?.data?.service,
            service_category: responseData?.data?.service_category,
            vehicle_type: responseData?.data?.vehicle_type,
            hourly_packages: responseData?.data?.hourly_packages,
          };

          if (taxidoSettingData?.taxido_values?.activation?.bidding == 1) {
            setRideRequestId(responseData?.id);
            setStartDriverRequest(true);
          } else if (
            taxidoSettingData?.taxido_values?.activation?.bidding == 0
          ) {
            const rideId = responseData?.id?.toString();
            const allDrivers = responseData?.drivers || [];
            if (!rideId || allDrivers.length === 0) {
              return;
            }
            let currentDriverId = null;
            let eligibleDrivers = [];
            let queueDrivers = [];
            for (const driverId of allDrivers) {
              try {
                const rideRequests = Array.isArray(driverData?.ride_requests)
                  ? driverData.ride_requests
                  : [];
                if (rideRequests.length === 0) {
                  if (!currentDriverId) {
                    currentDriverId = driverId;
                  } else {
                    eligibleDrivers.push(driverId);
                  }
                } else {
                  queueDrivers.push(driverId);
                }
              } catch (err) {
                console.error(`⚠️ Error checking driver ${driverId}`, err);
                setBookLoading(false);
                queueDrivers.push(driverId);
              }
            }
            if (!currentDriverId) {
              queueDrivers = [...allDrivers];
              eligibleDrivers = [];
            }
            setRideRequestId(rideId);
            setStartDriverRequest(true);
          }
        } catch (error) {
          notificationHelper("", "error || error", "error");
          setBookLoading(false);
        }
      } else {
        notificationHelper("", responseData.message, "error");
      }
    } catch (error) {
      console.error("Error in BookRideRequest:", error);
    }
  };

  useEffect(() => {
    if (!riderequestId) return;

    const instantRideRef = doc(
      db,
      "ride_requests",
      String(riderequestId),
      "instantRide",
      String(riderequestId),
    );

    const unsubscribe = onSnapshot(
      instantRideRef,
      async snapshot => {
        if (!snapshot.exists()) {
          console.warn("⚠️ instantRide doc missing:", riderequestId);
          return;
        }

        const data = snapshot.data();

        const {status, ride_id} = data || {};
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
            const rideRef = doc(db, "rides", ride_id.toString());
            const rideSnap = await getDoc(rideRef);

            if (rideSnap.exists()) {
              const rideData = rideSnap.data();
              navigate("RideActive", {activeRideOTP: rideData});
            }
          } catch (err) {
            console.error("❌ Error fetching ride:", err);
          }
        }
      },
      error => {
        console.error("🔥 Snapshot listener error:", error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [riderequestId]);

  useEffect(() => {
    if (startDriverRequest && rideID && isExpanding) {
      const ride_request_id = rideID;
      const fetchBidData = async () => {
        await dispatch(bidDataGet({ride_request_id}));
        setActivateRideRequest(true);
      };
      fetchBidData();
      const intervalId = setInterval(fetchBidData, 5000);
      return () => clearInterval(intervalId);
    }
  }, [startDriverRequest, rideID, isExpanding, dispatch]);

  const startPulseAnimation = () => {
    setBookLoading(false);
    if (animationRef.current) return;
    let tick = 0;
    animationRef.current = setInterval(() => {
      setPulses(() =>
        Array(pulseCount)
          .fill(null)
          .map((_, index) => {
            const offset = index * pulseDelay;
            const progress = (tick - offset + durations) % durations;
            if (progress < durations / 2) {
              const radius = 1000 + (progress / (durations / 2)) * 1000;
              const opacity = 0.5 * (1 - progress / (durations / 2));
              return {radius, opacity};
            } else {
              return {radius: 1000, opacity: 0};
            }
          }),
      );
      tick++;
    }, 50);
    setIsPulsing(true);
  };

  const stopPulseAnimation = async () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsPulsing(false);
    setPulses(Array(pulseCount).fill({radius: 1000, opacity: 0}));
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  const hasValidPackageDetails =
    selectedPackageDetails &&
    Object.values(selectedPackageDetails).some(value => value !== null);
  const activePaymentMethods = zoneValue?.payment_method;

  const renderItem = ({item}) => (
    <BookRideItem
      couponsData={couponValue}
      item={item}
      isDisabled={isExpanding}
      isSelected={selectedItemData?.id === item.id}
      onPress={() => {
        if (!isExpanding) {
          setSelectedItemData(item);

          if (taxidoSettingData?.taxido_values?.activation?.bidding === 0) {
            const price = finalPrices[item.id] ?? item?.charges?.total;
            setFareValue(`${price}`);
            setSelectedFinalPrice(`${price}`);
          }
        }
      }}
      onPressAlternate={() => {
        if (!isExpanding) {
          setSelectedItemData(item);
          handleOpenVehicleDetails(item);
        }
      }}
      onPriceCalculated={(id, price) => {
        setFinalPrices(prev => ({...prev, [id]: price}));
      }}
    />
  );

  const renderItem1 = ({item, index}) => (
    <TouchableOpacity onPress={() => paymentData(index)} activeOpacity={0.7}>
      <View
        style={[
          styles.modalPaymentView,
          {backgroundColor: bgContainer, flexDirection: viewRTLStyle},
        ]}>
        <View style={{flexDirection: viewRTLStyle, flex: 1}}>
          <View
            style={[
              styles.imageBg,
              {borderColor: isDark ? appColors.darkBorder : appColors.border},
            ]}>
            <Image source={{uri: item.image}} style={styles.paymentImage} />
          </View>
          <View style={styles.mailInfo}>
            <Text
              style={[
                styles.mail,
                {
                  color: isDark ? appColors.darkText : appColors.blackColor,
                  textAlign: textRTLStyle,
                },
              ]}>
              {item.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.payBtn} activeOpacity={0.7}>
          <RadioButton
            checked={index === selectedItem1}
            color={appColors.primary}
          />
        </TouchableOpacity>
      </View>
      {index !== activePaymentMethods.length - 1 ? (
        <View
          style={[
            styles.borderPayment,
            {borderColor: isDark ? appColors.darkBorder : appColors.border},
          ]}
        />
      ) : null}
    </TouchableOpacity>
  );

  const focusOnPickup = () => {
    if (pickupCoords?.lat && pickupCoords?.lng && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: pickupCoords.lat,
          longitude: pickupCoords.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000,
      );
    }
  };

  const handlePress = () => {
    const payload = {
      coupon: inputValue,
      service_id: service_ID,
      vehicle_type_id: selectedItem,
      locations: [pickupCoords],
      service_category_id: service_category_ID.toString(),
      hourly_package_id: selectedPackageDetails?.id,
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
    navigate("PromoCodeScreen", {from: "payment", getCoupon});
  };

  const removeCoupon = () => {
    setInputValue();
    setCouponValue();
  };

  const getCoupon = val => {
    setCoupon(val);
  };

  const startTimer = async () => {
    await AsyncStorage.setItem("ride_timer_start", Date.now().toString());
    setIsTimerRunning(true);
    timerCancelledRef.current = false; // reset cancel flag
    checkTimer(); // run immediately
    intervalTimeRef.current = setInterval(checkTimer, 1000);
  };

  const cancelTimer = async () => {
    setIsPulsing(false);
    timerCancelledRef.current = true; // prevent auto cancel after nav

    if (intervalTimeRef.current) {
      clearInterval(intervalTimeRef.current);
      intervalTimeRef.current = null;
    }

    await AsyncStorage.removeItem("ride_timer_start");
    setIsTimerRunning(false);
    setRemainingTime(0);
    setIsExpanding(false);
  };

  const handleTimerComplete = async () => {
    if (timerCancelledRef.current) return;

    handleCancelRide();
    await stopPulseAnimation();
    setBookLoading(false);
  };

  const checkTimer = async () => {
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
  };

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
  }, []);

  return (
    <GestureHandlerRootView style={external.fx_1}>
      <View style={[external.fx_1, {backgroundColor: bgContainer}]}>
        <View style={[commonStyles.flexContainer]}>
          <TouchableOpacity
            style={[styles.backBtn, {backgroundColor: bgContainer}]}
            onPress={goBack}
            activeOpacity={0.7}>
            <Back />
          </TouchableOpacity>
          {pickupCoords && (
            <MapScreen
              mapType={mapType}
              pickupCoords={pickupCoords}
              stopsCoords={[]}
              destinationCoords={pickupCoords}
              isDark={isDark}
              Google_Map_Key={Google_Map_Key}
              isPulsing={isPulsing}
            />
          )}
        </View>

        {RideBooked && (
          <View style={[external.mt_10, external.mh_15, styles.listView]}>
            <FlatList
              renderItem={renderItemRequest}
              data={bidValue?.data?.length > 0 ? [bidValue?.data[0]] : []}
              keyExtractor={item => item.id.toString()}
              removeClippedSubviews={true}
            />
          </View>
        )}

        <BottomSheet
          ref={mainBottomSheetRef}
          index={0}
          snapPoints={mainSnapPoints}
          enablePanDownToClose={false}
          backgroundStyle={{backgroundColor: bgContainer}}
          handleIndicatorStyle={{backgroundColor: textColorStyle}}>
          <BottomSheetView style={[external.fx_1, external.ph_10]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              scrollEnabled={true}>
              <View
                style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text
                  style={[
                    styles.choosePackage,
                    {color: textColorStyle, textAlign: textRTLStyle},
                  ]}>
                  {translateData.chooseaPackage}
                </Text>
                {isExpanding && (
                  <View
                    style={[styles.mainSheet, {flexDirection: viewRTLStyle}]}>
                    {isTimerRunning ? (
                      <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>
                          {Math.floor(remainingTime / 60000)}:
                          {Math.floor((remainingTime % 60000) / 1000)
                            .toString()
                            .padStart(2, "0")}
                          s
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
              <KmDetails
                onPackageSelect={handlePackageSelection}
                onpackageVehicle={handlepackagevehicle}
                zoneValue={zoneValue}
              />
              {hasValidPackageDetails && (
                <>
                  <Text
                    style={[
                      styles.carType,
                      {color: textColorStyle, textAlign: textRTLStyle},
                    ]}>
                    {translateData.vehicletype}
                  </Text>
                  <View style={{marginVertical: 10}}>
                    <FlatList
                      horizontal
                      data={packageVehicle}
                      renderItem={renderItem}
                      keyExtractor={item => item.id.toString()}
                      showsHorizontalScrollIndicator={false}
                      nestedScrollEnabled={true}
                      contentContainerStyle={{paddingHorizontal: 10}}
                      initialNumToRender={5}
                      windowSize={5}
                      maxToRenderPerBatch={5}
                      removeClippedSubviews={true}
                      scrollEnabled={true}
                    />
                  </View>
                </>
              )}
            </ScrollView>
            <View>
              <View
                style={[
                  styles.cardView,
                  {
                    flexDirection: viewRTLStyle,
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleOpenPaymentSheet}
                  style={[
                    styles.switchUser,
                    {
                      flexDirection: viewRTLStyle,
                      width: "49%",
                      backgroundColor: isDark
                        ? appColors.bgDark
                        : appColors.lightGray,
                    },
                  ]}>
                  <View style={styles.userIcon}>
                    <Card />
                  </View>
                  <Text
                    style={[
                      styles.selectText,
                      {color: textColorStyle},
                      styles.selectedText,
                    ]}>
                    {seletedPayment ? seletedPayment : translateData.payment}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleOpenRiderSheet}
                  style={[
                    styles.switchUser,
                    {
                      flexDirection: viewRTLStyle,
                      width: "49%",
                      backgroundColor: isDark
                        ? appColors.bgDark
                        : appColors.lightGray,
                    },
                  ]}>
                  <View style={styles.userIcon}>
                    <User />
                  </View>
                  <Text
                    style={[
                      styles.selectText,
                      {color: textColorStyle},
                      styles.selectedText,
                    ]}>
                    {translateData.myself}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[external.mv_13]}>
                {!isExpanding ? (
                  <Button
                    title={translateData.bookRide}
                    onPress={handleBookRide}
                    loading={bookLoading}
                    disabled={bookLoading}
                  />
                ) : (
                  <Button
                    title={translateData.cancelRide}
                    backgroundColor={
                      isDark ? appColors.darkHeader : appColors.primaryGray
                    }
                    textColor={appColors.regularText}
                    onPress={handleCancelRide}
                    loading={bookLoading}
                    disabled={bookLoading}
                  />
                )}
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          ref={vehicleDetailsBottomSheetRef}
          index={-1}
          snapPoints={vehicleDetailsSnapPoints}
          enablePanDownToClose={true}
          onChange={handleSubSheetChanges}
          backgroundStyle={{backgroundColor: bgContainer}}
          handleIndicatorStyle={{backgroundColor: textColorStyle}}>
          <BottomSheetView>
            <ModalContainers
              selectedItemData={selectedItemData}
              onPress={() => vehicleDetailsBottomSheetRef.current?.close()}
            />
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          ref={paymentBottomSheetRef}
          index={-1}
          snapPoints={paymentSnapPoints}
          enablePanDownToClose={true}
          onChange={handleSubSheetChanges}
          backgroundStyle={{backgroundColor: bgContainer}}
          handleIndicatorStyle={{backgroundColor: textColorStyle}}>
          <BottomSheetView style={[external.fx_1, external.ph_20,]}>
            <ScrollView>
            <Text
              style={[
                styles.payment,
                {
                  color: textColorStyle,
                  textAlign: textRTLStyle,
                  marginBottom: 15,
                },
              ]}>
              {translateData.paymentMethodSelect}
            </Text>

            <BottomSheetFlatList
              data={activePaymentMethods}
              renderItem={renderItem1}
              keyExtractor={item => item?.name?.toString()}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
             scrollEnabled={true}
             
            />

            </ScrollView>
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          ref={riderBottomSheetRef}
          index={-1}
          snapPoints={riderSnapPoints}
          enablePanDownToClose={true}
          onChange={handleSubSheetChanges}
          backgroundStyle={{backgroundColor: bgContainer}}
          handleIndicatorStyle={{backgroundColor: textColorStyle}}>
          <BottomSheetView style={[external.fx_1, external.ph_20]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity activeOpacity={0.7}>
                <Text
                  style={[
                    commonStyles.mediumText23,
                    {color: textColorStyle, textAlign: textRTLStyle},
                  ]}>
                  {translateData.talkingRide}
                </Text>
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
              </TouchableOpacity>
              <View style={[external.mt_20]}>
                <View
                  style={[
                    external.fd_row,
                    external.ai_center,
                    external.js_space,
                    {flexDirection: viewRTLStyle},
                  ]}>
                  <View
                    style={[external.fd_row, {flexDirection: viewRTLStyle}]}>
                    <UserFill />
                    <Text
                      style={[
                        commonStyles.mediumTextBlack12,
                        external.mh_2,
                        {fontSize: fontSizes.FONT19},
                        {color: textColorStyle},
                      ]}>
                      {translateData.myself}
                    </Text>
                  </View>
                  <Pressable
                    style={{
                      backgroundColor: appColors.selectPrimary,
                      borderRadius: windowHeight(48),
                    }}>
                    <RadioButton
                      onPress={radioPress}
                      checked={isChecked}
                      color={appColors.primary}
                    />
                  </Pressable>
                </View>
                <SolidLine marginVertical={14} />
                <TouchableOpacity
                  onPress={chooseRider}
                  activeOpacity={0.7}
                  style={[
                    external.fd_row,
                    external.js_space,
                    {flexDirection: viewRTLStyle},
                  ]}>
                  <View
                    style={[
                      external.fd_row,
                      external.ai_center,
                      {flexDirection: viewRTLStyle},
                    ]}>
                    <NewContact />
                    <Text style={[styles.chooseAnotherAccount]}>
                      {translateData.contact}
                    </Text>
                  </View>
                  <Forword />
                </TouchableOpacity>
              </View>
              <View
                style={[external.fd_row, external.js_space, external.mt_25]}>
                <Button
                  width={"47%"}
                  backgroundColor={isDark?appColors.bgDark:appColors.lightGray}
                  title={translateData.cancel}
                  textColor={isDark?appColors.iconColor:appColors.primaryText}
                  onPress={handleCloseRiderSheet}
                />
                <Button
                  width={"47%"}
                  title={translateData.continue}
                  onPress={handleChooseRiderAndClose}
                />
              </View>
            </ScrollView>
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          ref={rentalInfoBottomSheetRef}
          index={-1}
          snapPoints={rentalInfoSnapPoints}
          enablePanDownToClose={true}
          onChange={handleSubSheetChanges}
          backgroundStyle={{
            backgroundColor: isDark
              ? appColors.darkPrimary
              : appColors.whiteColor,
          }}
          handleIndicatorStyle={{backgroundColor: textColorStyle}}>
          <BottomSheetView style={external.fx_1}>
            <ScrollView>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.close}
                onPress={() => rentalInfoBottomSheetRef.current?.close()}>
                <Close />
              </TouchableOpacity>
              <Text
                style={[
                  commonStyles.extraBold,
                  external.ti_center,
                  {
                    color: isDark
                      ? appColors.whiteColor
                      : appColors.primaryText,
                    marginTop: windowHeight(10),
                  },
                ]}>
                {translateData.rentalRide}
              </Text>
              <Image style={styles.carTwo} source={Images.carTwo} />
              <View style={external.ph_20}>
                <View
                  style={{
                    flexDirection: viewRTLStyle,
                    justifyContent: "space-between",
                  }}>
                  <Text
                    style={[
                      commonStyles.extraBold,
                      external.pv_10,
                      {
                        color: isDark
                          ? appColors.whiteColor
                          : appColors.primaryText,
                      },
                    ]}>
                    {translateData.incorporated}
                  </Text>
                  <View
                    style={{
                      flexDirection: viewRTLStyle,
                      marginVertical: windowHeight(4.8),
                    }}>
                    <UserFill />
                    <Text style={styles.total}>5</Text>
                  </View>
                </View>
                <SolidLine />
                <View style={[external.mt_5]}>
                  <ModalContainer data={modelData} />
                </View>
                <SolidLine />
                <Text
                  style={[
                    commonStyles.extraBold,
                    external.mt_10,
                    {
                      color: isDark
                        ? appColors.whiteColor
                        : appColors.primaryText,
                    },
                  ]}>
                  {translateData.policiesFees}
                </Text>
                <View style={[external.mt_5]}>
                  <ModalContainer data={feesPolicies} />
                </View>
              </View>
            </ScrollView>
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          ref={couponBottomSheetRef}
          index={-1}
          snapPoints={couponSnapPoint}
          onChange={handleSubSheetChanges}
          backgroundStyle={{backgroundColor: bgContainer}}
          handleIndicatorStyle={{backgroundColor: textColorStyle}}
          enablePanDownToClose={true}
          enableContentPanningGesture={true}
          enableHandlePanningGesture={false}>
          <BottomSheetView style={[external.fx_1, external.ph_10]}>
            <View>
              <View>
                <TouchableOpacity
                  style={{
                    alignSelf: "flex-end",
                    marginHorizontal: windowWidth(15),
                  }}
                  onPress={handlecloseCouponSheet}>
                  <CloseCircle />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.payment,
                    {color: textColorStyle, textAlign: textRTLStyle},
                  ]}>
                  {translateData.applyCoupons}
                </Text>
              </View>
              <View>
                <View
                  style={[
                    styles.containerCouponMain,
                    {flexDirection: viewRTLStyle},
                    {
                      backgroundColor: bgContainer,
                      borderColor: isDark
                        ? appColors.darkBorder
                        : appColors.border,
                    },
                  ]}>
                  <TextInput
                    style={[styles.input, {color: textColorStyle}]}
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder={translateData.applyPromoCode}
                    placeholderTextColor={appColors.regularText}
                  />
                  <TouchableOpacity
                    style={styles.buttonAdd}
                    onPress={handlePress}
                    activeOpacity={0.7}>
                    <Text style={styles.buttonAddText}>
                      {translateData.apply}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  {!isValid && (
                    <Text style={styles.invalidPromoText}>
                      {translateData.invalidPromo}
                    </Text>
                  )}
                  {couponValue?.success == true && (
                    <Text style={styles.successMessage}>{successMessage}</Text>
                  )}
                  {inputValue?.length > 0 ? (
                    <TouchableOpacity
                      onPress={removeCoupon}
                      activeOpacity={0.7}>
                      <Text
                        style={[
                          styles.viewCoupon,
                          {textDecorationLine: "underline"},
                        ]}>
                        {translateData.remove}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={gotoCoupon} activeOpacity={0.7}>
                      <Text style={styles.viewCoupon}>
                        {translateData.allCoupon}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}
