import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import appColors from '../../../../../theme/appColors'
import styles from './styles'
import { Button, Input } from '../../../../../commonComponents'
import { useValues } from '../../../../../utils/context'
import { useSelector } from 'react-redux'
import Icons from '../../../../../utils/icons/icons'
import { AuthTitle } from '../../../login/component/authtitle'
import LoginViewProps from '../../../login/types'


export function LoginView({ gotoOTP, email, setEmail, setDemouser }: LoginViewProps | any) {

  const [error, setError] = useState<string>('')
  const { isDark } = useValues()
  const { loading } = useSelector((state: any) => state.auth)
  const { translateData, settingData } = useSelector((state: any) => state.setting)

  const handleGetOTP = () => {
    if (!email) {
      setError(translateData.enterYourPhone)
      return
    }
    gotoOTP()
    setError('')
  }

  const gotoDemo = () => {
    setEmail('driver@example.com')
    setDemouser(true)
  }

  return (
    <View
      style={[
        styles.main,
        { backgroundColor: isDark ? appColors.darkThemeSub : appColors.white },
      ]}
    >
      <View style={styles.subView}>
        <AuthTitle
          title={translateData.authTitle}
          subTitle={translateData.subTitle}
        />
        <Input
          icon={<Icons.Mail />}
          placeholder={translateData.enterEmail}
          backgroundColor={appColors.graybackground}
          value={email}
          onChangeText={setEmail}
          keyboardType='default'
        />
      </View>
      <Button
        onPress={handleGetOTP}
        title={translateData.login}
        backgroundColor={appColors.primary}
        color={appColors.white}
        loading={loading}
      />
      {settingData?.values?.activation?.demo_mode == 1 ? (
        <TouchableOpacity style={styles.demoBtn} onPress={gotoDemo} activeOpacity={0.7}>
          <Text style={styles.demoTitle}>{translateData.demoDriver}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}
