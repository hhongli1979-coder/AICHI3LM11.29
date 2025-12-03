import { View } from 'react-native';
import React, { useEffect } from 'react';
import { styles } from './style';
import { useValues } from '@src/utils/context/index';
import { appColors } from '@src/themes';
import { useAppNavigation } from '@src/utils/navigation';

export function EmptyNotification() {
  const { navigate } = useAppNavigation();
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleRefresh();
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleRefresh = () => {
    navigate('Notifications');
  };
  const { isDark } = useValues();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? appColors.bgDark : appColors.notificationColor },
      ]}>
    </View>
  );
};
