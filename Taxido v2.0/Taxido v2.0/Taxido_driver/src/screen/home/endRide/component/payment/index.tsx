import { View, Text } from 'react-native'
import React from 'react'
import styles from './styles'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'
import appColors from '../../../../../theme/appColors'
import { useSelector } from 'react-redux'

export function Payment({ rideDetails }: any) {
  const { colors } = useTheme()
  const { viewRtlStyle, textRtlStyle, isDark } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)

  return (
    <View style={[styles.main, { backgroundColor: colors.card }]}>
      <View
        style={[
          styles.mainContainer,
          {
            backgroundColor: colors.border,
          },
        ]}
      />
      <View
        style={[
          styles.mainView,
          {
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: isDark ? appColors.white : appColors.primaryFont,
              textAlign: textRtlStyle,
            },
          ]}
        >
          {translateData.paymentMethod}
        </Text>
        <View style={[styles.border, { borderColor: colors.border }]} />
        <View style={[styles.contain, { flexDirection: viewRtlStyle }]}>
          <Text
            style={[
              styles.type,
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {translateData.paymentMode}
          </Text>
          <Text
            style={[
              styles.type,
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {rideDetails?.payment_mode}
          </Text>
        </View>
        <View style={[styles.contain, { flexDirection: viewRtlStyle }]}>
          <Text
            style={[
              styles.type,
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {translateData.methodType}
          </Text>
          <Text
            style={[
              styles.type,
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {rideDetails?.payment_method}
          </Text>
        </View>
        <View style={[styles.contain, { flexDirection: viewRtlStyle }]}>
          <Text
            style={[
              styles.type,
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {translateData.status}
          </Text>
          <Text
            style={[
              styles.type,
              { color: rideDetails?.payment_status === "COMPLETED"?appColors.price:rideDetails?.payment_status === "PENDING" ?appColors.yellow:appColors.red},
            ]}
          >
            {rideDetails?.payment_status}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.leftRadius,
          { backgroundColor: colors.background },
          { borderColor: colors.border },
        ]}
      />
      <View
        style={[
          styles.rightRadius,
          { backgroundColor: colors.background },
          { borderColor: colors.border },
        ]}
      />
    </View>
  )
}
