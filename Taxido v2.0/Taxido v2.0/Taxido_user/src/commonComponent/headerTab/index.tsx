import React from "react";
import { Text, View } from "react-native";
import { commonStyles } from "../../styles/commonStyle";
import { external } from "../../styles/externalStyle";
import { IconBackground } from "../iconBackground/index";
import { Notification, Wallet } from "@utils/icons";
import { useValues } from '@src/utils/context/index';
import { getValue, setValue } from "@src/utils/localstorage";
import { useSelector } from "react-redux";
import { useAppNavigation } from "@src/utils/navigation";
import { appColors, windowHeight } from "@src/themes";
import { HeaderTabProps } from "../type";

export function HeaderTab({ tabName }: HeaderTabProps) {
  const { textColorStyle, linearColorStyleTwo, iconColorStyle, viewRTLStyle, textRTLStyle, isDark } = useValues();
  const { navigate, replace } = useAppNavigation();
  const { settingData } = useSelector((state: any) => state.setting);

  const gotoWallet = async () => {
    let token: string | null = null;
    await getValue("token").then(function (value) {
      token = value;
    });
    if (token) {
      navigate("Wallet");
    } else {
      let screenName = "Wallet";
      if (settingData.values.activation.login_number == 1) {
        setValue("CountinueScreen", screenName);
        replace("SignIn");
      } else if (settingData.values.activation.login_number == 0) {
        setValue("CountinueScreen", screenName);
        replace("SignInWithMail");
      }
    }
  };

  const gotoNotification = () => {
    navigate("Notifications")
  }

  return (
    <View
      style={[
        external.fd_row,
        external.ai_center,
        external.ph_20,
        {
          flexDirection: viewRTLStyle, height: windowHeight(47),
        },
      ]}
    >
      <Text
        style={[
          commonStyles.mediumText23,
          external.fg_1,
          { color: textColorStyle },
          { textAlign: textRTLStyle },
        ]}
      >
        {tabName}
      </Text>
      <View style={[external.mh_10]}>
        <IconBackground
          icon={<Notification colors={iconColorStyle} />}
          backgroundColor={linearColorStyleTwo}
          borderColor={isDark ? appColors.darkBorder : appColors.border}
          onPress={gotoNotification}
        />
      </View>
      <IconBackground
        icon={<Wallet colors={iconColorStyle} />}
        backgroundColor={linearColorStyleTwo}
        borderColor={isDark ? appColors.darkBorder : appColors.border}
        onPress={gotoWallet}
      />
    </View>
  );
}
