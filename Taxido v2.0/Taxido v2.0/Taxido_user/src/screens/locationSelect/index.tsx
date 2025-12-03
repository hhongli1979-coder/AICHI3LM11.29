import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Back, AddressMarker } from "@src/utils/icons";
import { appColors } from "@src/themes";
import Images from "@utils/images";
import styles from "./styles";
import { useValues } from "@src/utils/context/index";
import { external } from "@src/styles/externalStyle";
import { useSelector } from "react-redux";
import { setValue } from "@src/utils/localstorage";
import useSmartLocation from "@src/components/helper/locationHelper";

// Define route params interface
interface RouteParams {
  field?: string;
  screenValue?: string;
  service_ID?: string;
  service_name?: string;
  service_category_ID?: string;
  service_category_slug?: string;
  formattedDate?: string;
  formattedTime?: string;
}

// Memoized components to prevent unnecessary re-renders
const BackButton = React.memo(({ onPress, isDark }: { onPress: () => void; isDark: boolean }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.backView, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor }]}
  >
    <Back />
  </TouchableOpacity>
));

const MapPointer = React.memo(({ pinImage }: { pinImage: any }) => (
  <View style={styles.pointerMarker} pointerEvents="none">
    <Image source={pinImage} style={styles.pinImage} />
  </View>
));

const AddressInput = React.memo(({
  fetchingAddress,
  currentAddress,
  isDark,
  viewRTLStyle,
}: {
  fetchingAddress: boolean;
  currentAddress: string;
  isDark: boolean;
  viewRTLStyle: "row" | "row-reverse";
}) => (
  <View style={[styles.textInputContainer, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, flexDirection: viewRTLStyle }]}>
    <View style={[styles.addressBtnView, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray }]}>
      <AddressMarker />
    </View>
    <TextInput
      style={[styles.textInput, { color: isDark ? appColors.whiteColor : appColors.blackColor }]}
      value={fetchingAddress ? "Locating..." : currentAddress || "Move map to select location"}
      editable={false}
      multiline
    />
  </View>
));

const ConfirmButton = React.memo(({
  onPress,
  fetchingAddress,
  loadingMap,
  currentAddress,
  translateData
}: {
  onPress: () => void;
  fetchingAddress: boolean;
  loadingMap: boolean;
  currentAddress: string;
  translateData: any;
}) => (
  <TouchableOpacity
    style={styles.confirmButton}
    onPress={onPress}
    disabled={fetchingAddress || loadingMap || !currentAddress}
    activeOpacity={0.8}
  >
    {fetchingAddress ? (
      <ActivityIndicator size="large" color={appColors.whiteColor} />
    ) : (
      <Text style={styles.confirmText}>{translateData.confirmLocation || "Confirm Location"}</Text>
    )}
  </TouchableOpacity>
));

export function LocationSelect() {
  const { isDark, viewRTLStyle, Google_Map_Key } = useValues();
  const webViewRef = useRef<WebView>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { field, screenValue, service_ID, service_name, service_category_ID, service_category_slug, formattedDate, formattedTime } = (route.params || {}) as RouteParams;
  const { currentLatitude, currentLongitude } = useSmartLocation();
  const [initialCoords, setInitialCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapCenterCoords, setMapCenterCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [loadingMap, setLoadingMap] = useState(true);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);
  const mapType = taxidoSettingData?.taxido_values?.location?.map_provider;

  useEffect(() => {
    const lat = currentLatitude;
    const lon = currentLongitude;

    if (lat && lon) {
      const coords = { latitude: lat, longitude: lon };
      setInitialCoords(coords);
      setMapCenterCoords(coords);
      setLoadingMap(false);
    } else {
      console.warn("No initial location found.");
      setLoadingMap(false);
    }
  }, [currentLatitude, currentLongitude]);

  // Memoize fetchAddress to prevent recreation
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    if (!Google_Map_Key) {
      console.error("[fetchAddress] Google Maps API Key is missing!");
      setCurrentAddress("Configuration error: Missing API Key.");
      return;
    }

    setFetchingAddress(true);
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${Google_Map_Key}&result_type=street_address|route|intersection`
      );
      let json = await response.json();

      if (json.status === 'OK' && json.results.length === 0) {
        response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${Google_Map_Key}`
        );
        json = await response.json();
      }

      if (json.status === 'OK' && json.results.length > 0) {
        const bestResult = json.results[0];
        const cleanedAddress = bestResult?.formatted_address;
        setCurrentAddress(cleanedAddress);
      } else {
        console.warn("[fetchAddress] Geocoding API returned no results:", json.status);
        setCurrentAddress("Could not find address for this location.");
      }

    } catch (error) {
      console.error("[fetchAddress] Failed to fetch address:", error);
      setCurrentAddress("Failed to connect to address service.");
    } finally {
      setFetchingAddress(false);
    }
  }, [Google_Map_Key]);

  useEffect(() => {
    if (mapCenterCoords) {
      if (debounceTimerRef?.current) clearTimeout(debounceTimerRef?.current);

      debounceTimerRef.current = setTimeout(() => {
        fetchAddress(mapCenterCoords?.latitude, mapCenterCoords?.longitude);
      }, 800);
    }
    return () => {
      if (debounceTimerRef?.current) clearTimeout(debounceTimerRef?.current);
    };
  }, [mapCenterCoords, fetchAddress]);

  const handleWebViewMessage = useCallback((event: any) => {
    const data = JSON.parse(event?.nativeEvent?.data);
    if (data?.type === 'mapMove') {
      const { lat, lng } = data?.payload;
      setMapCenterCoords({ latitude: lat, longitude: lng });
    }
  }, []);

  const handleConfirmLocation = useCallback(async () => {
    if (!currentAddress || !mapCenterCoords || fetchingAddress) {
      Alert.alert(translateData.locationNotReady, translateData.locationDescription);
      return;
    }
    if (screenValue === "HomeScreen") {
      await setValue('user_latitude_Selected', mapCenterCoords?.latitude.toString());
      await setValue('user_longitude_Selected', mapCenterCoords?.longitude.toString());
      (navigation as any).replace("MyTabs");
      return;
    }
    (navigation as any).navigate(screenValue, {
      selectedAddress: currentAddress,
      fieldValue: field,
      pinLatitude: mapCenterCoords?.latitude,
      pinLongitude: mapCenterCoords?.longitude,
      service_ID,
      service_name,
      service_category_ID,
      service_category_slug,
      formattedDate,
      formattedTime,
    });
  }, [currentAddress, mapCenterCoords, fetchingAddress, screenValue, field, navigation, service_ID, service_name, service_category_ID, service_category_slug, formattedDate, formattedTime]);

  const getMapHTML = useCallback((coords: { latitude: number; longitude: number }, mapType: string, isDark: boolean) => {
    if (mapType === 'osm') {
      const darkTileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      const tileUrl = isDark ? darkTileUrl : lightTileUrl;

      return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
          <style>
            body, html, #map {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              background-color: ${isDark ? appColors.blackColor : appColors.whiteColor};
            }
          </style>
      </head>
      <body>
          <div id="map"></div>
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
          <script>
              function initMap() {
                  const map = L.map('map', {
                      center: [${coords?.latitude}, ${coords?.longitude}],
                      zoom: 16,
                      zoomControl: false
                  });

                  L.tileLayer('${tileUrl}', {
                      attribution: '© OpenStreetMap contributors'
                  }).addTo(map);

                  map.on('moveend', function() {
                      const center = map.getCenter();
                      const message = {
                          type: 'mapMove',
                          payload: { lat: center.lat, lng: center.lng }
                      };
                      window.ReactNativeWebView.postMessage(JSON.stringify(message));
                  });
              }
              initMap();
          </script>
      </body>
      </html>
    `;
    }

    // Google Maps implementation (existing code)
    const darkTheme = [
      { elementType: "geometry", stylers: [{ color: "#212121" }] },
      { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#757575" }]
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#282828" }]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#181818" }]
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{ color: "#2c2c2c" }]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#8a8a8a" }]
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f2f2f" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#000000" }]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#3d3d3d" }]
      }
    ];

    const mapThemeStyles = isDark ? darkTheme : [];
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body, html, #map {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            background-color: ${isDark ? "#000" : "#fff"};
          }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            function initMap() {
                const map = new google.maps.Map(document.getElementById('map'), {
                    center: { lat: ${coords?.latitude}, lng: ${coords?.longitude} },
                    zoom: 16,
                    disableDefaultUI: true,
                    styles: ${JSON.stringify(mapThemeStyles)}
                });

                map.addListener('idle', () => {
                    const center = map.getCenter();
                    const message = {
                        type: 'mapMove',
                        payload: { lat: center.lat(), lng: center.lng() }
                    };
                    window.ReactNativeWebView.postMessage(JSON.stringify(message));
                });
            }
        </script>
        <script async defer src="https://maps.googleapis.com/maps/api/js?key=${Google_Map_Key}&callback=initMap"></script>
    </body>
    </html>
  `;
  }, [Google_Map_Key]);

  // Memoize the WebView source to prevent unnecessary reloads
  const webViewSource = useMemo(() => {
    return initialCoords ? { html: getMapHTML(initialCoords, mapType, isDark) } : { html: '' };
  }, [initialCoords, getMapHTML, mapType, isDark]);

  // Memoize loading state component
  const loadingComponent = useMemo(() => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={appColors.primary} />
    </View>
  ), []);

  return (
    <View style={external.main}>
      <BackButton onPress={() => navigation.goBack()} isDark={isDark} />

      {loadingMap ? (
        loadingComponent
      ) : initialCoords ? (
        <>
          <WebView
            ref={webViewRef}
            style={styles.mapView}
            source={webViewSource}
            onMessage={handleWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          />
          <MapPointer pinImage={Images.pin} />
        </>
      ) : (
        loadingComponent
      )}

      <AddressInput
        fetchingAddress={fetchingAddress}
        currentAddress={currentAddress}
        isDark={isDark}
        viewRTLStyle={viewRTLStyle}
      />

      <ConfirmButton
        onPress={handleConfirmLocation}
        fetchingAddress={fetchingAddress}
        loadingMap={loadingMap}
        currentAddress={currentAddress}
        translateData={translateData}
      />
    </View>
  );
}