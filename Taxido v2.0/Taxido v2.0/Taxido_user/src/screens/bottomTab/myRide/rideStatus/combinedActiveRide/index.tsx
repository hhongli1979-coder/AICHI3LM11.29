import { View } from 'react-native';
import React, { memo } from 'react';
import RideContainer from '../../rideContainer';

export const CombinedActiveRide = memo(() => {
    return (
        <View>
            <RideContainer status={'active_combined'} />
        </View>
    );
});
