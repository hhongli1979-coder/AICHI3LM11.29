import React, { useState, useEffect, useContext, useRef } from "react";
import { Text, TouchableOpacity, View, ScrollView, Modal, FlatList, Keyboard, TextInput } from "react-native";
import { History, Calender, AddressMarker, Save, PickLocation } from "@utils/icons";
import { styles } from "./style";
import { commonStyles } from "../../styles/commonStyle";
import { external } from "../../styles/externalStyle";
import { SolidLine, Button, Header, InputText } from "@src/commonComponent";
import { useValues } from "@src/utils/context/index";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { userZone } from "../../api/store/actions/index";
import { vehicleTypeDataGet } from "../../api/store/actions/vehicleTypeAction";
import { appColors, windowHeight } from "@src/themes";
import { getValue, setValue } from "@src/utils/localstorage";
import { windowWidth } from "@src/themes";
import { useAppNavigation } from "@src/utils/navigation";
import { LocationContext } from "@src/utils/locationContext";
import useStoredLocation from "@src/components/helper/useStoredLocation";

export function RentalLocation() {
  const dispatch = useDispatch();
  const { navigate, replace } = useAppNavigation();
  const [selectedCal, setSelectedCal] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [destination, setDestination] = useState<string>("");
  const [stops, setStops] = useState<string[]>([]);
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const route = useRoute();
  const { ScreenValue } = route.params || {};
  const { service_ID, service_category_ID, service_name, service_category_slug, formattedDate, formattedTime } = route.params;
  const { selectedAddress, fieldValue } = route.params || {};
  const [fieldLength, setFieldLength] = useState<number>(0);
  const [addressData, setAddressData] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);
  const { zoneValue } = useSelector((state) => state.zone);
  const [recentDatas, setRecentDatas] = useState<string[]>([]);
  const { translateData, settingData } = useSelector((state) => state.setting);
  const context = useContext(LocationContext);
  const { latitude, longitude } = useStoredLocation();
  const { linearColorStyleTwo, linearColorStyle, viewRTLStyle, textColorStyle, bgFullLayout, textRTLStyle, isDark, Google_Map_Key } = useValues();
  const [pickupCoords, setPickupCoords] = useState();
  const { pickupLocationLocal, setPickupLocationLocal } = context;
  const pickupRef = useRef<TextInput>(null);


  useEffect(() => {
    fetchAddressFromCoords(latitude, longitude);
  }, [latitude, longitude]);

  const fetchAddressFromCoords = async (latitude, longitude) => {
    if (!latitude || !longitude) return;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Google_Map_Key}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json.status === "OK" && json.results.length > 0) {
        const addressComponents = json.results[0].address_components;

        const routeName = addressComponents.find(comp => comp.types.includes('route'))?.short_name;
        const locality = addressComponents.find(comp => comp.types.includes('locality'))?.short_name;
        const subLocality = addressComponents.find(comp => comp.types.includes('sublocality'))?.short_name;

        const shortAddress = [routeName, subLocality || locality].filter(Boolean).join(', ');
        const fullAddress = json?.results[0]?.formatted_address;
        const locationToSet = shortAddress || fullAddress;

        // Set state utama
        setPickupLocation(locationToSet);
      }
    } catch (error) {
      console.error("Error fetching short address:", error);
    }
  };

  useEffect(() => {
    if (pickupLocation) {
      setPickupLocationLocal(pickupLocation);
    }
  }, [pickupLocation]);

  useEffect(() => {
    if (fieldValue === "pickupLocation" && selectedAddress) {
      setPickupLocation(selectedAddress);
    } else if (fieldValue === "destination") {
      setDestination(selectedAddress);
    } else if (fieldValue && fieldValue.startsWith("stop-")) {
      const stopIndex = parseInt(fieldValue.split("-")[1], 10) - 1;
      const updatedStops = [...stops];
      updatedStops[stopIndex] = selectedAddress;
      setStops(updatedStops);
    }
  }, [selectedAddress, fieldValue]);


  useEffect(() => {
    if (pickupLocation) convertToCoords(pickupLocation, setPickupCoords);
  }, [pickupLocation]);

  const convertToCoords = async (address, setter) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${Google_Map_Key}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setter({ latitude: lat, longitude: lng });
      } else {
        console.warn("No results for:", address, data.status);
        setter(null);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setter(null);
    }
  };


  useEffect(() => {
    const fetchRecentData = async () => {
      const stored = await getValue("locations");
      if (stored) {
        const parsedLocations = JSON.parse(stored);
        setRecentDatas(parsedLocations);
      }
    };
    fetchRecentData();
  }, []);

  const fetchAddressSuggestions = async (input: string) => {
    if (input.length >= 3) {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${Google_Map_Key}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== "OK") {
          console.error("API Error:", data.status, data.error_message || "");
          return;
        }
        if (data.predictions) {
          const places = data.predictions.map((prediction) => ({
            id: prediction.place_id,
            shortAddress: prediction.structured_formatting.main_text,
            detailAddress: prediction.structured_formatting.secondary_text,
          }));
          setSuggestions(places);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    Keyboard.dismiss();
    if (activeField === "pickupLocation") {
      setPickupLocation(suggestion);
    } else if (activeField === "destination") {
      setDestination(suggestion);
    } else if (activeField && activeField.startsWith("stop-")) {
      const stopIndex = parseInt(activeField.split("-")[1], 10) - 1;
      const updatedStops = [...stops];
      updatedStops[stopIndex] = suggestion;
      setStops(updatedStops);
    }
  };

  useEffect(() => {
    fetchAddressSuggestions(addressData);
  }, [addressData]);

  useEffect(() => {
    let length = 0;
    let addressDataValue = "";

    if (activeField === "pickupLocation") {
      length = pickupLocation.length;
      addressDataValue = pickupLocation;
    } else if (activeField === "destination") {
      length = destination.length;
      addressDataValue = destination;
    } else if (activeField && activeField.startsWith("stop-")) {
      const stopIndex = parseInt(activeField.split("-")[1], 10) - 1;
      const stopData = stops[stopIndex];
      if (stopData !== undefined) {
        length = stopData.length;
        addressDataValue = stopData;
      }
    }
    setAddressData(addressDataValue);
    setFieldLength(length);
  }, [activeField, stops, pickupLocation, destination]);

  const coordsData = async () => {
    const geocodeAddress = async (address) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${Google_Map_Key}`
        );
        const dataMap = await response.json();
        if (dataMap.results.length > 0) {
          const location = dataMap.results[0].geometry.location;
          return {
            latitude: location.lat,
            longitude: location.lng,
          };
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
      return null;
    };

    const fetchCoordinates = async () => {
      try {
        const pickup = await geocodeAddress(pickupLocation);
        if (pickup?.latitude && pickup?.longitude) {
          dispatch(userZone({ lat: pickup.latitude, lng: pickup.longitude }));
          getVehicleTypes(pickup.latitude, pickup.longitude);
          setIsInitialFetchDone(true);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  };

  const getVehicleTypes = (lat: number, lng: number) => {
    const payload = {
      locations: [
        {
          lat: latitude,
          lng: longitude,
        },
      ],
      service_id: service_ID.toString(),
      service_category_id: service_category_ID.toString(),
    };
    dispatch(vehicleTypeDataGet(payload)).then(res => {
    });
  };

  useEffect(() => {
    if (zoneValue && isInitialFetchDone) {
      gotoNext();
    }
  }, [zoneValue, isInitialFetchDone]);

  const gotoBook = async () => {
    const token = await getValue('token');
    if (!token) {
      navigate('SignIn')
    }

    setLoading(true);
    if (pickupLocation.length <= 0) {
      setModalVisible(true);
    } else {
      coordsData();
    }
  };

  const gotoNext = () => {
    setLoading(false)
    navigate("Rental", {
      pickupLocation,
      service_ID,
      service_category_ID,
      zoneValue,
      pickupCoords
    });
  };

  const gotoSelection = () => {
    Keyboard.dismiss();
    navigate("LocationSelect", { field: activeField, screenValue: "RentalLocation", service_ID: service_ID, service_name: service_name, service_category_ID: service_category_ID, service_category_slug: service_category_slug, formattedDate: formattedDate, formattedTime: formattedTime });
  };

  const handlerecentClick = (suggestion: string) => {
    Keyboard.dismiss();
    if (activeField === "pickupLocation") {
      setPickupLocation(suggestion.location);
    } else if (activeField === "destination") {
      setDestination(suggestion.location);
    } else if (activeField && activeField.startsWith("stop-")) {
      const stopIndex = parseInt(activeField.split("-")[1], 10) - 1;
      const updatedStops = [...stops];
      updatedStops[stopIndex] = suggestion;
      setStops(updatedStops);
    }
  };

  const modelOpen = () => {
    setModalVisible(false)
    setLoading(false)
  }

  const handleInputChange = (text: string, id: number) => {
    if (id === 1) {
      setPickupLocationLocal(text);
      setPickupLocation(text);
    }
  };

  const handleFocus = (id: number) => {
    if (id === 1) {
      setActiveField('pickupLocation');
    }
  };

  const gotoSaveLocation = async () => {
    let token = "";
    await getValue("token").then(function (value) {
      token = value;
    });
    if (token) {
      navigate("SavedLocation", { selectedLocation: "RentalLocation", savefield: activeField, service_ID: service_ID, service_name: service_name, service_category_ID: service_category_ID, service_category_slug: service_category_slug, formattedDate: formattedDate, formattedTime: formattedTime });
    } else {
      let screenName = "RentalLocation";
      if (settingData.values.activation.login_number == 1) {
        setValue("CountinueScreen", screenName);
        replace("SignIn");
      } else if (settingData.values.activation.login_number == 0) {
        setValue("CountinueScreen", screenName);
        replace("SignInWithMail");
      }
    }
  };

  const renderItemRecentData = ({ item: suggestion, index }) => (
    <View style={{ paddingHorizontal: windowWidth(15) }}>
      <TouchableOpacity
        activeOpacity={0.7}
        key={index}
        style={{
          height: windowHeight(50),
          flexDirection: viewRTLStyle,
          alignItems: "center",
        }}
        onPress={() => handlerecentClick(suggestion)}
      >
        <View
          style={[
            styles.historyBtn,
            {
              backgroundColor: isDark
                ? appColors.darkBorder
                : appColors.lightGray,
            },
          ]}
        >
          <History />
        </View>
        <Text
          style={[
            styles.locationText1,
            { color: isDark ? appColors.whiteColor : appColors.primaryText },
            { textAlign: textRTLStyle },
          ]}
        >
          {suggestion.location}
        </Text>
      </TouchableOpacity>
      {index !== recentDatas.length - 1 && (
        <View
          style={[
            styles.bottomLine,
            {
              borderColor: isDark ? appColors.darkBorder : appColors.lightGray,
            },
          ]}
        />
      )}
    </View>
  );

  return (
    <ScrollView
      style={[external.fx_1, { backgroundColor: linearColorStyle }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Header
        value={translateData.location}
        backgroundColor={isDark ? appColors.colorBg : appColors.whiteColor}
      />
      {ScreenValue === "Schedule" && (
        <View
          style={[
            styles.dateTimeView,
            {
              backgroundColor: linearColorStyleTwo,
            },
          ]}
        >
          <InputText
            title={translateData.dateAndTime}
            backgroundColor={linearColorStyleTwo}
            placeholder={translateData.selectDateTime}
            rightIcon={<Calender />}
            onPress={() => setSelectedCal(true)}
          />
        </View>
      )}
      <View
        style={[
          styles.horizontalView,
          {
            backgroundColor: isDark ? appColors.colorBg : appColors.whiteColor,
          },
        ]}
      >

        <View style={[styles.containerSearch, { backgroundColor: isDark ? appColors.colorBg : appColors.lightGray }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
          <View style={[styles.inputContainer, { flexDirection: viewRTLStyle }]}>
            <View style={styles.iconContainer}>
              <PickLocation width={20} height={20} />
            </View>
            <View style={styles.inputWithIcons}>
              <TextInput
                ref={pickupRef}
                style={[styles.input, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                placeholderTextColor={isDark ? appColors.darkText : appColors.regularText}
                placeholder={translateData.pickupLocation}
                value={pickupLocationLocal}
                onChangeText={(text) => handleInputChange(text, 1)}
                onFocus={() => handleFocus(1)}
              />
            </View>
          </View>
        </View>
        <View
          style={[
            styles.locateOnMapView,
            {
              flexDirection: viewRTLStyle,
            },
          ]}
        >
          <TouchableOpacity
            onPress={gotoSelection}
            activeOpacity={0.7}
            style={[
              styles.pickBtn,
              { flexDirection: viewRTLStyle },
              {
                backgroundColor: isDark
                  ? appColors.lightPrimary
                  : appColors.selectPrimary,
              },
            ]}
          >
            <View style={external.mh_5}>
              <PickLocation />
            </View>
            <Text style={[styles.locationText, { color: textColorStyle }]}>
              {translateData.locateonmap}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={gotoSaveLocation}
            activeOpacity={0.7}
            style={[styles.saveBtn, { flexDirection: viewRTLStyle }]}
          >
            <View style={external.mh_5}>
              <Save />
            </View>
            <Text style={styles.saveText}>{translateData.savedLocation}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.recentView, { backgroundColor: linearColorStyle }]}>
        <Text
          style={[
            commonStyles.mediumText23,
            { color: textColorStyle, textAlign: textRTLStyle },
          ]}
        >
          {fieldLength >= 3 ? translateData.addressSuggestionText : translateData.recentTextAddress}
        </Text>
        <View
          style={[
            styles.mapView,
            {
              backgroundColor: isDark
                ? appColors.darkPrimary
                : appColors.whiteColor,
            },
            { borderColor: isDark ? appColors.darkBorder : appColors.border },
          ]}
        >
          {suggestions.length >= 3 ? (
            suggestions?.map((suggestion, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.addressBtn, { flexDirection: viewRTLStyle }]}
                key={index}
                onPress={() => handleSuggestionClick(suggestion?.shortAddress)}
              >
                <View
                  style={[
                    styles.addressView,
                    {
                      backgroundColor: isDark
                        ? appColors.bgDark
                        : appColors.lightGray,
                    },
                  ]}
                >
                  <AddressMarker />
                </View>
                <View>
                  <View
                    style={[
                      { flexDirection: viewRTLStyle },
                      styles.spaceing,
                    ]}
                  >
                    <View>
                      <Text
                        style={[
                          styles.titleText,
                          {
                            color: textColorStyle,
                            textAlign: textRTLStyle,
                          },
                        ]}
                      >
                        {suggestion?.shortAddress}
                      </Text>
                      <Text
                        style={[
                          styles.titleTextDetail,
                          {
                            textAlign: textRTLStyle,
                          },
                        ]}
                      >
                        {suggestion?.detailAddress}
                      </Text>
                    </View>
                  </View>
                  {index !== suggestions.length - 1 ? (
                    <View style={external.mh_10}>
                      <SolidLine color={bgFullLayout} />
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          ) : Array.isArray(recentDatas) && recentDatas.length > 0 ? (
            <FlatList
              data={recentDatas}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItemRecentData}
            />
          ) : (
            <Text style={[styles.noDataText, { color: textColorStyle }]}>
              {translateData.nodataFound}
            </Text>
          )}
        </View>
        <View style={[external.mv_15]}>
          <Button title={translateData.proceed} onPress={gotoBook} loading={loading} />
        </View>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{translateData.enterPickupLocation}</Text>
            <Button title={translateData.close} onPress={modelOpen} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}