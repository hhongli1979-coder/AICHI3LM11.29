import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../style';
import { useValues } from '@src/utils/context/index';
import { appColors } from '@src/themes';

export function PackageItem({ item, onPress, isSelected }) {
  const { textColorStyle, bgFullLayout, viewRTLStyle } = useValues();

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.container,
          { flexDirection: viewRTLStyle },
          { backgroundColor: isSelected ? appColors.selectPrimary : bgFullLayout }
        ]}
        onPress={onPress}
      >
        <Text style={[styles.titleText, { color: isSelected ?appColors.primary:textColorStyle }]}>{item.hour} hr</Text>
        <View style={styles.separator} />
        <Text style={styles.kmText}>{item.distance}{item.distance_type}</Text>
      </TouchableOpacity>
    </View>
  );
};
