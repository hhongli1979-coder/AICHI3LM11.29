import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, View, Image, Text, TouchableOpacity, Vibration, BackHandler, Linking, InteractionManager, Modal, ActivityIndicator } from 'react-native'
import appColors from '../../../theme/appColors'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'
import Icons from '../../../utils/icons/icons'
import { useDispatch, useSelector } from 'react-redux'
import Images from '../../../utils/images/images'
import appFonts from '../../../theme/appFonts'
import useSmartLocation from '../../../commonComponents/helper/locationHelper'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import { Button, notificationHelper } from '../../../commonComponents'
import { startLiveLocation, stopLiveLocation } from '../../../commonComponents/helper/liveLocationHelper'
import { currentZone, dashBoardData, fleetWalletData, rideDataGets, rideRequestDataGet, selfDriverData, sosAlertGet, sosDataGet, taxidosettingDataGet, vehicleData, walletData } from '../../../api/store/action'
import Sound from 'react-native-sound'
import { MapScreen } from '../mapScreen'
import BottomSheet, { BottomSheetFlatList, BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { UpcomingRide } from '../component'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useValues } from '../../../utils/context'
import { TourGuideZone, useTourGuideController } from 'rn-tourguide'
import { getValue, setValue } from '../../../utils/localstorage'
import PushNotification from 'react-native-push-notification'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, onSnapshot, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { firebaseConfig } from '../../../../firebase'
import styles from './styles'
import { AppDispatch } from '../../../api/store'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

Sound.setCategory('Playback', true)

const PulseCircle = ({ delay = 0, color }: any) => {
  const scale = useRef(new Animated.Value(1)).current
  const opacity = useRef(new Animated.Value(0.6)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scale, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [delay])

  return (
    <Animated.View
      style={[
        styles.pulse,
        {
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  )
}

export function Home() {
  const { currentLatitude, currentLongitude } = useSmartLocation()
  const { selfDriver } = useSelector((state: any) => state.account)
  const char = selfDriver?.name ? selfDriver.name.charAt(0) : ''
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)
  const driverId = selfDriver?.id
  const [isOnline, setIsOnline] = useState(false)
  const { taxidoSettingData, translateData } = useSelector((state: any) => state.setting)
  const { sosData } = useSelector((state: any) => state.sos)
  const upcomingRideRef = useRef(null)
  const [selectedRide, setSelectedRide] = useState(null)
  const [rides, setRides] = useState<any>([])
  const dispatch = useDispatch<AppDispatch>()
  const { navigate } = useNavigation<any>()
  const navigation = useNavigation<any>()
  const [status, setStatus] = useState<'online' | 'offline'>('online')
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
  const [lastRideRequestId, setLastRideRequestId] = useState<string | null>(null)
  const [sheetManuallyClosed, setSheetManuallyClosed] = useState(false)
  const [totalOnlineSeconds, setTotalOnlineSeconds] = useState(0)
  const [readRideRequests, setReadRideRequests] = useState<Set<string>>(new Set())
  const bottomSheetOfflineRef = useRef<BottomSheetModal>(null)
  const [isBottomSheetOfflineOpen, setIsBottomSheetOfflineOpen] = useState(false)
  const [offlineloading, setOfflineLoading] = useState(false)
  const [isAmountVisible, setIsAmountVisible] = useState(false)
  const [viewMode, setViewMode] = useState<'amount' | 'time'>('amount')
  const bottomSheetSOSRef = useRef<BottomSheetModal>(null)
  const [isBottomSheetSOSOpen, setIsBottomSheetSOSOpen] = useState(false)
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const { isDark, viewRtlStyle, rtl } = useValues()
  const { dashBoardList } = useSelector((state: any) => state.dashboard)
  const TodayIncome = `${zoneValue?.currency_symbol} ${dashBoardList?.day?.dayRevenues?.revenues?.slice(-1)[0]}`
  const { start, canStart, stop } = useTourGuideController()
  const [noservice, setNodervice] = useState<boolean>(false)
  const mapRef = useRef()
  const isFocused = useIsFocused()
  const bottomSheetRef = useRef<any>(null)
  const cancelbottomSheetRef = useRef<BottomSheetModal>(null)
  const [cancel, setCancel] = useState<boolean>(false)
  const snapPoints = ['30%']
  const isRingtonePlayingRef = useRef<boolean>(false)
  const soundInstanceRef = useRef<any>(null)
  const [isBottomSheetCancelOpen, setIsBottomSheetCancelOpen] = useState<boolean>(false)
  const [on, SetOn] = useState(false)
  const [hasShownTour, setHasShownTour] = useState<boolean>(false);
  const [loadingId, setLoadingId] = useState<null>(null)
  const [showOnline, setShowOnline] = useState<boolean>(true);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapKey, setMapKey] = useState<number>(0);


  const maskValue = (value: any) => {
    if (value == null || value === 0) {
      return "*.**";
    } const strValue = value.toString();
    return strValue
      .split("")
      .map((char: string) => (char === "." ? "." : "*"))
      .join("");
  };

  const lastRevenue =
    dashBoardList?.day?.dayRevenues?.revenues?.length > 0
      ? dashBoardList.day.dayRevenues.revenues.slice(-1)[0]
      : null;

  const maskedAmount = `${zoneValue?.currency_symbol ?? ''} ${maskValue(lastRevenue)}`;



  useEffect(() => {
    if (isFocused && !hasShownTour) {
      start();
      setHasShownTour(true);
    } else if (!isFocused) {
      stop();
    }
  }, [isFocused]);

  // Ensure map loads properly on first open
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 100);

    // Fallback to ensure map loads even if initial load fails
    const fallbackTimer = setTimeout(() => {
      setMapLoaded(true);
      // Force re-render by changing the key
      setMapKey(prev => prev + 1);
    }, 500);

    // Additional re-render after 1 second to ensure proper loading
    const reRenderTimer = setTimeout(() => {
      setMapKey(prev => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      clearTimeout(reRenderTimer);
    };
  }, []);
  useEffect(() => {
    const fetchZone = async () => {
      if (!currentLatitude || !currentLongitude) {
        return
      }
      try {
        const res: any = await dispatch(
          currentZone({ lat: currentLatitude, lng: currentLongitude }),
        ).unwrap()
        if (res?.id) {
          setNodervice(false)
        } else {
          setNodervice(true)
        }
      } catch (err) {
        setNodervice(true)
      }
    }
    fetchZone()
  }, [currentLatitude, currentLongitude])

  useEffect(() => {
    const showTourIfFirstTime = async () => {
      const hasSeenTour = await getValue('hasSeenTour')
      if (!hasSeenTour && canStart) {
        InteractionManager.runAfterInteractions(() => {
          requestAnimationFrame(() => {
            setTimeout(async () => {
              if (canStart) {
                start()
                await setValue('hasSeenTour', 'true')
              }
            }, 500)
          })
        })
      }
    }
    if (noservice == false) {
      showTourIfFirstTime()
    }
  }, [canStart])

  const fetchStoredLocation = async () => {
    try {
      const lat = await AsyncStorage.getItem('user_latitude')
      const lng = await AsyncStorage.getItem('user_longitude')
      if (lat && lng) {
        setLocation({
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        })
      } else {
        setLocation(null)
      }
    } catch (error) {
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchStoredLocation()
      // Force map re-render when screen is focused
      setMapKey(prev => prev + 1);
    }, []),
  )

  useEffect(() => {
    if (!isFocused) return
    const backAction = () => {
      bottomSheetRef.current?.expand()
      return true
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )
    return () => backHandler.remove()
  }, [isFocused])

  const handleExit = () => {
    bottomSheetRef.current?.close()

    setTimeout(() => {
      BackHandler.exitApp()
    }, 150)
  }

  const handleCloseSheet = () => {
    bottomSheetRef.current?.close()
  }

  const handleCloseSheet1 = () => {
    cancelbottomSheetRef.current?.close()
    setIsBottomSheetCancelOpen(false)
  }

  const handleExit1 = () => {
    bottomSheetRef.current?.close()
    if (upcomingRideRef.current) {
      upcomingRideRef.current.decline()
    }
    setIsBottomSheetCancelOpen(false)
    cancelbottomSheetRef.current?.close()
  }

  useEffect(() => {
    dispatch(sosDataGet())
  }, [])


  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!driverId) return

        const driverRef = doc(db, 'driverTrack', driverId.toString())
        const driverSnap = await getDoc(driverRef)

        if (driverSnap.exists()) {
          const isOnline = driverSnap.data()?.is_online
          setStatus(isOnline == 1 ? 'online' : 'offline')
        }
      } catch (error) {
      }
    }

    fetchStatus()
  }, [driverId])

  const handlePresentModalPress = useCallback(() => {
    if (isBottomSheetOpen) {
      bottomSheetModalRef.current?.close()
      setIsBottomSheetOpen(false)
      setSheetManuallyClosed(true) // Mark that sheet was manually closed
    } else {
      bottomSheetModalRef.current?.present()
      setIsBottomSheetOpen(true)
      setSheetManuallyClosed(false) // Reset when manually opened
    }
  }, [isBottomSheetOpen])

  const statusColors = {
    online: {
      outer: appColors.primary,
      inner: appColors.primary,
      pulse1: appColors.primaryLight,
      pulse2: appColors.value,
      label: 'Online',
      icon: <Icons.Online />,
    },
    offline: {
      outer: appColors.brightRed,
      inner: appColors.vividRed,
      pulse1: appColors.darkCrimson,
      pulse2: appColors.roseTint,
      label: 'Offline',
      icon: <Icons.Stop />,
    },
  }
  const nextStatus = status === 'online' ? 'offline' : 'online'
  const current = statusColors[nextStatus]

  useEffect(() => {
    if (!taxidoSettingData || Object.keys(taxidoSettingData).length === 0) {
      dispatch(taxidosettingDataGet())
      dispatch(selfDriverData())
    }
  }, [taxidoSettingData])

  useFocusEffect(
    useCallback(() => {
      dispatch(rideDataGets())
      dispatch(vehicleData())
      if (selfDriver?.role == 'fleet_manager') {
        dispatch(fleetWalletData())
      } else {
        dispatch(walletData())
      } const unit = zoneValue?.distance_type
      const zoneId = zoneValue?.id
      const driver_id = ''
      dispatch(dashBoardData({ unit, zoneId, driver_id }))
    }, []),
  )

  const gotoRide = (ride: any) => {
    stopNotificationSound()
    if (ride?.service_category?.service_category_type === 'rental') {
      navigate('RentalDetails', { ride })
    } else {
      navigation.navigate('Ride', { ride })
    }
    bottomSheetModalRef.current?.close()
    setIsBottomSheetOpen(false)
  }

  const gotoInfo = (ride: any) => {
    if (
      ride?.service_category?.service_category_type === 'schedule' ||
      ride?.service?.service_type === 'freight' ||
      ride?.service?.service_type === 'parcel' ||
      ride?.service_category?.service_category_type === 'package'
    ) {
      navigate('RideInfo', { ride })
    } else if (ride?.service_category?.service_category_type === 'rental') {
      navigate('RentalDetails', { ride })
    }
  }

  useEffect(() => {
    const zone_id = zoneValue?.id
    if (zone_id) {
      const intervalId = setInterval(() => {
        dispatch(rideRequestDataGet(zone_id))
      }, 5000)
      return () => clearInterval(intervalId)
    }
  }, [dispatch, zoneValue])

  const selectDriver = (ride: any) => {
    setSelectedRide(ride)
  }

  const onRideDeclined = () => {
    if (rides?.length <= 1) {
      stopNotificationSound()
      bottomSheetModalRef.current?.close()
    }
  }

  useFocusEffect(
    useCallback(() => {
      const fetchOnlineStatus = async () => {
        if (!selfDriver?.id) {
          setIsOnline(false);
          return;
        }

        if (selfDriver?.wallet_balance < 0) {
          notificationHelper("", translateData.lowBalance, "error");
          setIsOnline(false);
          return;
        }

        try {
          const driverRef = doc(db, "driverTrack", selfDriver.id.toString());
          const snapshot = await getDoc(driverRef);

          if (snapshot.exists()) {
            const online = snapshot.data()?.is_online === "1";
            setIsOnline(online);

            if (online) {
              startLiveLocation(selfDriver.id, selfDriver);
            } else {
              stopLiveLocation();
            }
          } else {
            setIsOnline(false);
            stopLiveLocation();
          }
        } catch (error) {
          setIsOnline(false);
          stopLiveLocation();
        }
      };

      fetchOnlineStatus();
    }, [selfDriver?.id, selfDriver?.wallet_balance, translateData])
  );
  const getTodayDateStr = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const playQuickSound = () => {
    try {
      const statusSound = new Sound(require('../../../assets/ringtone/status.mp3'), (error) => {
        if (error) {
          return;
        }

        statusSound.setVolume(1.0);
        statusSound.play((success) => {
          if (!success) {
          }
          // Release the sound resource
          statusSound.release();
        });
      });
    } catch (error) {
    }
  };

  const toggleSwitch = async () => {
    Vibration.vibrate(42);
    if (!driverId) return;

    if (!isOnline) {
      SetOn(true);
      runOnlineAnimation();


      playQuickSound();
      setIsOnline(true);
      setStatus("online");

      try {
        const driverRef = doc(db, "driverTrack", driverId.toString());
        const today = getTodayDateStr();
        const snapshot = await getDoc(driverRef);
        const data = snapshot.exists() ? snapshot.data() : {};

        const now = Timestamp.now();

        const updatePayload: any = {
          is_online: "1",
          last_online_at: now,
          lat: currentLatitude?.toString(),
          lng: currentLongitude?.toString(),
          service_id: selfDriver?.service_id,
          service_category_id: selfDriver?.service_category_id,
          vehicle_type_id: selfDriver?.vehicle_info?.vehicle_type_id,
          vehicle_map_icon_url:
            selfDriver?.vehicle_info?.vehicle_type_map_icon_url,
          driver_name: selfDriver?.name,
          review_count: selfDriver?.review_count,
          rating_count: selfDriver?.rating_count,
          model: selfDriver?.vehicle_info?.model,
          plate_number: selfDriver?.vehicle_info?.plate_number,
          profile_image_url: selfDriver?.profile_image_url,
        };

        if (data?.date !== today) {
          updatePayload.total_online_time_today = 0;
          updatePayload.date = today;
        }

        await setDoc(driverRef, updatePayload, { merge: true });
        await startLiveLocation(driverId, selfDriver);
      } catch (err) {
        setIsOnline(false);
        setStatus("offline");
        stopLiveLocation();
        notificationHelper("", translateData.failedOnline, "error");
      }
    } else {
      bottomSheetOfflineRef.current?.present();
      setIsBottomSheetOfflineOpen(true);
    }
  };

  const driverOffline = async () => {
    // Play status change sound
    playQuickSound();

    try {
      if (!driverId) return;

      const driverRef = doc(db, "driverTrack", driverId.toString());
      const snapshot = await getDoc(driverRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const rideStatus = data?.is_on_ride;
        const onRide =
          typeof rideStatus === "string"
            ? rideStatus
            : rideStatus != null
              ? String(rideStatus)
              : "0";

        if (onRide == "1") {
          notificationHelper(
            "",
            translateData.rideIsActive,
            "error"
          );
          bottomSheetOfflineRef.current?.close()

          return;
        }
      }

      SetOn(true);
      runOnlineAnimation();
      setOfflineLoading(true);
      setIsOnline(false);
      setStatus("offline");
      closeDriveroffline();
      stopLiveLocation();

      const data = snapshot.data();
      const now = new Date();
      const lastOnlineAt = data?.last_online_at?.toDate?.();
      let totalTime = data?.total_online_time_today || 0;

      if (lastOnlineAt) {
        const seconds = Math.floor((now.getTime() - lastOnlineAt.getTime()) / 1000);
        totalTime += seconds;
      }

      await setDoc(
        driverRef,
        {
          is_online: "0",
          total_online_time_today: totalTime,
          lat: currentLatitude?.toString(),
          lng: currentLongitude?.toString(),
        },
        { merge: true }
      );
    } catch (err) {
      setIsOnline(true);
      setStatus("online");

      if (driverId) {
        startLiveLocation(driverId, selfDriver);
      }

      notificationHelper("", translateData.failedOnline, "error");
    } finally {
      setOfflineLoading(false);
    }
  };

  const closeDriveroffline = () => {
    bottomSheetOfflineRef.current?.close()
    setIsBottomSheetOfflineOpen(false)
  }

  const fetchTime = async () => {
    if (!selfDriver?.id) return
    const snap = await getDoc(doc(db, 'driverTrack', selfDriver.id.toString()))
    const seconds = snap?.data()?.total_online_time_today || 0
    setTotalOnlineSeconds(seconds)
  }
  const formatSecondsToHHMM = (totalSeconds: any) =>
    `${Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, '0')}:${Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0')}`

  const sosSheet = () => {
    if (isBottomSheetSOSOpen) {
      bottomSheetSOSRef.current?.close()
      setIsBottomSheetSOSOpen(false)
    } else {
      bottomSheetSOSRef.current?.present()
      setIsBottomSheetSOSOpen(true)
    }
  }

  const handelCall = () => {
    bottomSheetModalRef.current?.close()
    bottomSheetOfflineRef.current?.close()
    if (isBottomSheetSOSOpen) {
      cancelbottomSheetRef.current?.close()
      setIsBottomSheetCancelOpen(false)
    } else {
      cancelbottomSheetRef.current?.present()
      setIsBottomSheetCancelOpen(true)
    }
  }

  const toggleHeader = () => {
    Vibration.vibrate(52)
    setViewMode(prev => (prev === 'amount' ? 'time' : 'amount'))
    fetchTime()
  }


  const sosCall = (details: any) => {
    const payload = {
      sos_id: details?.id,
      location_coordinates: { lat: currentLatitude, lng: currentLongitude },
    }

    setLoadingId(details?.id)
    dispatch(sosAlertGet(payload))
      .unwrap()
      .then(async () => {
        Linking.openURL(`tel:${details?.phone}`)
      })
      .catch(err => {
      })
      .finally(() => {
        setLoadingId(null)
      })
  }

  // Automatic opening when new requests come in
  // Only auto-open if it's a new ride request and sheet wasn't manually closed
  useEffect(() => {
    if (rides?.length > 0 && !isBottomSheetOpen) {
      // Check if this is a new ride request by comparing with the last one
      const firstRideId = rides[0]?.id;
      if (firstRideId && firstRideId !== lastRideRequestId) {
        // This is a new ride request, auto-open the sheet if not manually closed
        if (!sheetManuallyClosed) {
          setLastRideRequestId(firstRideId);
          bottomSheetModalRef.current?.present();
          setIsBottomSheetOpen(true);
          // Mark this request as read when the sheet opens
          setReadRideRequests(prev => {
            const newSet = new Set(prev);
            newSet.add(firstRideId);
            return newSet;
          });
        }
      }
    } else if (rides?.length === 0) {
      // Reset when there are no rides
      setLastRideRequestId(null);
    }
  }, [rides, isBottomSheetOpen, lastRideRequestId, sheetManuallyClosed]);

  const handleFocusPress = () => {
    mapRef.current?.focusToCurrentLocation()
  }

  useEffect(() => {
    PushNotification.createChannel({
      channelId: 'ride-requests',
      channelName: 'Ride Requests',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    })
  }, [])

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const stopNotificationSound: any = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = null

    if (soundInstanceRef.current) {
      soundInstanceRef.current.stop(() => {
        soundInstanceRef.current?.release()
        soundInstanceRef.current = null
      })
    }

    Vibration.cancel()
    isRingtonePlayingRef.current = false
  }, [])

  const playNotificationSound = useCallback(() => {
    if (isRingtonePlayingRef.current) return

    isRingtonePlayingRef.current = true
    Vibration.vibrate([0, 1000, 500, 1000], true)

    const sound = new Sound(
      'https://res.cloudinary.com/dwsbvqylx/video/upload/v1748766805/mixkit-urgent-simple-tone-loop-2976_ip7rwc.wav',
      null,
      error => {
        if (error) {
          stopNotificationSound()
          return
        }

        soundInstanceRef.current = sound
        sound.setNumberOfLoops(-1)
        sound.play(success => {
          if (!success) stopNotificationSound()
        })

        timeoutRef.current = setTimeout(() => stopNotificationSound(), 5000)
      },
    )
  }, [stopNotificationSound])

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        stopNotificationSound()
        setIsBottomSheetOpen(false)
        setSheetManuallyClosed(true) // Mark that sheet was manually closed
        // When sheet closes, mark all current rides as read
        if (rides?.length > 0) {
          setReadRideRequests(prev => {
            const newSet = new Set(prev);
            rides.forEach((ride: any) => {
              if (ride?.id) {
                newSet.add(ride.id);
              }
            });
            return newSet;
          });
        }
      }
    },
    [stopNotificationSound, rides]
  )

  useFocusEffect(
    useCallback(() => {
      if (!driverId) {
        return
      }

      let unsubscribeDriver: (() => void) | null = null
      let rideDocsUnsubscribers: (() => void)[] = []
      let currentRideIds: string[] = []

      const driverDocRef = doc(db, 'driver_ride_requests', driverId.toString())

      unsubscribeDriver = onSnapshot(
        driverDocRef,
        async driverSnapshot => {
          if (!driverSnapshot.exists()) {
            rideDocsUnsubscribers.forEach(unsub => unsub())
            rideDocsUnsubscribers = []
            currentRideIds = []
            setRides([])
            return
          }

          const rideRequestsArray: { id: string }[] =
            driverSnapshot.data()?.ride_requests || []

          const newRideIds = rideRequestsArray
            .map(r => r.id?.toString())
            .filter(Boolean)

          const addedRideIds = newRideIds.filter(
            id => !currentRideIds.includes(id),
          )
          if (addedRideIds.length > 0) {
            playNotificationSound()
          }

          currentRideIds = newRideIds

          if (rideRequestsArray.length === 0) {
            rideDocsUnsubscribers.forEach(unsub => unsub())
            rideDocsUnsubscribers = []
            setRides([])
            return
          }

          rideDocsUnsubscribers.forEach(unsub => unsub())
          rideDocsUnsubscribers = []

          const allRides: any[] = []

          rideRequestsArray.forEach((rideReq: any) => {
            const rideDocRef = doc(db, 'ride_requests', rideReq.id)
            const unsub = onSnapshot(
              rideDocRef,
              rideSnapshot => {
                if (rideSnapshot.exists()) {
                  const rideData = {
                    id: rideSnapshot.id,
                    ...rideSnapshot.data(),
                  }
                  const index = allRides.findIndex(r => r.id === rideData.id)
                  if (index > -1) {
                    allRides[index] = rideData
                  } else {
                    allRides.push(rideData)
                  }
                  setRides([...allRides])
                }
              },
              error => {
              },
            )
            rideDocsUnsubscribers.push(unsub)
          })
        },
      )

      return () => {
        if (unsubscribeDriver) unsubscribeDriver()
        rideDocsUnsubscribers.forEach(unsub => unsub())
        stopNotificationSound()
      }
    }, [driverId, playNotificationSound, stopNotificationSound]),
  )
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const runOnlineAnimation = () => {
    setShowOnline(true);
    setTimeout(() => {
      setShowOnline(false);
      SetOn(false)
    }, 2000);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  useEffect(() => {
    return () => stopNotificationSound()
  }, [stopNotificationSound])



  const FallbackImage = ({ uri, style }) => {
    const [imgUri, setImgUri] = React.useState(uri);

    return (
      <Image
        source={imgUri ? { uri: imgUri } : Images.sos}
        style={style}
        onError={() => setImgUri(null)}
        resizeMode="contain"
      />
    );
  };


  return (
    <View style={{ flex: 1 }}>
      {mapLoaded && (
        <MapScreen
          key={mapKey}
          ref={mapRef}
          markerIcon={selfDriver?.vehicle_info?.vehicle_type_map_icon_url}
          selfDriver={selfDriver}
          zoneValue={zoneValue}
          isBottomSheetSOSOpen={isBottomSheetSOSOpen}
          isBottomSheetCancelOpen={isBottomSheetCancelOpen}
          isBottomSheetOpen={isBottomSheetOpen}
          isBottomSheetOfflineOpen={isBottomSheetOfflineOpen}
        />
      )}
      <Modal
        visible={noservice}
        transparent
        animationType="fade"
        onRequestClose={() => setNodervice(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{translateData.serviceNotAvailable}</Text>
            <Text style={styles.message}>
              {translateData.serviceNoDesc}
            </Text>
            <TouchableOpacity
              style={styles.buttonModel}
              onPress={() => BackHandler.exitApp()}
            >
              <Text style={styles.buttonTextModel}>{translateData.exit}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View
        style={{
          flexDirection: rtl ? 'row-reverse' : 'row',
          justifyContent: 'space-between',
          top: '3%',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigate('ProfileSetting')}
          style={{ left: windowHeight(2) }}
        >
          {selfDriver?.profile_image_url ? (
            <Image
              style={{
                backgroundColor: appColors.primary,
                height: windowHeight(5.5),
                width: windowHeight(5.5),
                borderRadius: windowHeight(5),
              }}
              source={{
                uri: selfDriver?.profile_image_url,
              }}
            />
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: windowHeight(5.5),
                height: windowHeight(5.5),
                backgroundColor: appColors.primary,
                borderRadius: windowHeight(74),
              }}
            >
              <Text
                style={{
                  color: appColors.white,
                  fontFamily: appFonts.bold,
                  fontSize: fontSizes.FONT5,
                }}
              >
                {char}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TourGuideZone
          zone={4}
          text={`${translateData.fleetData1}.\n${translateData.fleetData2}\n${translateData.fleetData3}`}
          borderRadius={12}
          isTourGuide
          style={{
            flexDirection: rtl ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: on && status === 'offline' ? appColors.red : appColors.primary,
            height: windowHeight(5.5),
            borderRadius: windowHeight(8.5),
            paddingHorizontal: windowWidth(4.3),
          }}
        >
          {showOnline && on ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: windowWidth(25),
              }}
            >
              <Animated.Text
                style={{
                  fontSize: fontSizes.FONT4,
                  fontFamily: appFonts.medium,
                  color: appColors.white,
                  transform: [{ scale: scaleAnim }],
                }}
              >
                {status === 'offline' ? 'Offline' : 'Online'}
              </Animated.Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => toggleHeader()}
              activeOpacity={0.9}
              style={{
                flexDirection: rtl ? "row-reverse" : "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appColors.primary,
                height: windowHeight(5.5),
                borderRadius: windowHeight(8.5),
              }}
            >
              {viewMode === "time" ? (
                <Icons.Clock color={appColors.white} />
              ) : (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setIsAmountVisible((prev) => !prev);
                  }}
                >
                  {isAmountVisible ? <Icons.Eye /> : <Icons.WalletEyeClose />}
                </TouchableOpacity>
              )}

              <View
                style={{
                  height: windowHeight(1.5),
                  width: windowHeight(0.1),
                  backgroundColor: appColors.white,
                  marginHorizontal: windowWidth(1.5),
                }}
              />

              <Text style={styles.text}>
                {viewMode === "time"
                  ? `${formatSecondsToHHMM(totalOnlineSeconds)} hrs`
                  : isAmountVisible
                    ? TodayIncome
                    : maskedAmount}
              </Text>
            </TouchableOpacity>
          )}
        </TourGuideZone>
        <TouchableOpacity
          onPress={() => navigate('Notification')}
          activeOpacity={0.9}
          style={{
            height: windowHeight(5.5),
            width: windowHeight(5.5),
            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
            borderRadius: windowHeight(15),
            alignItems: 'center',
            justifyContent: 'center',
            right: windowHeight(2),
            borderColor: isDark ? appColors.darkBorderBlack : appColors.white,
            borderWidth: 1,
          }}
        >
          <Icons.Notification
            color={isDark ? appColors.white : appColors.primaryFont}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={0.9}
        style={{
          height: windowHeight(5.5),
          width: windowHeight(5.5),
          backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
          borderRadius: windowHeight(15),
          alignItems: 'center',
          justifyContent: 'center',
          left: rtl ? windowHeight(-2) : windowHeight(2),
          top: windowHeight(4),
          position: 'relative',
          alignSelf: rtl ? 'flex-end' : 'flex-start',
          borderColor: isDark ? appColors.darkBorderBlack : appColors.white,
        }}
        onPress={handlePresentModalPress}
      >
        <TourGuideZone
          zone={3}
          text={translateData.fleetRide1}
          borderRadius={12}
          isTourGuide
          style={{
            height: windowHeight(6.5),
            width: windowHeight(7),
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icons.Car color={isDark ? appColors.white : appColors.primaryFont} />
          {/* Show red dot only for unread requests */}
          {rides?.length > 0 && !readRideRequests.has(rides[0]?.id) && (
            <View
              style={{
                position: 'absolute',
                top: windowHeight(1),
                right: windowHeight(1),
                height: windowHeight(1),
                width: windowHeight(1),
                backgroundColor: appColors.red,
                borderRadius: 5,
              }}
            />
          )}
        </TourGuideZone>
      </TouchableOpacity>
      <>
        {!isBottomSheetOpen &&
          !isBottomSheetOfflineOpen &&
          !isBottomSheetSOSOpen &&
          !isBottomSheetCancelOpen && (
            <View
              style={{
                position: 'absolute',
                left: windowHeight(2),
                height: windowHeight(7),
                bottom: windowHeight(10),
                [rtl ? 'right' : 'left']: windowWidth(4),
                zIndex: 1,
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={sosSheet}
                style={{
                  height: windowHeight(7),
                  width: windowHeight(7),
                  borderRadius: windowHeight(4),
                  backgroundColor: isDark
                    ? appColors.alertIconBg
                    : appColors.white,
                  borderColor: isDark ? appColors.red : appColors.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: windowHeight(0.15),
                  alignSelf: 'flex-end',
                }}
              >
                <Icons.SOS />
              </TouchableOpacity>

              <TourGuideZone
                zone={2}
                text={translateData.fleetSos1}
                borderRadius={12}
                isTourGuide
                style={{
                  height: windowHeight(7),
                  width: windowHeight(7),
                  position: 'absolute',
                }}
              >
                <View style={{ flex: 1 }} />
              </TourGuideZone>
            </View>
          )}
      </>



      <TouchableOpacity
        onPress={handleFocusPress}
        style={{
          position: 'absolute',
          bottom: windowHeight(10),
          height: windowHeight(7),
          width: windowHeight(7),
          borderRadius: windowHeight(4),
          borderWidth: windowHeight(0.15),
          borderColor: isDark ? appColors.darkBorderBlack : appColors.border,
          backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 0,
          [rtl ? 'left' : 'right']: windowWidth(4),
        }}
      >
        <Icons.LocationIcon
          color={isDark ? appColors.white : appColors.primaryFont}
        />

      </TouchableOpacity>
      <TourGuideZone
        zone={1}
        text={translateData.tourTitle}
        borderRadius={12}
        style={{
          position: 'absolute',
          marginTop: windowHeight(5),
          marginLeft: windowWidth(-15),
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      />
      {!isBottomSheetOpen &&
        !isBottomSheetOfflineOpen &&
        !isBottomSheetSOSOpen &&
        !isBottomSheetCancelOpen && (
          <View style={styles.container}>
            <PulseCircle delay={0} color={current.pulse1} />
            <PulseCircle delay={600} color={current.pulse2} />
            <View
              style={[
                styles.staticOuterCircle,
                { backgroundColor: current.outer },
              ]}
            />
            <TourGuideZone
              zone={5}
              text={translateData.fleetOnline1}
              borderRadius={12}
              style={{
                position: 'absolute',
                height: windowHeight(10),
                width: windowHeight(10),
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
              }}
            >
              <TouchableOpacity
                onPress={toggleSwitch}
                style={[styles.button, { backgroundColor: current.inner }]}
              >
                {current.icon}
              </TouchableOpacity>
            </TourGuideZone>
          </View>
        )}

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={['48%', '80%']}
          onChange={handleSheetChanges}
          onDismiss={() => setIsBottomSheetOpen(false)}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: '13%',
          }}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
          enableContentPanningGesture={true}
          enableHandlePanningGesture={true}
          enableOverDrag={false}
          enablePanDownToClose={true}
        >
          <BottomSheetView style={styles.contentContainer}>
            {rides?.length > 0 ? (
              <BottomSheetFlatList
                data={[...rides]
                  .filter(
                    (ride: any) => ride?.rider_id && ride?.location_coordinates,
                  )
                  .sort((a: any, b: any) => {
                    // Extract timestamp values, handling different formats
                    const getTimeValue = (item: any) => {
                      if (!item?.created_at) return 0;

                      // Handle Firestore timestamp format (_seconds and _nanoseconds)
                      if (item.created_at._seconds !== undefined) {
                        return item.created_at._seconds * 1000 + (item.created_at._nanoseconds || 0) / 1000000;
                      }

                      // Handle string format (ISO date string)
                      if (typeof item.created_at === 'string') {
                        return new Date(item.created_at).getTime();
                      }

                      // Handle numeric timestamp
                      if (typeof item.created_at === 'number') {
                        return item.created_at;
                      }

                      return 0;
                    };

                    const timeA = getTimeValue(a);
                    const timeB = getTimeValue(b);

                    // Sort in descending order (latest first)
                    return timeB - timeA;
                  })}
                keyExtractor={(item: any, index) =>
                  item?.id?.toString() || index.toString()
                }
                extraData={rides}
                renderItem={({ item }) => {
                  return (
                    <UpcomingRide
                      ride={item}
                      ref={upcomingRideRef}
                      gotoRide={gotoRide}
                      gotoInfo={gotoInfo}
                      selectDriver={selectDriver}
                      onRideDeclined={onRideDeclined}
                      cancelbottomSheetRef={cancelbottomSheetRef}
                      cancel={cancel}
                      handelCall={handelCall}
                      bottomSheetRef={bottomSheetRef}
                    />
                  )
                }}
                ListEmptyComponent={
                  <Text style={styles.noRideText}>
                    {translateData.noUpcomingrides}
                  </Text>
                }
                bounces={false}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={true}
              />
            ) : (
              <View style={styles.noRideContainer}>
                <Image
                  source={Images.noRide}
                  style={styles.noRideImg}
                  resizeMode="contain"
                />
                <Text style={styles.noRideText}>
                  {translateData.waitNewRide}
                </Text>
              </View>
            )}
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetOfflineRef}
          index={0}
          snapPoints={['30%']}
          onChange={handleSheetChanges}
          onDismiss={() => setIsBottomSheetOfflineOpen(false)}
          style={{ zIndex: 2 }}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: '13%',
          }}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
          enableOverDrag={false}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View>
              <Text
                style={{
                  color: isDark ? appColors.white : appColors.primaryFont,
                  fontFamily: appFonts.medium,
                  fontSize: fontSizes.FONT4HALF,
                  textAlign: 'center',
                  marginBottom: windowHeight(5),
                }}
              >
                {translateData.offlineMsg}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ width: windowWidth(46) }}>
                  <Button
                    title={translateData.cancel}
                    backgroundColor={
                      isDark ? appColors.darkThemeSub : appColors.graybackground
                    }
                    onPress={closeDriveroffline}
                    color={isDark ? appColors.white : appColors.black}
                  />
                </View>
                <View style={{ width: windowWidth(46) }}>
                  <Button
                    title={translateData.confirm}
                    backgroundColor={appColors.red}
                    color={appColors.white}
                    onPress={driverOffline}
                    loading={offlineloading}
                  />
                </View>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetSOSRef}
          index={0}
          snapPoints={['50%']}
          onChange={handleSheetChanges}
          onDismiss={() => setIsBottomSheetSOSOpen(false)}
          style={{ zIndex: 2 }}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: '13%',
          }}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View>
              <Text
                style={{
                  color: isDark ? appColors.white : appColors.primaryFont,
                  fontFamily: appFonts.medium,
                  fontSize: fontSizes.FONT4HALF,
                  textAlign: 'center',
                  marginBottom: windowHeight(3),
                }}
              >
                {translateData.keepSafe}
              </Text>
            </View>
            <BottomSheetFlatList
              data={sosData?.data}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: windowHeight(2) }}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={{
                      padding: windowHeight(1.5),
                      marginVertical: windowHeight(0.5),
                      backgroundColor: isDark
                        ? appColors.darkThemeSub
                        : appColors.graybackground,
                      borderRadius: 8,
                    }}
                    onPress={() => sosCall(item)}
                  >
                    <View
                      style={{
                        flexDirection: viewRtlStyle,
                        alignItems: 'center',
                      }}
                    >
                      <FallbackImage uri={item?.sos_image_url} style={styles.sosImage} />
                      <View
                        style={[
                          styles.sideLine,
                          {
                            backgroundColor: isDark
                              ? appColors.darkBorderBlack
                              : appColors.border,
                          },
                        ]}
                      />
                      <Text
                        style={{
                          color: isDark ? appColors.white : appColors.black,
                          fontFamily: appFonts.regular,
                          fontSize: fontSizes.FONT4HALF,
                          width: windowWidth(68),
                        }}
                      >
                        {item?.title}
                      </Text>
                      {loadingId === item?.id && (
                        <ActivityIndicator
                          size={'small'}
                          color={appColors.primary}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )
              }}
              bounces={false}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      <BottomSheetModalProvider>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: '13%',
          }}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
        >
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
              {translateData.exitMsg}
            </Text>
            <TouchableOpacity
              onPress={handleExit}
              style={{ marginVertical: 10 }}
            >
              <Text style={{ color: 'red', fontSize: 16 }}>
                {translateData.exit}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseSheet}
              style={{ marginVertical: 10 }}
            >
              <Text style={{ fontSize: 16 }}>{translateData.cancel}</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </BottomSheetModalProvider>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={cancelbottomSheetRef}
          index={0}
          snapPoints={['32%']}
          onChange={handleSheetChanges}
          onDismiss={() => setIsBottomSheetOpen(false)}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: '13%',
          }}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
          style={{ zIndex: 2 }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View style={{ padding: 20, paddingTop: windowHeight(2) }}>
              <Text
                style={{ fontSize: 16, fontFamily: appFonts.medium, marginBottom: 15 }}
              >
                {translateData?.areyousure}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: rtl ? 'row-reverse' : 'row',
                }}
              >
                <TouchableOpacity
                  onPress={handleExit1}
                  style={{
                    marginVertical: 10,
                    height: windowHeight(5),
                    width: windowWidth(35),
                    backgroundColor: appColors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: windowWidth(1.5),
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? appColors.darkText : appColors.white,
                      fontSize: 16,
                    }}
                  >
                    {translateData?.confirm}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCloseSheet1}
                  style={{
                    marginVertical: 10,
                    height: windowHeight(5),
                    width: windowWidth(35),
                    backgroundColor: isDark
                      ? appColors.darkThemeSub
                      : appColors.graybackground,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: windowWidth(1.5),
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? appColors.darkText : appColors.black,
                      fontSize: 16,
                    }}
                  >
                    {translateData.cancel}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  )
}