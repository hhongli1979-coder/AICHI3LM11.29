import { Text, View } from 'react-native';
import React from 'react';
import { external } from '../../styles/externalStyle';
import { styles } from './styles';
import { Gps, PickLocation } from '@utils/icons';
import { appColors, windowHeight } from '@src/themes';
import { useValues } from '@src/utils/context/index';
import { LocationDetailsPrpos } from '../type';


export function LocationDetails({ locationDetails }: LocationDetailsPrpos) {
  const { textColorStyle, iconColorStyle, viewRTLStyle, textRTLStyle, isDark } = useValues();

  return (
    <View
      style={[
        { flexDirection: viewRTLStyle },
      ]}
    >
      <View style={[external.fd_column, external.mh_15, external.mt_8]}>
        <PickLocation height={12} width={12} colors={iconColorStyle} />
        {locationDetails[1] && (
          <>
            <View style={styles.icon} />
            <Gps height={12} width={12} colors={iconColorStyle} />
          </>
        )}
      </View>

      <View style={[external.pv_10, external.ph_5]}>
        <Text
          style={[
            styles.itemStyle,
            { color: textColorStyle, textAlign: textRTLStyle },
          ]}
        >
          {locationDetails[0]?.length > 40
            ? locationDetails[0].slice(0, 40) + '...'
            : locationDetails[0]}
        </Text>

        {locationDetails[1] && (
          <>
            <View
              style={[
                styles.dashedLine,
                { borderColor: isDark ? appColors.darkBorder : appColors.border },
              ]}
            />
            <View style={{ paddingHorizontal: windowHeight(2.5), right: windowHeight(1.8) }}>
              <Text style={[styles.pickUpLocationStyles, { color: textColorStyle }]}>
                {locationDetails[1]?.length > 40
                  ? locationDetails[1].slice(0, 40) + '...'
                  : locationDetails[1]}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
