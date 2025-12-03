import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { external } from '../../../../../../styles/externalStyle';
import { commonStyles } from '../../../../../../styles/commonStyle';
import { AddressMarker, Alarm } from '@utils/icons';
import { styles } from './styles';
import { useValues } from '@src/utils/context/index';
import { useSelector } from 'react-redux';
import { appColors } from '@src/themes';

export function LocationTime({ pickupLocation }) {
  const { textColorStyle, bgContainer, isDark } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);


  return (
    <View style={[external.fd_row, external.ai_center, external.js_space]}>
      <View style={[styles.container, { backgroundColor: bgContainer }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
        <AddressMarker />
        <View style={[styles.line, { borderColor: isDark ? appColors.darkBorder : appColors.border }]} />
        <Text style={[styles.textContainer, { color: textColorStyle }]}>
          {pickupLocation?.length > 25 ? `${pickupLocation.substring(0, 25)}...` : pickupLocation}
        </Text>
      </View>
      <TouchableOpacity style={[styles.locationContainer, { backgroundColor: bgContainer }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]} activeOpacity={0.7}
      >
        <Alarm />
        <Text style={[commonStyles.mediumTextBlack12, external.ph_5, { color: textColorStyle }]}>{translateData.now}</Text>
      </TouchableOpacity>
    </View>
  );
};
