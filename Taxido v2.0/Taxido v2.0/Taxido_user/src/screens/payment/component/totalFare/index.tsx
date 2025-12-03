import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../styles'
import { useValues } from "@src/utils/context/index";
import { useSelector } from 'react-redux';

interface TotalFareProps {
  handlePress: () => void;
  fareAmount: number;
  rideStatus: string;
}

export function TotalFare({ handlePress, fareAmount, rideStatus }: TotalFareProps) {
  const { viewRTLStyle, textColorStyle } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);
  const { zoneValue } = useSelector((state: any) => state.zone);

  return (
    <View style={[styles.topView, { flexDirection: viewRTLStyle }]}>
      <View style={[styles.fareView, { flexDirection: viewRTLStyle }]}>
        <Text style={[styles.total, { color: textColorStyle }]}>{translateData.totalFare}</Text>
        <Text style={styles.amount}>{zoneValue.currency_symbol}{fareAmount}</Text>
      </View>
      {rideStatus === 'completed' && (
        <TouchableOpacity style={styles.btnRetry} onPress={handlePress} activeOpacity={0.7}
        >
          <Text style={styles.retry}>{translateData.payNow}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}