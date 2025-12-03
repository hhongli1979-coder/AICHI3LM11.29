import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { external } from '../../styles/externalStyle';
import { RadioBox, RadioBoxPrimary } from '@utils/icons';
import { RadioButtonProps } from '../type';

export function RadioButton({ onPress, checked, color }: RadioButtonProps) {
  return (
    <View>
      <TouchableOpacity style={[external.fd_row]} onPress={onPress} activeOpacity={0.7}
      >
        {checked ? <RadioBoxPrimary color={color} /> : <RadioBox />}
      </TouchableOpacity>
    </View>
  );
};

