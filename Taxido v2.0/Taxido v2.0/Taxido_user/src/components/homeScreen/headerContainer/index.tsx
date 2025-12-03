import { Platform, View } from 'react-native';
import React from 'react';
import { external } from '../../../styles/externalStyle';
import { HeaderComponent } from './headerContainer/index';
import { ProfileContainer } from './profileContainer';
import styles from './styles';
import { windowHeight } from '@src/themes';

export function HeaderContainer() {
  return (
    <View style={[styles.container, external.mh_20, { marginTop: Platform.OS && windowHeight(15) }]}>
      <HeaderComponent />
      <ProfileContainer />
    </View>
  );
};

