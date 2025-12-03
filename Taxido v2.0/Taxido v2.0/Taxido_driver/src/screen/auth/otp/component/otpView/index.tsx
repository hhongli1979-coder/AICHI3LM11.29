import { View, Text, TouchableOpacity, Keyboard, Alert } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles'
import { Button, notificationHelper } from '../../../../../commonComponents'
import appColors from '../../../../../theme/appColors'
import OTPTextView from 'react-native-otp-textinput'
import { LineAnimation } from '../../../login/component'
import { useNavigation, useTheme, useRoute, useIsFocused } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../../navigation/main/types'
import { useValues } from '../../../../../utils/context'
import { DriverLoginInterface, FirebaseOTPInterface, FleetVerifyOtpInterface, VerifyOtpInterface } from '../../../../../api/interface/authInterface'
import { selfDriverData, settingDataGet, userVerifyOtp, userLogin, firebaseOTPLogin, fleetsVerifyOtp } from '../../../../../api/store/action/index'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../../../api/store/index'
import { getValue, setValue } from '../../../../../utils/localstorage/index'
import auth from '@react-native-firebase/auth'
import messaging from '@react-native-firebase/messaging';

type navigation = NativeStackNavigationProp<RootStackParamList>

const OtpView: React.FC = () => {
  const route = useRoute()
  const demouser = route.params || {}
  const { confirmation, smsGateway }: any = route.params
  const { translateData, settingData } = useSelector((state: any) => state.setting)
  const demoMode = settingData?.values?.activation?.demo_mode == 1
  const [warning, setWarning] = useState('')
  const [enteredOtp, setEnteredOtp] = useState(demoMode == true ? '123456' : '')
  const { colors } = useTheme()
  const { viewRtlStyle } = useValues()
  const { textRtlStyle, isDark, setToken, token } = useValues()
  const countryCode = route.params?.countryCode ?? '91'
  const phoneNumber = route.params?.phoneNumber ?? '1234567890'
  const cca2 = route?.params?.cca2 ?? 'US'
  const userType = route?.params?.userType ?? ''
  const [firebaseloading, setFirebaseloading] = useState<any>()
  const [message, setMessage] = useState<string>('')
  const [fcmToken, setFcmToken] = useState('')
  const [success, setSuccess] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const { navigate } = useNavigation<navigation>()
  const [loading, setLoading] = useState(false)
  const emailOrPhone = demouser?.email_or_phone ?? phoneNumber
  const isEmail = emailOrPhone.includes('@')
  const input = useRef<OTPTextView>(null)
  const isFocused = useIsFocused()
  const [resendTimer, setResendTimer] = useState(0);
  const formattedCountryCode = useMemo(() => {
    return countryCode.startsWith('+') ? countryCode.substring(1) : countryCode;
  }, [countryCode]);


  const handleChange = (otp: string) => {
    setEnteredOtp(otp)
    if (otp.length === 6) {
      Keyboard.dismiss()
      setWarning('')
    }
    else {
      setWarning(translateData?.validOtpEnter)
    }
  }

  useEffect(() => {
    if (enteredOtp.length === 6) {
      Keyboard.dismiss()
      setWarning('')

      if (userType == 'fleet') {
        handleVerifyFleet(enteredOtp);
      } else if (userType == 'driver') {
        handleVerify(enteredOtp);
      }
    }
    else {
    }
  }, [enteredOtp, fcmToken])

  useEffect(() => {
    const fetchToken = async () => {
      let fcmToken = await getValue('fcmToken')
      if (fcmToken) {
        setFcmToken(fcmToken)
      }
    }
    fetchToken()
  }, [isFocused])

  const handleVerify = async () => {
    setLoading(true)
    const formatCountryCode = (code: string): string => {
      if (code.startsWith('+')) {
        return code.substring(1)
      }
      return code
    }
    let payload: VerifyOtpInterface = {
      email_or_phone: phoneNumber,
      country_code: formatCountryCode(countryCode),
      token: enteredOtp,
      email: null,
      fcm_token: fcmToken,
    }

    dispatch(userVerifyOtp(payload))
      .unwrap()
      .then((res: any) => {
        setLoading(false)
        if (res?.success && res?.is_registered) {
          messaging()
            .subscribeToTopic(`user_${res?.id}`)
            .then(() => {
              console.log(`Subscribed to topic: user_${res?.id}`);

            });

          setValue('token', res.access_token)
          setToken(res.access_token)
          if (res?.is_verified == '0') {
            navigate('Verification')
          } else {
            navigate('TabNav')
          }
          dispatch(selfDriverData())
        } else if (res.success && !res.is_registered) {
          messaging()
            .subscribeToTopic(`user_${res?.id}`)
            .then(() => {
              console.log(`Subscribed to topic: user_${res?.id}`);

            });

          navigate('CreateAccount', {
            countryCode,
            phoneNumber,
            cca2,
            userType
          })
          dispatch(settingDataGet())
          setSuccess(false)
          setMessage(translateData.noLinkAccount)
        } else if (!res.success) {
          setSuccess(false)
          setMessage(res.message)
        }
      })
      .catch((error: any) => {
        setLoading(false)
        setSuccess(false)
        setMessage(translateData.verifyWarn)
      })
  }


  const handleVerifyFleet = async () => {
    if (!enteredOtp || enteredOtp.length < 6) {
      setWarning(translateData.validOtpEnter)
      return
    }

    const formatCountryCode = (code: string): string => {
      if (code.startsWith('+')) {
        return code.substring(1)
      }
      return code
    }
    let payload: FleetVerifyOtpInterface = {
      email_or_phone: phoneNumber,
      country_code: formatCountryCode(countryCode),
      token: enteredOtp,
      email: null,
      fcm_token: fcmToken,
    }

    dispatch(fleetsVerifyOtp(payload))
      .unwrap()
      .then((res: any) => {

        if (res.success && res.is_registered) {
          messaging()
            .subscribeToTopic(`user_${res?.id}`)  // or 'users', 'offers', etc.
            .then(() => {
              console.log(`Subscribed to topic: user_${res?.id}`);

            });

          setValue('token', res.access_token)
          setToken(res.access_token)
          if (res?.is_verified == '0') {
            navigate('Verification')
          } else {
            navigate('TabNav')
          }
          dispatch(selfDriverData()).then((res) => {
          })
        } else if (res.success && !res.is_registered) {
          messaging()
            .subscribeToTopic(`user_${res?.id}`)
            .then(() => {
              console.log(`Subscribed to topic: user_${res?.id}`);

            });

          navigate('CreateAccount', {
            countryCode,
            phoneNumber,
            cca2,
            userType
          })
          dispatch(settingDataGet())
          setSuccess(false)
          setMessage(translateData.noLinkAccount)
        } else if (!res.success) {
          setSuccess(false)
          setMessage(res.message)
        }
      })
      .catch((error: any) => {
        setSuccess(false)
        setMessage(translateData.verifyWarn)
      })
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const ResendOtp = async () => {
    setResendTimer(15)
    const formatCountryCode = (code: string): string => {
      return code.startsWith('+') ? code.substring(1) : code;
    };

    const sanitizedPhone = phoneNumber.replace(/^0+/, '');

    try {
      const fullPhoneNumber = `+${formatCountryCode(countryCode)}${sanitizedPhone}`;
      const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
    } catch (error: any) {
      Alert.alert(translateData.errorsendingOTP, error.message || translateData.somethingwentwrong);
    }
  }



  const handelGetOtp = async () => {
    setResendTimer(15)
    const payload: DriverLoginInterface = {
      email_or_phone: phoneNumber,
      country_code: formattedCountryCode,
      fcm_token: fcmToken
    };

    try {
      const res = await dispatch(userLogin(payload)).unwrap();
      if (res?.success) {
        await setValue('userType', userType);
        notificationHelper('', translateData?.otpSent, 'success');
      } else {
        notificationHelper('', res.message, 'error');
      }
    } catch (error) {
      notificationHelper('', translateData.loginFailed, 'error');
    }
  }


  const handleVerifyOtp = async () => {
    if (!enteredOtp || enteredOtp.length < 6) {
      setWarning(translateData.validOtpEnter)
      return
    }

    try {
      setFirebaseloading(true)
      const result = await confirmation.confirm(enteredOtp)
      let called = false

      const unsubscribe = auth().onAuthStateChanged(async user => {
        if (called || !user) return

        called = true
        unsubscribe()

        try {
          const idToken = await user.getIdToken()
          const payload: FirebaseOTPInterface = {
            phone: phoneNumber,
            country_code: countryCode.startsWith('+')
              ? countryCode.slice(1)
              : countryCode,
            firebase_token: idToken,
          }
          const loginResult = await dispatch(firebaseOTPLogin(payload)).unwrap()
          if (loginResult?.is_registered === true) {
            setValue('token', loginResult.access_token)
            setToken(loginResult.access_token)
            await dispatch(selfDriverData())
            navigate('TabNav')
          } else {
            navigate('CreateAccount', {
              countryCode,
              phoneNumber,
              cca2,
              userType
            })
          }
        } catch (apiError) {
          Alert.alert(translateData.error, translateData.loginFailed)
        } finally {
          setFirebaseloading(false)
        }
      })

      setTimeout(() => {
        if (!called) {
          called = true
          unsubscribe()
          Alert.alert(translateData.error, translateData.authenticationtimedout)
          setFirebaseloading(false)
        }
      }, 5000)
    } catch (error) {
      Alert.alert(translateData.error, translateData.invalidOTP)
      setFirebaseloading(false)
    }
  }


  return (
    <View
      style={[
        styles.otpView,
        { backgroundColor: isDark ? appColors.darkThemeSub : appColors.white },
      ]}
    >
      <View style={styles.subView}>
        <View style={styles.space} />
        <LineAnimation />
        <Text
          style={[
            styles.otpVef,
            { color: colors.text, textAlign: textRtlStyle },
          ]}
        >
          {translateData.otpVerification}
        </Text>

        <Text style={[styles.subtitle, { textAlign: textRtlStyle }]}>
          {isEmail
            ? `${translateData.enterOtp} ${emailOrPhone}`
            : `${translateData.enterOtp} ${countryCode} ${emailOrPhone}`}
        </Text>
        <Text
          style={[
            styles.title,
            { color: colors.text, textAlign: textRtlStyle },
          ]}
        >
          {translateData.otp}
        </Text>
        <View style={[styles.inputContainer, { flexDirection: viewRtlStyle }]}>
          <OTPTextView
            containerStyle={[
              styles.otpContainer,
              { flexDirection: viewRtlStyle },
            ]}
            textInputStyle={[
              styles.otpInput,
              {
                color: colors.text,
              },
            ]}
            handleTextChange={handleChange}
            inputCount={6}
            keyboardType="numeric"
            tintColor={appColors.primary}
            offTintColor={isDark ? appColors.darkborder : appColors.line}
            defaultValue={enteredOtp}
          />
        </View>
        {warning !== '' && <Text style={styles.warningText}>{warning}</Text>}
      </View>

      <View style={styles.buttonView}>
        {smsGateway == 'firebase' ? (
          <Button
            title={translateData.verify}
            onPress={handleVerifyOtp}
            loading={firebaseloading}
            backgroundColor={appColors.primary}
            color={appColors.white}
          />
        ) : (
          <Button
            title={translateData.verify}
            onPress={() => {
              if (userType == 'fleet') {
                handleVerifyFleet();
              } else if (userType == 'driver') {
                handleVerify();
              } else {
              }
            }}
            backgroundColor={appColors.primary}
            color={appColors.white}
            loading={loading}
          />
        )}
      </View>
      <View style={styles.subView}>
        <View style={[styles.retry, { flexDirection: viewRtlStyle }]}>
          {resendTimer === 0 ? (
            <Text style={styles.notReceive}>{translateData.notReceived}</Text>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              if (resendTimer === 0) {
                smsGateway === 'firebase' ? ResendOtp() : handelGetOtp()
              }
            }}
            activeOpacity={resendTimer === 0 ? 0.7 : 1}
            disabled={resendTimer !== 0}
          >
            <Text style={[styles.resend, { color: resendTimer === 0 ? colors.text : 'gray' }]}>
              {resendTimer === 0 ? translateData.resendIt : `${translateData.resendOtp} ${resendTimer}s`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default OtpView
