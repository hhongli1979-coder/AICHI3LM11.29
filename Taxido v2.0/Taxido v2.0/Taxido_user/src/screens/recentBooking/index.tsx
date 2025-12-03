import { View, Text, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import { appColors, windowWidth } from '@src/themes';
import { CalenderSmall, ClockSmall, Gps, PickLocation } from '@src/utils/icons';
import { external } from '@src/styles/externalStyle';
import { styles } from './styles';
import { useValues } from '@src/utils/context/index';
import { Button, formatDateTime, notificationHelper } from '@src/commonComponent';
import { useAppNavigation } from '@src/utils/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { userRideLocation, vehicleTypeDataGet } from '@src/api/store/actions';

export function Recentbooking({ recentRideData }) {
    const { bgFullStyle, textColorStyle, viewRTLStyle, isDark, textRTLStyle, Google_Map_Key } = useValues();
    const dispatch = useDispatch();
    const [loadingIndex, setLoadingIndex] = useState(null);
    const { zoneValue } = useSelector((state: any) => state.zone);
    const { translateData } = useSelector((state) => state.setting);
    const { navigate } = useAppNavigation();

    if (!recentRideData || recentRideData.length === 0) {
        return null;
    }

    const convertToCoords = async (address) => {
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${Google_Map_Key}`
            );
            const data = await res.json();
            if (data.status === 'OK' && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                return { latitude: lat, longitude: lng };
            } else {
                console.warn("No results for:", address, data.status);
                return null;
            }
        } catch (err) {
            console.error("Geocoding error:", err);
            return null;
        }
    };

    const convertStopsToCoords = async (stopList) => {
        const coordsArray = [];
        for (const stop of stopList) {
            try {
                const res = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(stop)}&key=${Google_Map_Key}`
                );
                const data = await res.json();
                if (data.status === 'OK' && data.results.length > 0) {
                    const { lat, lng } = data.results[0].geometry.location;
                    coordsArray.push({ latitude: lat, longitude: lng });
                } else {
                    console.warn("No results for stop:", stop, data.status);
                    coordsArray.push(null);
                }
            } catch (err) {
                console.error("Stop geocoding error:", err);
                coordsArray.push(null);
            }
        }
        return coordsArray;
    };


    const gotoBook = async (item) => {
        const locations = item?.locations || [];
        const pickupLocation = locations[0] || null;
        const destination = locations.length > 1 ? locations[locations.length - 1] : null;
        const stops = locations.length > 2 ? locations.slice(1, locations.length - 1) : [];
        try {
            const pickupCoords = await convertToCoords(pickupLocation);
            const destinationCoords = await convertToCoords(destination);
            const stopCoords = await convertStopsToCoords(stops || []);
            const ride_number = item?.id;
            const res = await dispatch(userRideLocation({ ride_number })).unwrap();
            const zoneValue = res?.data?.[0];
            const rawLocations = [
                pickupCoords,
                stopCoords[0],
                stopCoords[1],
                stopCoords[2],
                destinationCoords,
            ];

            const filteredLocations = rawLocations
                .filter(coord => coord && coord.latitude != null && coord.longitude != null)
                .map(coord => ({
                    lat: coord.latitude,
                    lng: coord.longitude,
                }));

            const payload = {
                locations: filteredLocations,
                service_id: item?.service_id,
                service_category_id: item?.service_category_id,
            };

            dispatch(vehicleTypeDataGet(payload)).then((res: any) => {
                const categoryId = item?.service_id;
                const categoryOptionID = item?.service_category_id;
                const scheduleDate = null;
                const service_name = item?.service?.service_type;
                const slug = item?.service_category?.slug;
                const pickupCoords1 = item?.location_coordinates[0];
                const destinationCoords1 = item?.location_coordinates.length > 1 ? item?.location_coordinates[item?.location_coordinates.length - 1] : null;
                if (slug === 'intercity' || slug === 'ride') {
                    navigate("BookRide", {
                        destination,
                        stops,
                        pickupLocation,
                        service_ID: categoryId,
                        zoneValue,
                        scheduleDate,
                        service_category_ID: categoryOptionID,
                        filteredLocations: filteredLocations,
                        pickupCoords: pickupCoords1,
                        destinationCoords: destinationCoords1
                    });

                } else if (slug === 'package') {
                    navigate("Rental", {
                        pickupLocation,
                        service_ID: categoryId,
                        service_category_ID: categoryOptionID,
                        zoneValue,

                    });
                } else if (service_name === 'parcel' || service_name === 'freight') {
                    navigate("Outstation", {
                        destination,
                        stops,
                        pickupLocation,
                        service_ID: categoryId,
                        zoneValue,
                        service_name,
                        service_category_ID: categoryOptionID,
                        filteredLocations: filteredLocations,
                        pickupCoords: pickupCoords1,
                        destinationCoords: destinationCoords1
                    });
                }
            })
        } catch (error) {
            notificationHelper('', error, "error");
        } finally {
        }
    };


    const renderItem = ({ item, index }) => {
        const { date, time } = formatDateTime(item?.created_at);
        return (
            <View
                style={[styles.view, {
                    borderColor: isDark ? appColors.darkBorder : appColors.border,
                    backgroundColor: bgFullStyle,
                }]}>
                <View style={{ flexDirection: viewRTLStyle }}>
                    <View style={styles.viewWidth}>
                        <View style={{ flexDirection: viewRTLStyle }}>
                            <View style={[styles.imageView, { backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray }]}>
                                <Image source={{
                                    uri: item?.vehicle_type?.vehicle_image_url
                                }} style={styles.img} />
                            </View>
                            <View style={styles.textView}>
                                <Text style={[styles.textId, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>#{item?.ride_number}</Text>
                                <Text style={styles.price}>{zoneValue?.currency_symbol}{item?.total}</Text>
                                <Text style={[styles.textId, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{Number(item?.distance).toFixed(1)} {item?.distance_unit}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.viewWidth1}>
                        <View style={[styles.clockSmallView1, { flexDirection: viewRTLStyle }]}>
                            <View style={styles.clockSmall}>
                                <CalenderSmall />
                            </View>
                            <Text style={styles.date}>{date}</Text>
                        </View>
                        <View style={[styles.clockSmallView, { flexDirection: viewRTLStyle }]}>
                            <View style={styles.clockSmall}>
                                <ClockSmall />
                            </View>
                            <Text style={styles.date}>{time}</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.border, { borderColor: isDark ? appColors.darkBorder : appColors.border }]} />
                <View style={[{ flexDirection: viewRTLStyle }, { backgroundColor: bgFullStyle }]}>
                    <View style={[external.fd_column, external.mh_15, external.mt_8]}>
                        <PickLocation height={12} width={12} colors={isDark ? appColors.whiteColor : appColors.primaryText} />
                        <View style={styles.icon} />
                        <Gps height={12} width={12} colors={isDark ? appColors.whiteColor : appColors.primaryText} />
                    </View>
                    <View style={[external.pv_10]}>
                        <Text style={[styles.itemStyle, { color: textColorStyle, width: windowWidth(310) }]}>
                            {item?.locations[0]?.length > 42
                                ? `${item.locations[0].slice(0, 42)}...`
                                : item?.locations[0]}
                        </Text>
                        <View style={[styles.dashedLine, { borderColor: isDark ? appColors.darkBorder : appColors.border }]} />
                        <Text style={[styles.pickUpLocationStyles, { color: textColorStyle }]}>{item?.locations[item?.locations.length - 1]}</Text>
                    </View>
                </View>

                <Button
                    backgroundColor={appColors.primary}
                    onPress={() => {
                        setLoadingIndex(index);
                        gotoBook(item).finally(() => setLoadingIndex(null));
                    }}
                    textColor={appColors.whiteColor}
                    title={translateData.BookAgainTextttt}
                    loading={loadingIndex === index}
                />
            </View>
        )
    };

    return (
        <View style={[styles.mainContainer, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray }]}>
            <Text style={[styles.recentRides, { color: isDark ? appColors.whiteColor : appColors.primaryText, textAlign: textRTLStyle }]}>{translateData.homeRecentRides}</Text>
            <FlatList
                data={recentRideData}
                keyExtractor={(item) => item?.id}
                renderItem={renderItem}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}
