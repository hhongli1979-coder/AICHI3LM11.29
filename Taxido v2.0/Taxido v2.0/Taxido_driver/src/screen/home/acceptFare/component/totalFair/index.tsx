import { View, Text } from 'react-native'
import React from 'react'
import Icons from '../../../../../utils/icons/icons'
import styles from './styles'
import { useValues } from '../../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import { useSelector } from 'react-redux'

export function TotalFair({ onPress, totalAmount, paymentMethod }: {
  onPress: () => void
  totalAmount: any
  paymentMethod: string
}) {
  const { viewRtlStyle, textRtlStyle } = useValues()
  const { colors } = useTheme()
  const { translateData } = useSelector((state: any) => state.setting)
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)

  return (
    <View
      activeOpacity={0.7}
      style={[
        styles.bottomView,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.fareView,
          { borderColor: colors.border, flexDirection: viewRtlStyle },
        ]}
      >
        <Text style={[styles.text, { color: colors.text }]}>
          {translateData?.totalFare}
        </Text>
        <Text style={styles.total}>
          {zoneValue?.currency_symbol}
          {totalAmount}
        </Text>
      </View>
      <View style={[styles.payment, { flexDirection: viewRtlStyle }]}>
        <View style={styles.dollerIcon}>
          <Icons.Doller />
        </View>
        <View style={styles.paymentMethod}>
          <Text
            style={[
              styles.cash,
              { color: colors.text, textAlign: textRtlStyle },
            ]}
          >
            {paymentMethod}
          </Text>
          <Text style={[styles.paymentType, { textAlign: textRtlStyle }]}>
            {translateData?.payRideEnd}
          </Text>
        </View>
      </View>
    </View>
  )
}
