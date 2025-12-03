import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, Image, Vibration, ActivityIndicator } from "react-native";
import { appColors, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { appFonts } from "@src/themes";
import { useAppNavigation } from "@src/utils/navigation";
import { notificationHelper } from "@src/commonComponent";
import { useDispatch } from "react-redux";
import { userZone, vehicleTypeDataGet } from "@src/api/store/actions";
import { deleteValue } from "@src/utils/localstorage";


interface DynamicIcelandProps {
    rideData?: any; // You can make this more specific based on your ride data structure
}

const DynamicIceland: React.FC<DynamicIcelandProps> = ({ rideData }) => {

    const [isBubble, setIsBubble] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = useAppNavigation();

    // --- Refs for synchronous tracking and animations ---
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const isDraggable = useRef(false);
    const dispatch = useDispatch();


    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
    const BOX_HEIGHT = windowHeight(50);
    const BUBBLE_SIZE = windowHeight(50);
    const LONG_PRESS_DURATION = 500; // Changed to 500ms as per UI pattern
    const BOTTOM_SNAP_THRESHOLD = SCREEN_HEIGHT * 0.75; // Top 75% of the screen
    const BOTTOM_AREA_PADDING = windowHeight(70); // Padding from the bottom edge


    // Set initial position to bottom center
    const initialX = (SCREEN_WIDTH - windowWidth(170)) / 2; // Initial guess, will update on layout
    const initialY = SCREEN_HEIGHT - BOX_HEIGHT - BOTTOM_AREA_PADDING;

    const position = useRef(new Animated.ValueXY({ x: initialX, y: initialY })).current;
    const sizeAnimation = useRef(new Animated.ValueXY({ x: windowWidth(170), y: BOX_HEIGHT })).current;
    const borderRadiusAnimation = useRef(new Animated.Value(50)).current;
    const [contentWidth, setContentWidth] = useState(windowWidth(170));

    // --- Animation Functions  ---
    const transformToBubble = () => {
        if (isBubble) return;
        isDraggable.current = true;
        setIsBubble(true);

        Animated.parallel([
            Animated.spring(sizeAnimation, {
                toValue: { x: BUBBLE_SIZE, y: BUBBLE_SIZE },
                useNativeDriver: false,
            }),
            Animated.timing(borderRadiusAnimation, {
                toValue: BUBBLE_SIZE / 2,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const transformToBox = () => {
        setIsBubble(false);
        Animated.parallel([
            Animated.spring(sizeAnimation, {
                toValue: { x: contentWidth, y: BOX_HEIGHT },
                useNativeDriver: false,
            }),
            Animated.timing(borderRadiusAnimation, {
                toValue: 50,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    // Track the current position values
    const currentPosition = useRef({ x: initialX, y: initialY });

    // --- PanResponder ---
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            onPanResponderGrant: () => {
                isDraggable.current = false;
                if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                }
                longPressTimer.current = setTimeout(() => {
                    transformToBubble();
                    // Add vibration on long press
                    Vibration.vibrate(100);
                }, LONG_PRESS_DURATION);

                // Get current position values
                position.extractOffset();
                position.setValue({ x: 0, y: 0 });
            },

            onPanResponderMove: (evt, gestureState) => {
                if (Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10) {
                    if (longPressTimer.current) {
                        clearTimeout(longPressTimer.current);
                        longPressTimer.current = null;
                    }
                }
                if (isDraggable.current) {
                    position.setValue({ x: gestureState.dx, y: gestureState.dy });
                }
            },

            onPanResponderRelease: (e, gestureState) => {
                if (longPressTimer.current) {
                    clearTimeout(longPressTimer.current);
                    // This was a short tap since the timer didn't complete

                    gotoBook(rideData);
                }

                // Clear the timer reference in all cases
                longPressTimer.current = null;

                if (isDraggable.current) {
                    position.flattenOffset();

                    // Update current position
                    currentPosition.current = {
                        x: currentPosition.current.x + gestureState.dx,
                        y: currentPosition.current.y + gestureState.dy
                    };

                    let targetX, targetY;

                    // --- NEW: Smart Snap Logic ---
                    if (gestureState.moveY > BOTTOM_SNAP_THRESHOLD) {
                        targetX = (SCREEN_WIDTH - (isBubble ? BUBBLE_SIZE : contentWidth)) / 2; // Center horizontally
                        targetY = SCREEN_HEIGHT - BOX_HEIGHT - BOTTOM_AREA_PADDING;
                    } else {
                        // Otherwise, snap to the nearest left or right edge.
                        targetY = currentPosition.current.y; // Keep the current vertical position
                        if (gestureState.moveX > SCREEN_WIDTH / 2) {
                            targetX = SCREEN_WIDTH - (isBubble ? BUBBLE_SIZE : contentWidth) - 20; // Snap right
                        } else {
                            targetX = 20; // Snap left
                        }
                    }

                    Animated.spring(position, {
                        toValue: { x: targetX, y: targetY },
                        useNativeDriver: false,
                    }).start(() => {
                        isDraggable.current = false;
                        transformToBox();
                        // Update current position after animation
                        currentPosition.current = { x: targetX, y: targetY };
                    });
                }
            },
        })
    ).current;


    const gotoBook = async (item) => {
        setLoading(true);
        const locations = item?.locations || [];
        const pickupLocation = locations[0] || null;
        const destination =
            locations.length > 1 ? locations[locations.length - 1] : null;
        const stops =
            locations.length > 2 ? locations.slice(1, locations.length - 1) : [];
        const pickupCoords = item.location_coordinates[0];

        try {
            const res = await dispatch(userZone({ lat: pickupCoords?.lat, lng: pickupCoords?.lng })).unwrap();
            const zoneValue = res;
            const rawLocations = item?.location_coordinates ?? [];
            const filteredLocations = rawLocations
                .filter(
                    (coord) =>
                        coord &&
                        coord.lat != null &&
                        coord.lng != null
                )
                .map((coord) => ({
                    lat: Number(coord.lat),
                    lng: Number(coord.lng),
                }));

            const payload = {
                locations: filteredLocations,
                service_id: item?.service_id,
                service_category_id: item?.service_category_id,
            };

            //  WAIT for vehicle data
            await dispatch(vehicleTypeDataGet(payload));

            const categoryId = item?.service_id;
            const categoryOptionID = item?.service_category_id;
            const scheduleDate = null;

            const service_name = item?.service?.service_type;

            // FIX slug
            const slug = item?.service_category?.service_category_type;

            const pickupCoords1 = filteredLocations[0] || null;
            const destinationCoords1 =
                filteredLocations.length > 1
                    ? filteredLocations[filteredLocations.length - 1]
                    : null;

            //  Navigation
            if (rideData?.status == 'requested') {
                if (slug === "intercity" || slug === "ride" || service_name === "parcel" || service_name === "freight") {
                    navigation.navigate("BookRide", {
                        destination,
                        stops,
                        pickupLocation,
                        service_ID: categoryId,
                        zoneValue,
                        scheduleDate,
                        service_category_ID: categoryOptionID,
                        filteredLocations,
                        pickupCoords: pickupCoords1,
                        destinationCoords: destinationCoords1,
                        vehicleIdValue: item?.vehicle_type?.id,
                        countinueRide: true,
                        countinueRideId: item?.id,
                    });
                } else {
                }
            } else if (rideData?.ride_status?.slug == "accepted") {
                navigation.navigate('RideActive', { activeRideOTP: rideData });
            } else if (rideData?.ride_status?.slug == "arrived") {
                navigation.navigate('RideActive', { activeRideOTP: rideData });
            } else if (rideData?.ride_status?.slug == "started") {
                navigation.navigate("Payment", { rideId: rideData?.id });
            } else if (rideData?.ride_status?.slug == "completed") {
                deleteValue("current_ride_request_id");
                notificationHelper("", "Ride completed", "success");
            }
            else {
                notificationHelper("", "Something went wrong", "error");
                deleteValue("current_ride_request_id");
            }
        } catch (error) {
            notificationHelper("", error, "error");
            deleteValue("current_ride_request_id");
        } finally {
            setLoading(false);
        }
    };



    // --- Styles ---
    const animatedStyle = {
        width: sizeAnimation.x,
        height: sizeAnimation.y,
        borderRadius: borderRadiusAnimation,
        transform: position.getTranslateTransform(),
    };

    const getRideDisplayStatus = (rideData) => {
        const isFinding =
            rideData?.status === "requested" ||
            rideData?.ride_status?.slug === "requested";

        if (isFinding) return "Finding...";

        const status = rideData?.status || rideData?.ride_status?.slug;

        return status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "";
    };

    const renderContent = () => {
        if (rideData) {
            if (isBubble) {
                return (
                    <View style={[styles.icelandView, { backgroundColor: appColors.whiteColor }]}>
                        {loading ? <ActivityIndicator color={appColors.primary} size={'small'} /> : <Image
                            source={{ uri: rideData?.vehicle_type?.vehicle_image_url }}
                            style={styles.icelandImage}
                        />}
                    </View>
                );
            } else {
                return (
                    <View
                        style={styles.boxContent}
                        onLayout={(event) => {
                            const { width } = event.nativeEvent.layout;
                            const newWidth = Math.max(width + windowWidth(20), windowWidth(170));
                            if (Math.abs(newWidth - contentWidth) > 5) {
                                setContentWidth(newWidth);
                                if (!isBubble) {
                                    Animated.spring(sizeAnimation, {
                                        toValue: { x: newWidth, y: BOX_HEIGHT },
                                        useNativeDriver: false,
                                    }).start();
                                    // Re-center if at bottom
                                    if (currentPosition.current.y > BOTTOM_SNAP_THRESHOLD) {
                                        const newX = (SCREEN_WIDTH - newWidth) / 2;
                                        Animated.spring(position, {
                                            toValue: { x: newX, y: currentPosition.current.y },
                                            useNativeDriver: false
                                        }).start();
                                        currentPosition.current.x = newX;
                                    }
                                }
                            }
                        }}
                    >
                        <Text style={styles.name}>
                            {getRideDisplayStatus(rideData)}
                        </Text>
                        <View style={styles.icelandView} >
                            {loading ? <ActivityIndicator color={appColors.primary} size={'small'} /> : <Image source={{ uri: rideData?.vehicle_type?.vehicle_image_url }} style={styles.icelandImage} />}
                        </View>
                    </View>
                );
            }
        }

        return null;
    };


    return (
        <Animated.View style={[styles.base, animatedStyle, { backgroundColor: '#026BDD' }]} {...panResponder.panHandlers}>
            {renderContent()}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        position: "absolute",
        zIndex: 999,
    },
    boxContent: {
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: fontSizes.FONT18,
        color: appColors.whiteColor,
        marginHorizontal: windowHeight(5),
        fontFamily: appFonts.medium,
    },
    number: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 2,
        color: appColors.primary,
    },
    bubbleNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: appColors.primary,
    },
    icelandView: {
        height: windowHeight(40),
        width: windowHeight(40),
        borderRadius: windowHeight(20),
        backgroundColor: appColors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icelandImage: {
        height: windowHeight(35),
        width: windowHeight(35),
        borderRadius: windowHeight(20),
        resizeMode: 'contain'
    }
});

export default DynamicIceland;