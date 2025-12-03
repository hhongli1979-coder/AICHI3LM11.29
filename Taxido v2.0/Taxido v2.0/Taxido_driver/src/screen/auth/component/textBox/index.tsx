import { useTheme } from '@react-navigation/native'
import React from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import { useValues } from '../../../../utils/context'
import styles from './styles'
import appColors from '../../../../theme/appColors'

interface InputProps extends TextInputProps {
  placeholderTextColor?: string
  backgroundColors?: string
  borderColor?: string
  backgroundColor?: string
}

export function InputBox({
  placeholder = '',
  placeholderTextColor,
  borderColor,
  backgroundColor,
  backgroundColors,
  keyboardType,
  autoCapitalize,
  ...rest
}: InputProps) {
  const { colors } = useTheme()
  const { textRtlStyle, isDark, viewRtlStyle } = useValues()

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            backgroundColor ??
            (isDark ? appColors.primaryFont : appColors.graybackground),
          borderColor: borderColor ?? colors.border,
        },
        { flexDirection: viewRtlStyle },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          { backgroundColor: backgroundColors, textAlign: textRtlStyle },
          { color: colors.text },
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        {...rest}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  )
}
