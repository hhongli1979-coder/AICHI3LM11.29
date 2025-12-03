import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { HeaderContainer, notificationHelper } from "@src/commonComponent";
import { useValues } from "@src/utils/context/index";;
import { styles } from "./styles";
import Images from "@src/utils/images";
import { Copied } from "@src/utils/icons";
import { external } from "@src/styles/externalStyle";
import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation } from "@react-navigation/native";
import { appColors } from "@src/themes";
import { useSelector } from "react-redux";

export function PromoCodeDetail({ route }: { route: any }) {
  const { item } = route.params;
  const { bgFullStyle, linearColorStyle, isDark, textColorStyle, viewSelfRTLStyle, viewRTLStyle, textRTLStyle } = useValues();
  const { goBack } = useNavigation();
  const { translateData } = useSelector((state: any) => state.setting);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const ordinal =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";
    return `${day}${ordinal} ${month} ${year}`;
  };

  const copyToClipboard = (coupon: any) => {
    Clipboard.setString(coupon.code);
    notificationHelper("", translateData.copyClipboard, "success")
    goBack();
  };

  const renderTags = (data: any[], label: string) => (

    <View style={styles.tagContainer}>
      <Text
        style={[
          styles.label,
          { color: textColorStyle },
          { textAlign: textRTLStyle },
        ]}
      >
        {label}:
      </Text>
      <View style={[styles.subLabelContainer, { flexDirection: viewRTLStyle }]}>
        {data?.map((item: any) => (
          <Text
            key={item.id}
            style={[styles.labelName, { textAlign: textRTLStyle }]}
          >
            {item.name}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: linearColorStyle }]}>
      <View style={[styles.headerContainer, { backgroundColor: bgFullStyle }]}>
        <HeaderContainer value={translateData.promoCodeDetails} />
      </View>
      <View style={styles.detailsContainer}>
        <View
          style={[
            styles.detailsComonent,
            {
              backgroundColor: isDark
                ? appColors.darkHeader
                : appColors.whiteColor,
            },
          ]}
        >
          <View style={[external.fd_row, { flexDirection: viewRTLStyle }]}>
            <View style={[styles.titleContainer]}>
              <View style={[styles.titleBg]}>
                <Text style={[styles.titleCode, { textAlign: textRTLStyle }]}>
                  {item.code}
                </Text>
              </View>
              <Text
                style={[
                  styles.title,
                  { color: textColorStyle },
                  { textAlign: textRTLStyle },
                ]}
              >
                {item.title}
              </Text>
            </View>
            <View
              style={[styles.imageContainer, { alignItems: viewSelfRTLStyle }]}
            >
              <Image source={Images.discount} style={styles.discountImage} />
            </View>
          </View>
          <Text style={[styles.discription, { textAlign: textRTLStyle }]}>
            {item.description}
          </Text>
          {item.services && item.services.length > 0 && renderTags(item.services, "Services")}
          {item.vehicle_types && item.vehicle_types.length > 0 && renderTags(item.vehicle_types, "Vehicles")}
          {item.end_date && (
            <View style={[styles.dateContainer]}>
              <Text
                style={[
                  styles.label,
                  { color: textColorStyle },
                  { textAlign: textRTLStyle },
                ]}
              >
                {translateData.validTill}:
              </Text>
              <Text style={[styles.date, { textAlign: textRTLStyle }]}>
                {`\u2022 ${translateData.offerValidUntil} ${formatDate(item.end_date)}`}
              </Text>
            </View>
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.copyBtn, { flexDirection: viewRTLStyle }]}
            onPress={() => copyToClipboard(item)}
          >
            <Copied />
            <Text style={styles.btnText}>{item.code}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
