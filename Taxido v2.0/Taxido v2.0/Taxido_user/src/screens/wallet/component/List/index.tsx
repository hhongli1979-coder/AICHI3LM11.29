import { View, Text, ScrollView } from "react-native";
import React from "react";
import styles from "./styles";
import { Receipt, PlusAmount, MinusAmount } from "@utils/icons";
import { appColors, windowHeight } from "@src/themes";
import { useValues } from '@src/utils/context/index';
import { useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";

interface DataItem {
  detail: string;
  type: "debit" | "credit";
  amount: number;
}

interface ListProps {
  dataList: DataItem[];
}

export function List({ dataList }: ListProps) {
  const { colors } = useTheme();
  const { viewRTLStyle, textRTLStyle, bgFullLayout, isDark } = useValues();
  const { zoneValue } = useSelector((state: any) => state.zone);

  return (
    <View
      style={[
        styles.dataView,
        { backgroundColor: bgFullLayout, borderColor: colors.border },
        { borderColor: isDark ? appColors.darkBorder : appColors.border }
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: windowHeight(1) }}>
        {dataList?.map((data, index) => (
          <View key={index}>
            <View style={[styles.list, { flexDirection: viewRTLStyle }]}>
              <View style={{ flexDirection: viewRTLStyle }}>
                <View
                  style={[
                    styles.receiptView,
                    styles.bgStyle,
                  ]}
                >
                  <Receipt color={colors.text} />
                </View>
                <View style={styles.detailView}>
                  <Text
                    style={[styles.description, { textAlign: textRTLStyle }, { color: isDark ? appColors.lightGray : appColors.primaryText }]}
                  >
                    {data.detail}
                  </Text>
                </View>
              </View>

              <View style={[styles.amountView, { flexDirection: viewRTLStyle }]}>
                <View style={styles.icons}>
                  {data.type === "debit" ? <PlusAmount /> : <MinusAmount />}
                </View>
                <Text
                  style={[
                    styles.amount,
                    {
                      color:
                        data.type === "debit"
                          ? appColors.alertRed
                          : appColors.price,
                    },
                  ]}
                >
                  {zoneValue.currency_symbol}
                  {(zoneValue.exchange_rate * data.amount).toFixed(2)}
                </Text>
              </View>
            </View>

            {index !== dataList.length - 1 && (
              <View
                style={[
                  styles.dash,
                  { borderColor: isDark ? appColors.darkBorder : appColors.border },
                ]}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
