import { useTheme } from '@react-navigation/native'
import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import CustomButtonProps from './types'
import { useValues } from '../../../../../utils/context'

export function CustomButton({
  imageSource,
  buttonText,
  onPress,
}: CustomButtonProps) {

  const { colors } = useTheme()
  const { viewRtlStyle } = useValues()

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        style={[
          styles.main,
          { backgroundColor: colors.card },
          { flexDirection: viewRtlStyle },
        ]}
      >
        <Image source={imageSource} style={styles.image} />
        <Text style={[styles.name, { color: colors.text }]}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  )
}
