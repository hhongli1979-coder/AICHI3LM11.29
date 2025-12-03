import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userZone } from '@src/api/store/actions';
import { useDispatch } from 'react-redux';
import { requestLocationPermissionAndRun } from './permissionHelper';
import { AppDispatch } from '@src/api/store';

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
    const dispatch = useDispatch<AppDispatch>();

    const requestLocationPermission = () => {
        requestLocationPermissionAndRun(getOneTimeLocation);
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
                    dispatch(userZone({ lat: latitude.toString(), lng: longitude.toString() }));
                    setLocationStatus(isFirstTime ? 'Stored first-time location' : 'Updated location (moved > 50m)');
                } else {
                    dispatch(userZone({ lat: latitude.toString(), lng: longitude.toString() }));
                    setLocationStatus('Location unchanged (within 50m)');
                }

                setCurrentLatitude(latitude);
                setCurrentLongitude(longitude);
            },
            (error) => {
                console.warn('[Location Error]', error.message);
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
            const permissionGranted: any = await requestLocationPermission();
            if (!permissionGranted) {
                setLocationStatus('Permission denied');
                return;
            }

            const storedLat = await AsyncStorage.getItem('user_latitude');
            const storedLng = await AsyncStorage.getItem('user_longitude');

            if (!storedLat || !storedLng) {
                fetchLocation();
            } else {
                Geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        const isFirstTime =
                            !storedLat || !storedLng || isNaN(parseFloat(storedLat)) || isNaN(parseFloat(storedLng));

                        const oldLat = parseFloat(storedLat);
                        const oldLng = parseFloat(storedLng);
                        const distance = getDistance(oldLat, oldLng, latitude, longitude);

                        if (distance > 50) {
                            await AsyncStorage.setItem('user_latitude', latitude.toString());
                            await AsyncStorage.setItem('user_longitude', longitude.toString());
                            setCurrentLatitude(latitude);
                            setCurrentLongitude(longitude);
                            setLocationStatus(`Updated location (Moved ${Math.round(distance)}m)`);
                        } else if (isFirstTime) {
                            await AsyncStorage.setItem('user_latitude', latitude.toString());
                            await AsyncStorage.setItem('user_longitude', longitude.toString());
                            setCurrentLatitude(latitude);
                            setCurrentLongitude(longitude);
                            setLocationStatus('Location stored for the first time');
                        } else {
                            setCurrentLatitude(oldLat);
                            setCurrentLongitude(oldLng);
                            setLocationStatus('Stored location used (within 50m)');
                        }
                    },
                    (error) => {
                        console.warn('[SmartLocation] Error on getting stored location:', error.message);
                        setLocationStatus('Failed to fetch new location');
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
                );
            }
        };

        init();
    }, []);

    const fetchLocation = () => {
        setLocationStatus('Fetching location...');
        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await AsyncStorage.setItem('user_latitude', latitude.toString());
                await AsyncStorage.setItem('user_longitude', longitude.toString());
                setCurrentLatitude(latitude);
                setCurrentLongitude(longitude);
                setLocationStatus('Location fetched & stored');
            },
            (error) => {
                console.warn('[SmartLocation] Error on location fetch:', error.message);
                setLocationStatus('Failed to fetch location');
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
    };

    return { currentLatitude, currentLongitude, locationStatus };
};

export default useSmartLocation;

