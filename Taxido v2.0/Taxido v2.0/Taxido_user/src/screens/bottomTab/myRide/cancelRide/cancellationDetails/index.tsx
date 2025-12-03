import { Text, View } from 'react-native';
import React from 'react';
import SolidLine from '@src/commonComponent';
import { styles } from './styles';
import { useValues } from '@src/utils/context/index';
import { useSelector } from 'react-redux';

export function CancellationDetails() {
  const { bgFullStyle, linearColorStyle, textColorStyle, textRTLStyle } = useValues();
  const { translateData } = useSelector((state) => state.setting);

  return (
    <View style={[styles.container, { backgroundColor: bgFullStyle }]}>
      <Text style={[styles.billText, { color: textColorStyle, textAlign: textRTLStyle }]}>
        {translateData.cancellationReason}
      </Text>
      <SolidLine marginVertical={10} color={linearColorStyle} />
      <Text style={[styles.paragraph, { color: textColorStyle, textAlign: textRTLStyle }]}>
        {translateData.reason}
      </Text>
    </View>
  );
};
