import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Image, FlatList } from 'react-native';
import { commonStyles } from '../../../../styles/commonStyle';
import { external } from '../../../../styles/externalStyle';
import { Header, SolidLine, LineContainer, LocationDetails, ProgressBar, Button } from '@src/commonComponent';
import { styles } from './styles';
import Images from '@utils/images';
import { CancelFareData } from '../../../../data/cancelFare/index';
import { CancelRender } from '../../../cancelFare/cancelRenderItem/index';
import { appColors } from '@src/themes';
import { useValues } from '@src/utils/context/index';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

var progress = 0;

export function FindingDriver() {
  const route = useRoute();
  const { isOutstation } = route?.params || { isOutstation: false };
  const [progresss, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { textColorStyle } = useValues();
  const { bgFullLayout, viewRTLStyle } = useValues();
  const { translateData } = useSelector((state) => state.setting);

  useEffect(() => {
    increaseProgress();
  }, []);

  const increaseProgress = () => {
    const interval = setInterval(() => {
      if (progress === 100) {
        clearInterval(interval);
        setCompleted(true);
      } else {
        progress = progress + 1;
        setProgress(progress);
      }
    }, 100);
  };
  const renderItem = ({ item }: { item: any }) => <CancelRender item={item} value={isOutstation} />;

  return (
    <View style={[commonStyles.flexContainer]}>
      <Header
        value={translateData.driverTitle}
        container={
          <ScrollView
            contentContainerStyle={[external.Pb_80]}
            showsVerticalScrollIndicator={false}
            style={[external.mh_20, external.mt_20]}>
            {completed && (
              <FlatList renderItem={renderItem} data={CancelFareData} />
            )}
            <LocationDetails />
            <LineContainer />
            <View style={[styles.addressContainer, { backgroundColor: bgFullLayout }]}>
              <View style={[external.pv_10, external.ph_10]}>
                <View style={[styles.findingView, { flexDirection: viewRTLStyle }]}>
                  <Image style={styles.img} source={Images.taxi} />
                  <Text style={[commonStyles.mediumTextBlack12, { color: textColorStyle }]}>
                    {translateData.privateRide}
                  </Text>
                </View>
                <SolidLine />
                <View
                  style={[
                    external.fd_row,
                    external.ai_center,
                    external.js_space,
                    external.mt_3,
                  ]}>
                  <Text style={[commonStyles.regularText]}>
                    {translateData.time}
                  </Text>
                  <Text style={[commonStyles.regularText]}>
                    {translateData.cashOnly}
                  </Text>
                </View>
              </View>
            </View>
            <ProgressBar value={progress} />
            <View style={[external.mv_15, external.mt_25]}>
              {completed && (
                <Button
                  backgroundColor={appColors.whiteColor}
                  title={translateData.cancel}
                  textColor={appColors.subtitle}
                />
              )}
            </View>
          </ScrollView>
        }
      />
    </View>
  );
};
