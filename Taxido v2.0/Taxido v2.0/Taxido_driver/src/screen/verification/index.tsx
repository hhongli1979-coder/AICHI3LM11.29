import React, { useCallback, useEffect, useRef } from "react";
import { BackHandler, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Icons from "../../utils/icons/icons";
import appColors from "../../theme/appColors";
import Images from "../../utils/images/images";
import { useValues } from "../../utils/context";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import { Button } from "../../commonComponents";
import { fontSizes, windowHeight } from "../../theme/appConstant";
import appFonts from "../../theme/appFonts";
import { selfDriverData } from "../../api/store/action";
import { useFocusEffect, useIsFocused, useNavigation, useTheme } from "@react-navigation/native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { firebaseConfig } from "../../../firebase";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, getDoc } from "firebase/firestore";
import { AppDispatch } from "../../api/store";
import { useAppNavigation } from "../../utils/navigation";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function Verification() {
    const { selfDriver } = useSelector((state: any) => state.account);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useAppNavigation();
    const { translateData } = useSelector((state: any) => state.setting);
    const retryTimeoutRef = useRef<any>(null);
    const listenerRef = useRef<any>(null);
    const bottomSheetRef = useRef<any>(null);

    const { viewRtlStyle, isDark } = useValues();
    const { colors } = useTheme();

    const isFocused = useIsFocused();

    useFocusEffect(
        useCallback(() => {
            dispatch(selfDriverData());
        }, [dispatch])
    );

    useEffect(() => {
        const waitForSelfId = async () => {
            if (!selfDriver?.id) {
                retryTimeoutRef.current = setTimeout(waitForSelfId, 500);
                return;
            }
            clearTimeout(retryTimeoutRef.current);

            const docRef = doc(db, "driverTrack", selfDriver.id.toString());

            try {
                const serverDoc = await getDoc(docRef, { source: "server" });
                if (serverDoc.exists()) {
                    const data = serverDoc.data();
                    if (data?.is_verified == 1) {
                        navigation.reset({ index: 0, routes: [{ name: "TabNav" }] });
                    }
                }
            } catch (err) {
            }

            listenerRef.current = onSnapshot(
                docRef,
                (snapshot) => {
                    if (!snapshot.exists()) return;
                    const data = snapshot.data();

                    if (data?.is_verified == 1) {
                        navigation.reset({ index: 0, routes: [{ name: "TabNav" }] });
                    }
                },
                (error) => {
                }
            );
        };

        waitForSelfId();

        return () => {
            clearTimeout(retryTimeoutRef.current);
            if (listenerRef.current) {
                listenerRef.current();
                listenerRef.current = null;
            }
        };
    }, [selfDriver?.id]);

    useEffect(() => {
        const backAction = () => {
            bottomSheetRef.current?.expand();
            return true;
        };

        if (isFocused) {
            const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => backHandler.remove();
        }
    }, [isFocused]);

    const handleExit = () => {
        BackHandler.exitApp();
        bottomSheetRef.current?.close();
    };

    const handleCancel = () => {
        bottomSheetRef.current?.close();
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop {...props} pressBehavior="close" appearsOnIndex={0} disappearsOnIndex={-1} />
        ),
        []
    );

    const gotoDocUpdate = () => {
        navigation.navigate("DocumentDetail", { NavValue: 1 });
    };

    const hasRejectedDocument = Array.isArray(selfDriver?.documents)
        ? selfDriver.documents.some((doc: any) => doc?.status === "rejected")
        : false;



    return (
        <View style={{ height: "100%" }}>
            <View style={{ height: "10%", backgroundColor: colors.card, width: "100%" }}>
                <Text
                    style={{
                        top: windowHeight(3.8),
                        justifyContent: "center",
                        textAlign: "center",
                        fontSize: fontSizes.FONT5,
                        fontFamily: appFonts.medium,
                        color: colors.text,
                    }}
                >
                    {translateData.verification}
                </Text>
            </View>

            <View style={[styles.main, { backgroundColor: isDark ? appColors.bgDark : appColors.graybackground }]}>
                <Image source={Images.verification} resizeMode="contain" style={styles.image} />
                <View style={[styles.container, { flexDirection: viewRtlStyle }]}>
                    <Text style={[styles.title, { color: isDark ? appColors.white : appColors.primaryFont }]}>
                        {translateData.verificationProcess}
                    </Text>
                    <Icons.Info />
                </View>
                <Text style={[styles.text, { color: isDark ? appColors.darkText : appColors.darkBorderBlack }]}>
                    {translateData.verificationNote}
                </Text>

                <View style={[styles.btn, { marginBottom: windowHeight(2) }]}>
                    <Button
                        title={translateData.chatwithstaf}
                        backgroundColor={appColors.primary}
                        color={appColors.white}
                        onPress={() =>
                            navigation.navigate("Chat", {
                                driverId: selfDriver?.id,
                                from: "help",
                                riderName: selfDriver?.name,
                            })
                        }
                    />
                </View>

                {hasRejectedDocument && (
                    <View style={styles.btn}>
                        <Button title={translateData.updateDocument} backgroundColor={appColors.primary} color={appColors.white} onPress={gotoDocUpdate} />
                    </View>
                )}
            </View>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={["20%"]}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                handleIndicatorStyle={{ backgroundColor: appColors.primary, width: "13%" }}
            >
                <BottomSheetView style={{ paddingHorizontal: windowHeight(2) }}>
                    <TouchableWithoutFeedback>
                        <TouchableOpacity style={[styles.modalContainer, { backgroundColor: colors.card }]} activeOpacity={1}>
                            <Text style={[styles.modalTitle, { color: isDark ? appColors.white : appColors.primaryFont }]}>
                                {translateData.exitMsg}
                            </Text>
                            <View style={[styles.buttonContainer, { flexDirection: viewRtlStyle }]}>
                                <TouchableOpacity
                                    style={[styles.button, { backgroundColor: isDark ? colors.background : appColors.graybackground }]}
                                    onPress={handleExit}
                                >
                                    <Text style={[styles.buttonText, { color: isDark ? appColors.white : appColors.primaryFont }]}>
                                        {translateData.exit}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                                    <Text style={styles.buttonText}>{translateData.cancel}</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </TouchableWithoutFeedback>
                </BottomSheetView>
            </BottomSheet>
        </View>
    );
}
