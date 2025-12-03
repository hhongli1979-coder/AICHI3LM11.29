import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { Add, Back, Location, Swap } from '@src/utils/icons'
import { appColors } from '@src/themes'
import { HomeSlider } from '@src/components'
import { TextInput } from 'react-native-gesture-handler'
import { styles } from './styles'
import { Button, LineContainer } from '@src/commonComponent'
import { useAppNavigation } from '@src/utils/navigation'
import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { useValues } from '@src/utils/context/index';
import { useNavigation } from '@react-navigation/native'


export function CarpoolingHome() {
    const [isScrolling, setIsScrolling] = useState(true);
    const { navigate, goBack } = useAppNavigation();
    const { viewRTLStyle, Google_Map_Key } = useValues()
    const navigation = useNavigation()
    const mapRef = useRef(null);
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropOffCoords, setDropOffCoords] = useState(null);

    return (
        <View style={styles.mainView}>

            <View style={styles.headerView}>
                <TouchableOpacity onPress={goBack} activeOpacity={0.7} style={styles.back}>
                    <Back />
                </TouchableOpacity>
                <Text style={styles.headerText}>Carpooling</Text>
                <TouchableOpacity onPress={() => navigate('PublishRide')} activeOpacity={0.7} style={styles.add}>
                    <Add colors={appColors.primaryText} />
                </TouchableOpacity>
            </View>


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
                        <View style={styles.rideView}>
                            <TouchableOpacity style={styles.searchRideView}>
                                <Text style={styles.searchRide}>Search Ride</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.createRideView}>
                                <Text style={styles.createRide}>Create Ride</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.lineContainer}>
                            <LineContainer />
                        </View>
                        <View style={styles.locationMainView}>
                            <View style={styles.locationView}>
                                <View style={styles.inputBox}>
                                    <View style={styles.iconContainer}>
                                        <Location />
                                    </View>
                                    <TextInput
                                        placeholder="Pickup Location"
                                        placeholderTextColor={appColors.gray}

                                    />
                                </View>
                                <View style={styles.inputBox}>
                                    <View style={styles.iconContainer}>
                                        <Location />
                                    </View>
                                    <TextInput
                                        placeholder="Drop-off Location"
                                        style={styles.input}
                                        placeholderTextColor={appColors.gray}

                                    />
                                </View>

                                <TouchableOpacity style={styles.swapButton} activeOpacity={0.7}>
                                    <Swap />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.buttonView}>
                                <Button textColor={appColors.whiteColor} title='Next' onPress={() => navigation.navigate('Stopover')} />
                            </View>
                        </View>
                        <View style={styles.addressMainView}>
                            <Text
                                style={styles.recent}
                            >
                                Recent Search
                            </Text>
                            <View style={styles.textView}>
                                <Location />
                                <Text
                                    style={styles.adajanText}
                                >
                                    Adajan, Gujarat
                                </Text>
                            </View>
                            <View
                                style={styles.addressView}
                            />
                            <View style={{ flexDirection: viewRTLStyle, alignItems: "center" }}>
                                <Location />
                                <Text
                                    style={styles.adajanText}
                                >
                                    Adajan, Gujarat
                                </Text>
                            </View>
                        </View>



                        <View style={styles.slider}>
                            <HomeSlider
                                onSwipeStart={() => setIsScrolling(false)}
                                onSwipeEnd={() => setIsScrolling(true)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>


        </View>
    )
}











