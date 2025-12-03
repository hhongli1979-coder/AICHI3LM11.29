import { View } from 'react-native';
import React, { memo } from 'react';
import RideContainer from '../../rideContainer';

export const UpcomingRide = memo(() => {
    return (
        <View>
            <RideContainer status={'Schedule'} />
        </View>
    );
});
