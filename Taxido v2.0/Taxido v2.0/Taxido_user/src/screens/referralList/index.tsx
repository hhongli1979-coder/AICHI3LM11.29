import React from "react";
import {View, Text, Image, FlatList, StyleSheet} from "react-native";
import {Header} from "@src/commonComponent";
import Images from "@src/utils/images";
import {
  appColors,
  appFonts,
  fontSizes,
  windowHeight,
  windowWidth,
} from "@src/themes";
import {useSelector} from "react-redux";
import {useValues} from "@src/utils/context";

export function ReferralList() {
  const {referralList} = useSelector((state: any) => state.refer);
  const {isDark} = useValues();
  const {translateData} = useSelector((state: any) => state.setting);
  const referralData = referralList?.data?.data || [];

  const renderItem = ({item}: any) => {
    const referredUser = item?.referred || {};
    const status = item?.status?.toLowerCase() || "";
    const isPending = status === "pending";
    const statusColor = isPending ? "#FFB400" : "#28A745";
    const bgColor = isPending ? "#FFF7E5" : "#E8F4F1";

    return (
      <View
        style={[
          styles.itemContainer,
          {
            backgroundColor: isDark
              ? appColors.darkPrimary
              : appColors.whiteColor,
            borderColor: isDark ? appColors.darkBorder : appColors.border,
          },
        ]}>
        {!item?.referrer?.profile_image_url ? (
          <View style={styles.userImage1}>
            <Text
              style={[
                styles.nameText,
                {color: appColors.whiteColor, fontSize: fontSizes.FONT22},
              ]}>
              {referredUser?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        ) : (
          <Image
            source={{uri: item?.referrer?.profile_image_url}}
            style={styles.userImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.textContainer}>
          <Text
            style={[
              styles.nameText,
              {color: isDark ? appColors.whiteColor : appColors.primaryText},
            ]}>
            {referredUser?.name || translateData.unknownUser}
          </Text>
          {item?.referred_bonus_amount < 0 && (
            <Text
              style={[
                styles.amountText,
                {color: isDark ? appColors.categoryTitle : appColors.primary},
              ]}>
              +{item?.referred_bonus_amount}
            </Text>
          )}
        </View>

        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: bgColor,
              paddingHorizontal: windowWidth(15),
              paddingVertical: windowHeight(3),
              borderRadius: windowHeight(20),
            },
          ]}>
          <Text style={[styles.statusText, {color: statusColor}]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? appColors.primaryText : appColors.lightGray,
      }}>
      <Header value={translateData?.referralsList} />
      <FlatList
        data={referralData}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={{padding: windowHeight(15)}}
        ItemSeparatorComponent={() => (
          <View style={{marginVertical: windowHeight(5)}} />
        )}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
              marginTop: "40%",
            }}>
            <Image
              source={isDark ? Images.noReferralDark : Images.noReferral}
              style={{
                height: windowHeight(250),
                width: windowWidth(400),
                resizeMode: "contain",
                marginTop: windowHeight(-50),
              }}
            />
            <Text
              style={{
                fontFamily: appFonts.bold,
                fontSize: fontSizes.FONT22,
                color: isDark ? appColors.whiteColor : appColors.primaryText,
              }}>
              {translateData.noReferralList}
            </Text>
            <Text
              style={{
                fontFamily: appFonts.regular,
                color: isDark ? appColors.darkText : appColors.regularText,
                textAlign: "center",
                marginTop: windowHeight(5),
              }}>
              {translateData.noReferralDetail}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: windowHeight(15),
    borderRadius: windowHeight(8),
    borderWidth: windowHeight(1),
  },
  userImage: {
    height: windowHeight(40),
    width: windowHeight(40),
    borderRadius: windowHeight(20),
  },
  userImage1: {
    height: windowHeight(40),
    width: windowHeight(40),
    borderRadius: windowHeight(40),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.primary,
  },
  textContainer: {
    flex: 1,
    marginLeft: windowWidth(10),
  },
  nameText: {
    fontSize: fontSizes.FONT18,
    fontFamily: appFonts.medium,
  },
  amountText: {
    fontSize: fontSizes.FONT14,
    fontFamily: appFonts.regular,
    marginTop: 2,
  },
  statusContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  statusText: {
    fontSize: fontSizes.FONT16,
    fontFamily: appFonts.medium,
  },
});
