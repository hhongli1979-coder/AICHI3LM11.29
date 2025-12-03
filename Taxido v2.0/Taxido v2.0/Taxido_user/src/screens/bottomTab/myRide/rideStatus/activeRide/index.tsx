import { View } from 'react-native';
import React from 'react';
import RideContainer from '../../rideContainer';
import { appColors } from '@src/themes';
import { useAppNavigation } from '@src/utils/navigation';


export function ActiveRide() {
  const { navigate } = useAppNavigation();
  return (
    <View>
      <RideContainer
        status={'started'}
        onPress={() => navigate('PendingRideScreen')}
        color={appColors.activeColor} />
    </View>
  );
};
