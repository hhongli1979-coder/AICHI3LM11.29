import { View, Text, Image, TouchableOpacity, Modal, Linking, Share } from "react-native";
import React, { useState } from "react";
import styles from "../../styles";
import { useValues } from "@src/utils/context/index";
import Images from "@utils/images";
import { Call, LiveShare, Star, Verification } from "@utils/icons";
import { useNavigation } from "@react-navigation/native";
import { ModalContect } from "@src/screens/rideActive/component/modalContect";
import { external } from "@src/styles/externalStyle";
import { appColors, appFonts, windowHeight, windowWidth } from "@src/themes";
import { useSelector } from "react-redux";

export function DriverData({ driverDetails }: { driverDetails: any }) {
  const { bgFullStyle, viewRTLStyle, textColorStyle, isDark } = useValues();
  const { navigate } = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { translateData } = useSelector((state: any) => state.setting);

  const gotoChat = (item) => {
    navigate("ChatScreen", {
      driverId: item?.driver?.id,
      riderId: item?.rider?.id,
      rideId: item?.id,
      driverName: item?.driver?.name,
      driverImage: item?.driver?.profile_image_url,
    });
  };

  const gotoCall = (item) => {
    const phoneNumber = `${item?.driver?.phone}`;
    Linking.openURL(`tel:${phoneNumber}`);
  };


const handleShare = async () => {
  try {
    const message = 
`🚖 Taxido Ride Details

📍 Pickup        : ${driverDetails?.locations?.[0] ?? "N/A"}
👨‍✈️ Driver Name   : ${driverDetails?.driver?.name ?? "N/A"}
🚗 Vehicle Model  : ${driverDetails?.vehicle_model ?? "N/A"}
🔢 Plate Number   : ${driverDetails?.plate_number ?? "N/A"}
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
          <Image source={Images.profileUser} style={styles.driverImage} />
          <View style={styles.details}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.name, { color: textColorStyle }]}>
                {driverDetails?.driver?.name}
              </Text>
              <View style={{ marginHorizontal: windowWidth(5) }}>
                <Verification />
              </View>
            </View>
            <View style={[external.ai_center, { flexDirection: viewRTLStyle }]}>
              <View style={styles.star}>
                <Star />
              </View>
              <Text style={[styles.rating, { color: textColorStyle }]}>
                {Number(driverDetails?.driver?.rating_count).toFixed(1)}
              </Text>
              <Text style={styles.totalReview}>({driverDetails?.driver?.review_count})</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={handleShare} style={[styles.message, { backgroundColor: appColors.lightGray, borderRadius: windowHeight(5) }]} activeOpacity={0.7}>
          <LiveShare />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: viewRTLStyle, justifyContent: 'space-between', marginBottom: windowHeight(8), marginHorizontal: windowWidth(12) }}>
        <TouchableOpacity
          onPress={() => gotoChat(driverDetails)}
          style={[
            styles.message,
            {
              backgroundColor: isDark
                ? appColors.darkHeader
                : appColors.lightGray,
              height: windowHeight(40),
              width: windowWidth(355),
              alignItems: 'flex-start',
              borderRadius: windowHeight(5)
            },
          ]}
          activeOpacity={0.7}>
          <Text style={{ marginHorizontal: windowWidth(10), fontFamily: appFonts.regular }}>{translateData.sendMessage}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.call,
            {
              backgroundColor: appColors.primary,
            },
          ]}
          onPress={() => gotoCall(driverDetails)}
        >
          <Call color={appColors.whiteColor} />
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <ModalContect onpress={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
}
