import { View } from 'react-native';
import React from 'react';
import { Line } from '@utils/icons';
import { external } from '../../styles/externalStyle';

export function LineContainer() {
  return (
    <View>
      <View style={[external.fd_row, external.js_space, external.mh_20]}>
        <Line />
        <Line />
      </View>
    </View>
  );
};
