import { useTheme } from '@react-navigation/native'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useValues } from '../../utils/context'
import styles from './styles'
import appColors from '../../theme/appColors'

interface RadioButtonProps {
  label?: string
  selected?: boolean
  onPress?: any
}

export function CustomRadioButton({ label, selected, onPress }: RadioButtonProps) {
  const { viewRtlStyle, isDark } = useValues()
  const { colors } = useTheme()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.radioButton, { flexDirection: viewRtlStyle }]}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.radioButtonOuter,
          {
            borderColor: selected
              ? isDark ? appColors.dotDark : appColors.cardicon
              : isDark
                ? colors.border
                : appColors.bordercolor,

            backgroundColor: selected ? isDark ? appColors.dotDark : appColors.cardicon : colors.background,
          },
        ]}
      >
        {selected && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  )
}
