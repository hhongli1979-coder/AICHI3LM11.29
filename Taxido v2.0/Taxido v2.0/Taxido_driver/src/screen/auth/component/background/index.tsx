import { View, Image } from 'react-native'
import React from 'react'
import styles from './styles'
import images from '../../../../utils/images/images'
import { useValues } from '../../../../utils/context'
import appColors from '../../../../theme/appColors'

export function Background() {
  const { isDark } = useValues()
  return (
    <View
      style={[
        styles.backgroundView,
        {
          backgroundColor: isDark ? appColors.bgDark : appColors.graybackground,
        },
      ]}
    >
      {isDark ? (
        <Image
          source={images.cityBackGroundDark}
          style={[styles.backgroundImage]}
        />
      ) : (
        <Image
          source={images.cityBackGround}
          style={[styles.backgroundImage]}
        />
      )}
    </View>
  )
}
