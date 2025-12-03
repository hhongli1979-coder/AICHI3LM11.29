import React from 'react'
import { View } from 'react-native'
import SwitchToggle from 'react-native-switch-toggle'
import appColors from '../../../../../theme/appColors'
import styles from './styles'

interface ToggleProps {
  switchOn: boolean
  onPress: any
  background?: string
}

export function Switch({ switchOn, onPress, background }: ToggleProps | any) {
  return (
    <View>
      <SwitchToggle
        switchOn={switchOn}
        onPress={onPress}
        circleColorOff={appColors.secondaryFont}
        circleColorOn={appColors.white}
        backgroundColorOn={appColors.primary}
        backgroundColorOff={background}
        containerStyle={styles.containerStyles}
        circleStyle={styles.circleStyles}
      />
    </View>
  )
}
