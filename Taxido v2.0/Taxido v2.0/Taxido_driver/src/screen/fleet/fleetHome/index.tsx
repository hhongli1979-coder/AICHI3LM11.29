import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, View, Image, Text, TouchableOpacity, Vibration, BackHandler, InteractionManager, Modal, FlatList } from 'react-native'
import appColors from '../../../theme/appColors'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'
import Icons from '../../../utils/icons/icons'
import { useDispatch, useSelector } from 'react-redux'
import appFonts from '../../../theme/appFonts'
import useSmartLocation from '../../../commonComponents/helper/locationHelper'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import { notificationHelper } from '../../../commonComponents'
import { startLiveLocation, stopLiveLocation } from '../../../commonComponents/helper/liveLocationHelper'
import { currentZone, dashBoardData, fleetDriverList, fleetWalletData, rideDataGets, rideRequestDataGet, selfDriverData, taxidosettingDataGet, vehicleData, walletData } from '../../../api/store/action'
import Sound from 'react-native-sound'
import { MapScreenFleet } from '../../home'
import BottomSheet, { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useValues } from '../../../utils/context'
import { TourGuideZone, useTourGuideController } from 'rn-tourguide'
import { getValue, setValue } from '../../../utils/localstorage'
import PushNotification from 'react-native-push-notification'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { firebaseConfig } from '../../../../firebase'
import styles from './styles'
import { AppDispatch } from '../../../api/store'
import { CustomCheckbox } from '../../auth/registration/component'

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

export function FleetHome() {
    const { currentLatitude, currentLongitude } = useSmartLocation()
    const { selfDriver } = useSelector((state: any) => state.account)
    const char = selfDriver?.name ? selfDriver.name.charAt(0) : ''
    const { zoneValue } = useSelector((state: any) => state.zoneUpdate)
    const driverId = selfDriver?.id
    const [isOnline, setIsOnline] = useState(false)
    const { taxidoSettingData } = useSelector((state: any) => state.setting)
    const dispatch = useDispatch<AppDispatch>()
    const { navigate } = useNavigation<any>()
    const [status, setStatus] = useState<'online' | 'offline' | 'onride'>('online')
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
    const [totalOnlineSeconds, setTotalOnlineSeconds] = useState(0)
    const [isAmountVisible, setIsAmountVisible] = useState(false)
    const [viewMode, setViewMode] = useState<'amount' | 'time'>('amount')
    const [location, setLocation] = useState<{
        latitude: number
        longitude: number
    } | null>(null)
    const { translateData } = useSelector((state: any) => state.setting)
    const { isDark, rtl } = useValues()
    const { dashBoardList } = useSelector((state: any) => state.dashboard)
    const TodayIncome = `${zoneValue?.currency_symbol} ${dashBoardList?.day?.dayRevenues?.revenues?.slice(-1)[0]}`
    const { start, canStart, stop } = useTourGuideController()
    const [noservice, setNodervice] = useState<boolean>(false)
    const mapRef = useRef()
    const isFocused = useIsFocused()
    const bottomSheetRef = useRef<any>(null)
    const snapPoints = ['30%']
    const isRingtonePlayingRef = useRef<boolean>(false)
    const soundInstanceRef = useRef<any>(null)
    const [on, SetOn] = useState(false)
    const [hasShownTour, setHasShownTour] = useState<boolean>(false);
    const [showOnline, setShowOnline] = useState<boolean>(true);
    const { allVehicle } = useSelector(state => state.vehicleType)
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);


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
            console.warn('❌ Error fetching location:', error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchStoredLocation()
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
                console.error('Failed to fetch status:', error)
            }
        }

        fetchStatus()
    }, [driverId])


    const handlePresentModalPress = useCallback(() => {
        setModalVisible(true);
    }, []);

    const toggleVehicleSelection = (id: number) => {
        setSelectedVehicles((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((vehicleId) => vehicleId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const renderItem = ({ item }: any) => {
        const isSelected = selectedVehicles.includes(item.id);
        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: windowHeight(2),
                    borderBottomWidth: 0.5,
                    borderColor: appColors.gray,
                }}
                onPress={() => toggleVehicleSelection(item.id)}
            >
                <Image
                    source={{ uri: item.vehicle_image_url }}
                    style={{ width: windowHeight(5), height: windowHeight(5) }}
                    resizeMode="contain"
                />
                <Text style={{ flex: 1, color: isDark ? appColors.white : appColors.black, marginHorizontal: windowWidth(2) }}>
                    {item.name}
                </Text>
                <CustomCheckbox checked={isSelected} onChange={() => toggleVehicleSelection(item.id)} onPress={() => toggleVehicleSelection(item.id)} />
            </TouchableOpacity>
        );
    };



    const statusColors = {
        online: {
            outer: appColors.primary,
            inner: appColors.primary,
            pulse1: appColors.primaryLight,
            pulse2: appColors.value,
            label: 'Online',
            icon: <Icons.DriverLarge />,
        },
        offline: {
            outer: appColors.brightRed,
            inner: appColors.vividRed,
            pulse1: appColors.darkCrimson,
            pulse2: appColors.roseTint,
            label: 'Offline',
            icon: <Icons.DriverLarge />,
        },
        onride: {
            outer: '#0567D1',
            inner: '#026BDD',
            pulse1: '#B0CDEC',
            pulse2: '#DDE7F2',
            label: 'On-Ride',
            icon: <Icons.DriverLarge />,
        }
    }
    const statuses = ["online", "offline", "onride"];

    // find the current status object
    const current = statusColors[status];

    // find the next status in the loop
    const currentIndex = statuses.indexOf(status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

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
            }
            const unit = zoneValue?.distance_type
            const zoneId = zoneValue?.id
            const driver_id = ''
            dispatch(dashBoardData({ unit, zoneId, driver_id }))
            dispatch(fleetDriverList());
        }, []),
    )



    useEffect(() => {
        const zone_id = zoneValue?.id
        if (zone_id) {
            const intervalId = setInterval(() => {
                dispatch(rideRequestDataGet(zone_id))
            }, 5000)
            return () => clearInterval(intervalId)
        }
    }, [dispatch, zoneValue])


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
                    console.error("❌ Error fetching driver status:", error);
                    setIsOnline(false);
                    stopLiveLocation();
                }
            };

            fetchOnlineStatus();
        }, [selfDriver?.id, selfDriver?.wallet_balance, translateData])
    );


    const toggleSwitch = () => {
        runOnlineAnimation();
        Vibration.vibrate(42);
        setStatus(prev => {
            if (prev === "online") return "offline";
            if (prev === "offline") return "onride";
            return "online"; // when prev === "onride"
        });
        SetOn(true)
    };

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

    const handleRefresh = () => {

    }


    const toggleHeader = () => {
        Vibration.vibrate(52)
        setViewMode(prev => (prev === 'amount' ? 'time' : 'amount'))
        fetchTime()
    }



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


    return (
        <View style={{ flex: 1 }}>
            <MapScreenFleet
                ref={mapRef}
                markerIcon={selfDriver?.vehicle_info?.vehicle_type_map_icon_url}
                selfDriver={selfDriver}
                zoneValue={zoneValue}
                driverIds={selfDriver?.driver_ids}
                status={status}
                selectedVehiclesId={selectedVehicles}
            />
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
                            {translateData.serviceNotDesc}
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
                    text={`${translateData.fleetData1} 💰.\n${translateData.fleetData2}\n${translateData.fleetData3}`}
                    borderRadius={12}
                    isTourGuide
                    style={{
                        flexDirection: rtl ? "row-reverse" : "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: on ? statusColors[status].inner : appColors.primary,
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
                                {statusColors[status]?.label}
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
                    text="Tap"
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
                    <Icons.Filter color={isDark ? appColors.white : appColors.black} />

                </TourGuideZone>
            </TouchableOpacity>
            <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        padding: windowHeight(2),
                        marginTop: windowHeight(14),
                    }}
                >
                    <View
                        style={{
                            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                            borderRadius: windowHeight(0.8),
                            maxHeight: windowHeight(40),
                            shadowColor: appColors.black,
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 6,
                            elevation: 8,
                            width: '90%',
                        }}
                    >
                        <FlatList
                            data={allVehicle}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderItem}
                            ItemSeparatorComponent={() => <View style={{
                                height: windowHeight(0.1),
                                backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
                            }} />}
                            removeClippedSubviews={true}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: windowHeight(1.8) }}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={{ color: appColors.red, fontFamily: appFonts.medium }}>{translateData.cancelTextT}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={{ color: appColors.primary, fontFamily: appFonts.medium }}>{translateData.apply}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <>
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
                        onPress={handleRefresh}
                        style={{
                            height: windowHeight(7),
                            width: windowHeight(7),
                            borderRadius: windowHeight(4),
                            backgroundColor: isDark
                                ? appColors.darkThemeSub
                                : appColors.white,
                            borderColor: isDark ? appColors.darkborder : appColors.border,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: windowHeight(0.15),
                            alignSelf: 'flex-end',
                        }}
                    >
                        <Icons.Refresh />
                    </TouchableOpacity>

                    <TourGuideZone
                        zone={2}
                        text="Tap"
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
                    text={translateData.tourOnline}
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
        </View>
    )
}