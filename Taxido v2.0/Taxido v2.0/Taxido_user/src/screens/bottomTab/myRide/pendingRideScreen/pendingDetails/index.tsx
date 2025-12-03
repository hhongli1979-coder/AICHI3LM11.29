import { Image, Text, View } from "react-native";
import React from "react";
import { TaxiDetails } from "../../completeRideScreen/detailContainer/taxiDetails/index";
import { BillDetails } from "../../completeRideScreen/detailContainer/billDetails/index";
import { commonStyles } from "../../../../../styles/commonStyle";
import { external } from "../../../../../styles/externalStyle";
import { styles } from "./styles";
import { windowHeight } from "@src/themes";
import { useValues } from '@src/utils/context/index';
import { appColors, appFonts } from "@src/themes";
import { vehicleInterface } from "@src/api/interface/vehicleTypeInterface";
import { rideDetailsInterface } from "@src/api/interface/rideRequestInterface";
import { useSelector } from "react-redux";

type pendingdetailsProps = {
  rideDetails: rideDetailsInterface,
  vehicleData: vehicleInterface
}

export function PendingDetails({ rideDetails, vehicleData }: pendingdetailsProps) {
  const { bgFullStyle, viewRTLStyle, textRTLStyle, isDark } = useValues();
  const { translateData } = useSelector((state) => state.setting);

  return (
    < View>
      {rideDetails?.service?.slug !== "pending" && (
        <View
          style={[
            styles.pendingViewContainer,
            {
              flexDirection: viewRTLStyle,
              backgroundColor: bgFullStyle,
              borderColor: isDark ? appColors.darkBorder : appColors.border,
            },
          ]}
        >
          <Text
            style={[
              commonStyles.regularText,
              external.fg_1,
              [styles.rideOTPText,
              {
                textAlign: textRTLStyle,
                color: isDark ? appColors.whiteColor : appColors.primaryText
              }]
            ]}
          >
            {translateData.pendingRideOTP}
          </Text>
          <View style={{ flexDirection: viewRTLStyle }}>
            {rideDetails.otp
              ? rideDetails.otp
                .toString()
                .split("")
                ?.map((digit, index) => (
                  <Text key={index} style={styles.pin}>
                    {digit}
                  </Text>
                ))
              : null}
          </View>
        </View>
      )}

      <View style={[styles.container, { backgroundColor: bgFullStyle, borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
        <TaxiDetails
          texiDetail={rideDetails}
          paddingHorizontal={windowHeight(12.5)}
          vehicleData={vehicleData}
        />
        <View style={{ height: windowHeight(5), backgroundColor: isDark ? appColors.bgDark : appColors.lightGray, marginTop: windowHeight(5) }} />
        {rideDetails?.service?.slug == "parcel" ||
          (rideDetails?.service?.slug == "fright" && (
            <View style={styles.rideDetailsView}>
              <Image
                source={{
                  uri: "",
                }}
                style={styles.cargoImg}
              />
              <Text
                style={styles.paragraphText}
              >
                {translateData.pendingDetailsCargo}
              </Text>
              {rideDetails?.service?.slug == "parcel" && (
                <>
                  <View
                    style={[styles.parcelView, { flexDirection: viewRTLStyle }]}
                  >
                    <Text
                      style={styles.textStyle}
                    >
                      {translateData.pendingReceiverName}
                    </Text>
                    <Text
                      style={styles.textStyle}
                    >
                      {translateData.kamleshChaiwala}
                    </Text>
                  </View>

                  <View
                    style={[styles.dataContainer, { flexDirection: viewRTLStyle }]}
                  >
                    <Text
                      style={styles.textStyle}
                    >
                      {translateData.pendingReceiverNo}
                    </Text>
                    <Text
                      style={{
                        color: appColors.primaryText,
                        fontFamily: appFonts.regular,
                      }}
                    >
                      +91 12345 67890
                    </Text>
                  </View>
                  <View
                    style={[styles.dataContainer, { flexDirection: viewRTLStyle }]}
                  >
                    <Text
                      style={styles.textStyle}
                    >
                      {translateData.pendingParcelWeight}
                    </Text>
                    <Text
                      style={styles.textStyle}
                    >
                      1000KG
                    </Text>
                  </View>
                </>
              )}
            </View>
          ))}

        <BillDetails billDetail={rideDetails} />
      </View>
    </View>
  );
}
