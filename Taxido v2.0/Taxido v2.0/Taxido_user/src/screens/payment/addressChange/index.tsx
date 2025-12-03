import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Back, AddressMarker } from "@src/utils/icons";
import { appColors, appFonts, fontSizes, windowHeight } from "@src/themes";
import Images from "@utils/images";
import styles from "./styles";
import { useValues } from "@src/utils/context/index";
import { external } from "@src/styles/externalStyle";
import { useDispatch, useSelector } from "react-redux";
import useSmartLocation from "@src/components/helper/locationHelper";
import { locationChanges, rideDataPut } from "@src/api/store/actions";
import { AppDispatch } from "@src/api/store";
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export function AddressChange() {
    const { isDark, viewRTLStyle, Google_Map_Key } = useValues();
    const dispatch = useDispatch<AppDispatch>();
    const webViewRef = useRef<WebView>(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { rideId, rideDatas, locationIndex } = route.params as { rideId: string; rideDatas: any; locationIndex: number } || {};
    const { currentLatitude, currentLongitude } = useSmartLocation();
    const [initialCoords, setInitialCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [mapCenterCoords, setMapCenterCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [currentAddress, setCurrentAddress] = useState("");
    const [loadingMap, setLoadingMap] = useState(true);
    const [fetchingAddress, setFetchingAddress] = useState(false);
    const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [priceData, setPriceData] = useState<any>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);
    const mapType = taxidoSettingData?.taxido_values?.location?.map_provider;



    // Bottom sheet ref
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = ['25%'];

    useEffect(() => {
        if (rideDatas?.location_coordinates?.[locationIndex]) {
            const editingLocation = rideDatas.location_coordinates[locationIndex];
            const coords = {
                latitude: parseFloat(editingLocation.lat),
                longitude: parseFloat(editingLocation.lng)
            };
            setInitialCoords(coords);
            setMapCenterCoords(coords);
            setLoadingMap(false);
        } else if (currentLatitude && currentLongitude) {
            const coords = { latitude: currentLatitude, longitude: currentLongitude };
            setInitialCoords(coords);
            setMapCenterCoords(coords);
            setLoadingMap(false);
        } else {
            console.warn("No initial location found.");
            setLoadingMap(false);
        }
    }, [rideDatas, locationIndex, currentLatitude, currentLongitude]);

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
                setCurrentAddress("Could not find address for this location.");
            }

        } catch (error) {
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

    const handleWebViewMessage = (event: any) => {
        const data = JSON.parse(event?.nativeEvent?.data);
        if (data?.type === 'mapMove') {
            const { lat, lng } = data?.payload;
            setMapCenterCoords({ latitude: lat, longitude: lng });
        }
    };

    const handleLocationChange = () => {
        if (isUpdatingLocation || !currentAddress || !mapCenterCoords || fetchingAddress) {
            Alert.alert(
                translateData.locationNotReady,
                translateData.locationDescription
            );
            return;
        }

        const currentCoords = [...rideDatas.location_coordinates];
        const currentLocations = [...rideDatas.locations];

        // Validate locationIndex
        if (locationIndex === undefined || locationIndex < 0 || locationIndex >= currentCoords.length) {
            throw new Error(`Invalid location index: ${locationIndex}`);
        }

        // Directly replace the location at the specified index
        currentCoords[locationIndex] = {
            lat: mapCenterCoords.latitude.toString(),
            lng: mapCenterCoords.longitude.toString()
        };
        currentLocations[locationIndex] = currentAddress;

        const payload: any = {
            ride_id: rideId,
            location_coordinates: currentCoords,
            locations: currentLocations,
        };
        dispatch(locationChanges(payload))
            .unwrap()
            .then((res: any) => {
                setPriceData(res);
                // Open bottom sheet after locationChanges is successful
                setIsBottomSheetOpen(true);
                bottomSheetRef.current?.present();
            })
            .catch((error: any) => {
                setIsUpdatingLocation(false);
                Alert.alert(
                    translateData.updateFailed,
                    `Failed to update location: ${error?.message || 'Unknown error'}. Please try again.`
                );
            });
    };

    const processLocationChange = async () => {
        // Close the bottom sheet
        setIsBottomSheetOpen(false);
        bottomSheetRef.current?.close();

        // Set updating state to prevent multiple clicks
        setIsUpdatingLocation(true);

        try {
            // Validate inputs
            if (!rideId) {
                throw new Error('Ride ID is missing');
            }

            if (!rideDatas || !rideDatas.location_coordinates || !rideDatas.locations) {
                throw new Error('Ride data is invalid or missing');
            }

            // Get current arrays from rideDatas
            const currentCoords = [...rideDatas.location_coordinates];
            const currentLocations = [...rideDatas.locations];

            // Validate locationIndex
            if (locationIndex === undefined || locationIndex < 0 || locationIndex >= currentCoords.length) {
                throw new Error(`Invalid location index: ${locationIndex}`);
            }

            // Directly replace the location at the specified index
            // Add null check for mapCenterCoords
            if (!mapCenterCoords) {
                throw new Error('Map center coordinates are not available');
            }

            currentCoords[locationIndex] = {
                lat: mapCenterCoords.latitude.toString(),
                lng: mapCenterCoords.longitude.toString()
            };
            currentLocations[locationIndex] = currentAddress;

            const payload: any = {
                location_coordinates: currentCoords,
                locations: currentLocations
            };

            const ride_id = parseInt(rideId.toString());

            // Dispatch Redux action to update ride data
            dispatch(rideDataPut({ payload, ride_id }))
                .unwrap()
                .then((_res: any) => {
                    navigation.goBack();
                })
                .catch((error: any) => {
                    setIsUpdatingLocation(false);
                    Alert.alert(
                        translateData.updateFailed,
                        `Failed to update location: ${error?.message || 'Unknown error'}. Please try again.`
                    );
                });

        } catch (error: any) {
            setIsUpdatingLocation(false);
            Alert.alert(
                translateData.updateFailed,
                `Failed to update location: ${error?.message || 'Unknown error'}. Please try again.`
            );
        }
    };

    const handleSheetChanges = (index: number) => {
        // When sheet is closed (index = -1), show the button
        // When sheet is open (index >= 0), hide the button
        setIsBottomSheetOpen(index !== -1);
    };

    const getMapHTML = (coords: { latitude: number; longitude: number }, mapType: string, isDark: boolean) => {
        // Use the isDark value from component context

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
            background-color: ${isDark ? appColors.blackColor : appColors.whiteColor};
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
    };

    // Bottom sheet content
    const bottomSheetContent = (
        <BottomSheetView style={{ flex: 1, padding: 20 }}>
            <Text style={{
                fontSize: fontSizes.FONT19,
                fontFamily: appFonts.medium,
                textAlign: 'center',
                marginBottom: windowHeight(20),
                color: isDark ? appColors.whiteColor : appColors.blackColor
            }}>
                The updated price for your location is <Text style={{ fontFamily: appFonts.bold, color: appColors.primary }}>{rideDatas?.currency_symbol}{priceData?.total}</Text>
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight(20) }}>
                <TouchableOpacity
                    style={{
                        flex: 0.45,
                        padding: windowHeight(12),
                        backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray,
                        borderRadius: windowHeight(8),
                        alignItems: 'center'
                    }}
                    onPress={() => {
                        setIsBottomSheetOpen(false);
                        bottomSheetRef.current?.close();
                    }}
                >
                    <Text style={{
                        color: isDark ? appColors.whiteColor : appColors.blackColor,
                        fontFamily: appFonts.medium
                    }}>
                        {translateData.cancel}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        flex: 0.45,
                        padding: windowHeight(12),
                        backgroundColor: appColors.primary,
                        borderRadius: windowHeight(8),
                        alignItems: 'center'
                    }}
                    onPress={processLocationChange}
                >
                    <Text style={{
                        color: appColors.whiteColor,
                        fontFamily: appFonts.medium
                    }}>
                        {translateData.confirm}
                    </Text>
                </TouchableOpacity>
            </View>
        </BottomSheetView>
    );

    return (
        <BottomSheetModalProvider>
            <View style={external.main}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.backView, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor }]}
                >
                    <Back />
                </TouchableOpacity>

                {loadingMap ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={appColors.primary} />
                    </View>
                ) : initialCoords ? (
                    <>
                        <WebView
                            ref={webViewRef}
                            style={styles.mapView}
                            source={{ html: getMapHTML(initialCoords, mapType, isDark) }}
                            onMessage={handleWebViewMessage}
                            javaScriptEnabled
                            domStorageEnabled
                            originWhitelist={['*']}
                        />
                        <View style={styles.pointerMarker} pointerEvents="none">
                            <Image source={Images.pin} style={styles.pinImage} />
                        </View>
                    </>
                ) : (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={appColors.primary} />
                    </View>
                )}

                <View style={[styles.textInputContainer, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, flexDirection: viewRTLStyle }]}>
                    <View style={[styles.addressBtnView, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray }]}>
                        <AddressMarker />
                    </View>
                    <TextInput
                        style={[styles.textInput, { color: isDark ? appColors.whiteColor : appColors.blackColor }]}
                        value={fetchingAddress ? translateData.locating : currentAddress || translateData.moveToLocate}
                        editable={false}
                        multiline
                    />
                </View>

                {!isBottomSheetOpen && (
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleLocationChange}
                        disabled={isUpdatingLocation || fetchingAddress || loadingMap || !currentAddress}
                        activeOpacity={0.8}
                    >
                        {isUpdatingLocation || fetchingAddress ? (
                            <ActivityIndicator size="large" color={appColors.whiteColor} />
                        ) : (
                            <Text style={styles.confirmText}>{translateData.confirmLocation || translateData.confirmLocationText}</Text>
                        )}
                    </TouchableOpacity>
                )}

                <BottomSheetModal
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    backgroundStyle={{ backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor }}
                    handleIndicatorStyle={{ backgroundColor: appColors.primary }}
                    onChange={handleSheetChanges}
                >
                    {bottomSheetContent}
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
}