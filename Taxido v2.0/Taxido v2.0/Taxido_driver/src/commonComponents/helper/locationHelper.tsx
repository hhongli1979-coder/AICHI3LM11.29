import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, BackHandler, Linking, PermissionsAndroid, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { currentZone } from '../../api/store/action';

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);
    const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const useSmartLocation = () => {
    const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
    const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
    const [locationStatus, setLocationStatus] = useState('Checking location...');
    const dispatch = useDispatch();


    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            getOneTimeLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getOneTimeLocation();
                } else {
                    if (setLocationStatus) {
                        setLocationStatus('Permission Denied');
                    }

                    Alert.alert(
                        'Location Permission Denied',
                        'You need to enable location permission from settings or exit the app.',
                        [
                            {
                                text: 'Go to Settings',
                                onPress: () => Linking.openSettings(),
                            },
                            {
                                text: 'Exit App',
                                onPress: () => BackHandler.exitApp(),
                                style: 'destructive',
                            },
                        ],
                        { cancelable: false }
                    );
                }
            } catch (err) {
            }
        }
    };


    const getOneTimeLocation = async () => {
        setLocationStatus('Getting Location ...');

        const storedLat = await AsyncStorage.getItem('user_latitude');
        const storedLng = await AsyncStorage.getItem('user_longitude');

        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                const isFirstTime =
                    !storedLat || !storedLng || isNaN(parseFloat(storedLat)) || isNaN(parseFloat(storedLng));

                let shouldUpdate = true;

                if (!isFirstTime) {
                    const oldLat = parseFloat(storedLat);
                    const oldLng = parseFloat(storedLng);
                    const distance = getDistance(oldLat, oldLng, latitude, longitude);
                    shouldUpdate = distance > 50;
                }

                if (isFirstTime || shouldUpdate) {
                    await AsyncStorage.setItem('user_latitude', latitude.toString());
                    await AsyncStorage.setItem('user_longitude', longitude.toString());
                    dispatch(currentZone({ lat: latitude.toString(), lng: longitude.toString() }));
                    setLocationStatus(isFirstTime ? 'Stored first-time location' : 'Updated location (moved > 50m)');
                } else {
                    dispatch(currentZone({ lat: latitude.toString(), lng: longitude.toString() }));
                    setLocationStatus('Location unchanged (within 50m)');
                }

                setCurrentLatitude(latitude);
                setCurrentLongitude(longitude);
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000,
            },
        );
    };


    useEffect(() => {
        const init = async () => {
            const permissionGranted = await requestLocationPermission();
            if (!permissionGranted) {
                setLocationStatus('Permission denied');
                return;
            }
        };
        init();
    }, []);


    return { currentLatitude, currentLongitude, locationStatus };
};

export default useSmartLocation;

