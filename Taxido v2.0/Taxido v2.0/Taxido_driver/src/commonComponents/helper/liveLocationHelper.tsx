import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import { requestLocationPermission } from './permissionHelper';

let locationWatchId: any = null;
let lastCoords: any = null;
let totalDistanceCovered = 0;
let firebaseUpdateCount = 0;

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const startLiveLocation = async (driverId: number, selfDriver: any) => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
        return false;
    }

    const driverRef = firestore().collection('driverTrack').doc(driverId.toString());
    const today = new Date().toISOString().split('T')[0];

    const doc = await driverRef.get();
    const data = doc.data() || {};

    const now = firestore.Timestamp.now();
    const updatePayload: any = {
        is_online: "1",
        last_online_at: now,
    };

    if (data.date !== today) {
        updatePayload.total_online_time_today = 0;
        updatePayload.date = today;
    }

    try {
        await driverRef.set(updatePayload, { merge: true });
    } catch (e) {
    }

    const getInitialLocation = () =>
        new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                resolve,
                (error) => {
                    Geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: false,
                        timeout: 10000,
                        maximumAge: 10000,
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0,
                }
            );
        });

    try {
        const position: any = await getInitialLocation();
        const { latitude, longitude } = position.coords;
        lastCoords = { latitude, longitude };
        totalDistanceCovered = 0;
        firebaseUpdateCount = 1;

        await driverRef.set({
            lat: latitude.toString(),
            lng: longitude.toString(),
            service_id: selfDriver?.service_id,
            service_category_id: selfDriver?.service_category_id,
            vehicle_type_id: selfDriver?.vehicle_info?.vehicle_type_id,
            vehicle_map_icon_url: selfDriver?.vehicle_info?.vehicle_type_map_icon_url,
            driver_name: selfDriver?.name,
            review_count: selfDriver?.review_count,
            rating_count: selfDriver?.rating_count,
            model: selfDriver?.vehicle_info?.model,
            plate_number: selfDriver?.vehicle_info?.plate_number,
            profile_image_url: selfDriver?.profile_image_url
        }, { merge: true });
    } catch (error) {
        return false;
    }

    locationWatchId = Geolocation.watchPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            if (!lastCoords) {
                lastCoords = { latitude, longitude };
                try {
                    await driverRef.set({
                        lat: latitude.toString(),
                        lng: longitude.toString(),
                    }, { merge: true });
                    firebaseUpdateCount++;
                } catch (error) {
                }
                return;
            }

            const distanceMoved = haversineDistance(
                lastCoords.latitude,
                lastCoords.longitude,
                latitude,
                longitude
            );

            totalDistanceCovered += distanceMoved;

            if (distanceMoved >= 180) {
                lastCoords = { latitude, longitude };
                try {
                    await driverRef.set({
                        lat: latitude.toString(),
                        lng: longitude.toString(),
                    }, { merge: true });
                    firebaseUpdateCount++;
                } catch (error) {
                }
            }
        },
        (error) => {
        },
        {
            enableHighAccuracy: true,
            distanceFilter: 50,
            interval: 10000,
            fastestInterval: 5000,
            showsBackgroundLocationIndicator: true,
        }
    );

    return true;
};


export const stopLiveLocation = () => {
    if (locationWatchId !== null) {
        Geolocation.clearWatch(locationWatchId);
        locationWatchId = null;
        lastCoords = null;
        totalDistanceCovered = 0;
        firebaseUpdateCount = 0;
    }
};
