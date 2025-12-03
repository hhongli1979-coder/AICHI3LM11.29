import { View, Text, ActivityIndicator, Image } from "react-native";
import React from "react";
import { useValues } from '@src/utils/context/index';
import styles from "../../styles";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { useSelector } from "react-redux";

export function TexiDetail({ otp, vehicleData }: { otp: number, vehicleData: any }) {
  const { viewRTLStyle, textRTLStyle, isDark } = useValues();
  const { translateData } = useSelector((state) => state.setting);


  return (
    <>
      {otp ? (
        <View style={[styles.texiDetail]}>
          <View style={[styles.pinView, { alignItems: 'center' }]}>
            <View style={{ flexDirection: viewRTLStyle }}>
              {otp
                ? otp
                  .toString()
                  .split("")
                  ?.map((digit, index) => (
                    <Text key={index} style={styles.pin}>
                      {digit}
                    </Text>
                  ))
                : null}
            </View>

            <Text
              style={[
                styles.pinTitle,
                { color: appColors.regularText, textAlign: textRTLStyle },
              ]}
            >
              {translateData.pin}
            </Text>
          </View>
          <View style={styles.detailView}>
            <View style={{ height: windowHeight(40), width: windowWidth(100), backgroundColor: isDark ? appColors.darkHeader : appColors.lightGray, borderRadius: windowHeight(5), alignItems: 'center', justifyContent: 'center' }}>
              <Image source={{ uri: vehicleData?.vehicle_type?.vehicle_image_url }} style={{ height: windowHeight(40), width: windowWidth(80), resizeMode: 'contain' }} />
            </View>
            <View style={{ marginHorizontal: windowWidth(10), height: windowHeight(40), justifyContent: 'center' }}>
              <Text
                style={[
                  styles.texiNo,
                  { color: isDark ? appColors.whiteColor : appColors.primaryText, textAlign: textRTLStyle },
                ]}
              >{vehicleData?.plate_number}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[
                  styles.textName,
                  { color: appColors.regularText, textAlign: textRTLStyle },
                  { marginRight: windowWidth(4) }
                ]}>
                  {vehicleData?.vehicle_type?.color}
                </Text>
                <Text
                  style={[
                    styles.textName,
                    { color: appColors.regularText, textAlign: textRTLStyle },
                  ]}
                >
                  {vehicleData?.vehicle_model}
                </Text>
              </View>
            </View>
          </View>

        </View >
      ) : (
        <View style={[styles.loader, { flexDirection: viewRTLStyle }]}>
          <ActivityIndicator size="large" color={appColors.primary} />
        </View>
      )
      }
    </>
  );
}
