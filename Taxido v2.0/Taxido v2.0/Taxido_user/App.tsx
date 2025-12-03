import React from 'react';
import { StatusBar } from 'react-native';
import MyStack from './src/navigation';
import { Provider } from 'react-redux';
import store from './src/api/store';
import { LocationProvider } from './src/utils/locationContext';
import { MenuProvider } from 'react-native-popup-menu';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotifierRoot } from 'react-native-notifier';
import { enableScreens } from 'react-native-screens';
import NotificationHelper from '@src/components/helper/localNotificationHelper';
import { CommonProvider, useValues } from '@src/utils/context';
import { LoadingProvider } from '@src/utils/loadingContext';
import { appColors } from '@src/themes';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

enableScreens();

const AppContent = () => {
  const { isDark } = useValues();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor }} edges={['top', 'left', 'right']}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? appColors.darkHeader : appColors.whiteColor}
        />
        <MyStack />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

function App(): React.JSX.Element {
  React.useEffect(() => {
    NotificationHelper.configure();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotifierRoot />
      <MenuProvider>
        <Provider store={store}>
          <LoadingProvider>
            <CommonProvider>
              <LocationProvider>
                <AppContent />
              </LocationProvider>
            </CommonProvider>
          </LoadingProvider>
        </Provider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}

export default App;
