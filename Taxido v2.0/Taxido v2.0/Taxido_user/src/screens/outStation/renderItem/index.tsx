import { Image, Pressable, Text, View } from 'react-native';
import React from 'react';
import { styles } from '../style';
import { commonStyles } from '../../../styles/commonStyle';
import { external } from '../../../styles/externalStyle';
import { useValues } from "@src/utils/context/index";
import { Info } from '@utils/icons';
import { appColors, windowHeight } from '@src/themes';

interface OutStationRenderProps {
  item: any;
  onPress: () => void;
  selected: boolean;
}
export function OutStationRender({ item, onPress, selected }: OutStationRenderProps) {
  const { bgFullStyle, textColorStyle, bgFullLayout, textRTLStyle } = useValues();

  return (
    <View>
      <Pressable
        onPress={onPress}
        style={[
          styles.container,
          { backgroundColor: bgFullStyle },
          { borderColor: selected ? appColors.iconBg : bgFullLayout, borderWidth: selected ? windowHeight(1) : windowHeight(1) },
        ]}>
        <View style={styles.infoIcon} >
          <Info />
        </View>
        <Image style={styles.img} source={item.img} />
        <Text
          style={[
            commonStyles.mediumTextBlack12,
            external.pt_5,
            { textAlign: textRTLStyle },
            { color: textColorStyle },
          ]}>
          {item.title}
        </Text>
        {selected && <View style={styles.layer} />}
      </Pressable>
    </View>
  );
};
