import React, {useCallback, useEffect, useState} from "react";
import {Image, Text, View, TouchableOpacity} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {walletData} from "@src/api/store/actions/walletActions";
import {getValue} from "@src/utils/localstorage";
import {appColors, appFonts, fontSizes, windowWidth} from "@src/themes";
import {commonStyles} from "../../../../../../styles/commonStyle";
import {external} from "../../../../../../styles/externalStyle";
import {styles} from "./style";
import {useValues} from "@src/utils/context/index";
import {UserContainerSkeleton} from "./userSkeleton";
import {Star} from "@src/utils/icons";

export function UserContainer() {
  const {bgFullStyle, textColorStyle, viewRTLStyle, isDark,isRTL} = useValues();
  const dispatch = useDispatch();
  const {navigate} = useNavigation();
  const {self} = useSelector(state => state.account);
  const {walletTypedata} = useSelector(state => state.wallet);
  const char = self?.name ? self.name.charAt(0) : "";
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const {translateData} = useSelector((state: any) => state.setting);
  const {zoneValue} = useSelector((state: any) => state.zone);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      dispatch(walletData());
      const tokenValue = await getValue("token");
      const storedImage = await getValue("profile_image_uri");
      setToken(tokenValue);
      setLocalImageUri(storedImage);
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      const fetchStoredImage = async () => {
        const storedImage = await getValue("profile_image_uri");
        setLocalImageUri(storedImage);
      };
      fetchStoredImage();
    }, []),
  );

  const navigationProfile = () => {
    if (token) {
      navigate("EditProfile");
    }
  };



  return (
    <View style={[styles.container, {backgroundColor: bgFullStyle}]}>
      {loading ? (
        <UserContainerSkeleton />
      ) : (
        <>
          <View
            style={[
              external.fd_row,
              external.ai_center,
              {flexDirection: viewRTLStyle},
            ]}>
            <TouchableOpacity onPress={navigationProfile} activeOpacity={0.7}>
              {self?.profile_image_url ? (
                <Image
                  style={styles.userImage}
                  source={{uri: self?.profile_image_url}}
                />
              ) : (
                <View style={styles.nameTag}>
                  <Text style={[styles.char, {color: appColors.whiteColor}]}>
                    {char || translateData.g}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {self?.name ? (
              <View style={styles.userView}>
                <View
                  style={{
                    flexDirection: viewRTLStyle,
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: !isRTL&&"84%",
                  }}>
                  <Text
                    style={[
                      commonStyles.mediumTextBlack,
                      {color: textColorStyle},
                    ]}>
                    {self?.name
                      ? self.name.length > 30
                        ? `${self.name.substring(0, 30)}...`
                        : self.name
                      : ""}
                  </Text>

                  <View
                    style={[
                      styles.ratingBox,
                      {
                        backgroundColor: isDark
                          ? appColors.darkPrimary
                          : appColors.lightGray,
                        flexDirection: viewRTLStyle,
                      },
                    ]}>
                    <Star />
                    <Text
                      style={{
                        color: isDark
                          ? appColors.whiteColor
                          : appColors.blackColor,
                        fontFamily: appFonts.medium,
                        fontSize: fontSizes.FONT16,
                        marginLeft:isRTL?0:windowWidth(8),
                        marginRight:isRTL?windowWidth(8):0
                      }}>
                      {self?.rating_count}
                    </Text>
                  </View>
                </View>
                <Text style={[commonStyles.regularText, external.mt_3]}>
                  {self?.email}
                </Text>
              </View>
            ) : (
              <Text
                style={[commonStyles.mediumTextBlack, {color: textColorStyle}]}>
                {translateData.guest}
              </Text>
            )}
          </View>
          {token && (
            <TouchableOpacity
              style={[styles.walletContainer, {flexDirection: viewRTLStyle}]}
              onPress={() => navigate("Wallet")}
              activeOpacity={0.7}>
              <Text style={styles.walletBalance}>{translateData.balance}</Text>
              <Text
                style={[
                  commonStyles.mediumTextBlack,
                  {color: appColors.whiteColor, fontSize: fontSizes.FONT20},
                ]}>
                {zoneValue?.currency_symbol}{" "}
                {(
                  Number(zoneValue?.exchange_rate ?? 0) *
                  Number(walletTypedata?.balance ?? 0)
                ).toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
