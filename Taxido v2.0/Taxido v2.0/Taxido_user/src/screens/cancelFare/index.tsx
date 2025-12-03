import { FlatList, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { commonStyles } from '../../styles/commonStyle';
import { HeaderContainer, CommonModal, Button } from '@src/commonComponent';
import { appColors } from '@src/themes';
import { external } from '../../styles/externalStyle';
import { styles } from './style';
import { CancelRender } from './cancelRenderItem/index';
import { useValues } from '@src/utils/context/index';
import { useDispatch, useSelector } from 'react-redux';
import { bidDataGet } from '../../api/store/actions/bidAction';

export function CancelFare() {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);
  const renderItem = ({ item }: { item: any }) => <CancelRender item={item} />;
  const { bgFullStyle, linearColorStyle, textColorStyle, viewRTLStyle } = useValues();
  const { bidValue } = useSelector((state: any) => state.bid);
  const { translateData } = useSelector((state: any) => state.setting);

  useEffect(() => {
    getVehicleTypes();
  }, []);

  const getVehicleTypes = async () => {
    const rideRequestId = 8;
    dispatch(bidDataGet(rideRequestId));
  }

  return (
    <View style={[commonStyles.flexContainer, { backgroundColor: linearColorStyle }]}>
      <View style={[styles.headerContainer, { backgroundColor: bgFullStyle }]}>
        <HeaderContainer
          show={true}
          onPressIcon={() => setSelected(true)}
          icon={
            <Text style={[commonStyles.mediumText23, { color: appColors.primary }]}>
              {translateData.cancelFare}
            </Text>
          }
        />
      </View>
      <View style={[external.mt_10, external.mh_15]}>
        <FlatList renderItem={renderItem} data={bidValue.data} />
      </View>
      <CommonModal
        isVisible={selected}
        onPress={() => setSelected(false)}
        value={
          <View >
            <View style={styles.modelView}>
              <Text style={[commonStyles.mediumText23, external.ti_center, { color: textColorStyle }]}>
                {translateData.modelContent}
              </Text>
            </View>
            <View
              style={[
                external.ai_center,
                external.js_space,
                external.mt_25,
                { flexDirection: viewRTLStyle }
              ]}>
              <Button
                width={'47%'}
                backgroundColor={appColors.lightGray}
                title={translateData.modelYesCancel}
                textColor={appColors.primaryText}
                onPress={() => setSelected(false)}
              />
              <Button
                width={'47%'}
                title={translateData.modelNo}
                onPress={() => setSelected(false)}
              />
            </View>
          </View>
        }
      />
    </View>
  );
};
