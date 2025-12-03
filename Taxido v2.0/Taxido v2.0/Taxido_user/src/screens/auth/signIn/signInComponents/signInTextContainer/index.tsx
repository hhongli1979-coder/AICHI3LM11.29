import { View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { AuthText } from '@src/components';

export function SignInTextContainer() {
  const { translateData } = useSelector(
    (state: any) => state.setting
  );
  return (
    <View>
      <AuthText title={translateData.authTitle} subtitle={translateData.authDescription} />
    </View>
  );
};
