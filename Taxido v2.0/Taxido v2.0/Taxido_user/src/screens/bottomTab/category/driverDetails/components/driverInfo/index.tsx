import { Image, Text, View } from 'react-native';
import React from 'react';
import Images from '@utils/images';
import { commonStyles } from '../../../../../../styles/commonStyle';
import { driverDetailsData } from '../../../../../../data/driverDetails/index';
import { styles } from './style';
import { useValues } from '@src/utils/context/index';
import { Car } from '@utils/icons';
import { useRoute } from '@react-navigation/native';

export function DriverInfo() {
  const route = useRoute<any>();
  const { driverInfo } = route?.params;
  const { textRTLStyle, viewRTLStyle, textColorStyle, linearColorStyle, bgContainer } = useValues();

  return (
    <View style={styles.container}>
      <View style={[styles.profileContainer, { backgroundColor: bgContainer }]}>
        <Image style={styles.profileImage} source={Images.profileUser} />
        <View style={styles.profileName}>
          <Text style={[commonStyles.mediumText23, { color: textColorStyle }]}>{driverInfo?.name}</Text>
        </View>
        <View style={styles.driverDetailItem}>
          {driverDetailsData?.map((item, index) => (
            <View style={styles.detailTextContainer} key={index}>
              <View>
                <Text style={styles.detailNumber}>{item.number}</Text>
                <Text style={commonStyles.regularText}>{item.title}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={[styles.vehicleContainer, { flexDirection: viewRTLStyle, backgroundColor: linearColorStyle }]}>
          <View>
            <Text style={[styles.vehicleText, { textAlign: textRTLStyle, color: textColorStyle }]}>{driverInfo?.vehicle_info.model}</Text>
            <View style={{ flexDirection: viewRTLStyle }}>
              <Text style={[styles.vehicleNumber, { textAlign: textRTLStyle, color: textColorStyle }]}>{driverInfo?.vehicle_info.plate_number}</Text>
              <View style={styles.carView}>
                <Car colors='gray' />
              </View>
            </View>
          </View>
          <Image style={styles.imgStyle} source={Images.alto} />
        </View>
      </View>
    </View>
  );
};
