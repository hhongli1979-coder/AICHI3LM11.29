import { ScrollView, View } from 'react-native';
import React from 'react';
import { external } from '../../../../styles/externalStyle';
import { commonStyles } from '../../../../styles/commonStyle';
import { Header } from '@src/commonComponent';
import { DriverInfo } from './components/driverInfo/index';
import { DriverSlider } from './components/driverCarSwiper/index';
import { ReviewContainer } from './components/reviewContainer/index';
import { useSelector } from 'react-redux';

export function DriverDetails() {
  const { translateData } = useSelector((state: any) => state.setting);

  return (
    <View style={[commonStyles.flexContainer]}>
      <Header
        value={translateData.findingDriver}
        container={
          <ScrollView
            contentContainerStyle={[external.Pb_80]}
            showsVerticalScrollIndicator={false}
            style={[external.mh_20]}>
            <DriverInfo />
            <DriverSlider />
            <ReviewContainer />
          </ScrollView>
        }
      />
    </View>
  );
};
