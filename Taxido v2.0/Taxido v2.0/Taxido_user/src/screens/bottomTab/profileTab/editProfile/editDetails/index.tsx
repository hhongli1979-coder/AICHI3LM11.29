import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useRef, useCallback } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from '../style';
import { Button, Header, InputText, notificationHelper } from '@src/commonComponent';
import { useValues } from '@src/utils/context';
import { useDispatch, useSelector } from 'react-redux';
import { appColors, windowWidth, windowHeight, appFonts } from '@src/themes';
import { commonStyles } from '@src/styles/commonStyle';
import CountrySelect from 'react-native-country-select';
import { ICountry } from 'react-native-country-select/lib/interface/country';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import OTPTextInput from 'react-native-otp-textinput';
import { selfData, updateMobileEmail, verifyMobileEmail } from '@src/api/store/actions';
import { UpdateProfileInterface } from '@src/api/interface/accountInterface';

export function EditDetails() {
    const route = useRoute();
    const navigation = useNavigation();
    const { field } = route.params as { field: string };
    const { isDark, viewRTLStyle, isRTL } = useValues();
    const { translateData } = useSelector((state: any) => state.setting);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
    const [countryPickerVisible, setCountryPickerVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSheetOpen, setIsOtpSheetOpen] = useState(false);
    const dispatch = useDispatch();
    const otpBottomSheetRef = useRef<BottomSheetModal>(null);
    const otpInputRef = useRef<OTPTextInput>(null);

    const getPrimaryCallingCode = useCallback((country: ICountry | null): string => {
        if (!country) return '+1';
        const root = country.idd?.root || '+';
        const suffix = country.idd?.suffixes?.[0] || '';
        return root + suffix;
    }, []);

    const handleCountrySelect = useCallback((country: ICountry) => {
        setSelectedCountry(country);
        setCountryPickerVisible(false);
    }, []);

    const handleVerify = useCallback(() => {
        const payload: UpdateProfileInterface = {
            email: email,
            phone: phoneNumber,
            country_code: (selectedCountry?.idd?.root || '1').replace('+', ''),
        };

        dispatch(updateMobileEmail(payload) as any)
            .unwrap()
            .then((res: any) => {
                dispatch(selfData());
            })
            .catch(() => {});

        setIsOtpSheetOpen(true);
        otpBottomSheetRef.current?.present();
    }, [email, phoneNumber, selectedCountry, dispatch]);

    const handleOtpVerify = useCallback(() => {
        const payload: UpdateProfileInterface = {
            token: otp,
            email_or_phone: phoneNumber || email,
            country_code: (selectedCountry?.idd?.root || '1').replace('+', ''),
        };

        dispatch(verifyMobileEmail(payload) as any)
            .unwrap()
            .then((res: any) => {
                if (res?.status == 200) {
                    navigation.goBack();
                }
            })
            .catch(() => {
                notificationHelper("", translateData.somethingWrong, "error")
            });

        otpBottomSheetRef.current?.close();
        setIsOtpSheetOpen(false);
    }, [navigation, otp, phoneNumber, email, dispatch]);

    const handleOpenCountryPicker = useCallback(() => {
        setCountryPickerVisible(true);
    }, []);

    const handleCloseCountryPicker = useCallback(() => {
        setCountryPickerVisible(false);
    }, []);

    const formatPhoneNumber = useCallback((): string => {
        if (!selectedCountry) return '+1';
        return getPrimaryCallingCode(selectedCountry);
    }, [selectedCountry, getPrimaryCallingCode]);

    return (
        <BottomSheetModalProvider>
            <View style={{ flex: 1, backgroundColor: isDark ? appColors.darkHeader : appColors.lightGray }}>
                <Header value={field === 'mobile' ? translateData?.mobileNumber : translateData?.email} />
                <View style={{ paddingHorizontal: windowWidth(20), backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor, marginTop: windowHeight(20), borderWidth: 1, borderColor: isDark ? appColors.darkBorder : appColors.border, borderRadius: windowHeight(8), marginHorizontal: windowWidth(18) }}>
                    <Text style={{
                        fontWeight: 'bold',
                        marginBottom: windowHeight(10),
                        color: isDark ? appColors.whiteColor : appColors.blackColor
                    }}>
                        {field === 'mobile' ? translateData.updatePhoneNumber : translateData.updateEmail}
                    </Text>

                    {field === 'mobile' ? (
                        <View>
                            <Text style={{
                                color: isDark ? appColors.whiteColor : appColors.primaryText,
                                marginBottom: windowHeight(8),
                            }}>
                                {translateData.mobileNumber}
                            </Text>
                            <View>
                                <View style={{ flexDirection: viewRTLStyle }}>
                                    <TouchableOpacity
                                        style={[
                                            styles.countryCodeContainer,
                                            {
                                                backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray,
                                                borderColor: isDark ? appColors.darkBorder : appColors.border,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            },
                                        ]}
                                        onPress={handleOpenCountryPicker}
                                        disabled={isOtpSheetOpen}
                                    >
                                        <Text
                                            style={[
                                                styles.codeText,
                                                {
                                                    color: isDark ? appColors.whiteColor : appColors.regularText,
                                                },
                                            ]}
                                        >
                                            {formatPhoneNumber()}
                                        </Text>
                                    </TouchableOpacity>

                                    <View
                                        style={[
                                            styles.phoneNumberInput,
                                            {
                                                width: "71%",
                                                backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray,
                                                borderColor: isDark ? appColors.darkBorder : appColors.border,
                                            },
                                        ]}
                                    >
                                        <TextInput
                                            editable={!isOtpSheetOpen}
                                            style={[
                                                commonStyles.regularText,
                                                {
                                                    left: isRTL ? windowWidth(145) : windowWidth(13),
                                                    color: isDark ? appColors.whiteColor : appColors.regularText,
                                                    width: windowWidth(250),
                                                },
                                            ]}
                                            placeholderTextColor={isDark ? appColors.darkText : appColors.regularText}
                                            placeholder={translateData.enterPhone}
                                            keyboardType="phone-pad"
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={{ marginTop: windowHeight(-15) }}>
                            <InputText
                                title={'New Email ID'}
                                showTitle={true}
                                editable={!isOtpSheetOpen}
                                borderColor={isDark ? appColors.darkBorder : appColors.lightGray}
                                backgroundColor={isDark ? appColors.darkPrimary : appColors.lightGray}
                                placeholder={'enter your new email id'}
                                placeholderTextColor={
                                    isDark ? appColors.darkText : appColors.regularText
                                }
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    )}

                    <View style={{ marginTop: windowHeight(30), marginBottom: windowHeight(15) }}>
                        <Button title={translateData.verify} onPress={handleVerify} />
                    </View>

                    {countryPickerVisible && (
                        <CountrySelect
                            visible={true}
                            onClose={handleCloseCountryPicker}
                            onSelect={handleCountrySelect}
                            theme={isDark ? 'dark' : 'light'}
                            showAlphabetFilter={true}
                            showSearchInput={true}
                        />
                    )}
                    <BottomSheetModal
                        ref={otpBottomSheetRef}
                        snapPoints={['40%']}
                        onChange={(index) => {
                            if (index === -1) setIsOtpSheetOpen(false);
                        }}
                        handleIndicatorStyle={{
                            backgroundColor: appColors.primary,
                            width: '13%'
                        }}
                        backgroundStyle={{
                            backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor
                        }}
                    >
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS === "ios" ? "padding" : undefined}
                        >
                            <BottomSheetView style={{
                                padding: windowWidth(20),
                                flex: 1
                            }}>

                                <Text
                                    style={{
                                        color: isDark ? appColors.whiteColor : appColors.primaryText,
                                        marginBottom: windowHeight(10),
                                        fontFamily: appFonts.regular,
                                    }}
                                >
                                    {translateData.otpSendTo}{' '}
                                    {field === 'mobile' ? phoneNumber : email}
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    marginBottom: windowHeight(30)
                                }}>
                                    <OTPTextInput
                                        ref={otpInputRef}
                                        inputCount={6}
                                        handleTextChange={(value) => {
                                            setOtp(value);
                                        }}
                                        textInputStyle={{
                                            width: windowHeight(40),
                                            height: windowHeight(40),
                                            borderWidth: 1.5,
                                            borderColor: isDark ? appColors.darkBorder : appColors.border,
                                            borderRadius: windowHeight(8),
                                            backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray,
                                            color: isDark ? appColors.whiteColor : appColors.primaryText,
                                            borderBottomWidth:1.5
                                        }}
                                        keyboardType="numeric"
                                        tintColor={appColors.primary}
                                        offTintColor={isDark ? appColors.darkBorder : appColors.lightGray}
                                        defaultValue={otp}
                                    />
                                </View>
                                <Button title={translateData.verify} onPress={handleOtpVerify} />
                            </BottomSheetView>
                        </KeyboardAvoidingView>
                    </BottomSheetModal>
                </View>
            </View>
        </BottomSheetModalProvider>
    )
}
