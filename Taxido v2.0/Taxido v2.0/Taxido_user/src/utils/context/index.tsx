import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    imageRTLStyle,
    textRTLStyle,
    viewRTLStyle,
    viewSelfRTLStyle,
} from "@src/styles/rtlStyle";
import {
    bgFullStyle,
    iconColorStyle,
    linearColorStyle,
    linearColorStyleTwo,
    textColorStyle,
    bgFullLayout,
    bgContainer,
    ShadowContainer,
} from "@src/styles/darkStyle";
import { ThemeContextType } from "./types";

const defaultValues: ThemeContextType = {
    isRTL: false,
    setIsRTL: () => { },
    isDark: false,
    setIsDark: () => { },
    ShadowContainer: "",
    bgContainer: "",
    bgFullLayout: "",
    linearColorStyleTwo: "",
    linearColorStyle: "",
    textColorStyle: "",
    iconColorStyle: "",
    bgFullStyle: "",
    textRTLStyle: "",
    viewRTLStyle: "",
    imageRTLStyle: 0,
    viewSelfRTLStyle: "",
    token: "",
    setToken: () => { },
    notificationValue: "",
    setNotificationValues: () => { },
    Google_Map_Key: "",
    Google_Sign_Key: "",
    firebaseConfig: {},
};

export const CommonContext = createContext<ThemeContextType>(defaultValues);

export const useValues = () => useContext(CommonContext);

export const CommonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isRTL, setIsRTL] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [notificationValue, setNotificationValues] = useState<string>("");
    const [token, setToken] = useState("");

    const Google_Map_Key =
        Platform.OS === "android"
            ? "google Ads Key here"
            : "google Ads Key here";

    const Google_Sign_Key = "google sign in key here";

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const darkThemeValue = await AsyncStorage.getItem("darkTheme");
                if (darkThemeValue) setIsDark(JSON.parse(darkThemeValue));

                const rtlValue = await AsyncStorage.getItem("rtl");
                if (rtlValue) setIsRTL(JSON.parse(rtlValue));

                const tokenValue = await AsyncStorage.getItem("token");
                if (tokenValue) setToken(JSON.parse(tokenValue));

                const notifValue = await AsyncStorage.getItem("isNotificationOn");
                if (notifValue) setNotificationValues(notifValue);
            } catch (error) {
                console.error("Error loading settings:", error);
            }
        };
        loadSettings();
    }, []);

    const contextValues = {
        isRTL,
        setIsRTL,
        isDark,
        setIsDark,
        ShadowContainer: ShadowContainer(isDark),
        bgContainer: bgContainer(isDark),
        bgFullLayout: bgFullLayout(isDark),
        linearColorStyleTwo: linearColorStyleTwo(isDark),
        linearColorStyle: linearColorStyle(isDark),
        textColorStyle: textColorStyle(isDark),
        iconColorStyle: iconColorStyle(isDark),
        bgFullStyle: bgFullStyle(isDark),
        textRTLStyle: textRTLStyle(isRTL),
        viewRTLStyle: viewRTLStyle(isRTL),
        imageRTLStyle: imageRTLStyle(isRTL),
        viewSelfRTLStyle: viewSelfRTLStyle(isRTL),
        token,
        setToken,
        notificationValue,
        setNotificationValues,
        Google_Map_Key,
        Google_Sign_Key,
        firebaseConfig: {},

    };

    return (
        <CommonContext.Provider value={contextValues}>
            {children}
        </CommonContext.Provider>
    );
};
