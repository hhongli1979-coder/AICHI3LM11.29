import React from 'react'
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native'
import styles from './styles'
import CustomButtonProps from './types'
import appColors from '../../theme/appColors'

export function Button({
  onPress,
  title,
  backgroundColor,
  borderWidth,
  borderColor,
  color,
  margin,
  loading,
  activeOpacity
}: CustomButtonProps) {
  return (
    <View style={{ marginHorizontal: margin !== undefined ? margin : 15 }}>
      <TouchableOpacity
        activeOpacity={activeOpacity ? activeOpacity : 0.9}
        style={[
          styles.button,
          { backgroundColor },
          { borderColor },
          { borderWidth },
        ]}
        onPress={onPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color={appColors.white} />
        ) : (
          <Text style={[styles.buttonText, { color }]}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}
