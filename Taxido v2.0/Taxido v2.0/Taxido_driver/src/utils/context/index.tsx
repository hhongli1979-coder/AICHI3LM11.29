import React, { useState, createContext, useContext, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { textRtlStyle, imageRtlStyle, viewRtlStyle, viewSelfRtlStyle } from '../../style/rtlStyles'
import { ContextType } from './types'
import { Platform } from 'react-native'

const initialContextVal = {
  isDark: false,
  setIsDark: () => { },
  rtl: false,
  setRtl: () => { },
  textRtlStyle: 'left',
  imageRtlStyle: [{ scaleX: -1 }],
  viewRtlStyle: 'row',
  viewSelfRtlStyle: 'flex-end',
  token: '',
  setToken: '',
  accountDetail: '',
  setAccountDetail: () => { },
  documentDetail: '',
  setDocumentDetail: () => { },
  vehicleDetail: '',
  setVehicleDetail: () => { },
  Google_Map_Key: '',
  notificationValue: '',
  setNotificationValues: () => { },
}

export const AppContext = createContext<ContextType>(initialContextVal)

export const AppContextProvider = (props: any) => {
  const [isDark, setIsDark] = useState(false)
  const [rtl, setRtl] = useState(false)
  const [token, setToken] = useState('')
  const [accountDetail, setAccountDetail] = useState('')
  const [documentDetail, setDocumentDetail] = useState('')
  const [vehicleDetail, setVehicleDetail] = useState('')
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [notificationValue, setNotificationValues] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState<number>(null)
  const Google_Map_Key = Platform.OS === 'android'
    ? 'google_maps_key_for_android'
    : 'google_maps_key_for_ios'

  useEffect(() => {
    const fetchFromStorage = async () => {
      try {
        const rtlValue = await AsyncStorage.getItem("rtl");
        if (rtlValue !== null) {
          setRtl(JSON.parse(rtlValue));
        }

        const tokenValue = await AsyncStorage.getItem("token");
        if (tokenValue !== null) {
          setToken(tokenValue);
        }
      } catch (error) {
      }
    }
    fetchFromStorage()
  }, [])

  useEffect(() => {
    const fetchDarkTheme = async () => {
      try {
        const darkThemeValue = await AsyncStorage.getItem('darkTheme')
        if (darkThemeValue !== null) {
          setIsDark(JSON.parse(darkThemeValue))
        }
      } catch (error) {
      }
    }
    fetchDarkTheme()
  }, [])

  useEffect(() => {
    const loadLanguageFromStorage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage')
        if (savedLanguage) {
        }
      } catch (error) {
      }
    }
    loadLanguageFromStorage()
  }, [])

  useEffect(() => {
    const notificationFromStorage = async () => {
      try {
        const notificationValue = await AsyncStorage.getItem('isNotificationOn')
        if (notificationValue) {
          setNotificationValues(notificationValue)
        }
      } catch (error) {
      }
    }
    notificationFromStorage()
  }, [])




  const contextValue = {
    isDark,
    setIsDark,
    rtl,
    setRtl,
    textRtlStyle: textRtlStyle(rtl),
    imageRtlStyle: imageRtlStyle(rtl),
    viewRtlStyle: viewRtlStyle(rtl),
    viewSelfRtlStyle: viewSelfRtlStyle(rtl),
    token,
    setToken,
    accountDetail,
    setAccountDetail,
    documentDetail,
    setDocumentDetail,
    vehicleDetail,
    setVehicleDetail,
    selectedItemIndex,
    setSelectedItemIndex,
    categoryIndex, setCategoryIndex,
    Google_Map_Key: Google_Map_Key,
    notificationValue,
    setNotificationValues,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  )
}

export const useValues = () => useContext(AppContext)
