import { Text, View, TouchableOpacity, SafeAreaView, Pressable } from 'react-native';
import React from 'react';
import { Back } from '@utils/icons';
import { styles } from './style';
import { useAppNavigation } from '@src/utils/navigation';
import { useValues } from '@src/utils/context/index';
import { HeaderPropType } from '../type';

export function LocationHeader({ value, show, icon, onPressIcon }: HeaderPropType) {

  const { textColorStyle, bgContainer, imageRTLStyle, viewRTLStyle } = useValues();
  const { goBack } = useAppNavigation();
  const flexGrowValue: number | null = show ? null : 0.45;
  const justifyContentValue: 'space-between' | null = show
    ? 'space-between'
    : null;

  return (
    <SafeAreaView
      style={[
        styles.viewContainer,
        { justifyContent: justifyContentValue as any },
        { flexDirection: viewRTLStyle },
      ]}>
      <Pressable
        onPress={() => goBack()}
        style={{
          flexGrow: flexGrowValue as number,
          flexDirection: viewRTLStyle,
        }}>
        <View
          style={[
            styles.container,
            { backgroundColor: bgContainer },
            { transform: [{ scale: imageRTLStyle }] },
          ]}>
          <Back />
        </View>
      </Pressable>
      <Text style={[styles.textContainer, { color: textColorStyle }]}>
        {value}
      </Text>
      {show && (
        <TouchableOpacity onPress={onPressIcon} activeOpacity={0.7}
        >{icon}</TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
