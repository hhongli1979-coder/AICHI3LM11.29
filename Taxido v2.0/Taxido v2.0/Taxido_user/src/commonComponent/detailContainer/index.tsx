import { Text, View } from 'react-native';
import React from 'react';
import { external } from '../../styles/externalStyle';
import { commonStyles } from '../../styles/commonStyle';
import { useValues } from '@src/utils/context/index';
import { DetailContainerProps } from '../type';

export function DetailContainer({ title, value }: DetailContainerProps) {
  const { textColorStyle, viewRTLStyle, textRTLStyle } = useValues();

  return (
    <View style={[, external.js_space, external.ai_center, { flexDirection: viewRTLStyle }]}>
      <Text style={[commonStyles.regularText, { textAlign: textRTLStyle }]}>{title}</Text>
      <Text style={[commonStyles.regularText, { color: textColorStyle, textAlign: textRTLStyle }]}>
        {value}
      </Text>
    </View>
  );
};
