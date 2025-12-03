import React, { useEffect } from 'react'
import { BackHandler, View } from 'react-native'
import styles from './styles'
import { Background, Header } from '../component'
import OtpView from './component/otpView'
import appColors from '../../../theme/appColors'
import { useValues } from '../../../utils/context'
import { useNavigation } from '@react-navigation/native'

export function Otp() {
  const navigation = useNavigation<any>()
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

  const { isDark } = useValues()
  return (
    <View style={styles.main}>
      <View
        style={[
          styles.background,
          {
            backgroundColor: isDark
              ? appColors.bgDark
              : appColors.graybackground,
          },
        ]}
      >
        <Header
          showBackButton={false}
          backgroundColor={isDark ? appColors.bgDark : appColors.graybackground}
        />
      </View>
      <Background />
      <OtpView />
    </View>
  )
}
