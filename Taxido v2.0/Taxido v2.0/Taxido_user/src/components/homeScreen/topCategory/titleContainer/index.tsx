import { Image, Text, View } from 'react-native';
import React from 'react';
import { RightSmallArrow } from '@utils/icons';
import { styles } from '../styles';
import Images from '@utils/images';

export function TitleContainer({ item }: any) {
  return (
    <View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.title}</Text>
        <View style={styles.iconContainer}>
          <View>
            <RightSmallArrow />
          </View>
          <Image style={styles.carImage} source={Images.rideLogo} />
        </View>
      </View>
    </View>
  );
};
