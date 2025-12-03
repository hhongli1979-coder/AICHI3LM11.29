import { ScrollView, View } from 'react-native';
import React from 'react';
import {Header} from '@src/commonComponent';
import { commonStyles } from '../../../styles/commonStyle';
import { external } from '../../../styles/externalStyle';
import {DriverInfo} from '../../bottomTab/category/driverDetails/components/driverInfo/index';
import { ReviewContainer } from '../../bottomTab/category/driverDetails/components/reviewContainer/index';
import { useSelector } from 'react-redux';

export function DriverInfos() {
  const { translateData } = useSelector((state) => state.setting);

  return (
    <View style={[commonStyles.flexContainer]}>
      <Header
        value={translateData.title}
        container={
          <ScrollView
            contentContainerStyle={[external.Pb_80]}
            showsVerticalScrollIndicator={false}
            style={[external.mh_20]}>
            <DriverInfo />
            <ReviewContainer />
          </ScrollView>
        }
      />
    </View>
  );
};
