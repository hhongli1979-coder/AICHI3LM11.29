import { View, Text, Image, TouchableOpacity, Share, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import styles from "../../styles";
import { useValues } from "@src/utils/context/index";
import Images from "@utils/images";
import { Call, LiveShare, RatingStar, Verification } from "@utils/icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { appColors, appFonts, windowHeight, windowWidth } from "@src/themes";
import { URL } from "@src/api/config";

export function DriverData({ driverDetails, duration }) {
  const { bgFullStyle, viewRTLStyle, textColorStyle, textRTLStyle } = useValues();
  const { navigate } = useNavigation();
  const [endTime, setEndTime] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const { translateData } = useSelector((state) => state.setting);
  const { isDark } = useValues()

  const gotoChat = () => {
    navigate("ChatScreen", { driverId: driverDetails?.driver?.id, riderId: driverDetails?.rider?.id, rideId: driverDetails?.id, driverName: driverDetails?.driver?.name, driverImage: driverDetails?.driver?.profile_image_url });
  };

  const gotoDiler = (phoneNumber: number) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedCurrentTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    setCurrentTime(formattedCurrentTime);
    const endTime = new Date(now.getTime() + duration * 60 * 1000);
    const endHours = endTime.getHours();
    const endMinutes = endTime.getMinutes();
    const endAmpm = endHours >= 12 ? "PM" : "AM";
    const formattedEndHours = endHours % 12 || 12;
    const formattedEndMinutes = endMinutes < 10 ? `0${endMinutes}` : endMinutes;
    const formattedEndTime = `${formattedEndHours}:${formattedEndMinutes} ${endAmpm}`;
    setEndTime(formattedEndTime);
  }, []);

const handleShare = async () => {
  try {
    const message = 
`🚖 Taxido Ride Details

🕒 Expected Arrival : ${endTime ?? "N/A"}
📍 Pickup           : ${driverDetails?.locations?.[0] ?? "N/A"}
🏁 Destination      : ${driverDetails?.locations?.[1] ?? "N/A"}
👨‍✈️ Driver Name     : ${driverDetails?.driver?.name ?? "N/A"}

🚗 Vehicle Details
   • Type          : ${driverDetails?.vehicle_type?.vehicle_model ?? "N/A"}
   • Plate Number  : ${driverDetails?.vehicle_type?.plate_number ?? "N/A"}

📡 Live Tracking   : ${URL}/cab/ride/track/${driverDetails?.uuid ?? ""}
`;

    const result = await Share.share({ message });

    if (result.action === Share.sharedAction) {
      // shared successfully
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    console.error("Error sharing:", error.message);
  }
};


  return (
    <View style={[styles.card1, { backgroundColor: bgFullStyle }]}>
      <View style={[styles.subCard1, { flexDirection: viewRTLStyle }]}>
        <View style={{ flexDirection: viewRTLStyle }}>
          <Image
            source={
              driverDetails?.driver?.profile_image_url
                ? { uri: driverDetails?.driver?.profile_image_url }
                : Images.defultImage
            }
            style={styles.driverImage}
          />
          <View style={styles.details}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.name, { color: textColorStyle }]}>
                {driverDetails?.driver?.name}
              </Text>
              <View style={{ marginHorizontal: windowWidth(5) }}>
                <Verification />
              </View>
            </View>
            <View style={{ flexDirection: viewRTLStyle, marginTop: windowHeight(3) }}>
              <RatingStar />
              <View style={{ flexDirection: 'row', marginHorizontal: windowWidth(3) }}>
                <Text style={[styles.rating, { color: textColorStyle }]}>
                  {Number(driverDetails?.driver?.rating_count).toFixed(1)}
                </Text>
                <Text style={styles.totalReview}>
                  ({driverDetails?.driver?.review_count})
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: viewRTLStyle }}>
          <TouchableOpacity onPress={handleShare} style={[styles.message, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray, borderRadius: windowHeight(5) }]} activeOpacity={0.7}>
            <LiveShare />
          </TouchableOpacity>
        </View>
      </View>
      <View />
      <View style={{ flexDirection: viewRTLStyle, justifyContent: 'space-between', marginBottom: windowHeight(8) }}>
        <TouchableOpacity
          onPress={gotoChat}
          style={[
            styles.message,
            {
              backgroundColor: isDark
                ? appColors.bgDark
                : appColors.lightGray,
              height: windowHeight(40),
              width: windowWidth(355),
              alignItems: 'flex-start'
            },
          ]}
          activeOpacity={0.7}>
          <Text style={{ marginHorizontal: windowWidth(10), fontFamily: appFonts.regular, color: appColors.regularText }}>{translateData.sendMessage}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.call,
            {
              backgroundColor: appColors.primary,
            },
          ]}
          onPress={() => gotoDiler(driverDetails?.driver?.phone)}
        >
          <Call color={appColors.whiteColor} />
        </TouchableOpacity>
      </View>
      <View style={{ borderBottomWidth: 1, borderColor: isDark ? appColors.darkBorder : appColors.border, marginTop: windowHeight(4) }} />

      {driverDetails?.service?.service_type === 'parcel' &&
        <>
          <View style={{ borderBottomWidth: 1, borderColor: isDark ? appColors.darkBorder : appColors.border }} />
          <View style={{ flexDirection: viewRTLStyle, alignItems: "center", justifyContent: 'space-between', marginTop: windowHeight(15), marginBottom: windowHeight(-5) }}>
            <Text style={[
              styles.number1,
              { color: textColorStyle, textAlign: textRTLStyle },
            ]}>{translateData?.deliveryOtp}</Text>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              {driverDetails?.parcel_delivered_otp
                ?.toString()
                .padStart(4, "0")
                .split("")
                .map((digit, index) => (
                  <View key={index} style={styles.pinBox}>
                    <Text style={styles.pin}>{digit}</Text>
                  </View>
                ))}
            </View>
          </View>
        </>
      }
    </View >
  );
}
