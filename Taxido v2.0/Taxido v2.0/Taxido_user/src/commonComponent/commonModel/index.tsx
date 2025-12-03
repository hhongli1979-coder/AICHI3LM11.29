import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { styles } from './style';
import { appColors } from '@src/themes';
import { useValues } from '@src/utils/context/index';
import { CommonModelTypes } from '../type';

export function CommonModal({ isVisible, value, justifyContent, paddingTop, closeModal, onPress }: CommonModelTypes) {
  const { isDark } = useValues();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={closeModal}
      animationType='none'
    >
      <TouchableOpacity onPress={onPress}
        activeOpacity={2}
        style={[
          styles.container,
          { justifyContent: justifyContent || 'center' },
          { paddingTop: paddingTop },
        ]}>
        <TouchableOpacity activeOpacity={2}

          style={[
            styles.valueBar,
            { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor },
          ]}>
          <View>{value}</View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
