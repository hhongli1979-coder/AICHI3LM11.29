import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, Alert, BackHandler, Modal, ActivityIndicator } from 'react-native';
import { external } from '../../../styles/externalStyle';
import { AuthContainer } from '../../../components/authComponents/authContainer/index';
import { Button, notificationHelper } from '@src/commonComponent';
import { SignInTextContainer } from './signInComponents/signInTextContainer/index';
import { CountryCodeContainer } from './signInComponents/countryCodeContainer/index';
import { useValues } from '@src/utils/context/index';
import { windowHeight } from '@src/themes';
import { SocialLoginInterface, UserLoginInterface } from '../../../api/interface/authInterface';
import { selfData, socialLogin, taxidosettingDataGet, translateDataGet, userLogin } from '../../../api/store/actions/index';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../api/store/index';
import styles from './styles';
import { appColors } from '@src/themes';
import Images from '@src/utils/images';
import { useAppNavigation } from '@src/utils/navigation';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Apple, Google } from '@src/utils/icons';
import { getValue, setValue } from '@src/utils/localstorage';
import auth from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { getFCMToken } from '@src/utils/pushNotificationHandler';
import useSmartLocation from '@src/components/helper/locationHelper';


export function SignIn() {
  const navigation = useAppNavigation();
  const { isDark, textColorStyle, viewRTLStyle, Google_Sign_Key } = useValues();
  const dispatch = useDispatch<AppDispatch>();
  const { translateData, settingData, taxidoSettingData } = useSelector((state: any) => state.setting);
  const demoMode = settingData?.values?.activation?.demo_mode == 1;
  const smsGateway = settingData?.values?.general?.default_sms_gateway;
  const [cca2, setCca2] = useState(smsGateway === 'firebase' ? 'IN' : 'US');
  const [countryCode, setCountryCode] = useState(smsGateway === 'firebase' ? '+91' : `+${taxidoSettingData?.taxido_values?.ride?.country_code}`);
  const [phoneNumber, setPhoneNumber] = useState('');
  const messageRef = useRef<any>();
  const [demouser, setDemouser] = useState(false);
  const [warning, setWarning] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const isFocused = useIsFocused();
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [error, setError] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const { currentLatitude, currentLongitude } = useSmartLocation();

  useEffect(() => {
    if (!translateData || Object.keys(translateData).length === 0) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [translateData]);

  useEffect(() => {
    if (isFocused && taxidoSettingData?.taxido_values?.ride?.country_code) {
      setPhoneNumber('');
      setCountryCode(`+${taxidoSettingData.taxido_values.ride.country_code}`);
    }
  }, [isFocused, taxidoSettingData]);


  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove();
    }, [])
  );

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Google_Sign_Key,
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
      scopes: ['email', 'profile'],
    });
  }, []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fcmToken = await getValue('fcmToken');
        if (fcmToken) {
          setFcmToken(fcmToken);
        } else {
          const newToken: any = await getFCMToken();
          if (newToken) {
            setFcmToken(newToken);
            await setValue('fcmToken', newToken);
          } else {
            console.warn("Failed to get FCM token after requesting permission.");
          }
        }
      } catch (error) {
        console.error("Error fetching FCM token:", error);
      }
    };
    if (isFocused) {
      fetchToken();
    }
  }, [isFocused]);


  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const Info = await GoogleSignin.signIn();
      const email = Info?.data?.user?.email;
      const name = Info?.data?.user?.name;
      const photo = Info?.data?.user?.photo;

      let payload: SocialLoginInterface = {
        login_type: 'google',
        user: {
          email: email,
          name: name,
          photo: photo,
        },
        fcm_token: fcmToken,
      };

      dispatch(socialLogin(payload))
        .unwrap()
        .then((res: any) => {

          if (res?.success) {
            setValue('token', res.access_token);
            navigation.navigate('MyTabs');
            dispatch(selfData());
            setWarning(false);
          }
        });
    } catch (error: any) {
      messageRef.current?.animate();
    }
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(translateDataGet());
      dispatch(taxidosettingDataGet());
      if (smsGateway === 'firebase') {
        setCountryCode('+91');
      } else {
        const code = taxidoSettingData?.taxido_values?.ride?.country_code;
        if (code) {
          setCountryCode(`+${code}`);
        }
      }
    }, [dispatch]),
  );


  const validateInput = (input: string): 'valid_email' | 'invalid_email' | 'valid_phone' | 'invalid_phone' => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const phoneRegex = /^[0-9]{6,}$/;

    if (/[a-zA-Z@]/.test(input)) {
      return emailRegex.test(input) ? 'valid_email' : 'invalid_email';
    } else {
      return phoneRegex.test(input) ? 'valid_phone' : 'invalid_phone';
    }
  };

  const handleSignIn = async () => {

    const result = validateInput(phoneNumber);
    if (result === 'invalid_email') {
      setError(translateData?.emailerror);
      return;
    }

    if (result === 'invalid_phone') {
      setError(translateData?.mobileError);
      return;
    }
    if (error) {
      return
    }
    setLoadingAuth(true);
    const formatCountryCode = (code: string): string => {
      if (code.startsWith('+')) {
        return code.substring(1);
      }
      return code;
    };


    let payload: UserLoginInterface = {
      email_or_phone: phoneNumber,
      country_code: formatCountryCode(countryCode),
      fcm_token: fcmToken,
    };

    dispatch(userLogin(payload))
      .unwrap()
      .then((res: any) => {
        if (res?.success) {
          navigation.navigate('OtpVerification', { countryCode, phoneNumber, demouser, cca2, smsGateway });
          notificationHelper('', translateData.otpSuccess, 'success');
          setWarning(false);
          setLoadingAuth(false);
        } else {
          messageRef.current?.animate();
          setLoadingAuth(false);
        }
      });
  };

  const gotoGuest = () => {
    navigation.navigate('MyTabs');
  };


  useEffect(() => {
    const getStoredPhone = async () => {
      const storedPhone = await AsyncStorage.getItem('phoneNumber');
    };
    getStoredPhone();
  }, []);


  const handleSendOtp = async () => {
    const result = validateInput(phoneNumber);
    if (result === 'invalid_phone') {
      setError(translateData.phoneError);
      return;
    }
    if (error) {
      return
    }
    setLoadingAuth(true)
    const formatCountryCode = (code: string): string => {
      return code.startsWith('+') ? code.substring(1) : code;
    };
    try {
      const fullPhoneNumber = `+${formatCountryCode(countryCode)}${phoneNumber}`;
      const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
      navigation.navigate('OtpVerification', {
        confirmation,
        countryCode: countryCode.startsWith('+') ? countryCode : `+${countryCode}`,
        phoneNumber,
        demouser,
        cca2,
        smsGateway,
      });
      setLoadingAuth(false)
    } catch (error: unknown) {
      const err = error as Error;
      Alert.alert('Error sending OTP', err.message || 'Something went wrong');
      setLoadingAuth(false);
    }
  };


  const appleLogin = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, email, fullName, user } = appleAuthRequestResponse;

      if (!identityToken) {
        console.warn('No identityToken returned from Apple');
        return;
      }
      if (email) await AsyncStorage.setItem('apple_email', email);
      if (fullName) {
        const name = `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim();
        await AsyncStorage.setItem('apple_name', name);
      }
      if (user) await AsyncStorage.setItem('apple_user', user);

      const savedEmail = email || null;
      const savedName =
        fullName?.givenName || fullName?.familyName
          ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
          : null;

      const fcmToken = await getValue('fcmToken');

      let userData: any | null =
        savedEmail || savedName
          ? {
            email: savedEmail,
            name: savedName,
            photo: null,
          }
          : null;

      const payload: SocialLoginInterface = {
        login_type: 'apple',
        user: userData,
        apple_token: appleAuthRequestResponse?.user || null,
        fcm_token: fcmToken,
      };

      dispatch(socialLogin(payload))
        .unwrap()
        .then((res: any) => {

          if (res?.success) {
            setValue('token', res.access_token);
            navigation.navigate('MyTabs');
            dispatch(selfData());
            setWarning(false);
          } else {
            messageRef.current?.animate();
          }
        });
    } catch (error) {
      console.error('Apple login error:', error);
    }
  };


  return (
    <AuthContainer
      topSpace={windowHeight(70)}
      imageShow={true}
      container={
        <View
        >
          <SignInTextContainer />
          <View style={[external.mt_10]}>
            <CountryCodeContainer
              setCca2={setCca2}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              backGroundColor={isDark ? appColors.bgDark : appColors.lightGray}
              textBgColor={appColors.lightGray}
              borderColor={isDark ? appColors.bgDark : appColors.lightGray}
              borderColor1={isDark ? appColors.bgDark : appColors.lightGray}
              warning={warning}
              smsGateway={smsGateway}
              setError={setError}
              error={error}
            />

            <View style={[external.mt_25]}>
              <Button
                title={translateData.getOtp}
                onPress={() => {
                  if (demoMode || demouser) {
                    handleSignIn();
                  } else if (smsGateway === 'firebase') {
                    handleSendOtp();
                  } else {
                    handleSignIn();
                  }
                }}
                loading={loadingAuth}
              />
            </View>

            <View style={styles.imgContainer}>
              <Image source={Images.or} style={styles.orImg} />
            </View>

            <View
              style={[styles.socialContainer, { flexDirection: Platform.OS === 'ios' ? viewRTLStyle : 'column' }]}>
              {settingData?.values?.activation?.social_login_enable !== '0' && (
                <TouchableOpacity
                  style={[
                    styles.socialView,
                    {
                      flexDirection: viewRTLStyle,
                      backgroundColor: isDark
                        ? appColors.bgDark
                        : appColors.lightGray,
                      width: Platform.OS === 'ios' ? '48%' : '100%',
                    },
                  ]}
                  onPress={signIn}>
                  <Google />
                  <Text
                    style={[
                      styles.sociallogin,
                      { color: isDark ? appColors.whiteColor : appColors.primaryText },
                    ]}>
                    {translateData?.google}
                  </Text>
                </TouchableOpacity>
              )}

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[
                    styles.socialView,
                    {
                      flexDirection: viewRTLStyle,
                      backgroundColor: isDark
                        ? appColors.bgDark
                        : appColors.lightGray,
                      width: '48%',
                    },
                  ]}
                  onPress={appleLogin}>
                  <Apple
                    color={isDark ? appColors.whiteColor : appColors.blackColor}
                  />
                  <Text
                    style={[
                      styles.sociallogin,
                      {
                        color: isDark
                          ? appColors.whiteColor
                          : appColors.primaryText,
                      },
                    ]}>
                    {translateData?.apple}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={gotoGuest}
              style={[styles.faceBook, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray },
              { flexDirection: viewRTLStyle },
              ]}>
              <Image source={Images.defultImage} style={styles.guestImage} />
              <Text style={[styles.sociallogin, { color: textColorStyle }]}>
                {translateData.guest}
              </Text>
            </TouchableOpacity>
            <Modal
              visible={showLoader}
              transparent
              animationType="fade"
            >
              <View style={styles.overlay}>
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={appColors.primary || '#00AA88'} />
                </View>
              </View>
            </Modal>
            <View style={styles.emptySpace} />
          </View>
        </View>
      }
    />
  );
}
