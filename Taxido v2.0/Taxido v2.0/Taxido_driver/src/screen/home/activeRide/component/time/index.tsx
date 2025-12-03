import { View, Text } from 'react-native'
import React from 'react'
import commanStyle from '../../../../../style/commanStyles'
import styles from './styles'
import { useValues } from '../../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import { useSelector } from 'react-redux'

export function Time({ totalAmount, rideTime }: { totalAmount: number | string, rideTime?: string | any }) {
  const formatRideTime = (rideTime: string) => {
    const date = new Date(rideTime)

    const day = date.getDate()
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear().toString().slice(-2)

    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12

    return `${day} ${month} '${year} at ${hours}:${minutes} ${ampm}`
  }
  const { colors } = useTheme()
  const { viewRtlStyle } = useValues()
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)

  return (
    <View
      style={[
        styles.dateTime,
        { backgroundColor: colors.background, flexDirection: viewRtlStyle },
      ]}
    >
      <Text style={styles.timing}>{formatRideTime(rideTime)}</Text>
      <View style={[commanStyle.directionRow, { flexDirection: viewRtlStyle }]}>
        <Text style={styles.distance}>
          {zoneValue?.currency_symbol}
          {totalAmount}
        </Text>
      </View>
    </View>
  )
}
