import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";

const useStoredLocation = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const loadLocation = async () => {
    const lat = await AsyncStorage.getItem("user_latitude");
    const lng = await AsyncStorage.getItem("user_longitude");

    if (lat && lng) {
      setLatitude(parseFloat(lat));
      setLongitude(parseFloat(lng));
    }
  };

  useEffect(() => {
    loadLocation();

    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          loadLocation();
        }
      }
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  return { latitude, longitude };
};

export default useStoredLocation;
