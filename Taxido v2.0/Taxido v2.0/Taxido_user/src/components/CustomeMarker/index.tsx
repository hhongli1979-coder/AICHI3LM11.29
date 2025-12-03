import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';
import { imageurlProps } from './type';


export function CustomMarker({ imageUrl }: imageurlProps) {
  return (
    <View>
      <Image source={{ uri: imageUrl }} style={styles.markerImage} />
    </View>
  );
};

