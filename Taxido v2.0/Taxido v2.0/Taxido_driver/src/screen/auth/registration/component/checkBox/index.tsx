import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icons from '../../../../../utils/icons/icons'
import appColors from '../../../../../theme/appColors'
import styles from './styles'
import { useTheme } from '@react-navigation/native'
import appFonts from '../../../../../theme/appFonts'
import { useValues } from '../../../../../utils/context'

interface CustomCheckboxProps {
  label: string
  checked: boolean
  onPress: () => void
}

export function CustomCheckbox({
  label,
  checked,
  onPress,
}: CustomCheckboxProps) {
  const { colors } = useTheme()
  const { viewRtlStyle, isDark } = useValues()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.main, { flexDirection: viewRtlStyle }]}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.ticContainer,
          {
            borderColor: checked ? colors.text : colors.border,
            backgroundColor: checked ? colors.text : colors.card,
          },
        ]}
      >
        {checked && <Icons.CheckTic />}
      </View>
      <Text
        style={{
          color: isDark ? appColors.white : appColors.primaryFont,
          fontFamily: appFonts.regular,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}
