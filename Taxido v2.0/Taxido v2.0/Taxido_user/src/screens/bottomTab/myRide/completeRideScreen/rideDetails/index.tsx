import React from 'react';
import { Text, View, ImageBackground } from 'react-native';
import Images from '@utils/images';
import { DetailContainer, SolidLine } from '@src/commonComponent';
import { external } from '../../../../../styles/externalStyle';
import { TaxiDetails } from '../detailContainer/taxiDetails/index';
import { styles } from './styles';
import { windowHeight } from '@src/themes';
import { useValues } from '@src/utils/context/index';
import { commonStyles } from '../../../../../styles/commonStyle';
import { appColors } from '@src/themes';
import { useSelector } from 'react-redux';

export function RideDetails() {
  const { isDark, textRTLStyle, viewRTLStyle } = useValues();
  const detailImage = isDark ? Images.rideDetailDark : Images.rideDetail;
  const { translateData } = useSelector((state) => state.setting);
  const { zoneValue } = useSelector((state: any) => state.zone);

  return (
    <ImageBackground style={styles.imageBackground} source={detailImage}>
      <View style={styles.container}>
        <DetailContainer value={'15 Dec’23,10:15 AM'} title={translateData.date} />
        <View style={[external.mv_10]}>
          <DetailContainer value={'12000052'} title={translateData.tripCompleted} />
        </View>
      </View>
      <View>
        <TaxiDetails paddingHorizontal={windowHeight(30)} />
      </View>
      <View style={styles.billSummaryContainer}>
        <Text style={[styles.billSummaryText, { textAlign: textRTLStyle }]}>{translateData.billSummary}</Text>
        <SolidLine />
        <View style={[external.mt_10]}>
          <DetailContainer value={[zoneValue.currency_symbol, zoneValue?.exchange_rate * 46]} title={translateData.rideFare} />
        </View>
        <View style={[external.mv_10]}>
          <DetailContainer value={[zoneValue.currency_symbol, zoneValue?.exchange_rate * 4]} title={translateData.totalAccessFee} />
        </View>
        <View style={[, external.js_space, external.ai_center, { flexDirection: viewRTLStyle }]}>
          <Text style={[commonStyles.regularText, { textAlign: textRTLStyle }]}>{translateData.couponSavings}</Text>
          <Text style={[commonStyles.regularText, { color: appColors.alertRed, textAlign: textRTLStyle }]}>
            {[zoneValue.currency_symbol, zoneValue?.exchange_rate * -11]}
          </Text>
        </View>
      </View>
      <View style={styles.dashedLine} />
      <View style={styles.billSummaryContainer}>
        <View style={[, external.js_space, external.ai_center, { flexDirection: viewRTLStyle }]}>
          <Text style={[commonStyles.regularText, { textAlign: textRTLStyle }]}>{translateData.totalBill}</Text>
          <Text style={[commonStyles.regularText, { color: appColors.price, textAlign: textRTLStyle }]}>
            {[zoneValue.currency_symbol, zoneValue?.exchange_rate * 39]}
          </Text>
        </View>
      </View>
      <SolidLine height={4} marginVertical={10} />
      <View style={styles.paymentMethodContainer}>
        <Text style={[styles.paymentMethodText, { textAlign: textRTLStyle }]}>{translateData.paymentMethod}</Text>
        <SolidLine marginVertical={10} />
        <DetailContainer value={'#1011'} title={translateData.paymentID} />
        <View style={[external.mv_10]}>
          <DetailContainer value={translateData.cash} title={translateData.methodType} />
        </View>
        <DetailContainer value={translateData.paid} title={translateData.status} />
      </View>
    </ImageBackground>
  );
};
