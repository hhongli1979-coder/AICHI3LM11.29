import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Pressable, Text, View, Share, TouchableOpacity, Linking } from "react-native";
import { external } from "../../../../../../styles/externalStyle";
import { useProfileData, useGuestData } from "../../../../../../data/profileData/index";
import { notificationHelper, SolidLine } from "@src/commonComponent";
import { BackArrow, Delete } from "@utils/icons";
import { styles } from "./style";
import { useValues } from '@src/utils/context/index';
import { clearValue, getValue } from "@src/utils/localstorage";
import { resetState } from "@src/api/store/reducers";
import { useDispatch, useSelector } from "react-redux";
import { homeScreenPrimary, settingDataGet, userZone } from "@src/api/store/actions";
import { appColors, windowHeight } from "@src/themes";
import { useAppNavigation } from "@src/utils/navigation";
import { accountDelete } from "@src/api/store/actions";
import useStoredLocation from "@src/components/helper/useStoredLocation";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ProfileContainer = forwardRef(
  ({ openLogoutSheet, openDeleteSheet }, ref) => {
    const { textRTLStyle, viewRTLStyle, bgFullStyle, textColorStyle, isDark, setIsRTL, setIsDark, linearColorStyle, imageRTLStyle } = useValues();
    const dispatch = useDispatch();
    const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);
    const { self } = useSelector((state: any) => state.account);
    const adminId = 1;
    const chatId = [adminId, self?.id].sort().join("_");
    const [unreadCount, setUnreadCount] = useState(0);
    const profileData = useProfileData(unreadCount?.myUnread);
    const guestData = useGuestData();
    const [token, setToken] = useState<string | null | undefined>(undefined);
    const { latitude, longitude } = useStoredLocation();
    const { reset, navigate } = useAppNavigation();

    useEffect(() => {
      const Tokenvalue = async () => {
        const value = await getValue("token");
        setToken(value);
      };
      Tokenvalue();
    }, []);

    useImperativeHandle(ref, () => ({
      gotoLogout,
      gotoLoginWithoutNotification,
      deleteAccounts,
    }));

    let isSharing = false;

    const safeShare = async (options: { message: string }) => {
      if (isSharing) {
        return;
      }
      isSharing = true;
      try {
        await Share.share(options);
      } catch (err) {
        console.error("Share error:", err);
      } finally {
        setTimeout(() => {
          isSharing = false;
        }, 500);
      }
    };

    const handlePress = (screenName: string) => {
      if (screenName === "ChatScreen") {
        navigate(screenName, {
          from: "help",
          riderId: self?.id,
          setUnreadCount: setUnreadCount,
        });
      } else if (screenName === "Share") {
        safeShare({
          message:
            "https://play.google.com/store/apps/details?id=com.taxidouser&hl=en-IN",
        });
      }

      else if (screenName === 'PrivacyPolicy') {
        const url = taxidoSettingData?.taxido_values?.setting?.rider_privacy_policy;
        Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
      }
      else {
        navigate(screenName);
      }
    };

    const gotoLogout = async () => {
      try {
        const darkThemeValue = await AsyncStorage.getItem("darkTheme");
        const rtlValue = await AsyncStorage.getItem("rtl");
        await clearValue();
        if (darkThemeValue !== null) setIsDark(JSON.parse(darkThemeValue));
        if (rtlValue !== null) setIsRTL(JSON.parse(rtlValue));
        dispatch(resetState());
        dispatch(settingDataGet());
        notificationHelper("", translateData.logoutMsg, "error");
        reset({ index: 0, routes: [{ name: "SignIn" }] });
        dispatch(homeScreenPrimary());
        dispatch(userZone({ lat: latitude, lng: longitude }));
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };


    const gotoLoginWithoutNotification = () => {
      reset({ index: 0, routes: [{ name: "SignIn" }] });
    };

    const deleteAccounts = () => {
      dispatch(accountDelete());
      notificationHelper("", translateData.accountDelete, "error");
      reset({ index: 0, routes: [{ name: "SignIn" }] });
      dispatch(homeScreenPrimary());
      dispatch(userZone({ lat: latitude, lng: longitude }));
    };

    useEffect(() => {
      const currentUserId = self?.id;
      if (!currentUserId) return;

      const unsubscribe = firestore()
        .collection("chats")
        .doc(chatId)
        .onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            const counts = data?.unreadCount || {};
            const myUnread = counts[currentUserId] ?? 0;

            const otherUserId = Object.keys(counts).find(
              id => id !== currentUserId,
            );
            const otherUnread = counts[otherUserId] ?? 0;

            setUnreadCount({
              myUnread,
              otherUnread,
            });
          }
        });

      return () => unsubscribe();
    }, [chatId]);

    return (
      <View style={[external.mh_20]}>
        {(token ? profileData : guestData)?.map((section, index) => {
          const filteredData = section.data?.filter(item => {
            if (item.screenName === 'PrivacyPolicy') {
              return !!taxidoSettingData?.taxido_values?.setting?.rider_privacy_policy;
            }
            return true;
          });

          if (!filteredData || filteredData.length === 0) return null;

          return (
            <View key={index}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: textColorStyle, textAlign: textRTLStyle },
                ]}
              >
                {section?.title}
              </Text>
              <View
                style={[
                  styles.container,
                  { backgroundColor: bgFullStyle },
                  { borderColor: isDark ? appColors.darkBorder : appColors.border },
                ]}
              >
                {filteredData.map((item, itemIndex) => (
                  <Pressable
                    key={itemIndex}
                    onPress={() => handlePress(item.screenName)}
                    style={styles.pressableView}
                  >
                    <View
                      style={[
                        external.fd_row,
                        external.ai_center,
                        { flexDirection: viewRTLStyle },
                      ]}
                    >
                      <View
                        style={[
                          styles.itemContainer,
                          { backgroundColor: linearColorStyle },
                        ]}
                      >
                        {item?.icon}
                      </View>
                      <Text
                        style={[
                          styles.titleText,
                          { color: textColorStyle, textAlign: textRTLStyle },
                        ]}
                      >
                        {item?.title}
                      </Text>
                      <View style={{ transform: [{ scale: imageRTLStyle }] }}>
                        <BackArrow />
                      </View>
                    </View>
                    {itemIndex !== filteredData.length - 1 && (
                      <View style={styles.lineHeight}>
                        <SolidLine
                          color={isDark ? appColors.darkBorder : appColors.border}
                        />
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })}

        {token ? (
          <>
            <Text
              style={[
                {
                  ...styles.alertZone,
                  color: textColorStyle,
                  textAlign: textRTLStyle,
                },
              ]}>
              {translateData.alertZone}
            </Text>
            <View
              style={[
                {
                  backgroundColor: bgFullStyle,
                  borderColor: isDark
                    ? appColors.darkBorder
                    : appColors.iconRed,
                },
                styles.alertManu,
              ]}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.listView, { flexDirection: viewRTLStyle }]}
                onPress={openDeleteSheet}>
                <View
                  style={[styles.icon, { backgroundColor: appColors.iconRed }]}>
                  <Delete iconColor={appColors.alertRed} />
                </View>
                <Text style={[styles.listTitle, { color: appColors.alertRed }]}>
                  {translateData.deleteAccount}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "100%",
                alignItems: "center",
                height: windowHeight(35),
                marginTop: windowHeight(10),
                justifyContent: "center",
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.listView, { flexDirection: viewRTLStyle }]}
                onPress={openLogoutSheet}>
                <Text style={styles.logoutTitle}>{translateData.logout}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
    );
  },
);
