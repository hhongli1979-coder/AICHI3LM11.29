import React, { useEffect, useState } from "react";
import { BackHandler, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AuthContainer } from "../../../components/authComponents/authContainer/index";
import { InputText, Button, notificationHelper } from "@src/commonComponent";
import { AuthText } from "../../../components/authComponents/authText/index";
import { external } from "../../../styles/externalStyle";
import { appColors, fontSizes, windowHeight } from "@src/themes";
import { useValues } from '@src/utils/context/index';
import { EyeClose, EyeOpen } from "@utils/icons";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { countryData, selfData, userRegistration } from "@src/api/store/actions";
import { setValue } from "@src/utils/localstorage";
import { useAppNavigation, useAppRoute } from "@src/utils/navigation";
import { commonStyles } from "@src/styles/commonStyle";
import CountryPicker from 'react-native-country-picker-modal';
import { ValidatePhoneNumber } from "@src/utils/validation";
import messaging from '@react-native-firebase/messaging';
import { useNavigation, useTheme } from "@react-navigation/native";
import { CountryCodeType } from "./type";
import { AppDispatch } from "@src/api/store";
import { UserRegistrationPayload } from "@src/api/interface/authInterface";
import DropDownPicker from "react-native-dropdown-picker";

export function SignUp() {
  const { isDark, textRTLStyle, setToken, viewRTLStyle, isRTL } = useValues();
  const [isEmailUser, setIsEmailUser] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const route = useAppRoute();
  const usercredential = route?.params?.phoneNumber ?? "1234567890";
  const rawCode = route.params?.countryCode ?? "91";
  const cleanCode = rawCode.replace('+', '');
  const [countryCode, setCountryCode] = useState<CountryCodeType>({
    callingCode: [cleanCode],
    cca2: route?.params?.cca2 ?? 'US',
  });
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [referral, setReferral] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
  const [userNameError, setUserNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [numberError, setNumberError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean | string>(false);
  const [fcmToken, setFcmToken] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [success, setSuccess] = useState<boolean>(false);
  const { replace } = useAppNavigation();
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const { countryList } = useSelector((state: any) => state.account)
  const [open, setOpen] = useState(false)
  const [value, setValue1] = useState<string | null>("")
  const [items, setItems] = useState<any[]>([])
  const [countryError, setCountryError] = useState<string>('');


  useEffect(() => {
    dispatch(countryData());
  }, [])

  useEffect(() => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const isEmail = emailRegex.test(usercredential.trim());
    setIsEmailUser(isEmail);
    if (isEmail) {
      setEmail(usercredential.trim());
    } else {
      setPhoneNumber(usercredential.trim());
    }
  }, [usercredential]);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await AsyncStorage.getItem("fcmToken");
      setFcmToken(token || "");
    };
    fetchToken();
  }, [dispatch]);

  const handleRegister = () => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    let isValid = true;
    if (!value) {
      setCountryError(translateData.selectCountryError || "Please select a country");
      isValid = false;
    } else {
      setCountryError("");
    }
    if (!userName.trim()) {
      setUserNameError(true);
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError(true);
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (phoneNumber) {
      const errorMsg = ValidatePhoneNumber(phoneNumber, (key: number) => translateData[key]);
      setNumberError(errorMsg);
      if (errorMsg) {
        isValid = false;
      }
    } else {
      setNumberError(translateData.validNo);
      isValid = false;
    }

    if (!password) {
      setPasswordError(translateData.errorPassword);
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError(translateData.passwordDigit);
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError(translateData.confirmPasswordErrorrrrrr);
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(translateData.passwordErrorrrrr);
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!isValid) {
      return;
    }
    setLoading(true)
    const payload: UserRegistrationPayload = {
      username: userName,
      name: userName,
      email: email,
      country_code: countryCode.callingCode[0],
      phone: phoneNumber,
      fcm_token: fcmToken,
      password: password,
      password_confirmation: confirmPassword,
      referral_code: referral,
    };


    dispatch(userRegistration(payload))
      .unwrap()
      .then((res) => {
        if (res?.success) {
          if (res?.access_token) {
            setValue('token', res?.access_token);
            dispatch(selfData());
            messaging()
              .subscribeToTopic(`user_${res?.id}`)
              .then(() => {
              });
            replace("MyTabs");
          }

          setValue("token", res.access_token);
          setToken(res.access_token);
          setSuccess(false);
          setLoading(false)
        } else {
          setSuccess(false);
          notificationHelper('', res.message, 'error')
          setLoading(false);
        }
      })
      .finally(() => setLoading(false));
  };


  const [visible, setVisible] = useState(false);
  const onSelect = (country: any) => {
    setCountryCode(country);
    setVisible(false);
  };

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

  useEffect(() => {
    const formatted = countryList?.data?.data?.map((item: any) => ({
      label: `${item?.name}`,
      value: item?.name,
    }));
    setItems(formatted);
  }, [countryList]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={external.main}>
        <AuthContainer
          imageShow={false}
          topSpace={windowHeight(100)}
          container={
            <View>
              <AuthText
                title={translateData.createAccount}
                subtitle={translateData.registerContent}
              />
              <View>
                <InputText
                  showTitle={true}
                  title={translateData.nameeee}
                  borderColor={isDark ? appColors.bgDark : appColors.lightGray}
                  placeholder={translateData.enterYourNameeeeeeeee}
                  placeholderTextColor={
                    isDark ? appColors.darkText : appColors.regularText
                  }
                  customColor={
                    isDark ? appColors.whiteColor : appColors.blackColor
                  }
                  backgroundColor={
                    isDark ? appColors.bgDark : appColors.lightGray
                  }
                  show
                  value={userName}
                  onChangeText={(text) => {
                    setUserName(text);
                    setUserNameError(!text.trim());
                  }}
                  warningText={
                    userNameError ? `${translateData.enteryourNameeErrorrrr}` : ""
                  }
                />

                <Text style={[styles.numberTitle, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}>
                  {translateData.mobileNumber}
                </Text>
                <View style={styles.countryCodeContainer}>

                  <View>
                    <View
                      style={[
                        external.fd_row,
                        external.ai_center,
                        external.mt_5,
                        { flexDirection: viewRTLStyle },
                      ]}
                    >
                      <View
                        style={[
                          styles.countryCodeContainer1,
                          {
                            borderColor: isDark ? appColors.bgDark : appColors.lightGray,
                            alignItems: 'center',
                            backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor
                          },
                        ]}
                      >

                        <View>
                          <TouchableOpacity style={styles.pickerButton} onPress={() => {
                            if (isEmailUser) {
                              setVisible(true);
                            }
                            else {
                              setVisible(false)
                            }
                          }}>
                            <CountryPicker
                              countryCode={countryCode.cca2}
                              withFilter={true}
                              withFlag={true}
                              withCallingCode={true}
                              withAlphaFilter={true}
                              withEmoji={true}
                              onSelect={onSelect}
                              visible={visible}
                              onClose={() => setVisible(false)}
                              withFlagButton={false}
                            />

                            <Text style={[styles.codeText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>
                              +{countryCode.callingCode[0]}
                            </Text>
                          </TouchableOpacity>
                        </View>

                      </View>
                      <View
                        style={[
                          styles.phoneNumberInput,
                          {
                            width: "74%",
                            backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
                            flexDirection: viewRTLStyle,
                            borderColor: isDark ? appColors.bgDark : appColors.lightGray,
                          },
                        ]}
                      >
                        <TextInput
                          style={[[commonStyles.regularText, { color: isDark ? appColors.whiteColor : appColors.blackColor }], [styles.inputText, { textAlign: textRTLStyle }]]}
                          placeholderTextColor={isDark ? appColors.darkText : appColors.regularText}
                          placeholder={translateData.enterPhone}
                          keyboardType="number-pad"
                          editable={isEmailUser}
                          value={phoneNumber}

                          onChangeText={(text) => {
                            const numericText = text.replace(/[^0-9]/g, "");
                            setPhoneNumber(numericText);
                          }}

                        />
                      </View>
                    </View>
                    {numberError && (
                      <Text style={styles.warningText}>
                        {translateData.validNo}
                      </Text>
                    )}
                  </View>
                </View>


                <Text style={[styles.numberTitle, { marginBottom: windowHeight(5) }, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}>
                  {translateData.countryTitle}
                </Text>


                <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue1}
                  setItems={setItems}
                  placeholder={'Select Country'}
                  containerStyle={styles.container}
                  placeholderStyle={[
                    styles.placeholderStyles,
                    { color: isDark ? appColors.darkText : appColors.regularText },
                  ]}
                  style={{
                    backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
                    borderColor: isDark ? appColors.bgDark : appColors.lightGray,
                    flexDirection: viewRTLStyle,
                    paddingHorizontal: windowHeight(15),
                    marginTop: windowHeight(15),
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor,
                    borderColor: isDark ? appColors.darkBorder : appColors.border,
                    paddingVertical: windowHeight(5),
                    marginTop: windowHeight(5)
                  }}
                  textStyle={{
                    textAlign: isRTL ? 'right' : 'left',
                    fontSize: fontSizes.FONT14,
                    color: isDark ? appColors.whiteColor : appColors.blackColor,
                  }}
                  listItemLabelStyle={{
                    fontSize: fontSizes.FONT15,
                    color: isDark ? appColors.whiteColor : appColors.blackColor,
                  }}
                  tickIconStyle={{
                    tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                  }}
                  arrowIconStyle={{
                    tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                  }}
                  scrollViewProps={{
                    showsVerticalScrollIndicator: false,
                    nestedScrollEnabled: true,
                  }}

                  zIndex={2}
                  listMode="SCROLLVIEW"
                  dropDownDirection="AUTO"
                />

                {countryError !== '' && (
                  <Text style={[styles.errorText, { textAlign: textRTLStyle }]}>
                    {countryError}
                  </Text>
                )}

                <View style={styles.emailView}>
                  <InputText
                    showTitle={true}
                    title={translateData.email}
                    placeholder={translateData.enterEmail}
                    borderColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    customColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    placeholderTextColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    backgroundColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    keyboard={"email-address"}
                    autoCapitalize="none"
                    editable={!isEmailUser}
                    show
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                    }}
                    warningText={
                      emailError ? `${translateData.enterEmailIdddd}` : ""
                    }
                  />
                </View>
                <View style={styles.passwordView}>
                  <InputText
                    showTitle={true}
                    title={translateData.password}
                    placeholder={translateData.enterPassword}
                    borderColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    customColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    placeholderTextColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    backgroundColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    show
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                    }}
                    rightIcon={
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={{ paddingHorizontal: windowHeight(0) }}
                      >
                        {isPasswordVisible ? <EyeOpen /> : <EyeClose />}
                      </TouchableOpacity>
                    }
                    secureText={!isPasswordVisible}
                    warningText={passwordError}
                  />
                </View>
                <View style={styles.confirmPasswordView}>
                  <InputText
                    showTitle={true}
                    title={translateData.confirmPassword}
                    placeholder={translateData.enterConfirmPassword}
                    borderColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    customColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    placeholderTextColor={
                      isDark ? appColors.darkText : appColors.regularText
                    }
                    backgroundColor={
                      isDark ? appColors.bgDark : appColors.lightGray
                    }
                    show
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);

                    }} rightIcon={
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() =>
                          setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                        }
                        style={{ paddingHorizontal: windowHeight(0) }}
                      >
                        {isConfirmPasswordVisible ? <EyeOpen /> : <EyeClose />}
                      </TouchableOpacity>
                    }
                    secureText={!isConfirmPasswordVisible}
                    warningText={confirmPasswordError}
                  />
                </View>

                {taxidoSettingData?.taxido_values?.activation?.referral_enable == 1 && (
                  <View style={styles.referral}>
                    <InputText
                      showTitle={true}
                      title={translateData?.referralid}
                      placeholder={translateData?.referralidenter}
                      borderColor={
                        isDark ? appColors.bgDark : appColors.lightGray
                      }
                      customColor={
                        isDark ? appColors.darkText : appColors.regularText
                      }
                      placeholderTextColor={
                        isDark ? appColors.darkText : appColors.regularText
                      }
                      backgroundColor={
                        isDark ? appColors.bgDark : appColors.lightGray
                      }
                      keyboard={"email-address"}
                      autoCapitalize="none"
                      show
                      value={referral}
                      onChangeText={(text) => {
                        setReferral(text);
                      }}
                    />
                  </View>
                )}
              </View>
              <View style={styles.btn}>
                <Button
                  title={translateData.register}
                  onPress={handleRegister}
                  loading={loading}
                  textColor={appColors.whiteColor}
                  backgroundColor={appColors.primary}
                />
              </View>
            </View>
          }
        />
      </View>
    </ScrollView >
  );
}

