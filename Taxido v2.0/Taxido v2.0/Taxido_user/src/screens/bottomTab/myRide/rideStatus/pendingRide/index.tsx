import { View } from 'react-native';
import React from 'react';
import RideContainer from '../../rideContainer';
import { appColors } from '@src/themes';

export function PendingRide() {
  return (
    <View>
      <RideContainer
        status={'accepted'}
        color={appColors.primary}
      />
    </View>
  );
};
