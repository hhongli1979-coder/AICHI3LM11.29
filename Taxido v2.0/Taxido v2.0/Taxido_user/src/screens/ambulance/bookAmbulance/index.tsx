import { View, Text, TextInput, TouchableOpacity, ScrollView, AppState, Alert } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Header, notificationHelper } from "@src/commonComponent";
import { appColors, windowHeight } from "@src/themes";
import { Ambulance, IdCard, PickLocation } from "@src/utils/icons";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@src/api/store";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ambulancebook, updateRideRequest } from "@src/api/store/actions";
import styles from "./styles";
import { useValues } from "@src/utils/context/index";;
import { clearValue } from "@src/utils/localstorage";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import firestore from '@react-native-firebase/firestore';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";


const TOTAL_TIME = 60;

export function BookAmbulance() {
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute();
    const { location, lat, lng }: any = route?.params;
    const [selectedId, setSelectedId] = useState<any>(null);
    const { ambulanceList } = useSelector((state: any) => state.ambulance);
    const [selectedAmbulance, setSelectedAmbulance] = useState<any>();
    const [waiting, setWaiting] = useState<boolean>(false);
    const { viewRTLStyle, isDark, textRTLStyle } = useValues()
    const { translateData } = useSelector((state: any) => state.setting);
    const { zoneValue } = useSelector((state: any) => state.zone);
    const navigation = useNavigation<any>()
    const [rideRequestId, setRideRequestId] = useState<number | string | null>();
    const [driverId, setDriverId] = useState<number | string | null>();
    const [cancelledManually, setCancelledManually] = useState<boolean>(false);
    const [remaining, setRemaining] = useState<any>(TOTAL_TIME);
    const [startTime, setStartTime] = useState<any>(Date.now());
    const appState = useRef<any>(AppState.currentState);
    const circularRef = useRef<any>();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { bgFullStyle } = useValues()


    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setWaiting(false);
    };

    const bookAmbulance = () => {
        setWaiting(true);
        ambulanceRef.current?.present();
        const payload = {
            service_id: 4,
            location_coordinates: [
                {
                    lat: lat,
                    lng: lng,
                }
            ],
            locations: [location],
            payment_method: "cash",
            select_type: "manual",
            ambulance_id: selectedAmbulance?.id,
            cucurrency_code: zoneValue?.currency_code,
        };

        dispatch(ambulancebook(payload))
            .unwrap()
            .then(async (res: any) => {
                if (res?.status === 403) {
                    notificationHelper('', translateData.loginAgain, 'error');
                    clearValue().then(() => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'SignIn' }],
                        });
                    });
                    return;
                }
                if (res?.status == 200) {

                    setRideRequestId(res?.data?.id)
                    setDriverId(res?.data?.drivers)
                    notificationHelper('', translateData.ambulancebooked, 'success');
                }
            })
            .catch((error: any) => {
                console.error('Booking failed:', error);
            });
    };


    useEffect(() => {
        if (!waiting) return;
        const now = Date.now();
        setStartTime(now);
        setRemaining(TOTAL_TIME);

        const interval = setInterval(() => {
            const currentTime = Date.now();
            const elapsed = Math.floor((currentTime - now) / 1000);
            const timeLeft = Math.max(0, TOTAL_TIME - elapsed);
            setRemaining(timeLeft);

            const fill = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;
            circularRef.current?.animate(fill, 500);

            if (timeLeft === 0) {
                clearInterval(interval);
                timerRef.current = null;
                handleCancelRide();
            }
        }, 1000);

        timerRef.current = interval;

        const sub = AppState.addEventListener('change', next => {
            if (appState.current.match(/inactive|background/) && next === 'active') {
                const resumedNow = Date.now();
                const elapsed = Math.floor((resumedNow - now) / 1000);
                const timeLeft = Math.max(0, TOTAL_TIME - elapsed);
                setRemaining(timeLeft);
                const fill = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;
                circularRef.current?.animate(fill, 500);

                if (timeLeft === 0) {
                    clearInterval(interval);
                    timerRef.current = null;
                    handleCancelRide();
                }
            }
            appState.current = next;
        });

        return () => {
            clearInterval(interval);
            timerRef.current = null;
            sub.remove();
        };
    }, [waiting]);


    const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
    const seconds = String(remaining % 60).padStart(2, '0');

    const handleCancelRide = async () => {
        clearTimer();
        dispatch(updateRideRequest({ payload: '', ride_id: rideRequestId }))
            .then((res: any) => {
            })
        setCancelledManually(true);
        ambulanceRef.current?.close();
        try {
            const rideRequestIdStr = rideRequestId?.toString();
            const driverIdStr = driverId?.toString();
            if (!rideRequestIdStr || !driverIdStr) return;
            setWaiting(false);
            ambulanceRef.current?.close();
        } catch (error) {
            console.error('Error deleting ride request:', error);
            setWaiting(false);
            ambulanceRef.current?.close();
        }
    };


    useEffect(() => {
        if (!rideRequestId) return;
        const unsubscribe = firestore()
            .collection('ride_requests')
            .doc(rideRequestId.toString())
            .collection('ambulance_requests')
            .doc(rideRequestId.toString())
            .onSnapshot(async docSnapshot => {
                if (!docSnapshot.exists) return;
                const data = docSnapshot.data(); if (data?.status == 'canceled') {
                    setWaiting(false);
                    ambulanceRef.current?.close();
                    notificationHelper('', translateData.ambulanceRejected, 'error');

                } else if (data?.status == 'accepted') {
                    clearTimer();
                    const rideDoc = await firestore()
                        .collection('rides')
                        .doc(data?.ride_id.toString())
                        .get();

                    const rideData = rideDoc.exists ? rideDoc.data() : null;
                    setWaiting(false);
                    ambulanceRef.current?.close();
                    notificationHelper('', translateData.ambulanceAccepted, 'success');
                    await navigation.navigate('PaymentMethod', { rideData: rideData });
                }
            }, error => {
                console.error('Firestore listener error:', error);
            });
        return () => unsubscribe();
    }, [rideRequestId]);

    const ambulanceRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["35%"], []);

    return (
        <View style={styles.mainView}>
            <View style={styles.mainView}>
                <Header value={translateData.bookAmbulance} />
                <ScrollView style={{ backgroundColor: isDark ? appColors.primaryText : appColors.lightGray }}>
                    <View style={[styles.mainContainer, { flexDirection: viewRTLStyle, backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
                        <View>
                            <PickLocation />
                        </View>
                        <View style={styles.pickUpView}>
                            <Text style={[styles.pickUp, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}>
                                {translateData.pickupLocation}
                            </Text>
                            <Text style={[styles.locationText, { textAlign: textRTLStyle }]}>
                                {location?.length > 75 ? location.substring(0, 75) + "..." : location}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.description, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}>
                        {translateData.additionalDescription}
                    </Text>
                    <View style={[styles.ambulanceView, { flexDirection: viewRTLStyle, backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
                        <View style={styles.idCard}>
                            <IdCard />
                        </View>
                        <View>
                            <TextInput
                                style={[styles.textInput, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border, textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                                multiline
                                numberOfLines={5}
                                placeholder={translateData.writePlaceholder}
                                placeholderTextColor={appColors.gray}
                            />
                        </View>
                    </View>
                    <Text style={[styles.ambulanceText, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}>
                        {translateData.selectAmbulance}
                    </Text>

                    <FlatList
                        data={ambulanceList?.data}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        renderItem={({ item }) => {
                            const isSelected = selectedId === item.id;
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedId(item.id);
                                        setSelectedAmbulance(item);
                                    }}
                                    style={[styles.container, {
                                        backgroundColor: isSelected
                                            ? (isDark ? appColors.darkPrimary : appColors.lightButton)
                                            : (isDark ? appColors.darkPrimary : appColors.whiteColor)
                                        , borderColor: isSelected ? appColors.price : (isDark ? appColors.darkBorder : appColors.border),
                                    }, { flexDirection: viewRTLStyle }]}>
                                    <View
                                        style={[styles.bottomView]}
                                    >
                                        <Ambulance />
                                    </View>
                                    <View
                                        style={styles.textView}>
                                        <Text
                                            style={[styles.itemText, { color: isDark ? appColors.whiteColor : appColors.primaryText, textAlign: textRTLStyle }]}
                                        >
                                            {item.name}
                                        </Text>
                                        <Text
                                            style={[styles.text, { textAlign: textRTLStyle }]}>
                                            {translateData.emergencySupport}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        removeClippedSubviews={true}
                    />
                </ScrollView>

                <View style={styles.btn}>
                    <Button
                        title={translateData.bookAmbulance}
                        onPress={selectedAmbulance ? bookAmbulance : undefined}
                        backgroundColor={selectedAmbulance ? appColors.primary : appColors.gray}
                    />
                </View>

            </View>

            <BottomSheetModalProvider>
                <BottomSheetModal
                    ref={ambulanceRef}
                    index={1}
                    enablePanDownToClose
                    handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
                    snapPoints={snapPoints}
                    backdropComponent={(props) => <BottomSheetBackdrop {...props} pressBehavior="close" />}
                    backgroundStyle={{ backgroundColor: bgFullStyle }}
                >
                    <BottomSheetView style={{ padding: windowHeight(15) }}>
                        <View style={styles.modelView}>
                            <AnimatedCircularProgress
                                ref={circularRef}
                                size={120}
                                width={10}
                                fill={0}
                                tintColor={appColors.primary}
                                backgroundColor={appColors.loaderBackground}
                                rotation={0}
                                lineCap="round"
                            >
                                {() => (
                                    <Text style={styles.timerText}>
                                        {minutes}:{seconds}
                                    </Text>
                                )}
                            </AnimatedCircularProgress>
                            <Text style={styles.ambulanceApprovalText}>{translateData.ambulanceApproval}</Text>
                            <Button title={translateData?.cancel} backgroundColor={appColors.alertRed} textColor={appColors.whiteColor} onPress={handleCancelRide} />
                        </View>
                    </BottomSheetView>
                </BottomSheetModal>
            </BottomSheetModalProvider>
        </View>

    );
}
