import { View } from 'react-native';
import React from 'react';
import RideContainer from '../../rideContainer/index';
import { appColors } from '@src/themes'; 
import { useAppNavigation } from '@src/utils/navigation';

export function ScheduleRide() {
    const { navigate } = useAppNavigation();
    return (
        <View>
            <RideContainer
                status={'Schedule'}
                onPress={() => navigate('PendingRideScreen')}
                color={appColors.scheduleColor}
            />
        </View>
    );
};
