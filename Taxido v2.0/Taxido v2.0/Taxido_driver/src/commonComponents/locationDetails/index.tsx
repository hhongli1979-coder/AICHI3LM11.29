import { Text, View } from 'react-native'
import React from 'react'
import { styles } from './styles'
import { useValues } from '../../utils/context'
import Icons from '../../utils/icons/icons'
import appColors from '../../theme/appColors'
import { useTheme } from '@react-navigation/native'

export function LocationDetails({ locationDetails }: any) {
  const { viewRtlStyle, textRtlStyle, isDark } = useValues()
  const { colors } = useTheme()
  const hasDropLocation = !!locationDetails[0]
  const hasPickupLocation = !!locationDetails[1]

  return (
    <View
      style={[
        styles.addressContainer,
        { flexDirection: viewRtlStyle },
        { backgroundColor: isDark ? colors.card : appColors.white },
      ]}
    >
      <View style={styles.locationContainer}>
        <Icons.location
          color={isDark ? appColors.white : appColors.primaryFont}
        />
        {hasPickupLocation && (
          <>
            <View style={styles.icon} />
            <Icons.gps
              color={isDark ? appColors.white : appColors.primaryFont}
            />
          </>
        )}
      </View>

      <View style={styles.locationText}>
        {hasDropLocation && (
          <Text
            style={[
              styles.itemStyle,
              { textAlign: textRtlStyle },
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {locationDetails[0]?.length > 40
              ? `${locationDetails[0].slice(0, 40)}...`
              : locationDetails[0]}
          </Text>
        )}

        {hasDropLocation && hasPickupLocation && (
          <View
            style={[
              styles.dashedLine,
              {
                borderColor: colors.border,
              },
            ]}
          />
        )}

        {hasPickupLocation && (
          <Text
            style={[
              styles.pickUpLocationStyles,
              { textAlign: textRtlStyle },
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {locationDetails[1]?.length > 40
              ? `${locationDetails[1].slice(0, 40)}...`
              : locationDetails[1]}
          </Text>
        )}
      </View>
    </View>
  )
}
