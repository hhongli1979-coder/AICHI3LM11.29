import { View, Text, ImageBackground, TouchableOpacity, Image } from "react-native";
import React from "react";
import { styles } from "../../style";
import Images from "@src/utils/images";
import { useValues } from "@src/utils/context/index";;
import { appColors } from "@src/themes";
import { Copied } from "@src/utils/icons";
import Clipboard from "@react-native-clipboard/clipboard";
import { useAppNavigation } from "@src/utils/navigation";
import { useSelector } from "react-redux";
import { notificationHelper } from "@src/commonComponent";

export function Coupons({ couponsList, route }: any) {
  const { isDark, textColorStyle, viewRTLStyle, textRTLStyle } = useValues();
  const bgImage = isDark ? Images.promoCodeList : Images.promoCodeBg;
  const { navigate, goBack }: any = useAppNavigation();
  const { translateData } = useSelector((state: any) => state.setting);
  const { zoneValue } = useSelector((state: any) => state.zone);

  const copyToClipboard = (coupon: any) => {
    Clipboard.setString(coupon.code);
    notificationHelper("", translateData.copyClipboard, "success");
    if (route?.params?.getCoupon) {
      route.params.getCoupon(coupon);
    }
    if (route?.params?.from == "payment") {
      goBack()
    }
  };

  const gotoDetails = (value: number) => {
    navigate("PromoCodeDetail", { item: value });
  };

  return (
    <>
      {couponsList?.data?.map((item: any, index: number) => {
        const discountText =
          item.type === "percentage"
            ? `${translateData.flat} ${Math.round(item.amount)}${translateData.offPercentage}`
            : `${translateData.flatDoller} ${zoneValue?.currency_symbol}${Math.round(item.amount)} ${translateData.off}`;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => gotoDetails(item)}
            activeOpacity={0.7}
            style={styles.mainContainer}
          >
            <ImageBackground
              resizeMode="stretch"
              style={styles.promoCodeImageBackground}
              source={bgImage}
            >
              <View
                style={[
                  styles.promoCodeValidityContainer,
                  { flexDirection: viewRTLStyle },
                ]}
              >
                <View>
                  <Text
                    style={[styles.promoCodeText, { color: textColorStyle }, { textAlign: textRTLStyle }]}
                  >
                    {discountText}
                  </Text>
                  <Text
                    style={[
                      styles.promoCodeSubtitle,
                      { textAlign: textRTLStyle },
                    ]}
                  >
                    {item.description.length > 30
                      ? `${item.description.slice(0, 30)}...`
                      : item.description}
                  </Text>
                  {item.end_date && (
                    <Text
                      style={[
                        styles.promoCodeSubtitle,
                        {
                          textAlign: textRTLStyle,
                        },
                      ]}
                    >
                      {translateData.validTill} : {item.end_date}
                    </Text>
                  )}
                </View>
                <View>
                  <Image
                    source={Images.discount}
                    style={styles.discountImage}
                  />
                </View>
              </View>

              <View style={[styles.dashedLine, { borderColor: isDark ? appColors.darkBorder : appColors.primaryGray }]} />
              <View
                style={[
                  styles.promoCodeValidityContainer,
                  { flexDirection: viewRTLStyle },
                ]}
              >
                <View style={styles.promoCodeCodeContainer}>
                  <Text style={styles.promoCodeCodeText}>{item.code}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => copyToClipboard(item)}
                  style={[styles.copyView, { flexDirection: viewRTLStyle }]}
                >
                  <Copied />
                  <Text
                    style={[
                      styles.promoCodeUseNow,
                      { color: appColors.primary },
                    ]}
                  >
                    {translateData.copy}
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        );
      })}
    </>
  );
}
