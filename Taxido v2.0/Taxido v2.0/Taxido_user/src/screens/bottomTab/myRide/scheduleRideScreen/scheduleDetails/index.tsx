import { View } from 'react-native';
import React from 'react';
import { TaxiDetails } from '../../completeRideScreen/detailContainer/taxiDetails/index';
import { BillDetails } from '../../completeRideScreen/detailContainer/billDetails/index';
import { styles } from './styles';
import { windowHeight } from '@src/themes';
import { useValues } from '@src/utils/context/index';

export function ScheduleDetails() {
    const { bgFullStyle } = useValues();
    return (
        <View style={[styles.container, { backgroundColor: bgFullStyle }]}>
            <TaxiDetails paddingHorizontal={windowHeight(10)} />
            <BillDetails />
        </View>
    );
};
