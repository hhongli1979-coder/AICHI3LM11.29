import React, { useEffect, useState } from "react";
import { BackHandler, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";
import { Header, TitleView } from "../../component";
import { ProgressBar } from "../component";
import appColors from "../../../../theme/appColors";
import { useValues } from "../../../../utils/context";
import { useIsFocused, useNavigation, useTheme } from "@react-navigation/native";
import { Button, Input, notificationHelper } from "../../../../commonComponents";
import { useDispatch, useSelector } from "react-redux";
import { fontSizes, windowHeight, windowWidth } from "../../../../theme/appConstant";
import appFonts from "../../../../theme/appFonts";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/main/types";
import messaging from '@react-native-firebase/messaging';
import { getValue, setValue } from "../../../../utils/localstorage";
import { doc, getFirestore, serverTimestamp, setDoc } from '@react-native-firebase/firestore'
import { selfFleetData } from "../../../../api/store/action";
import { URL } from "../../../../api/config";
import { AppDispatch } from "../../../../api/store";
import { initializeApp } from "@react-native-firebase/app";
import { firebaseConfig } from "../../../../../firebase";

type Navigation = NativeStackNavigationProp<RootStackParamList>

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function FleetDetails() {
    const { isDark, textRtlStyle, accountDetail, documentDetail, setToken } = useValues();
    const navigation = useNavigation<Navigation>()
    const [loading, setLoading] = useState<boolean>(false)
    const { colors } = useTheme();
    const [companyName, setCompanyName] = useState<string>('');
    const [companyEmail, setCompanyEmail] = useState<string>('');
    const [companyAddress, setCompanyAddress] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>()
    const [fcmToken, setFcmToken] = useState<string>('')
    const isFocused = useIsFocused();
    const [warnings, setWarnings] = useState<any>({
        companyName: false,
        companyEmail: false,
        companyAddress: false,
        city: false,
        postalCode: false
    });
    const { translateData } = useSelector((state: any) => state.setting);

    useEffect(() => {
        const fetchToken = async () => {
            let fcmToken = await getValue('fcmToken')
            if (fcmToken) {
                setFcmToken(fcmToken)
            }
        }
        fetchToken()
    }, [isFocused])

    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const handleRegister = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', accountDetail.username);
            formData.append('name', accountDetail.name);
            formData.append('email', accountDetail.email);
            formData.append('country_code', accountDetail.countryCode?.callingCode?.[0] || '');
            formData.append('phone', accountDetail.phoneNumber);
            formData.append('password', accountDetail.password);
            formData.append('password_confirmation', accountDetail.confirmPassword);
            formData.append('company_name', companyName);
            formData.append('company_email', companyEmail);
            formData.append('company_address', companyAddress);
            formData.append('city', city);
            formData.append('postal_code', postalCode);
            formData.append('fcm_token', fcmToken);

            Object.keys(documentDetail).forEach((key, index) => {
                const doc = documentDetail[key]?.file;
                const expiryDate = documentDetail[key]?.expiryDate;

                if (doc) {
                    formData.append(`documents[${index}][file]`, {
                        uri: doc.uri,
                        type: doc.type,
                        name: doc.name,
                    });

                    formData.append(`documents[${index}][slug]`, key);

                    if (expiryDate) {
                        formData.append(`documents[${index}][expired_at]`, expiryDate);
                    }
                }
            });

            const response = await fetch(`${URL}/api/fleet/register`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                },
            });
            const data = await response.json();


            if (data?.id) {
                await setValue('token', data.access_token);
                setToken(data.access_token);
                notificationHelper('', translateData.registerSuccessfully, 'success');
                await dispatch(selfFleetData());

                messaging()
                    .subscribeToTopic('driver')
                    .then(() => {
                    });
                await messaging().subscribeToTopic(`user_${data?.id}`);

                // Save to Firestore
                try {
                    const driverRef = doc(db, 'driverTrack', data?.id.toString());
                    await setDoc(driverRef, {
                        is_verified: data?.is_verified ?? "",
                        driver_name: data?.name ?? "",
                        vehicle_model: data?.model ?? "",
                        plate_number: data?.plate_number ?? "",
                        rating_count: data?.rating_count ?? "",
                        review_count: data?.review_count ?? "",
                        wallet_balance: data?.wallet_balance ?? "",
                        is_on_ride: "0",
                        updated_at: serverTimestamp(),
                    });

                } catch (fsError) {
                    console.error("❌ Firestore save error:", fsError);
                    notificationHelper("Firestore Error", fsError?.message, "error");
                }


                if (data?.is_verified == 1) {
                    navigation.replace('TabNav');
                } else if (data?.is_verified == 0) {
                    navigation.navigate('Verification');
                }
            } else {
                notificationHelper('', data?.message ?? translateData.somethingwentwrong, 'error');
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={{ flex: 1 }}>
            <Header backgroundColor={isDark ? colors.card : appColors.white} />
            <ProgressBar fill={2} />
            <ScrollView style={[styles.subView, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
                <View style={styles.space}>
                    <TitleView
                        title={translateData?.addCompanyDetailsTitle}
                        subTitle={translateData?.addCompanyDetailsSubTitle
                        }
                    />
                    <Input
                        title={translateData?.companyName}
                        titleShow={true}
                        placeholder={translateData?.companyNameEnter}
                        value={companyName}
                        onChangeText={(text) => {
                            setCompanyName(text);
                            setWarnings((prev: any) => ({
                                ...prev,
                                companyName: !text.trim()
                            }));
                        }}

                        warning={translateData?.companyNameError}
                        showWarning={warnings.companyName}
                        backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                        borderColor={colors.border}
                    />
                    <Input
                        title={translateData?.companyEmail}
                        titleShow={true}
                        placeholder={translateData?.companyEmailEnter}
                        value={companyEmail}
                        onChangeText={(text) => {
                            setCompanyEmail(text);
                            setWarnings((prev: any) => ({
                                ...prev,
                                companyEmail: !text.trim()
                            }));
                        }}

                        warning={translateData?.companyEmailError}
                        showWarning={warnings.companyEmail}
                        backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                        borderColor={colors.border}
                    />
                    <View style={{ marginTop: windowHeight(0.8) }}>
                        <Text style={{
                            marginBottom: windowHeight(1),
                            color: isDark ? appColors.white : appColors.primaryFont,
                            fontFamily: appFonts.medium,
                            textAlign: textRtlStyle,
                        }}>{translateData?.companyAddress}</Text>
                        <View style={{
                            borderRadius: windowHeight(0.8),
                            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                            borderColor: colors.border,
                            borderWidth: windowHeight(0.1),
                            height: windowHeight(10)
                        }}>
                            <TextInput
                                value={companyAddress}
                                onChangeText={(text) => {
                                    setCompanyAddress(text);
                                    setWarnings((prev: any) => ({
                                        ...prev,
                                        companyAddress: !text.trim()
                                    }));
                                }}

                                placeholder={translateData?.companyAddressEnter}
                                placeholderTextColor={isDark ? appColors.darkText : appColors.secondaryFont}
                                style={{
                                    color: isDark ? appColors.white : appColors.black,
                                    paddingHorizontal: windowWidth(4),
                                    fontFamily: appFonts.regular,
                                    fontSize: fontSizes.FONT4,
                                    overflow: 'hidden',
                                    top: windowHeight(0.6)
                                }}
                            />
                        </View>
                        {warnings.companyAddress &&
                            <Text style={{ color: appColors.red, marginTop: windowHeight(0.8), fontSize: fontSizes.FONT3 }}>
                                {translateData?.companyAddressError}
                            </Text>
                        }
                    </View>
                    <View style={{ marginTop: windowHeight(1.8) }}>
                        <Input
                            title={translateData?.city}
                            titleShow={true}
                            placeholder={translateData?.cityEnter}
                            value={city}
                            onChangeText={(text) => {
                                setCity(text);
                                setWarnings((prev: any) => ({
                                    ...prev,
                                    city: !text.trim()
                                }));
                            }}
                            warning={translateData?.cityError}
                            showWarning={warnings.city}
                            backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                            borderColor={colors.border}
                        />
                        <Input
                            title={translateData?.postalCode}
                            titleShow={true}
                            placeholder={translateData?.postalCodeEnter}
                            value={postalCode}
                            onChangeText={(text) => {
                                setPostalCode(text);
                                setWarnings((prev: any) => ({
                                    ...prev,
                                    postalCode: !text.trim()
                                }));
                            }}
                            warning={translateData?.postalCodeError}
                            showWarning={warnings.postalCode}
                            backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                            borderColor={colors.border}
                        />

                    </View>
                </View>
                <View style={styles.margin}>
                    <Button
                        title={translateData?.register}
                        backgroundColor={appColors.primary}
                        color={appColors.white}
                        onPress={handleRegister}
                        loading={loading}
                    />
                </View>
            </ScrollView>
        </View>
    );
}
