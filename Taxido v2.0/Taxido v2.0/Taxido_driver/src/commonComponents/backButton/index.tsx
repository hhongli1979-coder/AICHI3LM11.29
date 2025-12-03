import { TouchableOpacity } from 'react-native'
import React from 'react'
import Icons from '../../utils/icons/icons'
import { useNavigation, useTheme } from '@react-navigation/native'
import commanStyles from '../../style/commanStyles'

export function BackButton() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const gotoBack = () => {
    navigation.goBack()
  }
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={gotoBack}
      style={[
        commanStyles.backButton,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Icons.Back color={colors.text} />
    </TouchableOpacity>
  )
}
