import React, { useState, useCallback, useMemo } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import styles from '../login/styles'
import { RootStackParamList } from '../../../navigation/main/types'
import appColors from '../../../theme/appColors'
import { Background, Header } from '../component'
import { LoginView } from './component/'
import { useValues } from '../../../utils/context/index'
import { AppDispatch } from '../../../api/store/index'
import { userMailLogin } from '../../../api/store/action/index'
import { notificationHelper } from '../../../commonComponents'
import { UserLoginEmailInterface } from '../../../api/interface/authInterface'

type NavigationType = NativeStackNavigationProp<RootStackParamList>

export function LoginMail() {
  const navigation = useNavigation<NavigationType>()
  const dispatch = useDispatch<AppDispatch>()
  const { isDark } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)
  const [email, setEmail] = useState<string>('')
  const [demouser, setDemouser] = useState<boolean>(false)

  const backgroundColor = useMemo(
    () => (isDark ? appColors.primaryFont : appColors.white),
    [isDark],
  )

  const gotoRegistration = useCallback(() => {
    navigation.navigate('CreateAccount')
  }, [navigation])

  const gotoOTP = useCallback(() => {
    const payload: UserLoginEmailInterface = { email }

    dispatch(userMailLogin(payload))
      .unwrap()
      .then(res => {
        if (res?.success) {
          navigation.navigate('OtpVerify', { email, demouser })
          notificationHelper('', translateData?.otpSend, 'success')
        }
      })
  }, [dispatch, email, demouser, navigation, translateData])

  return (
    <View style={[styles.main, { backgroundColor }]}>
      <Header
        showBackButton={false}
        backgroundColor={isDark ? appColors.bgDark : appColors.graybackground}
      />
      <Background />
      <View style={styles.loginView}>
        <LoginView
          gotoOTP={gotoOTP}
          gotoRegistration={gotoRegistration}
          email={email}
          setEmail={setEmail}
          setDemouser={setDemouser}
        />
      </View>
    </View>
  )
}
