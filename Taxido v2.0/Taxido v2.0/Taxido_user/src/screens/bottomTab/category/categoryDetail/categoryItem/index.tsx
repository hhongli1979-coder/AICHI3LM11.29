import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { styles } from '../style';
import { appColors } from '@src/themes';
import { ArrowService } from '@utils/icons';
import { useValues } from '@src/utils/context/index';
import Images from '@src/utils/images';

export function CategoryItem({ item, onPress }: any) {
  const { viewRTLStyle, bgFullStyle, textRTLStyle, isDark, isRTL } = useValues();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={[styles.mainContainer, { backgroundColor: bgFullStyle }]}>
      <TouchableOpacity onPress={onPress} style={styles.imageView} activeOpacity={0.7}>
        {isLoading && (
          <FastImage
            resizeMode="stretch"
            style={[styles.imgBg, { backgroundColor: isDark ? appColors.darkHeader : appColors.loaderBackground }]}
            source={Images.imagePlaceholder}
          />
        )}
        <FastImage
          resizeMode="stretch"
          style={[styles.imgBg, isLoading ? { position: 'absolute', opacity: 0 } : { opacity: 1 }]}
          source={
            item?.service_image_url
              ? { uri: item?.service_image_url }
              : Images.imagePlaceholder
          }
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />

        <View style={[styles.mainView, { flexDirection: viewRTLStyle }]}>
          <Text style={[styles.name, { textAlign: isRTL ? 'right' : 'left' }]}>{item?.name}</Text>
          {item.id != 10 && (
            <View
              style={[
                styles.roundedShadowContainer,
                { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor },
              ]}
            >
              <ArrowService />
            </View>
          )}

        </View>
        <Text style={[styles.text, { textAlign: textRTLStyle }]}>
          {item?.description}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
