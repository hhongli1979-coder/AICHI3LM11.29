import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icons from '../../../../../utils/icons/icons'
import styles from './styles'
import ListItemProps from './type'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'
import appColors from '../../../../../theme/appColors'

export function ListItem({
  icon,
  text,
  onPress,
  backgroundColor,
  color,
  showNextIcon,
  dot
}: ListItemProps) {
  const { colors } = useTheme()
  const { viewRtlStyle } = useValues()

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.main, { flexDirection: viewRtlStyle }]}
    >
      <View style={[styles.alignment, { flexDirection: viewRtlStyle }]}>

        <View
          style={[
            styles.iconContain,
            { backgroundColor: colors.background, backgroundColor },
          ]}
        >
          {dot && <View
            style={{
              position: "absolute",
              bottom: 20,
              right: 10,
              width: 8,
              height: 8,
              borderRadius: 5,
              backgroundColor: "red",
              zIndex: 3
            }}
          />}
          {icon}
        </View>
        <Text style={[styles.title, { color: colors.text, color }]}>
          {text}
        </Text>
      </View>
      {showNextIcon && (
        <View>
          <Icons.NextLarge color={appColors.iconColor} />
        </View>
      )}
    </TouchableOpacity>
  )
}
