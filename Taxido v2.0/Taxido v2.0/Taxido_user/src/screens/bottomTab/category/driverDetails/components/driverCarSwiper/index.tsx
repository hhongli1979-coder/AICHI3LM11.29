import { Image, View } from 'react-native';
import React from 'react';
import Images from '@utils/images';
import Swiper from 'react-native-swiper';
import { external } from '../../../../../../styles/externalStyle';
import { styles } from './style';

export function DriverSlider() {
  return (
    <Swiper
      height={308}
      width={'100%'}
      removeClippedSubviews={false}
      style={[external.mv_13]}>
      {Images?.map((image: any, index: number) => (
        <View key={index}>
          <Image style={styles.imageContainer} source={image} />
        </View>
      ))}
    </Swiper>
  );
};
