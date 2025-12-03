import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import styles from './styles'
import images from '../../../../utils/images/images'
import Icons from '../../../../utils/icons/icons'
import { useNavigation, useTheme } from '@react-navigation/native'
import { useValues } from '../../../../utils/context/index'

interface RegistrationHeaderProps {
  showBackButton?: boolean
  backgroundColor?: string
}

export function Header({
  showBackButton = true,
  backgroundColor,
}: RegistrationHeaderProps) {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { isDark, viewRtlStyle } = useValues()

  const gotoBack = () => {
    navigation.goBack()
  }

  return (
    <View
      style={[
        styles.main,
        { backgroundColor: backgroundColor },
        { flexDirection: viewRtlStyle },
      ]}
    >
      {showBackButton && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.iconView, { borderColor: colors.border }]}
          onPress={gotoBack}
        >
          <Icons.Back color={colors.text} />
        </TouchableOpacity>
      )}
      <View style={[styles.header, { flexDirection: viewRtlStyle }]}>
        <Image
          source={isDark ? images.splashDark : images.splash}
          style={styles.imageLogo}
        />
      </View>
    </View>
  )
}
