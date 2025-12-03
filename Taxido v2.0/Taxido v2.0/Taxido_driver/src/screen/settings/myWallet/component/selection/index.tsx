import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import styles from './styles';
import { useValues } from '../../../../../utils/context';
import { useTheme } from '@react-navigation/native';
import appColors from '../../../../../theme/appColors';

export function Selection({ activeTab, onButtonPress }: any) {
  const { translateData } = useSelector((state: any) => state.setting);
  const { viewRtlStyle, isDark } = useValues();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.selection,
        { flexDirection: viewRtlStyle, backgroundColor: colors.card },
      ]}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.tab,
            styles.leftTab,
            activeTab === 'wallet' ? styles.activeTab : styles.inactiveTab,
            activeTab !== 'wallet' && {
              backgroundColor: isDark ? appColors.bgDark : appColors.white,
            },
          ]}
          onPress={() => onButtonPress?.('wallet')}
        >
          <Text
            style={[
              activeTab === 'wallet' ? styles.activeText : styles.inactiveText,
            ]}
          >
            {translateData.totalEarning}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            styles.rightTab,
            activeTab === 'withdraw' ? styles.activeTab : styles.inactiveTab,
            activeTab !== 'withdraw' && {
              backgroundColor: isDark ? appColors.bgDark : appColors.white,
            },
          ]}
          onPress={() => onButtonPress?.('withdraw')}

        >
          <Text
            style={[
              activeTab === 'withdraw' ? styles.activeText : styles.inactiveText,
            ]}
          >
            {translateData.withdrawHistory}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
