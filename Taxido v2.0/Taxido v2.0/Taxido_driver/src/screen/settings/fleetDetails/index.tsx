import React, { useEffect, useState } from "react";
import { BackHandler, ScrollView, Text, TextInput, View } from "react-native";
import styles from "./styles";
import { useIsFocused, useNavigation, useTheme } from "@react-navigation/native";
import { initializeApp } from "@react-native-firebase/app";
import { getFirestore } from "@react-native-firebase/firestore";
import { firebaseConfig } from "../../../../firebase";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/main/types";
import { useValues } from "../../../utils/context";
import { AppDispatch } from "../../../api/store";
import { useDispatch, useSelector } from "react-redux";
import { getValue } from "../../../utils/localstorage";
import { Header, Input } from "../../../commonComponents";
import appColors from "../../../theme/appColors";
import { fontSizes, windowHeight, windowWidth } from "../../../theme/appConstant";
import appFonts from "../../../theme/appFonts";

type Navigation = NativeStackNavigationProp<RootStackParamList>

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function CompanyDetails() {
    const { isDark, textRtlStyle, accountDetail, documentDetail, setToken } = useValues();
    const navigation = useNavigation<Navigation>()
    const [loading, setLoading] = useState<boolean>(false)
    const { colors } = useTheme();
    const [companyName, setCompanyName] = useState<string>('');
    const [companyEmail, setCompanyEmail] = useState<string>('');
    const [companyAddress, setCompanyAddress] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>('');
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

    const { selfDriver } = useSelector((state: any) => state.account)


    return (
        <View style={{ flex: 1 }}>
            <Header backgroundColor={isDark ? colors.card : appColors.white} title={translateData.companyDetails || "Company Details"} />
            <ScrollView style={[styles.subView, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
                <View style={styles.space}>
                    <Input
                        title={translateData?.companyName}
                        titleShow={true}
                        placeholder={translateData?.companyNameEnter}
                        value={selfDriver?.company_address?.company_name}
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
                        editable={false}

                    />
                    <Input
                        title={translateData?.companyEmail}
                        titleShow={true}
                        placeholder={translateData?.companyEmailEnter}
                        value={selfDriver?.company_address?.company_email}
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
                        editable={false}

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
                                value={selfDriver?.company_address?.company_address}
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
                                    paddingHorizontal: windowWidth(4),
                                    fontFamily: appFonts.regular,
                                    fontSize: fontSizes.FONT4,
                                    overflow: 'hidden',
                                    top: windowHeight(0.6),
                                    color: appColors.secondaryFont
                                }}
                                editable={false}

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
                            value={selfDriver?.company_address?.city}
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
                            editable={false}

                        />
                        <Input
                            title={translateData?.postalCode}
                            titleShow={true}
                            placeholder={translateData?.postalCodeEnter}
                            value={selfDriver?.company_address?.postal_code}
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
                            editable={false}
                        />

                    </View>
                </View>
                <View style={styles.margin}>
                </View>
            </ScrollView>
        </View>
    );
}
