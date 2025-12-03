import React from 'react';
import { View } from 'react-native';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { windowWidth } from '@src/themes';
import { appColors } from '@src/themes';
import { useValues } from '@src/utils/context';
import { ProgressbarProps } from "../type";



export function ProgressBar({ value }: ProgressbarProps) {
  const { isDark } = useValues()

  return (
    <View>
      <ProgressBarAnimated
        width={windowWidth(600)}
        value={value}
        backgroundColorOnComplete={appColors.primary}
        backgroundColor={appColors.primary}
        borderColor={isDark ? appColors.darkBorder : appColors.border}
        height={7}
        borderRadius={0}
      />
    </View>
  );
};
