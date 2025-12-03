import { View, ScrollView } from 'react-native'
import React from 'react'
import RideContainer from '../../rideContainer'
import appColors from '../../../../theme/appColors'
import { useValues } from '../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import styles from './styles'


export function PendingRide() {
  const { isDark } = useValues()
  const { colors } = useTheme()

  return (
    <View
      style={{
        backgroundColor: isDark ? colors.background : appColors.graybackground,
      }}
    >
      <ScrollView>
        <View style={styles.container}>
          <RideContainer status={'accepted'} color={appColors.primary} />
        </View>
      </ScrollView>
    </View>
  )
}
