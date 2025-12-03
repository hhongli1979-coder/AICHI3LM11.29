import { View, Text } from 'react-native'
import React from 'react'
import Icons from '../../utils/icons/icons'
import styles from './styles'
import commanStyle from '../../style/commanStyles'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../utils/context'
import appColors from '../../theme/appColors'

interface AddressDataProps {
  color?: string
  locationDetails?: any[]
}

export function AddressData({ locationDetails = [] }: AddressDataProps) {
  const { colors } = useTheme()
  const { viewRtlStyle, textRtlStyle, isDark } = useValues()

  if (locationDetails.length === 0) return null

  const isSingle = locationDetails.length === 1

  return (
    <View style={[styles.address1, { flexDirection: viewRtlStyle }]}>
      <View style={[styles.alignment, { flexDirection: viewRtlStyle }]}>
        <View style={styles.spaceRight}>
          <Icons.location color={colors.text} />
          {!isSingle && (
            <>
              <View style={styles.verticalDot} />
              <Icons.gps color={isDark ? appColors.white : appColors.primaryFont} />
            </>
          )}
        </View>

        <View style={styles.spaceRight}>
          <Text
            style={[
              commanStyle.pickup,
              { color: colors.text, textAlign: textRtlStyle },
            ]}
          >
            {locationDetails[0].length > 40
              ? `${locationDetails[0].slice(0, 40)}...`
              : locationDetails[0]}
          </Text>

          {!isSingle && locationDetails[1] && (
            <>
              <View style={[styles.border, { borderColor: colors.border }]} />
              <Text
                style={[
                  commanStyle.drop,
                  { color: colors.text, textAlign: textRtlStyle },
                ]}
              >
 {locationDetails[1].length > 40
              ? `${locationDetails[1].slice(0, 40)}...`
              : locationDetails[1]}              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  )
}
