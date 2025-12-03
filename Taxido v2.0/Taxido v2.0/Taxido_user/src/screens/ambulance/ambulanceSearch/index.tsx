import { View, Text, TextInput, TouchableOpacity, FlatList, Keyboard, ActivityIndicator } from "react-native";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { WebView } from 'react-native-webview';
import { Button, Header } from "@src/commonComponent";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { Location } from "@src/utils/icons";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { getValue, setValue } from "@src/utils/localstorage";
import { HomeSlider } from "@src/components";
import { useDispatch, useSelector } from "react-redux";
import { ambulanceAction } from "@src/api/store/actions";
import { useValues } from "@src/utils/context/index";;
import useStoredLocation from "@src/components/helper/useStoredLocation";
import { BannerLoader } from "../bannerLoader";
import { AppDispatch } from "@src/api/store";

export function AmbulanceSearch() {
    const [pickup, setPickup] = useState<string>("");
    const [suggestions, setSuggestions] = useState<any>([]);
    const [isPickupField, setIsPickupField] = useState<boolean>(true);
    const inputTimer = useRef<any>(null);
    const [recentAddresses, setRecentAddresses] = useState<string[]>([]);
    const [pickupCoords, setPickupCoords] = useState<any>(null);
    const [isLoadingCoords, setIsLoadingCoords] = useState<boolean>(true);
    const navigation = useNavigation<any>();
    const webViewRef = useRef<any>(null);
    const [isScrolling, setIsScrolling] = useState<boolean>(true);
    const { homeScreenData, } = useSelector((state: any) => state.home);
    const dispatch = useDispatch<AppDispatch>();
    const { bgFullStyle, viewRTLStyle, textRTLStyle, isDark, bgContainer, Google_Map_Key } = useValues();
    const { translateData } = useSelector((state: any) => state.setting);
    const { latitude, longitude } = useStoredLocation();

    useEffect(() => {
        loadRecentAddresses();
        if (latitude && longitude) {
            fetchAddressFromCoords(latitude, longitude);
        }
    }, [latitude, longitude]);

    const loadRecentAddresses = async () => {
        const savedAddresses = await getValue("ambulanceLocations");
        if (savedAddresses) {
            setRecentAddresses(JSON.parse(savedAddresses));
        }
    };

    const fetchAddressFromCoords = async (latitude: any, longitude: any) => {
        if (!latitude || !longitude) {
            setIsLoadingCoords(false);
            return;
        }

        setIsLoadingCoords(true);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Google_Map_Key}&result_type=street_address`;
        try {
            const response = await fetch(url);
            const json = await response.json();
            if (json.status === "OK" && json.results.length > 0) {
                const address = json.results[0].formatted_address;
                setPickup(address);
                const coords: any = { latitude, longitude };
                setPickupCoords(coords);
                updateWebViewMap(coords);
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        } finally {
            setIsLoadingCoords(false);
        }
    };

    const fetchCoordinates = async (address: string | number | boolean, isPickup: any) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${Google_Map_Key}`;
        try {
            const response = await fetch(url);
            const json = await response.json();

            if (json.status === "OK" && json.results.length > 0) {
                const location = json.results[0].geometry.location;
                const coords = { latitude: location.lat, longitude: location.lng };
                if (isPickup) {
                    setPickupCoords(coords);
                    updateWebViewMap(coords);
                }
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    const updateWebViewMap = (coords: any) => {
        if (webViewRef.current && coords) {
            const script = `
                if (window.map && window.marker) {
                    window.marker.setPosition({lat: ${coords.latitude}, lng: ${coords.longitude}});
                    window.map.setCenter({lat: ${coords.latitude}, lng: ${coords.longitude}});
                    window.map.setZoom(15);
                }
            `;
            webViewRef.current.postMessage(script);
        }
    };

    const handleSelectSuggestion = async (address: any, isPickup: any) => {
        if (isPickup) {
            setPickup(address);
            fetchCoordinates(address, true);
        } else {
            fetchCoordinates(address, false);
        }
        setSuggestions([]);
        Keyboard.dismiss();
    };

    const fetchAddressSuggestions = useCallback(async (text: string) => {
        if (text.length < 3) {
            setSuggestions([]);
            return;
        }

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${Google_Map_Key}&types=geocode`;

        try {
            const response = await fetch(url);
            const json = await response.json();

            if (json.status === "OK" && json.predictions.length > 0) {
                setSuggestions(json.predictions.slice(0, 2));
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
        }
    }, []);

    const handleInputChange = (text: string, isPickup: any) => {
        if (isPickup) {
            setPickup(text);
            setIsPickupField(true);
        } else {
            setIsPickupField(false);
        }
        if (inputTimer.current) {
            clearTimeout(inputTimer.current);
        }
        inputTimer.current = setTimeout(() => {
            fetchAddressSuggestions(text);
        }, 500);
    };

    const gotoBookAmbulance = async () => {
        try {
            const locationData = { 0: pickup };
            await setValue("ambulanceLocations", JSON.stringify(locationData));
            try {
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                        pickup
                    )}&key=${Google_Map_Key}`
                );
                const dataMap = await response.json();
                if (dataMap.results.length > 0) {
                    const location = dataMap?.results[0]?.geometry?.location;
                    dispatch(ambulanceAction({ lat: location.lat, lng: location.lng }));
                    navigation.navigate("BookAmbulance", { location: pickup, lat: location.lat, lng: location.lng });

                    return {
                        latitude: location.lat,
                        longitude: location.lng,
                    };
                }
            } catch (error) {
                console.error("Error geocoding address:", error);
            }
        } catch (error) {
            console.error("Error storing locations:", error);
        }
    }

    const generateMapHTML = () => {
        const darkMapStyle = JSON.stringify([
            { elementType: "geometry", stylers: [{ color: "#212121" }] },
            { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
            { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
            { featureType: "poi", elementType: "geometry", stylers: [{ color: "#282828" }] },
            { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#383838" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f2f2f" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
            { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
        ]);

        return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body, html { margin: 0; padding: 0; height: 100%; }
            #map { height: 100%; width: 100%; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            let map;
            let marker;
            
            function initMap() {
                map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 15,
                    center: { lat: ${pickupCoords?.latitude || 0}, lng: ${pickupCoords?.longitude || 0} },
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    styles: ${isDark ? darkMapStyle : "[]"} 
                });
                
                marker = new google.maps.Marker({
                    position: { lat: ${pickupCoords?.latitude || 0}, lng: ${pickupCoords?.longitude || 0} },
                    map: map,
                    title: "${translateData.PickupAmbulance || 'Pickup Location'}",
                    icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${appColors.primary || '#007AFF'}"/>
                            </svg>
                        `)}',
                        scaledSize: new google.maps.Size(30, 30),
                        anchor: new google.maps.Point(15, 30)
                    }
                });
                
                window.map = map;
                window.marker = marker;
            }
            
            // Listen for RN messages
            window.addEventListener('message', function(event) {
                try { eval(event.data); } catch (e) { console.error('Error executing script:', e); }
            });
            document.addEventListener('message', function(event) {
                try { eval(event.data); } catch (e) { console.error('Error executing script:', e); }
            });
        </script>
        <script async defer src="https://maps.googleapis.com/maps/api/js?key=${Google_Map_Key}&callback=initMap"></script>
    </body>
    </html>
    `;
    };


    return (
        <View style={[styles.container, { backgroundColor: bgFullStyle }]}>
            <Header value={translateData.ambulance} />
            <View style={[styles.inputContainer, { backgroundColor: bgFullStyle }]}>
                <View style={{ height: windowHeight(180) }}>
                    {homeScreenData?.banners && homeScreenData.banners.length > 0 ? (
                        <HomeSlider
                            onSwipeStart={() => setIsScrolling(false)}
                            onSwipeEnd={() => setIsScrolling(true)}
                            bannerData={homeScreenData.banners}
                        />
                    ) : (
                        <BannerLoader />
                    )}
                </View>
                <View style={{ paddingHorizontal: windowWidth(20) }}>
                    <View >
                        <View style={[styles.inputBox, { flexDirection: viewRTLStyle }, { backgroundColor: isDark ? bgContainer : appColors.lightGray }]}>
                            <View style={[styles.iconContainer, { backgroundColor: bgFullStyle }]}>
                                <Location />
                            </View>
                            <TextInput
                                placeholderTextColor={isDark ? appColors.whiteColor : appColors.blackColor}
                                placeholder={translateData.pickupLocation}
                                style={[styles.input, { textAlign: textRTLStyle, color: isDark ? appColors.darkText : appColors.blackColor }]}
                                value={pickup}
                                onChangeText={(text) => handleInputChange(text, true)}

                            />
                        </View>
                    </View>
                    <Text style={[styles.suggestionText, { textAlign: textRTLStyle }]}>{suggestions.length > 0 ? translateData.suggestedAddresses : translateData.recentAddresses}</Text>
                    <View style={styles.listView}>
                        <FlatList
                            data={suggestions.length > 0 ? suggestions : []}
                            keyExtractor={(item, index) => item?.address || item?.place_id || index.toString()}
                            renderItem={({ item, index }) => {
                                const isLastItem = index === suggestions.length - 1;
                                return (
                                    <View>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => handleSelectSuggestion(item?.address || item?.description, isPickupField)}
                                            style={[styles.suggestionItem, { flexDirection: viewRTLStyle }]}
                                        >
                                            <View><Location /></View>
                                            <Text style={styles.suggestionText}>{item?.address || item?.description}</Text>
                                        </TouchableOpacity>
                                        {!isLastItem && (
                                            <View style={{ borderBottomWidth: windowHeight(1), borderColor: appColors.border }} />
                                        )}
                                    </View>
                                );
                            }}
                        />
                        <FlatList
                            data={recentAddresses ? Object.values(recentAddresses) : []}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }: any) => {
                                const isLastItem = index === Object.values(recentAddresses).length - 1;

                                return (
                                    <View>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => handleSelectSuggestion(item?.address || item?.description || item, isPickupField)}
                                            style={[styles.suggestionItem, {
                                                flexDirection: viewRTLStyle
                                            }]}
                                        >
                                            <View><Location /></View>
                                            <Text style={[styles.suggestionText, { textAlign: textRTLStyle }]}>{item?.address || item?.description || item}</Text>
                                        </TouchableOpacity>
                                        {!isLastItem && (
                                            <View style={{ borderBottomWidth: windowHeight(1), borderColor: appColors.border }} />
                                        )}
                                    </View>
                                );
                            }}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.mapContainer}>
                {isLoadingCoords || !pickupCoords ? (
                    <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? bgContainer : appColors.lightGray }]}>
                        <ActivityIndicator
                            size="large"
                            color={appColors.primary}
                            style={{ marginBottom: 10 }}
                        />
                        <Text style={{
                            color: isDark ? appColors.whiteColor : appColors.blackColor,
                            fontSize: 16,
                            textAlign: 'center'
                        }}>
                            {translateData.loadingLocation ||translateData?.fecthinglocation}
                        </Text>
                    </View>
                ) : (
                    <WebView
                        ref={webViewRef}
                        source={{ html: generateMapHTML() }}
                        style={styles.map}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={false}
                    />
                )}
            </View>
            <View style={styles.buttonView}>
                <View style={styles.buttonHz_Space}>
                    <Button title={translateData.confirmLocation} onPress={gotoBookAmbulance} />
                </View>
            </View>
        </View>
    );
}