import { ScrollView, View } from 'react-native';
import React from 'react';
import { Header } from '@src/commonComponent';
import RideContainer from '../rideContainer';
import { external } from '../../../../styles/externalStyle';
import { PendingDetails } from './activeDetails/index';
import { appColors } from '@src/themes';
import { useSelector } from 'react-redux';

export function ActiveRideScreen() {
    const { translateData } = useSelector((state) => state.setting);

    return (
        <Header
            value={translateData.activeRideHeader}
            container={
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[external.Pb_80]}>
                    <RideContainer mapShow={true} status={translateData.active} color={appColors.activeColor} />
                    <View style={[external.mt_10]}>
                        <PendingDetails />
                    </View>
                </ScrollView>
            }
        />
    );
};
