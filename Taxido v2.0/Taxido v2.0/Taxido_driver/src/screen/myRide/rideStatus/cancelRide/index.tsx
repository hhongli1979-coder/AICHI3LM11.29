import { View } from 'react-native'
import React from 'react'
import RideContainer from '../../rideContainer'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/main/types'
import appColors from '../../../../theme/appColors'

type CancelRideProps = NativeStackNavigationProp<RootStackParamList>

export function CancelRide() {
  const { navigate } = useNavigation<CancelRideProps>()
  return (
    <View>
      <RideContainer
        status={'cancelled'}
        onPress={() => navigate('PendingDetails')}
        color={appColors.alertRed}
      />
    </View>
  )
}
