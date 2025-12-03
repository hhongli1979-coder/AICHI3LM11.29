/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {    
    // Not a Responsys Push, your app should handle this notification
});

LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);
