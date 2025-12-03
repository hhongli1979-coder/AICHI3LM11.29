import { Text, View } from 'react-native';
import React from 'react';
import {OutStationDetails} from '../../../components/outStationDetails/index';
import { external } from '../../../styles/externalStyle';
import { commonStyles } from '../../../styles/commonStyle';
import { styles } from './styles';
import { useSelector } from 'react-redux';

export function SharedRide() {
  const { translateData } = useSelector((state) => state.setting);

  return (
    <View>
      <View style={styles.container}>
        <Text
          style={[
            external.ti_center,
            external.pv_10,
            external.ph_30,
            commonStyles.mediumTextBlack12,
          ]}>
          {translateData.minPrice}
        </Text>
      </View>
      <OutStationDetails />
    </View>
  );
};
