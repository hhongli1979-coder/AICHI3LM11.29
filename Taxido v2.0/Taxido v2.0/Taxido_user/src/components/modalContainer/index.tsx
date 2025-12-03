import { Text, View } from 'react-native';
import React from 'react';
import { commonStyles } from '../../styles/commonStyle';
import { appColors } from '@src/themes';
import { external } from '../../styles/externalStyle';
import { fontSizes, windowHeight } from '@src/themes';
import { useValues } from '@src/utils/context/index';

export function ModalContainer({ data }: any) {
  const { isDark } = useValues();

  return (
    <>
      {data?.map((item: any) => {
        return (
          <View style={[external.mv_5]}>
            <Text
              style={[
                commonStyles.regularText,
                {
                  color: isDark ? appColors.whiteColor : appColors.primaryText
                  , fontSize: fontSizes.FONT20,
                },
              ]}>
              {`\u2022 ${item.title}`}
            </Text>
            <Text
              style={[
                commonStyles.regularText,
                external.mt_2,
                { lineHeight: windowHeight(17) },
                { marginHorizontal: windowHeight(8) }
              ]}>
              {item.subtitle}
            </Text>
          </View>
        );
      })}
    </>
  );
};
