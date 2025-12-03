import React, { useEffect } from 'react'
import Navigation from './src/navigation'
import { AppContextProvider, useValues } from './src/utils/context'
import { Provider } from 'react-redux'
import store from './src/api/store'
import { MenuProvider } from 'react-native-popup-menu'
import { NotificationServices, requestUserPermission } from './src/utils/pushNotificationHandler'
import { LoadingProvider } from './src/utils/loadingContext'
import { NotifierRoot } from 'react-native-notifier'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Platform, StatusBar, Alert, AppState, Linking } from 'react-native'
import NotificationHelper from './src/commonComponents/helper/localNotificationhelper'
import appColors from './src/theme/appColors'
import { Verificationhelper } from './src/commonComponents/helper/verificationhelper'
import { PortalProvider } from '@gorhom/portal'
import { useBatteryLowLog } from './src/commonComponents'
import { TourGuideProvider } from 'rn-tourguide'
import messaging from '@react-native-firebase/messaging'
import { getValue, setValue } from './src/utils/localstorage'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { requestAllPermissionsOnFirstLaunch } from './src/utils/appPermissions'

type ChatHeadModule = {
  showChatHead: () => void
  hideChatHead: () => void
  checkOverlayPermission: () => Promise<boolean>
}

let showChatHead: (() => void) | undefined
let hideChatHead: (() => void) | undefined
let checkOverlayPermission: (() => Promise<boolean>) | undefined
const PERMISSION_EXPLANATION_SHOWN = 'PERMISSION_EXPLANATION_SHOWN'

if (Platform.OS === 'android') {
  const chatHead = require('react-native-chat-head') as ChatHeadModule
  showChatHead = chatHead.showChatHead
  hideChatHead = chatHead.hideChatHead
  checkOverlayPermission = chatHead.checkOverlayPermission
}

const AppGuards = () => {
  Verificationhelper()
  return null
}

const AppInner = () => {
  const { isDark } = useValues()
  const backgroundColor = isDark ? appColors.darkThemeSub : appColors.white
  const barStyle = isDark ? 'light-content' : 'dark-content'
  useBatteryLowLog()

  useEffect(() => {
    const initializePermissions = async () => {
      await requestAllPermissionsOnFirstLaunch()
      NotificationServices()
      requestUserPermission()
      NotificationHelper.configure()
    }
    initializePermissions()
  }, [])

  return (
    <>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={Platform.OS === 'android' ? backgroundColor : undefined}
      />
      <AppGuards />
      <Navigation />
    </>
  )
}

const AppContent = () => {
  const [granted, setGranted] = React.useState(false)
  const appState = React.useRef(AppState.currentState)
  const { isDark } = useValues()
  const backgroundColor = isDark ? appColors.darkThemeSub : appColors.white

  const openOverlayPermissionScreen = async () => {
    try {
      await Linking.openURL('android.settings.action.MANAGE_OVERLAY_PERMISSION')
    } catch (err) {
      await Linking.openSettings()
    }
  }

  const showPermissionExplanation = async () => {
    try {
      const alreadyShown = await getValue(PERMISSION_EXPLANATION_SHOWN)
      if (alreadyShown) return
      await setValue(PERMISSION_EXPLANATION_SHOWN, 'true')
      Alert.alert(
        'Permission Required',
        'To show the chat head bubble when the app is in the background, please grant the "Draw over other apps" permission in the next screen.',
        [
          { text: 'Go to Settings', onPress: openOverlayPermissionScreen },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: false },
      )
    } catch (err) {
    }
  }

  useEffect(() => {
    if (Platform.OS !== 'android') return
    const checkAndRequestPermission = async () => {
      try {
        const hasPermission = await checkOverlayPermission?.()
        if (hasPermission) {
          setGranted(true)
        } else {
          showPermissionExplanation()
        }
      } catch (err) {
      }
    }
    checkAndRequestPermission()
  }, [])

  useEffect(() => {
    if (Platform.OS !== 'android') return
    const handleAppStateChange = async (nextAppState: any) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const hasPermission = await checkOverlayPermission?.()
        setGranted(Boolean(hasPermission))
        hideChatHead?.()
      }

      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        if (granted) {
          showChatHead?.()
        }
      }

      appState.current = nextAppState
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => subscription.remove()
  }, [granted])

  useEffect(() => {
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
      }
    }
    requestPermission()
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor }} edges={['top', 'left', 'right']}>
            <Provider store={store}>
              <NotifierRoot />
              <TourGuideProvider borderRadius={16} backdropColor="rgba(0,0,0,0.4)" androidStatusBarVisible>
                <LoadingProvider>
                  <PortalProvider>
                    <AppInner />
                  </PortalProvider>
                </LoadingProvider>
              </TourGuideProvider>
            </Provider>
          </SafeAreaView>
        </SafeAreaProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  )
}

const App = () => {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  )
}

export default App











// // // // native ads demo
// import React, { useState, useEffect } from "react";
// import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";
// import {
//   NativeAd,
//   NativeAdView,
//   NativeAsset,
//   NativeMediaView,
//   NativeAssetType,
//   TestIds,
//   NativeAdEventType,
// } from "react-native-google-mobile-ads";

// const NativeAdComponent = () => {
//   const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);

//   useEffect(() => {
//     NativeAd.createForAdRequest(TestIds.NATIVE, {
//       // optional request options
//       // e.g. requestNonPersonalizedAdsOnly: true
//     })
//       .then(ad => {
//         setNativeAd(ad);

//         // Optionally listen to ad events
//         const listener = ad.addAdEventListener(
//           NativeAdEventType.LOADED,
//           () => {
//           }
//         );

//         return () => {
//           listener.remove();
//           ad.destroy();
//         };
//       })
//       .catch(error => {
//         console.error("Error loading native ad:", error);
//       });
//   }, []);

//   if (!nativeAd) {
//     // Ad not loaded yet
//     return (
//       <View style={styles.placeholder}>
//         <Text>Loading ad…</Text>
//       </View>
//     );
//   }

//   return (
//     <NativeAdView nativeAd={nativeAd} style={styles.adView}>
//       {/** Icon / App Logo */}
//       {nativeAd.icon && (
//         <NativeAsset assetType={NativeAssetType.ICON}>
//           <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
//         </NativeAsset>
//       )}

//       {/** Headline */}
//       <NativeAsset assetType={NativeAssetType.HEADLINE}>
//         <Text style={styles.headline}>{nativeAd.headline}</Text>
//       </NativeAsset>

//       {/** Media (image / video) */}
//       <NativeMediaView style={styles.media} />

//       {/** Tagline / body */}
//       <NativeAsset assetType={NativeAssetType.TAGLINE}>
//         <Text style={styles.tagline}>{nativeAd.tagline}</Text>
//       </NativeAsset>

//       {/** Advertiser name */}
//       <NativeAsset assetType={NativeAssetType.ADVERTISER}>
//         <Text style={styles.advertiser}>{nativeAd.advertiser}</Text>
//       </NativeAsset>

//       {/** Call to Action button */}
//       <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
//         <View style={styles.ctaButton}>
//           <Text style={styles.ctaText}>{nativeAd.callToAction}</Text>
//         </View>
//       </NativeAsset>
//     </NativeAdView>
//   );
// };

// export default function App() {
//   return (
//     <SafeAreaView style={{ flex: 1, padding: 16 }}>
//       <Text style={styles.title}>Native Ad (Invertase)</Text>
//       <NativeAdComponent />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   placeholder: {
//     height: 120,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#eee",
//     borderRadius: 8,
//   },
//   adView: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 12,
//     padding: 10,
//     overflow: "hidden",
//   },
//   icon: { width: 60, height: 60, borderRadius: 8, marginBottom: 8 },
//   headline: { fontSize: 18, fontWeight: "bold" },
//   media: { width: "100%", height: 180, marginVertical: 8 },
//   tagline: { fontSize: 14, color: "#555" },
//   advertiser: { fontSize: 12, color: "#777", marginTop: 4 },
//   ctaButton: {
//     marginTop: 10,
//     backgroundColor: "#007bff",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//   },
//   ctaText: { color: "#fff", fontSize: 14, fontWeight: "600" },
//   title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
// });
