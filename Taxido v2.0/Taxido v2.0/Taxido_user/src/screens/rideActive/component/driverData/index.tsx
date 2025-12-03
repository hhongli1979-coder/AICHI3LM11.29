import { View, Text, TouchableOpacity, Image, Share } from 'react-native';
import React from 'react';
import { useValues } from '@src/utils/context/index';
import styles from '../../styles';
import { LiveShare, Star, Verification } from '@utils/icons';
import { external } from '@src/styles/externalStyle';
import { appColors, windowWidth } from '@src/themes';
import { URL } from '@src/api/config';

interface DriverDataProps {
  driverData: () => void;
  driverDetail: any;
  rideData: any;
}

export function DriverData({ driverData, driverDetail, rideData }: DriverDataProps) {
  const { viewRTLStyle, textColorStyle, isDark } = useValues();


const handleShare = async () => {
  try {
    const message = 
`🚖 Taxido Ride Details

👨‍✈️ Driver Name : ${rideData?.driver?.name ?? "N/A"}
🚗 Vehicle Model : ${rideData?.vehicle_model ?? "N/A"}
🔢 Plate Number  : ${rideData?.plate_number ?? "N/A"}
📍 Pickup        : ${rideData?.locations?.[0] ?? "N/A"}
📡 Live Track    : ${URL}/cab/ride/track/${rideData?.uuid ?? ""}
`;

    const result = await Share.share({ message });

    if (result.action === Share.sharedAction) {
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    console.error("Error sharing:", error.message);
  }
};


  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
      <TouchableOpacity
        style={{ flexDirection: viewRTLStyle }}
        onPress={driverData}
        activeOpacity={0.7}>
        {driverDetail?.profile_image_url ? (
          <Image
            source={{ uri: driverDetail.profile_image_url }}
            style={styles.userImage}
          />
        ) : (
          <View style={[styles.userImage, styles.fallbackImage]}>
            <Text style={styles.initialText}>
              {driverDetail?.name?.charAt(0)?.toUpperCase() || 'D'}
            </Text>
          </View>
        )}{' '}
        <View style={styles.profileData}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.name, { color: textColorStyle }]}>
              {driverDetail?.name}
            </Text>
            <View style={{ marginHorizontal: windowWidth(5) }}><Verification /></View>
          </View>
          <View style={[external.ai_center, { flexDirection: viewRTLStyle }]}>
            <View style={styles.star}>
              <Star />
            </View>

            <Text style={[styles.rating, { color: textColorStyle }]}>
              {Number(driverDetail?.rating_count).toFixed(1)}
            </Text>
            <Text style={styles.review}>({driverDetail?.review_count})</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.share, { backgroundColor: isDark ? appColors.darkHeader : appColors.lightGray }]} onPress={handleShare}>
        <LiveShare />
      </TouchableOpacity>
    </View>
  );
}