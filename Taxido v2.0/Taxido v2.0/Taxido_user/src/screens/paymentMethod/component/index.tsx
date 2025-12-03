import { View, Text } from "react-native";
import React from "react";
import styles from "../styles";
import { useValues } from "@src/utils/context/index";;
import { useSelector } from "react-redux";

const PaymentDetails = ({ title, rideAmount }: { title: string, rideAmount: number }) => {
  const { textColorStyle, viewRTLStyle } = useValues();
  const { zoneValue } = useSelector((state) => state.zone);

  return (
    <View style={[styles.rideContainer, { flexDirection: viewRTLStyle }]}>
      <Text style={[styles.billTitle, { color: textColorStyle }]}>{title}</Text>
      <Text style={{ color: textColorStyle }}>{zoneValue?.currency_symbol}{rideAmount}</Text>
    </View>
  );
};

export default PaymentDetails;
