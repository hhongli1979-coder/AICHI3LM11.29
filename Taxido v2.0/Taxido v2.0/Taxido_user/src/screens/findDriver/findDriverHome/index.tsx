import React, { useContext, useRef, useState } from "react";
import styles from "./styles";
import { Dimensions, FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Location, Search } from "@src/utils/icons";
import { HeaderContainer, HomeSlider } from "@src/components";
import MapViewDirections from "react-native-maps-directions";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { appColors, windowHeight } from "@src/themes";
import { useValues } from "@src/utils/context/index";;
import { useSelector } from "react-redux";
import Images from "@src/utils/images";
import { commonStyles } from "@src/styles/commonStyle";
import { LocationContext } from "@src/utils/locationContext";


export function FindDriverHome() {
    const { width } = Dimensions.get("window");
    const navigation = useNavigation();
    const [isScrolling, setIsScrolling] = useState(true);
    const mapRef = useRef(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropOffCoords, setDropOffCoords] = useState(null);
    const { viewRTLStyle, isDark, bgFullStyle, textRTLStyle, Google_Map_Key } = useValues()
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isScrollable, setIsScrollable] = useState(true);
    const { homeScreenDataPrimary } = useSelector((state) => state.home);
    const context = useContext(LocationContext);
    const { setPickupLocationLocal, setStopsLocal, setDestinationLocal } = context;


    const locationData = [
        { id: '1', label: 'Adajan, Gujarat' },
        { id: '2', label: 'Adajan, Gujarat' },
    ];


    const onPress = (index) => {
        setSelectedIndex(index);
    }
    const serviceCategories = [
        {
            id: 1,
            name: "One Way",
        },
        {
            id: 2,
            name: "Round Trip",
        },
        {
            id: 3,
            name: "Outstation",
        },
        {
            id: 4,
            name: "Daily",
        }
    ];


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
            <View style={[styles.main, {
                backgroundColor: isDark ? '#1F1F1F' : appColors.lightGray,
            }]}>

                <View style={styles.mapContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.mapView}>
                            <MapView
                                ref={mapRef}
                                style={styles.map}
                                initialRegion={{
                                    latitude: 37.7749,
                                    longitude: -122.4194,
                                    latitudeDelta: 0.05,
                                    longitudeDelta: 0.05
                                }}
                            >
                                {pickupCoords && <Marker coordinate={pickupCoords} title="Pickup" />}
                                {dropOffCoords && <Marker coordinate={dropOffCoords} title="Drop-off" />}
                                {pickupCoords && dropOffCoords && (
                                    <MapViewDirections
                                        origin={pickupCoords}
                                        destination={dropOffCoords}
                                        apikey={Google_Map_Key}
                                        strokeWidth={4}
                                        strokeColor={appColors.primary}
                                    />
                                )}
                            </MapView>
                        </View>
                        <View style={styles.view}>
                            <View >
                                <View>
                                    <FlatList
                                        horizontal
                                        data={serviceCategories}
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={{ paddingBottom: windowHeight(8) }}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => onPress(item, index)}
                                                style={[
                                                    styles.item,
                                                    { width: isScrollable ? width / 4 : width }
                                                ]}
                                            >
                                                <Image
                                                    style={styles.image}
                                                    source={Images.imagePlaceholder}
                                                />
                                                <Text
                                                    style={[
                                                        styles.text,
                                                        { color: isDark ? appColors.whiteColor : appColors.primaryText }
                                                    ]}
                                                >
                                                    {item.name}
                                                </Text>
                                                {selectedIndex === index && (
                                                    <View style={styles.highlightLine} />
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    />
                                    <View style={styles.mainLine} />
                                </View>
                            </View>


                            <TouchableOpacity
                                style={[styles.packageMainView, {
                                    backgroundColor: bgFullStyle,
                                    borderColor: isDark ? appColors.darkBorder : appColors.border
                                }]} onPress={() => navigation.navigate('OneWaySelect')}
                            >
                                <View
                                    style={[styles.searchView, {
                                        backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray,

                                        flexDirection: viewRTLStyle,

                                    }]}
                                >
                                    <Search />
                                    <Text
                                        style={[styles.whereNext, {

                                            color: isDark ? appColors.whiteColor : appColors.primaryText, textAlign: textRTLStyle
                                        }]}
                                    >
                                        Where next?                                </Text>
                                </View>
                                <Text
                                    style={[styles.homeRecentSearch, {

                                        textAlign: textRTLStyle
                                    }]}
                                >Recent Search
                                </Text>
                                <FlatList
                                    data={locationData}
                                    keyExtractor={(item) => item.id?.toString()}
                                    renderItem={({ item, index }) => (
                                        <>
                                            <View style={[styles.centerLocation, { flexDirection: viewRTLStyle }]}>
                                                <Location />
                                                <Text
                                                    style={[
                                                        styles.adajanText,
                                                        { color: isDark ? appColors.whiteColor : appColors.primaryText }
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                            </View>

                                            {index < locationData.length - 1 && (
                                                <View style={styles.itemDivider} />
                                            )}
                                        </>
                                    )}
                                />


                            </TouchableOpacity>

                        </View>
                        <View style={{ marginBottom: windowHeight(40) }}>
                            <HomeSlider
                                onSwipeStart={() => setIsScrolling(false)}
                                onSwipeEnd={() => setIsScrolling(true)}
                                bannerData={homeScreenDataPrimary.banners}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>

        </View>
    )
}