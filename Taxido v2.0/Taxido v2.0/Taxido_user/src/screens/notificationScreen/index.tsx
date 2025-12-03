import { View } from 'react-native';
import React from 'react';
import { HeaderContainer } from '../../commonComponent/headingContainer/index';
import { TopCategory } from '../../components/notificationContainer/messageContainer';
import { commonStyles } from '../../styles/commonStyle';
import { useValues } from "@src/utils/context/index";
import { appColors, windowHeight } from '@src/themes';
import { useSelector } from 'react-redux';

export function Notifications() {
  const { isDark } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);

  return (
    <View
      style={[
        commonStyles.flexContainer,
        { backgroundColor: isDark ? appColors.bgDark : appColors.notificationColor },
        { paddingTop: windowHeight(15) },
      ]}>
      <HeaderContainer value={translateData.header} />
      <TopCategory />
    </View>
  );
};
