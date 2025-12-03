import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

//  Ask for notification permissions
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    await getFCMToken();
  } else {
  }
}

//  Get FCM token
async function getFCMToken() {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
    } else {
    }
  } catch (e) {
  }
}

// Handle notification services
export function NotificationServices() {
  //  Create a local channel (Android only, must match with FCM channelId if you send custom)
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: 'default-channel',
        channelName: 'Default Channel',
        importance: 4, // High importance
        vibrate: true,
        playSound: true,
        soundName: 'notification_sound.mp3',
      },
      created => console.log(`📢 Notification channel created: '${created}'`)
    );
  }



  //  Foreground notifications
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    PushNotification.localNotification({
      channelId: 'default-channel',
      title: remoteMessage.notification?.title || 'New Message',
      message: remoteMessage.notification?.body || '',
      bigPictureUrl: remoteMessage.notification?.android?.imageUrl,
      smallIcon: 'ic_notification',
      playSound: true,
      soundName: 'default',
      priority: 'high',
    });
  });

  return unsubscribe;
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
});



