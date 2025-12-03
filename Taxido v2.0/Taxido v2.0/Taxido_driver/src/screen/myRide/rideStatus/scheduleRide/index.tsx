import { View } from 'react-native'
import React from 'react'
import RideContainer from '../../rideContainer'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/main/types'
import { useNavigation } from '@react-navigation/native'
import appColors from '../../../../theme/appColors'

type PendingProp = NativeStackNavigationProp<RootStackParamList>

export function ScheduleRide() {
  const { navigate } = useNavigation<PendingProp>()
  return (
    <View>
      <RideContainer
        status={'Schedule'}
        onPress={() => navigate('ScheduleRideScreen')}
        color={appColors.scheduleColor}
      />
    </View>
  )
}
