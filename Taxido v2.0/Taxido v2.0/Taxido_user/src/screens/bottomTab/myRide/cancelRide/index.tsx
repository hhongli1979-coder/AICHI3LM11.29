import { ScrollView } from 'react-native';
import React from 'react';
import { Header } from '@src/commonComponent';
import RideContainer from '../rideContainer';
import { external } from '../../../../styles/externalStyle';
import { CancellationDetails } from './cancellationDetails/index';
import { appColors } from '@src/themes';
import { useSelector } from 'react-redux';

export function CancelRideScreen() {
  const { translateData } = useSelector((state) => state.setting);

  return (
    <Header
      value={translateData.cancelRide}
      container={
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[external.Pb_80]}>
          <RideContainer mapShow={true} status={translateData.cancel} color={appColors.alertRed} />
          <CancellationDetails />
        </ScrollView>
      }
    />
  );
};
