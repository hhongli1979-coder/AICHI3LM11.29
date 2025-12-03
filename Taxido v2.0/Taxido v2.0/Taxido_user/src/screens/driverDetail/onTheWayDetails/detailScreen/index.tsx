import { Image, Text, View } from 'react-native';
import React from 'react';
import { external } from '../../../../styles/externalStyle';
import Images from '@utils/images';
import { commonStyles } from '../../../../styles/commonStyle';
import { appColors } from '@src/themes';
import styles from './styles';
import { useSelector } from 'react-redux';

export function DetailScreen() {
  const { translateData } = useSelector((state) => state.setting);

  return (
    <View style={styles.container}>
      <View style={styles.view}>
        <View style={[external.fx_1, external.js_end, external.mh_20]}>
          <View style={[external.fd_row]}>
            <View style={[external.fd_row]}>
              <Image
                style={styles.profileUser}
                source={Images.profileUser}></Image>
              <Text
                style={[commonStyles.regularText, { color: appColors.primaryText }]}>
                {translateData.userJonathanHiggins}
              </Text>
              <Text></Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
