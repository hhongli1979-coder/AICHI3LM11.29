import { Pressable, View } from 'react-native';
import React from 'react';
import styles from './style';
import { windowHeight } from '@src/themes';
import { appColors } from '@src/themes';
import { IconBgPropType } from '../type';

export function IconBackground({ onPress, icon, height, backgroundColor, borderColor }: IconBgPropType) {
  return (
    <Pressable onPress={onPress} style={[{ height: height || windowHeight(35) }]}>
      <View
        style={[
          styles.container,
          { backgroundColor: backgroundColor || appColors.iconBg },
          { borderColor: borderColor || appColors.whiteColor },
        ]}>
        {icon}
      </View>
    </Pressable>
  );
};
