import { Alert, Platform, Linking, BackHandler, PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PERMISSIONS_REQUESTED_KEY = 'APP_PERMISSIONS_REQUESTED';

interface PermissionResult {
    location: boolean;
    notification: boolean;
    camera: boolean;
    allGranted: boolean;
}

/**
 * Request Location Permission (Fine Location)
 */
export const requestLocationPermission = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'android') {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission Required',
                    message: 'This app needs access to your location to provide ride services.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'Allow',
                }
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            // iOS
            const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            return result === RESULTS.GRANTED || result === RESULTS.LIMITED;
        }
    } catch (error) {
        console.error('Error requesting location permission:', error);
        return false;
    }
};

/**
 * Request Notification Permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'android') {
            // Android 13+ requires POST_NOTIFICATIONS permission
            if (Platform.Version >= 33) {
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                    {
                        title: 'Notification Permission Required',
                        message: 'Allow notifications to receive ride updates and alerts.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'Allow',
                    }
                );
                return result === PermissionsAndroid.RESULTS.GRANTED;
            }
            return true; // Below Android 13, no explicit permission needed
        } else {
            // iOS - Firebase Messaging
            const authStatus = await messaging().requestPermission();
            return (
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL
            );
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
    }
};

/**
 * Request Camera Permission
 */
export const requestCameraPermission = async (): Promise<boolean> => {
    try {
        const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
        const result = await request(permission);
        return result === RESULTS.GRANTED;
    } catch (error) {
        console.error('Error requesting camera permission:', error);
        return false;
    }
};

/**
 * Request Background Location Permission (Android only)
 */
export const requestBackgroundLocationPermission = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'android' && Platform.Version >= 29) {
            const result = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                {
                    title: 'Background Location Permission',
                    message: 'Allow location access in the background to track rides accurately.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'Allow',
                }
            );
            return result === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // iOS or older Android
    } catch (error) {
        console.error('Error requesting background location permission:', error);
        return false;
    }
};

/**
 * Show alert when permission is denied with options to go to settings or exit
 */
export const showPermissionDeniedAlert = (permissionName: string, onRetry?: () => void) => {
    Alert.alert(
        `${permissionName} Permission Required`,
        `This app requires ${permissionName.toLowerCase()} permission to function properly. Please enable it in settings.`,
        [
            {
                text: 'Go to Settings',
                onPress: () => {
                    if (Platform.OS === 'ios') {
                        Linking.openURL('app-settings:');
                    } else {
                        Linking.openSettings();
                    }
                },
            },
            {
                text: 'Exit App',
                style: 'destructive',
                onPress: () => BackHandler.exitApp(),
            },
            ...(onRetry ? [{
                text: 'Retry',
                onPress: onRetry,
            }] : []),
        ],
        { cancelable: false }
    );
};

/**
 * Request all essential permissions on first app launch
 * Returns true if all critical permissions are granted
 */
export const requestAllPermissionsOnFirstLaunch = async (): Promise<PermissionResult> => {
    const result: PermissionResult = {
        location: false,
        notification: false,
        camera: false,
        allGranted: false,
    };

    try {
        // Check if permissions have already been requested
        const alreadyRequested = await AsyncStorage.getItem(PERMISSIONS_REQUESTED_KEY);

        // Step 1: Request Location Permission (Critical)
        result.location = await requestLocationPermission();

        if (!result.location) {
            showPermissionDeniedAlert('Location', async () => {
                const retryResult = await requestAllPermissionsOnFirstLaunch();
                return retryResult;
            });
            return result;
        }

        // Step 2: Request Background Location (Android 10+)
        if (Platform.OS === 'android' && Platform.Version >= 29) {
            await requestBackgroundLocationPermission();
        }

        // Step 3: Request Notification Permission
        result.notification = await requestNotificationPermission();

        if (!result.notification) {
            // Non-blocking - just inform user
            Alert.alert(
                'Notification Permission',
                'You won\'t receive ride updates and alerts. You can enable this later in settings.',
                [{ text: 'OK' }]
            );
        }

        // Step 4: Request Camera Permission (for profile/document upload)
        result.camera = await requestCameraPermission();

        if (!result.camera) {
            // Non-blocking - can be requested later when needed
        }

        // Mark permissions as requested
        await AsyncStorage.setItem(PERMISSIONS_REQUESTED_KEY, 'true');

        // All critical permissions granted
        result.allGranted = result.location && result.notification;

        return result;
    } catch (error) {
        console.error('Error in requestAllPermissionsOnFirstLaunch:', error);
        return result;
    }
};

/**
 * Check if critical permissions are already granted
 */
export const checkCriticalPermissions = async (): Promise<boolean> => {
    try {
        let locationGranted = false;

        if (Platform.OS === 'android') {
            locationGranted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
        } else {
            const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            locationGranted = result === RESULTS.GRANTED || result === RESULTS.LIMITED;
        }

        return locationGranted;
    } catch (error) {
        console.error('Error checking permissions:', error);
        return false;
    }
};

/**
 * Reset permission request flag (for testing)
 */
export const resetPermissionRequestFlag = async () => {
    await AsyncStorage.removeItem(PERMISSIONS_REQUESTED_KEY);
};
