import { TouchableOpacity } from 'react-native'
import React from 'react'
import Icons from '../../utils/icons/icons'
import { useNavigation, useTheme } from '@react-navigation/native'
import commanStyles from '../../style/commanStyles'
import { useValues } from '../../utils/context'
import appColors from '../../theme/appColors'

export function BackButton() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const { isDark } = useValues()
  const gotoBack = () => {
    navigation.goBack()
  }
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={gotoBack}
      style={[
        commanStyles.backButtonMain,
        {
          backgroundColor: colors.card,
          borderColor: isDark ? appColors.darkborder : appColors.border,
        },
      ]}
    >
      <Icons.Back color={colors.text} />
    </TouchableOpacity>
  )
}
