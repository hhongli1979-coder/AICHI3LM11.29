import { View } from 'react-native'
import React from 'react'
import { Line } from '../../assets/icons/line'
import { useValues } from '../../utils/context'
import styles from './styles'

export function LineContainer() {
  const { viewRtlStyle } = useValues()
  return (
    <View>
      <View style={[styles.lineContainer, { flexDirection: viewRtlStyle }]}>
        <Line />
        <Line />
      </View>
    </View>
  )
}
