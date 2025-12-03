import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SolidLine, Button } from '@src/commonComponent';
import { Location, Back } from '@utils/icons';
import { external } from '../../../styles/externalStyle';
import { styles } from './style';
import { useValues } from "@src/utils/context/index";
import { useAppNavigation } from '@src/utils/navigation';
import { appColors, windowWidth } from '@src/themes';
import { useSelector } from 'react-redux';

export function LocationDetails() {
  const { navigate, goBack } = useAppNavigation();
  const { bgFullStyle, textColorStyle, textRTLStyle, viewRTLStyle, bgContainer, isDark } = useValues();
  const { translateData } = useSelector((state) => state.setting);

  return (
    <View>
      <TouchableOpacity style={[styles.backButton, { backgroundColor: bgContainer }]} onPress={goBack} activeOpacity={0.7}>
        <Back />
      </TouchableOpacity>
      <View
        style={[
          external.fx_1,
          external.js_end,
          external.mh_20,
          external.mb_30,
        ]}>
        <View style={[styles.popupContainer, { backgroundColor: bgFullStyle }]}>
          <View style={[styles.popupHeader, { flexDirection: viewRTLStyle }]}>
            <Text style={[styles.popupHeaderText, { color: textColorStyle }]}>
              {translateData.selectServiceLocation}
            </Text>
            <TouchableOpacity activeOpacity={0.7}
            >
              <Text style={styles.changeText}>{translateData.ChangeTexttt}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.SolidLineView}>
            <SolidLine marginVertical={1} color={isDark ? appColors.darkBorder : appColors.border} width={windowWidth(370)} />
          </View>
          <View style={[styles.locationContainer, { flexDirection: viewRTLStyle }]}>
            <View style={[styles.locationIconContainer, { backgroundColor: isDark ? appColors.dotDark : appColors.lightGreen }]}>
              <Location />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={[styles.locationTitle, { color: textColorStyle, textAlign: textRTLStyle }]}>
                {translateData.mesaStreet}
              </Text>
              <Text style={[styles.locationAddress, { textAlign: textRTLStyle }]}>{translateData.addressKentucky}</Text>
            </View>
          </View>
        </View>
        <View style={styles.confirmButtonContainer}>
          <Button
            title={translateData.confirmLocationText}
            onPress={() => navigate('AddNewLocation')}
          />
        </View>
      </View>
    </View>
  );
};
