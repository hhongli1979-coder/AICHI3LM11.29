import { TextInput, View, Text } from "react-native";
import React, { useState } from "react";
import { Button, CommonModal } from "@src/commonComponent";
import { external } from "../../../styles/externalStyle";
import { DescriptionText } from "./descriptionText/index";
import { PictureCargo } from "./pictureCargo/index";
import { useValues } from "@src/utils/context/index";
import { Calander } from "../../dateTimeSchedule/index";
import { appColors } from "@src/themes";
import { CountryCodeContainer } from "@src/screens/auth/signIn/signInComponents";
import { useAppNavigation } from "@src/utils/navigation";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { vehicleTypeDataGet } from "@src/api/store/actions";

export function Freight({ pickupLocation, stops, destination, service_ID, zoneValue, service_name, service_category_ID, scheduleDate, filteredLocations,
  pickupCoords, destinationCoords }) {
  const dispatch = useDispatch();
  const { navigate } = useAppNavigation();
  const [selected, setSelected] = useState(false);
  const { bgContainer, textColorStyle, textRTLStyle, isDark } = useValues();
  const [descriptionText, setDescriptionText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [parcelWeight, setParcelWeight] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { translateData, taxidoSettingData } = useSelector(state => state.setting);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [bookloading, setBookLoading] = useState(false);

  const handleDescriptionChange = text => {
    setDescriptionText(text);
  };

  const handleImageSelect = imageUri => {
    setSelectedImage(imageUri);
  };

  const closeModal = () => {
    setSelected(false);
  };

  const validateParcel = () => {
    const newErrors = {};

    if (!receiverName?.trim())
      newErrors.receiverName = translateData.enterReceiverName;
    if (!phoneNumber?.trim())
      newErrors.phoneNumber = translateData.enterPhoneNumber;
    if (!parcelWeight?.trim()) {
      newErrors.parcelWeight = translateData.enterParcelWeight;
    } else {
      const weight = parseFloat(parcelWeight);
      if (isNaN(weight) || weight > taxidoSettingData?.taxido_values?.ride?.parcel_weight_limit) {
        newErrors.parcelWeight = `max ${taxidoSettingData?.taxido_values?.ride?.parcel_weight_limit}kg Allow`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const gotoRide = () => {
    setBookLoading(true);
    if (service_name === "parcel" && !validateParcel()) {
      setBookLoading(false);
      return;
    }

    const payload = {
      locations: filteredLocations,
      service_id: service_ID,
      service_category_id: service_category_ID,
      weight: parcelWeight,
    };

    dispatch(vehicleTypeDataGet(payload)).then((res: any) => {
      navigate("BookRide", {
        destination,
        stops,
        pickupLocation,
        service_ID,
        zoneValue,
        descriptionText,
        selectedImage,
        parcelWeight,
        service_name,
        receiverName,
        countryCode,
        phoneNumber,
        service_category_ID,
        scheduleDate,
        pickupCoords,
        destinationCoords,
      });
      setBookLoading(false);
    });
  };

  return (
    <View>
      {service_name === "parcel" && (
        <View>
          <Text
            style={[
              styles.weightText,
              { color: textColorStyle, textAlign: textRTLStyle },
            ]}>
            {translateData.parcelReceiverName}
          </Text>
          <TextInput
            style={[styles.inputView, {
              backgroundColor: bgContainer,
              borderColor: isDark ? appColors.darkBorder : appColors.border,
              color: isDark ? appColors.darkText : appColors.blackColor,
              textAlign: textRTLStyle,
            }]}
            keyboardType="ascii-capable"
            placeholder={translateData.enterReceiverName}
            placeholderTextColor={appColors.regularText}
            value={receiverName}
            onChangeText={text => setReceiverName(text)}
          />
          {errors.receiverName && (
            <Text style={styles.errorText}>{errors.receiverName}</Text>
          )}

          <Text
            style={[
              styles.parcelText,
              { color: textColorStyle, textAlign: textRTLStyle },
            ]}>
            {translateData.parcelReceiverNumber}
          </Text>
          <CountryCodeContainer
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            backGroundColor={bgContainer}
            borderColor={isDark ? appColors.darkBorder : appColors.border}
            setError={setError}
            error={error}
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}

          <Text
            style={[
              styles.weightText,
              { color: textColorStyle, textAlign: textRTLStyle },
            ]}>
            {translateData.weightKg} (KG)
          </Text>
          <TextInput
            style={[styles.inputView, {
              backgroundColor: bgContainer,
              borderColor: isDark ? appColors.darkBorder : appColors.border,
              color: isDark ? appColors.darkText : appColors.blackColor,
              textAlign: textRTLStyle,
            }]}
            keyboardType="number-pad"
            placeholder={translateData.enterParcelWeight}
            placeholderTextColor={appColors.regularText}
            value={parcelWeight}
            onChangeText={text => setParcelWeight(text)}
          />
          {errors.parcelWeight && (
            <Text style={styles.errorText}>{errors.parcelWeight}</Text>
          )}
        </View>
      )}

      <DescriptionText onTextChange={handleDescriptionChange} />
      <PictureCargo
        onImageSelect={handleImageSelect}
        service_name={service_name}
      />

      <View style={[external.mv_15]}>
        <Button title={translateData.bookRide} onPress={gotoRide} loading={bookloading} />
      </View>

      <CommonModal
        isVisible={selected}
        onPress={closeModal}
        value={
          <View>
            <Calander onPress={closeModal} />
            <View style={styles.buttonView}>
              <Button title={translateData.Continue} onPress={closeModal} />
            </View>
          </View>
        }
      />
    </View>
  );
}
