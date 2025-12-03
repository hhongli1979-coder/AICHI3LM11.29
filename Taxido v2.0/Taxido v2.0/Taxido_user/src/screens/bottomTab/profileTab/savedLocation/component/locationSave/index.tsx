import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from "@react-navigation/native";
import darkMapStyle from "@src/screens/darkMapStyle";
import Images from "@utils/images";
import { useValues } from "@src/utils/context/index";;
import styles from "./styles";
import { Back, AddressMarker } from "@src/utils/icons";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { Button } from "@src/commonComponent";
import { SaveLocationDataInterface } from "@src/api/interface/saveLocationinterface";
import { addSaveLocation, updateSaveLocation } from "@src/api/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { userSaveLocation } from "@src/api/store/actions/saveLocationAction";
import { external } from "@src/styles/externalStyle";
import useStoredLocation from "@src/components/helper/useStoredLocation";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

interface RouteParams {
  mode?: string;
  locationID?: number;
  locationDetails?: {
    title?: string;
    type?: string;
    latitude?: number;
    longitude?: number;
  };
}

const BackButton = React.memo(({ onPress, linearColorStyle }: { onPress: () => void; linearColorStyle: string }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[styles.backView, { backgroundColor: linearColorStyle }]}
  >
    <Back />
  </TouchableOpacity>
));

const AddressInput = React.memo(({
  fetchingAddress,
  currentAddress,
  translateData,
  linearColorStyle,
  textColorStyle,
  viewRTLStyle,
  isDark,
  darkBorder,
  primaryGray
}: any) => (
  <View style={[styles.textInputContainer, { backgroundColor: linearColorStyle }, { flexDirection: viewRTLStyle }]}>
    <View style={[styles.addressMarkerIcon, { backgroundColor: linearColorStyle }]}>
      <AddressMarker />
    </View>
    <View
      style={[styles.inputLine, {
        borderColor: isDark ? darkBorder : primaryGray,
      }]}
    />
    <TextInput
      style={[styles.textInput, { backgroundColor: linearColorStyle }, { color: textColorStyle }]}
      value={fetchingAddress ? translateData.gettingAddress : currentAddress || translateData.moveMapToSelectLocation}
      placeholder={translateData.searchHere}
      placeholderTextColor={textColorStyle}
      editable={false}
    />
  </View>
));

const ConfirmButton = React.memo(({
  onPress,
  fetchingAddress,
  loadingMap,
  translateData,
  whiteColor
}: any) => (
  <TouchableOpacity
    style={styles.confirmButton}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={fetchingAddress || loadingMap}
  >
    {fetchingAddress ? (
      <ActivityIndicator size="large" color={whiteColor} />
    ) : (
      <Text style={styles.confirmText}>{translateData.confirmLocation}</Text>
    )}
  </TouchableOpacity>
));

const PinMarker = React.memo(({ pinImage }: { pinImage: any }) => (
  <View style={styles.pointerMarker}>
    <Image source={pinImage} style={styles.pinImage} />
  </View>
));

export function LocationSave() {
  const { isDark, linearColorStyle, textColorStyle, viewRTLStyle, textRTLStyle, Google_Map_Key, bgFullStyle } = useValues();
  const [currentAddress, setCurrentAddress] = useState("");
  const { goBack } = useNavigation();
  const route = useRoute();
  const { mode, locationID, locationDetails } = (route.params || {}) as RouteParams;
  const [locationTitle, setLocationTitle] = useState(locationDetails?.title || "");
  const dispatch = useDispatch();
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);
  const { latitude, longitude } = useStoredLocation();
  const webViewRef = useRef<WebView>(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [isLocationInitialized, setIsLocationInitialized] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [mapCenterCoords, setMapCenterCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [saveLoading, setsaveLoading] = useState(false);
  const saveLocationBottomSheetRef = useRef<BottomSheet>(null);
  const saveLocationSnapPoints = useMemo(() => ['1%', '39%'], []);
  const mapType = taxidoSettingData?.taxido_values?.location?.map_provider;

  // Memoize options to prevent re-creation on each render
  const options = useMemo(() => [
    { label: translateData.home, value: "home" },
    { label: translateData.work, value: "work" },
    { label: translateData.other, value: "other" },
  ], [translateData.home, translateData.work, translateData.other]);

  const validTypes = useMemo(() => options.map(opt => opt.value), [options]);

  const [selectedOption, setSelectedOption] = useState(() =>
    validTypes.includes(locationDetails?.type || "")
      ? locationDetails?.type || ""
      : options[0].value
  );

  // Memoize map HTML to prevent unnecessary re-renders
  const mapHtml = useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
        ${isDark ? `body { background-color: #000; }` : ''}
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        let map;
        let debounceTimer;

        function initMap() {
          const initialCoords = { lat: ${latitude || 21.1702}, lng: ${longitude || 72.8311} };
          map = new google.maps.Map(document.getElementById('map'), {
            center: initialCoords,
            zoom: 15,
            styles: ${isDark ? JSON.stringify(darkMapStyle) : '[]'},
            disableDefaultUI: true
          });

          map.addListener('center_changed', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
              const center = map.getCenter();
              window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: center.lat(), longitude: center.lng() }));
            }, 500);
          });

         // Initial position post
          window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: initialCoords.lat, longitude: initialCoords.lng }));
        }
      </script>
      <script async defer src="https://maps.googleapis.com/maps/api/js?key=${Google_Map_Key}&callback=initMap"></script>
    </body>
    </html>
  `, [latitude, longitude, Google_Map_Key, isDark]);

  const OsmapHtml = useMemo(() => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; margin: 0; padding: 0; }
      ${isDark ? `body { background-color: #000; }` : ''}
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
      let map;
      let debounceTimer;

      function initMap() {
        const initialCoords = [${latitude || 21.1702}, ${longitude || 72.8311}];

        map = L.map('map', {
          center: initialCoords,
          zoom: 15,
          zoomControl: false
        });

        // Tile layer (OpenStreetMap standard)
        const tileLayer = L.tileLayer(
          ${isDark
      ? "'https://tiles.stadiamaps.com/tiles/alidade_dark/{z}/{x}/{y}{r}.png'"
      : "'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'"}, 
          {
            attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'
          }
        ).addTo(map);

        // Listen to map move
        map.on('moveend', () => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            const center = map.getCenter();
            window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: center.lat, longitude: center.lng }));
          }, 500);
        });

        // Initial position post
        window.ReactNativeWebView.postMessage(JSON.stringify({ latitude: initialCoords[0], longitude: initialCoords[1] }));
      }

      // Initialize map
      initMap();
    </script>
  </body>
  </html>
`, [latitude, longitude, isDark]);

  // Memoize fetchAddress to prevent recreation
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    if (!Google_Map_Key) {
      console.warn("[fetchAddress] Missing Google Map Key");
      setCurrentAddress("Google Map Key is missing");
      return;
    }

    try {
      setFetchingAddress(true);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${Google_Map_Key}&result_type=street_address`;
      const res = await fetch(url);
      const json = await res.json();

      if (json?.results?.length > 0) {
        const formattedAddress = json.results[0].formatted_address;
        setCurrentAddress(formattedAddress);
      } else {
        setCurrentAddress("No address found");
      }
    } catch (err) {
      console.error("[fetchAddress] Error:", err);
      setCurrentAddress("Address fetch failed");
    } finally {
      setFetchingAddress(false);
    }
  }, [Google_Map_Key]);

  // Optimize useEffect dependencies
  useEffect(() => {
    if (!isLocationInitialized) {
      if (latitude && longitude) {
        setMapCenterCoords({ latitude, longitude });
        fetchAddress(latitude, longitude);
      } else {
        const defaultLat = 21.1702;
        const defaultLng = 72.8311;
        setMapCenterCoords({ latitude: defaultLat, longitude: defaultLng });
        fetchAddress(defaultLat, defaultLng);
      }
      setIsLocationInitialized(true);
    }
  }, [latitude, longitude, isLocationInitialized, fetchAddress]);

  useEffect(() => {
    if (mode === "edit" && locationDetails && !isLocationInitialized) {
      const { latitude: lat, longitude: lng } = locationDetails;
      if (lat && lng) {
        setMapCenterCoords({ latitude: lat, longitude: lng });
        fetchAddress(lat, lng);
      }
      setIsLocationInitialized(true);
    }
  }, [mode, locationDetails, isLocationInitialized, fetchAddress]);

  const handleWebViewMessage = useCallback((event: any) => {
    const coords = JSON.parse(event.nativeEvent.data);
    setMapCenterCoords(coords);
    fetchAddress(coords.latitude, coords.longitude);
  }, [fetchAddress]);

  const handleConfirmLocation = useCallback(() => {
    if (!currentAddress || !mapCenterCoords || fetchingAddress) {
      Alert.alert("Location Not Ready", "Wait for address to load or move map.");
      return;
    }
    saveLocationBottomSheetRef.current?.expand();
  }, [currentAddress, mapCenterCoords, fetchingAddress]);

  const goback = useCallback(() => {
    goBack();
  }, [goBack]);

  const addAddress = useCallback(() => {
    setsaveLoading(true);
    if (!locationTitle?.trim()) {
      setTitleError(translateData.addressRequired || "Please Enter Your Title");
      setsaveLoading(false);
      return;
    }
    setTitleError("");

    const payload: SaveLocationDataInterface = {
      title: locationTitle,
      location: currentAddress,
      type: selectedOption,
      location_coordinates: {
        lat: mapCenterCoords?.latitude,
        lng: mapCenterCoords?.longitude,
      }
    } as SaveLocationDataInterface;

    // Fix TypeScript error by casting dispatch
    const action = mode === 'edit' ? updateSaveLocation({ data: payload, locationID: locationID || 0 }) : addSaveLocation(payload);

    (dispatch as any)(action)
      .unwrap()
      .then(() => {
        (dispatch as any)(userSaveLocation());
        goBack();
      })
      .catch((error: any) => {
        console.error(`Error ${mode === 'edit' ? 'updating' : 'adding'} location:`, error);
        Alert.alert("Error", `Failed to ${mode === 'edit' ? 'update' : 'add'} location.`);
      })
      .finally(() => {
        saveLocationBottomSheetRef.current?.close();
        setsaveLoading(false);
      });
  }, [locationTitle, currentAddress, selectedOption, mapCenterCoords, mode, locationID, dispatch, goBack, translateData.addressRequired]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleBottomSheetClose = useCallback(() => {
    if (mode !== 'edit') {
      setLocationTitle('');
    }
    setTitleError('');
  }, [mode]);

  // Memoize bottom sheet content to prevent unnecessary re-renders
  const bottomSheetContent = useMemo(() => (
    <BottomSheetView style={bottomSheetStyles.contentContainer}>
      <Text style={[styles.title, { color: textColorStyle }]}>{translateData.addNewLocation}</Text>
      <View style={styles.container}>
        <View style={[styles.optionContain, { flexDirection: viewRTLStyle }]}>
          {options.map((option) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={option.value}
              style={[
                [styles.optionContainer, { flexDirection: viewRTLStyle }, { borderColor: isDark ? appColors.darkBorder : appColors.border, backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor }],
                selectedOption === option.value &&
                styles.selectedOptionContainer,
              ]}
              onPress={() => setSelectedOption(option.value)}
            >
              <View
                style={[
                  styles.radioButton,
                  selectedOption === option.value &&
                  styles.selectedOptionRadio,
                ]}
              >
                {selectedOption === option.value && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text
                style={[
                  styles.optionLabel, { color: isDark ? appColors.whiteColor : appColors.primaryText },
                  selectedOption === option.value &&
                  styles.selectedOptionLabel,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{
          color: isDark ? appColors.whiteColor : appColors.primaryText,
          fontFamily: appFonts.medium,
          marginTop: windowHeight(8),
          textAlign: textRTLStyle,
        }}>
          {translateData.addressTitle}
        </Text>
        <TextInput
          placeholder={translateData.enterYouTitleeeee}
          placeholderTextColor={appColors.regularText}
          style={[
            styles.titleInput,
            { color: textColorStyle },
            { borderColor: isDark ? appColors.darkBorder : appColors.border }, { textAlign: textRTLStyle },
          ]}
          value={locationTitle}
          onChangeText={(text) => {
            setLocationTitle(text);
            if (!text.trim()) {
              setTitleError(translateData.addressRequired || "Title is required");
            } else {
              setTitleError('');
            }
          }}
        />

        {titleError ? (
          <Text style={{ color: appColors.textRed, fontSize: fontSizes.FONT14SMALL, fontFamily: appFonts.medium }}>
            {titleError}
          </Text>
        ) : null}

      </View>
      <View style={[styles.btnContainer, { flexDirection: viewRTLStyle }]}>
        <Button
          backgroundColor={appColors.lightButton}
          onPress={() => saveLocationBottomSheetRef.current?.close()}
          textColor={appColors.primary}
          title={translateData.cancel}
          width={'48%'}
        />
        <Button
          backgroundColor={appColors.primary}
          onPress={addAddress}
          textColor={appColors.whiteColor}
          title={translateData.save}
          width={'48%'}
          loading={saveLoading}
        />
      </View>
    </BottomSheetView>
  ), [textColorStyle, translateData.addNewLocation, translateData.addressTitle, translateData.enterYouTitleeeee,
    translateData.cancel, translateData.save, viewRTLStyle, options, selectedOption, isDark, locationTitle,
    titleError, saveLoading, addAddress, textRTLStyle, translateData.addressRequired]);

  return (
    <View style={external.main}>
      <View style={{ flexDirection: 'row' }}>
        <BackButton onPress={goback} linearColorStyle={linearColorStyle} />
        <AddressInput
          fetchingAddress={fetchingAddress}
          currentAddress={currentAddress}
          translateData={translateData}
          linearColorStyle={linearColorStyle}
          textColorStyle={textColorStyle}
          viewRTLStyle={viewRTLStyle}
          isDark={isDark}
          darkBorder={appColors.darkBorder}
          primaryGray={appColors.primaryGray}
        />
      </View>
      <View style={styles.mapView}>
        {loadingMap && (
          <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color={appColors.primary} />
        )}
        <WebView
          ref={webViewRef}
          source={{ html: mapType ? mapHtml : OsmapHtml }}
          onLoadEnd={() => setLoadingMap(false)}
          onMessage={handleWebViewMessage}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color={appColors.primary} />}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <ConfirmButton
        onPress={handleConfirmLocation}
        fetchingAddress={fetchingAddress}
        loadingMap={loadingMap}
        translateData={translateData}
        whiteColor={appColors.whiteColor}
      />
      <PinMarker pinImage={Images.pin} />

      <BottomSheet
        ref={saveLocationBottomSheetRef}
        index={-1}
        snapPoints={saveLocationSnapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        onChange={(index) => {
          if (index === -1) {
            handleBottomSheetClose();
          }
        }}
        style={{ zIndex: 5 }}
        handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
        backgroundStyle={{ backgroundColor: bgFullStyle }}
      >
        {bottomSheetContent}
      </BottomSheet>
    </View>
  );
}

const bottomSheetStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: windowWidth(18),
    paddingTop: windowHeight(15),
  },
  closeButton: {
    position: 'absolute',
    right: windowWidth(5),
    top: windowHeight(2),
    zIndex: 10,
    padding: windowWidth(2),
  },
});