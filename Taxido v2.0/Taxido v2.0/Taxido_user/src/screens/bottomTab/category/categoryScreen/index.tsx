import { BackHandler, SafeAreaView, ScrollView } from 'react-native';
import React, { useCallback } from 'react';
import { external } from '../../../../styles/externalStyle';
import { commonStyles } from '../../../../styles/commonStyle';
import { HeaderTab } from '@src/commonComponent';
import { CategoryDetail } from '../categoryDetail/index';
import { useValues } from '@src/utils/context/index';
import { windowHeight } from '@src/themes';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useAppNavigation } from '@src/utils/navigation';

export function CategoryScreen() {
  const { bgFullStyle, linearColorStyle } = useValues();
  const navigation = useAppNavigation();

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (navigation.canGoBack()) {
          navigation.navigate('HomeScreen');
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  const { translateData } = useSelector((state: any) => state.setting);

  const gotocarPoling = () => {
    navigation.navigate('FindDriverHome')
  }


  return (
    <SafeAreaView
      style={[external.fx_1, { backgroundColor: bgFullStyle }]}>
      <HeaderTab tabName={translateData?.services} />
      <ScrollView
        contentContainerStyle={[external.Pb_10]}
        showsVerticalScrollIndicator={false}
        style={[
          commonStyles.flexContainer,
          { paddingTop: windowHeight(10) },
          { backgroundColor: linearColorStyle },
        ]}>
        <CategoryDetail />
        {/* <Button title='Car Pooling ' onPress={gotocarPoling} /> */}
      </ScrollView>
    </SafeAreaView>
  );
};
