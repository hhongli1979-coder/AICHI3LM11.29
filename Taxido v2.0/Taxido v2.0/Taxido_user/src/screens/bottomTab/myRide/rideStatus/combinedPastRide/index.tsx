import { View } from 'react-native';
import React, { memo } from 'react';
import RideContainer from '../../rideContainer';

export const CombinedPastRide = memo(() => {
    return (
        <View>
            <RideContainer status={'past_combined'} />
        </View>
    );
});
