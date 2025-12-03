import {Text, View} from 'react-native';
import React from 'react';
import { alertData } from '../../../../../../data/alertData/index';
import {styles} from './styles';
import { useSelector } from 'react-redux';

export function AlertContainer() {
  const { translateData } = useSelector((state) => state.setting);

  return (
    <View style={[styles.container]}>
      <View style={[styles.alertBox]}>
        <Text style={[styles.alertText]}>{translateData.profileAlertzone}</Text>
        {alertData?.map(item => {
          return (
            <View style={[styles.alertItem]}>
              <View style={[styles.alertIcon]} />
              <Text style={[styles.alertItemText]}>{item.title}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
