import React from 'react';
import { View, ViewStyle } from 'react-native';
import { appColors } from '@src/themes';
import { SolidLineProps } from '../type';

export function SolidLine(props: SolidLineProps) {
  const { width, height, color, marginVertical } = props;

  const containerStyle: ViewStyle = {
    width: typeof width === 'number' ? width : '100%',
    height: height || 1,
    backgroundColor: color || appColors.lightGray,
    marginVertical: marginVertical || 5,
  };

  return <View style={containerStyle} />;
};
