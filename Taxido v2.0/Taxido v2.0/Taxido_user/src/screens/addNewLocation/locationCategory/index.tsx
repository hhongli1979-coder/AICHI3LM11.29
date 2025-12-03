import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { locationCategory } from '../../../data/locationCategory/index';
import { external } from '../../../styles/externalStyle';
import { RadioButton } from '@src/commonComponent';
import { commonStyles } from '../../../styles/commonStyle';
import { style } from './style';
import { appColors } from '@src/themes';
import { LocationItem } from './types';
import { useValues } from '@src/utils/context/index';
import { useSelector } from 'react-redux';
import { RootState } from '@src/api/store';

export function LocationCategory() {
  const { textColorStyle, bgContainer, textRTLStyle, viewRTLStyle } = useValues();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const translateData = useSelector((state: RootState) => state.setting);

  const paymentData = (index: number) => {
    setSelectedItem(index === selectedItem ? null : index);
  };

  const getItemStyles = (item: LocationItem) => {
    const backgroundColor =
      item.id === selectedItem ? appColors.primary : appColors.whiteColor;
    const textColor =
      item.id === selectedItem ? appColors.whiteColor : appColors.subtitle;
    return {
      backgroundColor,
      color: textColor,
    };
  };

  return (
    <View style={[external.mh_20, external.mb_25, external.mt_25]}>
      <Text style={[commonStyles.mediumTextBlack, { color: textColorStyle, textAlign: textRTLStyle }]}>
        {translateData?.selectCategory}
      </Text>
      <View style={[external.ai_center, { flexDirection: viewRTLStyle }]}>
        {locationCategory?.map((item: LocationItem, index: number) => (
          <Pressable
            key={item.id}
            onPress={() => paymentData(index)}
            style={[
              style.container,
              getItemStyles(item),
              { borderColor: bgContainer },
            ]}>
            <RadioButton
              onPress={() => paymentData(index)}
              checked={index === selectedItem}
              color={appColors.whiteColor}
            />
            <Text
              style={[
                commonStyles.regularText,
                external.ph_5,
                getItemStyles(item),
              ]}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
