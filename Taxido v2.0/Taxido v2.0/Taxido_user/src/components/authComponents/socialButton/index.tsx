import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './style';
import { external } from '../../../styles/externalStyle';
import { useAppNavigation } from '@src/utils/navigation';
import { appColors } from '@src/themes';
import { useValues } from '@src/utils/context/index';
import { SocialButtonProps } from '../type';

export function SocialButton({ value, title }: SocialButtonProps) {
  const { navigate } = useAppNavigation();
  const { bgFullLayout, isDark } = useValues();

  return (
    <TouchableOpacity onPress={() => navigate('Payment')}
      activeOpacity={0.7}
      style={[styles.container, { backgroundColor: bgFullLayout }]}>
      <View style={[external.fd_row, external.ai_center]}>
        {value}
        <Text style={[styles.title, { color: isDark ? appColors.primaryText : appColors.whiteColor }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
