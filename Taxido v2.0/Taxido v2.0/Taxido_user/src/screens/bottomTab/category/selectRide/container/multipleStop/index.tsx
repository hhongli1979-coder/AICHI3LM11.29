import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import { useSelector } from 'react-redux';

export function MultiStop() {

  const { translateData } = useSelector((state) => state.setting);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {translateData.multiStopTextFirst}{'\n'} {translateData.multiStopTextSec}
      </Text>
    </View>
  );
};
