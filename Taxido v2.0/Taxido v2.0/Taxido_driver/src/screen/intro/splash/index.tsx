import React, { useEffect, useState, useCallback } from "react";
import { Alert, Image, View, BackHandler, Linking } from "react-native";
import images from "../../../utils/images/images";
import styles from "./styles";
import { getValue, setValue, deleteValue } from "../../../utils/localstorage/index";
import { selfDriverData, settingDataGet, translateDataGet, taxidosettingDataGet } from "../../../api/store/action";
import { useDispatch, useSelector } from "react-redux";
import { useAppNavigation } from "../../../utils/navigation";
import DeviceInfo from "react-native-device-info";
import { AppDispatch } from "../../../api/store";
import { requestLocationPermission, requestNotificationPermission } from "../../../commonComponents/helper/permissionHelper";

export function Splash() {
  const { replace } = useAppNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { settingData, taxidoSettingData, translateData } = useSelector((state: any) => state.setting);
  const [splashImage, setSplashImage] = useState<string | null>(null);
  const [showNoInternet, setShowNoInternet] = useState(false);
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)


  useEffect(() => {
    const loadSplashImage = async () => {
      try {
        const cachedImage = await getValue('splashImage')
        if (cachedImage) {
          setSplashImage(cachedImage)
        }
      } catch (error) {
      }
    }
    loadSplashImage()
  }, [])

  useEffect(() => {
    // Ensure location permission prompt shows early, not blocked by settings loading
    (async () => {
      const granted = await requestLocationPermission();
      if (granted) {
        // Ask for notifications permisssion (non-blocking). User can allow/deny.
        try { await requestNotificationPermission(); } catch { }
        proceedToNextScreen();
        return;
      }
      Alert.alert(
        "Permission Required",
        "Location permission is needed to continue.",
        [
          { text: "Open Settings", onPress: () => Linking.openSettings() },
          { text: "Exit", style: "destructive", onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );
    })();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(taxidosettingDataGet())
      await dispatch(settingDataGet())
        .unwrap()
        .then((res) => {
          if (res._status === 500) {
            replace('NoInternalServer');
          } else {
          }
        })
        .catch((error) => {
        });
      await dispatch(translateDataGet())
      await dispatch(selfDriverData())
    }
    fetchData()
  }, [dispatch])




  useEffect(() => {
    const updateSplashImage = async () => {
      const serverImage = taxidoSettingData?.taxido_values?.setting?.driver_splash_screen_url
      try {
        if (serverImage && typeof serverImage === 'string') {
          await setValue('splashImage', serverImage)
        } else {
          await deleteValue('splashImage')
        }
      } catch (error) {
      }
    }
    if (taxidoSettingData) {
      updateSplashImage()
    }
  }, [taxidoSettingData])

  useEffect(() => {
    const activation = settingData?.values?.activation;
    const maintenance_mode = activation?.maintenance_mode;
    if (maintenance_mode === '1' || maintenance_mode === 1) {
      setShowNoInternet(true);
    }
  }, [settingData]);


  const proceedToNextScreen = useCallback(async () => {
    try {
      const token = await getValue("token");
      const versionCode = parseInt(await DeviceInfo.getBuildNumber(), 10);
      const requiredVersion = parseInt(taxidoSettingData?.taxido_values?.setting?.app_version, 10) || 0;
      const forceUpdate = taxidoSettingData?.taxido_values?.activation?.force_update === "1";

      if (forceUpdate && versionCode < requiredVersion) {
        Alert.alert(translateData.updateRequired, translateData.newVersions, [
          { text: "OK", },
        ]);
        return;
      }

      const waitForZone = async () => {
        if (token) {
          dispatch(selfDriverData())
          replace("TabNav");
        } else {
          replace("OnBoarding");
        }
      };

      await waitForZone();
    } catch (error) {
    }
  }, [dispatch, replace, taxidoSettingData, zoneValue]);

  if (showNoInternet) {
    return (
      <View></View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={splashImage ? { uri: splashImage } : images.splashDriver}
          style={styles.img}
          onError={() => {
            setSplashImage(null)
            deleteValue('splashImage')
          }}
        />
      </View>
    </View>
  )
}
