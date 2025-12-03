import { View } from 'react-native';
import React from 'react';
import MapView from 'react-native-maps';
import { styles } from './style';
import { DetailContainer } from '../container/detailContainer/index';

export function SelectRides() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
      />
      <DetailContainer />
    </View>
  );
};

