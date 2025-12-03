import { View } from 'react-native';
import React from 'react';
import { styles } from './styles';
import { useValues } from '@src/utils/context/index';

import { appColors } from '@src/themes';
import { VerticalLineType } from '../type';

export function VerticalLine({ dynamicHeight }: VerticalLineType) {
  const { isDark } = useValues()
  return (
    <View style={[styles.verticalLine, { height: dynamicHeight || '100%' }, { backgroundColor: isDark ? appColors.darkBorder : appColors.border }]} />
  );
};
