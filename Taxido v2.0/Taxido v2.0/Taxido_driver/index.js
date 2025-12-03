/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native'
import App from './App'
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { name as appName } from './app.json'

LogBox.ignoreAllLogs()
AppRegistry.registerComponent(appName, () => App)
