import { View } from 'react-native';
import React from 'react';
import RideContainer from '../../rideContainer';
import { appColors } from '@src/themes'; 
import { useAppNavigation } from '@src/utils/navigation';

export function CancelRide() {
  const { navigate } = useAppNavigation();
  return (
    <View>
      <RideContainer
        status={'cancelled'}
        onPress={() => navigate('PendingRideScreen')}
        color={appColors.alertRed}
      />
    </View>
  );
};
