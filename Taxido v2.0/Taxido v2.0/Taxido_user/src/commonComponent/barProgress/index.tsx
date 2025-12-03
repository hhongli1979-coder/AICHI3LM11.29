import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useValues } from '@src/utils/context/index';
import { appColors } from '@src/themes';
import { FilledBarsProps } from '../type';
import styles from './styles';


export function BarProgress({ fill, totalBars = 4 }: FilledBarsProps) {
  const { colors } = useTheme();
  const { isDark, viewRTLStyle } = useValues();

  return (
    <View style={[styles.wrapper, { backgroundColor: isDark ? colors.card : appColors.whiteColor }]}>
      <View style={[styles.container, { flexDirection: viewRTLStyle }]}>
        {Array(totalBars).fill(0).map((_, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              index < fill ? styles.filledBar : styles.emptyBar,
              { backgroundColor: index < fill ? appColors.primary : isDark ? appColors.primary : '#E3F2EE' },
            ]}
          />
        ))}
      </View>
    </View>
  );
}
