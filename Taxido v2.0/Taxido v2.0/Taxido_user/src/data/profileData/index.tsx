import React from "react";
import { AppPages, Chat, HelpSupport, Location, PrivacyPolicIcon, ProfileSetting, PromoCode, Share } from "@utils/icons";
import { useSelector } from "react-redux";
import { View } from "react-native";
import ReferralId from "@src/assets/icons/referralID";

export const useProfileData = (staffUnread = 0) => {
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);

  const ChatWithStaffIcon = (
    <View>
      <HelpSupport />
      {staffUnread > 0 && (
        <View
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            borderRadius: 5,
            backgroundColor: "red",
          }}
        />
      )}
    </View>
  );
  return [
    {
      title: translateData.general,
      data: [
        {
          icon: <ProfileSetting />,
          title: translateData.profileSettings,
          screenName: "EditProfile",
        },
        {
          icon: <Location />,
          title: translateData.savedLocation,
          screenName: "SavedLocation",
        },
        ...(taxidoSettingData?.taxido_values?.activation?.coupon_enable == 1
          ? [
            {
              icon: <PromoCode />,
              title: translateData.promoCodeList,
              screenName: "PromoCodeScreen",
            },
          ]
          : []),
        ...(taxidoSettingData?.taxido_values?.activation?.referral_enable == 1
          ? [
            {
              icon: <ReferralId />,
              title:translateData?.erarnMoney,
              screenName: "ReferralID",
            },
          ]
          : []),
      ],
    },
    {
      title: translateData.appDetails,
      data: [
        {
          icon: <AppPages />,
          title: translateData.appPages,
          screenName: "AppPageScreen",
        },
        {
          icon: <Share />,
          title: translateData.shareApp,
          screenName: "Share",
        },
        {
          icon: <Chat />,
          title: translateData.chatSupport,
          screenName: "SupportTicket",
        },
        {
          icon: ChatWithStaffIcon,
          title: translateData?.chatwithstaff,
          screenName: "ChatScreen",
        },
        {
          icon: <PrivacyPolicIcon />,
          title: translateData.privacyPolicy,
          screenName: "PrivacyPolicy",
        },
      ],
    },
  ];
};

export const useGuestData = () => {
  const { translateData } = useSelector((state: any) => state.setting);

  return [
    {
      title: translateData.appDetails,
      data: [
        {
          icon: <AppPages />,
          title: translateData.appPages,
          screenName: "AppPageScreen",
        },
        {
          icon: <Share />,
          title: translateData.shareApp,
          screenName: "Share",
        },
      ],
    },
  ];
};
