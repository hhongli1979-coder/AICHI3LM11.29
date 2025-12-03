import PushNotification from 'react-native-push-notification';
import { Platform, PermissionsAndroid } from 'react-native';

class NotificationHelper {
    static configure() {
        PushNotification.configure({
            onNotification: function (notification) {
            },
            popInitialNotification: true,
            requestPermissions: Platform.OS === 'ios',
        });

        PushNotification.createChannel(
            {
                channelId: 'default-channel-id',
                channelName: 'Default Channel',
                importance: 4,
                vibrate: true,
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );

        if (Platform.OS === 'android' && Platform.Version >= 33) {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            ).then((result) => {
                if (result === PermissionsAndroid.RESULTS.GRANTED) {
                } else {
                    console.warn('Notification permission denied');
                }
            });
        }
    }

    static showNotification({ title, message }: { title: string; message: string }) {
        PushNotification.localNotification({
            channelId: 'default-channel-id',
            title,
            message,
            smallIcon: 'ic_launcher',
            vibrate: true,
            vibration: 300,
            importance: 'high',
            priority: 'high',
            playSound: true,
            soundName: 'default',
        });
    }
}

export default NotificationHelper;
