import React, { useState, useMemo, useCallback } from 'react';
import { View, Dimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { OfferItem } from './sliderItem/index';
import { OfferItemType } from './sliderItem/types';
import styles from '../headerContainer/styles';
import { windowHeight } from '@src/themes';
import { HomeSliderProps } from './sliderLoader/type';

const { width } = Dimensions.get('window');

export function HomeSlider({ bannerData }: HomeSliderProps) {
  const scrollOffsetValue = useSharedValue<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const bannerDataArray: OfferItemType[] = useMemo(() => bannerData || [], [bannerData]);

  const renderItem = useCallback(({ item }: { item: OfferItemType | any }) => (
    <OfferItem item={item} />
  ), []);

  const onProgressChange = useCallback((_offsetValue: any, absoluteProgress: number) => {
    const newIndex = Math.round(absoluteProgress);
    setCurrentIndex(newIndex);
  }, []);

  const onSnapToItem = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);



  return (
    <View style={styles.swipeContainer}>
      <Carousel
        loop
        width={width}
        height={windowHeight(155)}
        autoPlay
        autoPlayInterval={5000}
        data={bannerDataArray}
        renderItem={renderItem}
        style={{ width: '100%' }}
        defaultScrollOffsetValue={scrollOffsetValue}
        pagingEnabled
        snapEnabled
        onProgressChange={onProgressChange}
        onSnapToItem={onSnapToItem}
      />
      <View style={styles.paginationContainer}>
        {bannerDataArray.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}







