import { Text, View } from 'react-native';
import React from 'react';
import { DetailContainer } from '@src/commonComponent';
import { external } from '../../../../../../styles/externalStyle';
import { styles } from './styles';
import { useValues } from '@src/utils/context/index';
import { commonStyles } from '../../../../../../styles/commonStyle';
import { appColors, windowHeight } from '@src/themes';
import { BillDetailsInterface } from '@src/api/interface/rideRequestInterface';
import { useSelector } from 'react-redux';

interface BillDetailsProps {
  billDetail: BillDetailsInterface;
}

export function BillDetails({ billDetail }: BillDetailsProps) {
  const { textColorStyle, textRTLStyle, viewRTLStyle, isDark } = useValues();
  const { translateData } = useSelector((state) => state.setting);

  return (
    <View>
      <View style={styles.viewHeder}>
        <Text style={[styles.billSummary, { color: textColorStyle, textAlign: textRTLStyle }]}>
          {translateData.billSummary}
        </Text>
        <View style={{ width: '100%', borderStyle: 'dashed', borderColor: isDark ? appColors.darkBorder : appColors.border, height: 1, borderBottomWidth: 1, marginTop: windowHeight(10), marginBottom: windowHeight(5) }} />
        {billDetail?.ride_fare > 0 && (
          <View style={[external.mv_5]}>
            <DetailContainer
              value={[billDetail?.currency_symbol, Number(billDetail?.ride_fare).toFixed(2)]}
              title={translateData.baseFare}
            />
          </View>
        )}
        {billDetail?.additional_distance_charge > 0 && (
          <View style={[external.mv_5]}>
            <DetailContainer
              value={[billDetail?.currency_symbol, Number(billDetail?.additional_distance_charge).toFixed(2)]}
              title={translateData.additionalFare}
            />
          </View>
        )}
        {billDetail?.vehicle_rent > 0 && (
          <View style={[external.mv_5]}>
            <DetailContainer
              value={[billDetail?.currency_symbol, Number(billDetail?.vehicle_rent).toFixed(2)]}
              title={translateData.vehicleFare}
            />
          </View>
        )}
        {billDetail?.additional_minute_charge > 0 && (
          <View style={[external.mv_5]}>
            <DetailContainer
              value={[billDetail?.currency_symbol, Number(billDetail?.additional_minute_charge).toFixed(2)]}
              title={translateData.timeFare}
            />
          </View>
        )}
        {billDetail?.additional_weight_charge > 0 && (
          <View style={[external.mv_5]}>
            <DetailContainer
              value={[billDetail?.currency_symbol, Number(billDetail?.additional_weight_charge).toFixed(2)]}
              title={translateData.weightFare}
            />
          </View>
        )}
        {billDetail?.bid_extra_amount > 0 && (
          <View style={[external.mv_5]}>
            <DetailContainer
              value={[billDetail?.currency_symbol, Number(billDetail?.bid_extra_amount).toFixed(2)]}
              title={translateData.bidFare}
            />
          </View>
        )}
        {billDetail?.commission > 0 && (
          <View style={[external.mv_5]}>
            <DetailContainer
              value={[billDetail?.currency_symbol, Number(billDetail?.commission).toFixed(2)]}
              title={translateData.commission}
            />
          </View>
        )}
        {billDetail?.total_extra_charge > 0 && (
          <View style={[external.mv_5]}>
            <DetailContainer
              value={[billDetail?.total_extra_charge, Number(billDetail?.total_extra_charge).toFixed(2)]}
              title={translateData?.extracharg}
            />
          </View>
        )}
        {billDetail?.tax > 0 && (
          <View style={[external.mv_5]}>
            <DetailContainer
              value={[billDetail?.currency_symbol, Number(billDetail?.tax).toFixed(2)]}
              title={translateData.tax}
            />
          </View>
        )}
        {billDetail?.platform_fees > 0 && (
          <View style={[external.js_space, external.ai_center, external.mt_5, { flexDirection: viewRTLStyle }]}>
            <Text style={[commonStyles.regularText, { textAlign: textRTLStyle }]}>{translateData.platformFees}</Text>
            <Text
              style={[
                commonStyles.regularText,
                { color: textColorStyle, textAlign: textRTLStyle },
              ]}
            >
              {billDetail?.currency_symbol}{Number(billDetail?.platform_fees).toFixed(2)}
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.container, { borderColor: isDark ? appColors.darkBorder : appColors.primaryGray }]} />
      <View style={styles.detailContainerText}>
        <View style={[, external.js_space, external.ai_center, { flexDirection: viewRTLStyle }]}>
          <Text style={[commonStyles.regularText, { textAlign: textRTLStyle }]}>{translateData.totalBill}</Text>
          <Text
            style={[
              commonStyles.regularText,
              { color: appColors.price, textAlign: textRTLStyle },
            ]}
          >
            {billDetail?.currency_symbol}{Number(billDetail?.total).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};
