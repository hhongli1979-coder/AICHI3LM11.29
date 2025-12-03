import { View } from 'react-native';
import React from 'react';
import RideContainer from '../../rideContainer';
import { appColors } from '@src/themes';
import { useAppNavigation } from '@src/utils/navigation';

export function CompletedRide() {
  const { navigate } = useAppNavigation();

  return (
    <View>
      <RideContainer
        status={'completed'}
        onPress={() => navigate('PendingRideScreen')}
        color={appColors.completeColor}
      />
    </View>
  );
};
