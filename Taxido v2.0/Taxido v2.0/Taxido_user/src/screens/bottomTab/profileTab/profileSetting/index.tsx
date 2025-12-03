import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { BackHandler, SafeAreaView, ScrollView, Text, View } from "react-native";
import { Button, HeaderTab, notificationHelper } from "@src/commonComponent";
import { external } from "../../../../styles/externalStyle";
import { commonStyles } from "../../../../styles/commonStyle";
import { UserContainer } from "./profileComponent/userContainer/index";
import { ProfileContainer } from "./profileComponent/profileScreen/ProfileContainer";
import { styles } from "./style";
import { useValues } from '@src/utils/context/index';
import { appColors, appFonts, fontSizes, windowHeight } from "@src/themes";
import { deleteValue, getValue } from "@src/utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import DeviceInfo from "react-native-device-info";
import { accountDelete, couponListData, homeScreenPrimary, ticketDataGet, userSaveLocation, userZone } from "@src/api/store/actions";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import Images from "@src/utils/images";
import messaging from "@react-native-firebase/messaging";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useStoredLocation from "@src/components/helper/useStoredLocation";
import { useAppNavigation } from "@src/utils/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function ProfileSetting() {
  const { bgFullStyle, linearColorStyle, textColorStyle, viewRTLStyle, isDark, setNotificationValues } = useValues();
  const profileContainerRef = useRef(null);
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const { translateData } = useSelector((state: any) => state.setting);
  const dispatch = useDispatch();
  const [versionCode, setVersionCode] = useState("");
  const logoutSheetRef = useRef<BottomSheetModal>(null);
  const deleteSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%"], []);
  const snapPoints1 = useMemo(() => ["47%"], []);
  const { self } = useSelector(state => state.account);
  const { latitude, longitude } = useStoredLocation();
  const navigation = useNavigation();
  const { reset } = useAppNavigation();

  useEffect(() => {
    const loadNotification = async () => {
      try {
        const storedNotification = await AsyncStorage.getItem("isNotificationOn");
        if (storedNotification !== null) {
          setNotificationValues(storedNotification === "true");
        } else {
          await AsyncStorage.setItem("isNotificationOn", "true");
          setNotificationValues(true);
        }
      } catch (error) {
        console.error("Error loading notification value:", error);
        setNotificationValues(true);
      }
    };
    loadNotification();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (navigation.canGoBack()) {
          navigation.navigate("HomeScreen");
          return true;
        }
        return false;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  useEffect(() => {
    const fetchVersion = async () => {
      const version = await DeviceInfo.getVersion();
      setVersionCode(version);
    };
    fetchVersion();
    dispatch(userSaveLocation());
    dispatch(couponListData());
    dispatch(ticketDataGet());
  }, []);

  useEffect(() => {
    const Tokenvalue = async () => {
      const value = await getValue("token");
      setToken(value);
    };
    Tokenvalue();
  }, []);

  const openLogoutSheet = () => logoutSheetRef.current?.present();
  const openDeleteSheet = () => deleteSheetRef.current?.present();

  const handleSignIn = async () => {
    await dispatch(homeScreenPrimary())
    profileContainerRef.current?.gotoLoginWithoutNotification();
  };

  const handleLogout = () => {
    messaging().unsubscribeFromTopic(`user_${self?.id}`);
    profileContainerRef.current?.gotoLogout();
  };

  const handleDeleteAccount = async () => {
    messaging().unsubscribeFromTopic(`user_${self?.id}`);
    deleteAccounts();
  };

  const deleteAccounts = () => {
    dispatch(accountDelete())
      .unwrap()
      .then((res) => {
        deleteValue("token");
      })
      .catch((err) => {
        console.error("❌ Account delete error:", err)
      })
    notificationHelper("", translateData.accountDelete, "error");
    reset({ index: 0, routes: [{ name: "SignIn" }] });
    dispatch(homeScreenPrimary());
    dispatch(userZone({ lat: latitude, lng: longitude }));
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.main}>
        <SafeAreaView
          style={[styles.container, { backgroundColor: bgFullStyle }]}>
          <HeaderTab tabName={`${translateData.settingTitle}`} />
          <ScrollView
            contentContainerStyle={[external.Pb_30]}
            showsVerticalScrollIndicator={false}
            style={[
              commonStyles.flexContainer,
              external.pt_15,
              { backgroundColor: linearColorStyle },
            ]}>
            <UserContainer />
            <ProfileContainer
              ref={profileContainerRef}
              openLogoutSheet={openLogoutSheet}
              openDeleteSheet={openDeleteSheet}
            />
            <Text style={[styles.versionCode, { marginTop: windowHeight(11) }]}>
              {translateData.versionCode}: {versionCode}
            </Text>
          </ScrollView>

          {!token && (
            <View style={styles.signInMainView}>
              <View style={styles.signInView}>
                <Button
                  title={translateData.signIn}
                  textColor={appColors.whiteColor}
                  backgroundColor={appColors.primary}
                  onPress={handleSignIn}
                />
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={logoutSheetRef}
          index={1}
          enablePanDownToClose
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: "13%",
          }}
          snapPoints={snapPoints}
          backdropComponent={props => (
            <BottomSheetBackdrop {...props} pressBehavior="close" />
          )}
          backgroundStyle={{ backgroundColor: bgFullStyle }}>
          <BottomSheetView style={{ padding: windowHeight(15) }}>
            <View style={{ alignSelf: "center" }}>
              <FastImage
                source={Images.logout}
                style={{ height: windowHeight(50), width: windowHeight(50) }}
                resizeMode="stretch"
              />
            </View>
            <Text
              style={{
                color: textColorStyle,
                fontSize: fontSizes.FONT22,
                fontFamily: appFonts.medium,
                textAlign: "center",
                marginTop: windowHeight(30),
              }}>
              {translateData.logoutConfirm}
            </Text>
            <View
              style={{
                flexDirection: viewRTLStyle,
                marginTop: windowHeight(10),
                gap: 10,
              }}>
              <Button
                title={translateData.cancel}
                width="48%"
                backgroundColor={
                  isDark ? appColors.darkBorder : appColors.lightGray
                }
                textColor={textColorStyle}
                onPress={() => logoutSheetRef.current?.close()}
              />
              <Button
                title={translateData.logout}
                width="48%"
                backgroundColor={appColors.textRed}
                textColor={appColors.whiteColor}
                onPress={handleLogout}
              />
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={deleteSheetRef}
          index={1}
          snapPoints={snapPoints1}
          enablePanDownToClose
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: "13%",
          }}
          backdropComponent={props => (
            <BottomSheetBackdrop {...props} pressBehavior="close" />
          )}
          backgroundStyle={{ backgroundColor: bgFullStyle }}>
          <BottomSheetView style={{ padding: windowHeight(15) }}>
            <FastImage
              source={Images.delete}
              style={{
                height: windowHeight(90),
                width: windowHeight(100),
                alignSelf: "center",
                bottom: windowHeight(10),
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: isDark ? appColors.whiteColor : appColors.blackColor,
                fontFamily: appFonts.medium,
                fontSize: fontSizes.FONT22,
                top: windowHeight(1),
                alignSelf: "center",
              }}>
              {translateData.wantDeleteAccount}
            </Text>
            <Text
              style={{
                color: appColors.gray,
                textAlign: "center",
                fontFamily: appFonts.regular,
                fontSize: fontSizes.FONT16,
                width: "92%",
                top: windowHeight(8),
                alignSelf: "center",
              }}>
              {translateData.deleteAccountMsg}
            </Text>
            <View
              style={{
                width: "96%",
                top: windowHeight(29),
                alignSelf: "center",
              }}>
              <Button
                title={translateData.proceed}
                backgroundColor={appColors.primary}
                color={appColors.whiteColor}
                onPress={handleDeleteAccount}
              />
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
