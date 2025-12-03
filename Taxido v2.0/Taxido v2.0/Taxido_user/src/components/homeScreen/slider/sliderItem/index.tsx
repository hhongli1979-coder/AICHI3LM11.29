import React from 'react';
import { View, Image } from 'react-native';
import { external } from '../../../../styles/externalStyle';
import { styles } from './styles';
import { OfferItemType } from './types';

export function OfferItem({ item }: OfferItemType) {

  return (
    <View style={styles.bannerContainer}>
      <Image
        resizeMode="stretch"
        style={styles.img}
        source={{ uri: item?.banner_image_url }}
      />
      <View style={[external.mh_20, external.mt_25]} />
    </View>
  );
}
