import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import Icons from '../../../../../utils/icons/icons'
import commanStyles from '../../../../../style/commanStyles'
import { useTheme } from '@react-navigation/native'

export function MapIcon() {
  const { colors } = useTheme()
  return (
    <View style={commanStyles.mapBtnView}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          commanStyles.mapButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Icons.Shield color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          commanStyles.mapButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Icons.Target color={colors.text} />
      </TouchableOpacity>
    </View>
  )
}
