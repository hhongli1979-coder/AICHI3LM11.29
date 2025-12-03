import React from 'react'
import { View, Image } from 'react-native'
import { style } from '../otpverify/style'
import Icons from '../../../../utils/icons/icons'
import appColors from '../../../../theme/appColors'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../../utils/context'

export function AuthTemplate({ children, image }: any) {
  const { colors } = useTheme()
  const { isDark } = useValues()

  return (
    <View
      style={[
        style.container,
        {
          backgroundColor: isDark ? appColors.bgDark : appColors.graybackground,
        },
      ]}
    >
      <View style={style.topContainer}>
        <View style={[style.backBtn, { borderColor: colors.card }]}>
          <Icons.Back color={colors.text} />
        </View>
        <View style={style.imgContainer}>
          <Image source={image} style={style.img} />
        </View>
      </View>
      <View
        style={[
          style.bottomContainer,
          {
            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
          },
        ]}
      >
        {children}
      </View>
    </View>
  )
}
