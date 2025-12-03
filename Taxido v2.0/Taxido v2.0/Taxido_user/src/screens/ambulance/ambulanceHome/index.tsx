import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { Button } from "@src/commonComponent";
import MapView, { Marker } from "react-native-maps";
import { Location } from "@src/utils/icons";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { HeaderContainer, HomeSlider } from "@src/components";
import { BannerLoader } from "../bannerLoader";
import useStoredLocation from "@src/components/helper/useStoredLocation";
import { useValues } from "@src/utils/context/index";;
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import MapViewDirections from "react-native-maps-directions";
import { getValue, setValue } from "@src/utils/localstorage";
import { ambulanceAction } from "@src/api/store/actions";
import { commonStyles } from "@src/styles/commonStyle";
import { AppDispatch } from "@src/api/store";

export function AmbulanceHome() {
    const [pickup, setPickup] = useState<string>("");
    const [suggestions, setSuggestions] = useState<any>([]);
    const [isPickupField, setIsPickupField] = useState<boolean>(true);
    const inputTimer = useRef<any>(null);
    const [recentAddresses, setRecentAddresses] = useState<string | number | any>([]);
    const [pickupCoords, setPickupCoords] = useState<any>(null);
    const navigation = useNavigation<any>();
    const mapRef = useRef<any>(null);
    const [isScrolling, setIsScrolling] = useState<boolean>(true);
    const { homeScreenData } = useSelector((state: any) => state.home);
    const dispatch = useDispatch<AppDispatch>();
    const { bgFullStyle, viewRTLStyle, textRTLStyle, isDark, bgContainer, Google_Map_Key } = useValues();
    const { translateData } = useSelector((state: any) => state.setting);
    const { latitude, longitude } = useStoredLocation();


    useEffect(() => {
        loadRecentAddresses();
        fetchAddressFromCoords(latitude, longitude);
    }, [latitude, longitude]);


    const loadRecentAddresses = async () => {
        const savedAddresses = await getValue("ambulanceLocations");
        if (savedAddresses) {
            setRecentAddresses(JSON.parse(savedAddresses));
        }
    };

    const fetchAddressFromCoords = async (latitude: number | null, longitude: number | null) => {
        if (!latitude || !longitude) return;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Google_Map_Key}&result_type=street_address`;
        try {
            const response = await fetch(url);
            const json = await response.json();
            if (json.status === "OK" && json.results.length > 0) {
                const address = json.results[0].formatted_address;
                setPickup(address);
                setPickupCoords({ latitude, longitude });
            }
        } catch (error) {
            console.error("Error fetching address:", error);
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
                if (isPickup) setPickupCoords(coords);
                if (mapRef.current) {
                    mapRef.current.animateToRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 1000);
                }
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    const handleSelectSuggestion = async (address: string | number | boolean | any, isPickup: any) => {
        if (isPickup) {
            setPickup(address);
            fetchCoordinates(address, true);
        } else {
            fetchCoordinates(address, false);
        }
        setSuggestions([]);
        Keyboard.dismiss();
    };

    const fetchAddressSuggestions = useCallback(async (text: any) => {
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

    const handleInputChange = (text: string, isPickup?: any) => {
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

    useEffect(() => {
        if (pickupCoords && mapRef.current) {
            mapRef.current.fitToCoordinates(
                [pickupCoords],
                { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
            );
        }
    }, [pickupCoords]);


    const gotoBookAmbulance = async () => {
        try {
            const locationData = { 0: pickup };
            await setValue("ambulanceLocations", JSON.stringify(locationData));
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(pickup)}&key=${Google_Map_Key}`);
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
    };

    useEffect(() => {
        if (pickupCoords && mapRef.current) {
            mapRef.current.fitToCoordinates(
                [pickupCoords],
                { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
            );
        } else if (pickupCoords && mapRef.current) {
            mapRef.current.animateToRegion({
                ...pickupCoords,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 1000);
        }
    }, [pickupCoords]);


    return (
        <View
            style={[
                commonStyles.flexContainer,
                { backgroundColor: appColors.lightGray },
            ]}
        >
            <SafeAreaView style={styles.containerHeader}>
                <HeaderContainer />
            </SafeAreaView>
            <View style={[styles.container, { backgroundColor: bgFullStyle }]}>
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
                                    style={[styles.input, { textAlign: textRTLStyle }]}
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
                                                    flexDirection: viewRTLStyle,
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
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={{
                            latitude: 37.7749,
                            longitude: -122.4194,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                    >
                        {pickupCoords && <Marker coordinate={pickupCoords} title={translateData.PickupAmbulance} />}
                        {pickupCoords && (
                            <MapViewDirections
                                origin={pickupCoords}
                                apikey={Google_Map_Key}
                                strokeWidth={4}
                                strokeColor={appColors.primary}
                            />
                        )}
                    </MapView>
                </View>
                <View style={styles.buttonView}>
                    <View style={styles.buttonHz_Space}>
                        <Button title={translateData.confirmLocation} onPress={gotoBookAmbulance} />
                    </View>
                </View>
            </View>
        </View>
    );
}