import { View, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './styles'
import { General, RegistrationDetails, Profile, SettingHeader, AlertZone } from './component/'
import { useFocusEffect, useTheme } from '@react-navigation/native'
import DeviceInfo from 'react-native-device-info'
import { currentZone, deleteProfile, fleetVehicleList, fleetWalletData, incentivesValue, planDataGet, rentalVehicleData, serviceDataGet, settingDataGet, ticketDataGet, walletData } from '../../../api/store/action'
import { useDispatch, useSelector } from 'react-redux'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import appColors from '../../../theme/appColors'
import Images from '../../../utils/images/images'
import appFonts from '../../../theme/appFonts'
import { Button, notificationHelper } from '../../../commonComponents'
import { clearValue } from '../../../utils/localstorage'
import useSmartLocation from '../../../commonComponents/helper/locationHelper'
import FastImage from 'react-native-fast-image'
import { useValues } from '../../../utils/context'
import { windowHeight, fontSizes } from '../../../theme/appConstant'
import { resetState } from '../../../api/store/reducers'
import messaging from '@react-native-firebase/messaging'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, updateDoc } from 'firebase/firestore'
import { firebaseConfig } from '../../../../firebase'
import { AppDispatch } from '../../../api/store'
import { useAppNavigation } from '../../../utils/navigation'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export function Settings() {
  const dispatch = useDispatch<AppDispatch>()
  const { translateData } = useSelector((state: any) => state.setting)
  const { colors } = useTheme()
  const [versionCode, setVersionCode] = useState<string>('')
  const { viewRtlStyle } = useValues()
  const { isDark } = useValues()
  const { selfDriver } = useSelector((state: any) => state.account)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const fetchVersion = async () => {
      const version = await DeviceInfo.getVersion()
      setVersionCode(version)
    }
    dispatch(planDataGet())
    dispatch(ticketDataGet())
    dispatch(rentalVehicleData())
    dispatch(fleetVehicleList());

    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    dispatch(incentivesValue({ incentivedate: formattedToday }))
    dispatch(serviceDataGet());
    fetchVersion()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (selfDriver?.role == 'fleet_manager') {
        dispatch(fleetWalletData())
      } else {
        dispatch(walletData())
      } return () => { }
    }, [dispatch]),
  )

  const bottomSheetRef = useRef<any>(null)
  const snapPoints = useMemo(() => ['50%'], [])
  const openSheet = () => bottomSheetRef.current?.present()

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  )
  const navigation = useAppNavigation()
  const { currentLatitude, currentLongitude } = useSmartLocation()

  const deleteAccount = () => {
    messaging().unsubscribeFromTopic(`user_${selfDriver?.id}`)
    notificationHelper('', translateData?.sucessacount, 'error')
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
    dispatch(deleteProfile())
    dispatch(settingDataGet())
    dispatch(currentZone({ lat: currentLatitude, lng: currentLongitude }))
    clearValue()
  }

  const closeLogoutSheet = () => {
    logoutSheetRef.current?.close()
  }

  const renderLogoutBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  )

  const gotoLogout = async () => {
    setIsLoggingOut(true)
    try {
      messaging().unsubscribeFromTopic(`user_${selfDriver?.id}`)
      if (selfDriver?.id && selfDriver?.role == 'driver') {
        const driverRef = doc(db, 'driverTrack', selfDriver.id.toString())
        await updateDoc(driverRef, {
          is_online: '0',
        })
      }

      notificationHelper('', 'Logged Out Successfully', 'error')
      closeLogoutSheet()
      clearValue()
      dispatch(resetState())
      dispatch(settingDataGet())
      dispatch(currentZone({ lat: currentLatitude, lng: currentLongitude }))
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const logoutSheetRef = useRef<any>(null)
  const logoutSnapPoints = useMemo(() => ['43%'], [])

  const openLogoutSheet = () => {
    logoutSheetRef.current?.present()
  }

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1 }}>
        <ScrollView
          style={[styles.main, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
        >
          <SettingHeader />
          <View style={styles.container}>
            <Profile />
            <General />
            <RegistrationDetails />
            <AlertZone
              openSheet={openSheet}
              openLogoutSheet={openLogoutSheet}
            />
            <Text style={styles.version}>
              {translateData.settingTextVersion}: {versionCode}
            </Text>
          </View>
        </ScrollView>
      </View>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: '13%',
          }}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
        >
          <BottomSheetView style={{ alignItems: 'center' }}>
            <FastImage
              source={Images.delete}
              style={{ height: windowHeight(13), width: windowHeight(13) }}
              resizeMode="cover"
            />
            <Text
              style={{
                color: isDark ? appColors.white : appColors.black,
                fontFamily: appFonts.medium,
                fontSize: fontSizes.FONT4HALF,
                top: windowHeight(1),
              }}
            >
              {translateData?.whatyoudeleteaccount}
            </Text>
            <Text
              style={{
                color: appColors.darkBorderBlack,
                textAlign: 'center',
                fontFamily: appFonts.regular,
                fontSize: fontSizes.FONT3HALF,
                width: '92%',
                top: windowHeight(2),
              }}
            >
              {translateData?.deleteNotice}
            </Text>
            <View style={{ width: '96%', top: windowHeight(5) }}>
              <Button
                title={translateData?.proceed}
                backgroundColor={appColors.primary}
                color={appColors.white}
                onPress={deleteAccount}
              />
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={logoutSheetRef}
          index={1}
          snapPoints={logoutSnapPoints}
          backdropComponent={renderLogoutBackdrop}
          enablePanDownToClose={true}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: '13%',
          }}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
        >
          <BottomSheetView style={{ alignItems: 'center' }}>
            <FastImage
              source={Images.logoutImage}
              style={{
                height: windowHeight(9),
                width: windowHeight(8),
                top: windowHeight(2),
              }}
              resizeMode="cover"
            />
            <Text
              style={{
                color: isDark ? appColors.white : appColors.black,
                fontFamily: appFonts.medium,
                fontSize: fontSizes.FONT4HALF,
                top: windowHeight(5),
                width: '80%',
                textAlign: 'center',
              }}
            >
              {translateData.logoutConfirm}
            </Text>
            <View
              style={{
                flexDirection: viewRtlStyle,
                justifyContent: 'space-between',
                marginTop: windowHeight(8),
                gap: 15,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: isDark
                      ? appColors.darkText
                      : appColors.graybackground,
                    width: '43%',
                  },
                ]}
                onPress={closeLogoutSheet}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: isDark ? appColors.bgDark : appColors.iconColor,
                    textAlign: 'center',
                    fontFamily: appFonts.medium,
                    fontSize: fontSizes.FONT4,
                    paddingVertical: windowHeight(1.5),
                  }}
                >
                  {translateData?.cancel}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: appColors.red, width: '43%' },
                ]}
                onPress={gotoLogout}
                disabled={isLoggingOut}
                activeOpacity={0.7}
              >
                {isLoggingOut ? (
                  <ActivityIndicator color={appColors.white} style={{ paddingVertical: windowHeight(1.5) }} size={'small'} />
                ) : (
                  <Text
                    style={{
                      color: appColors.white,
                      textAlign: 'center',
                      fontFamily: appFonts.medium,
                      fontSize: fontSizes.FONT4,
                      paddingVertical: windowHeight(1.5),
                    }}
                  >
                    {translateData?.logout}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
