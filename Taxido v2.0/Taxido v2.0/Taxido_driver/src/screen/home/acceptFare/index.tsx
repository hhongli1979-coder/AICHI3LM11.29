import { View, Text, Image, TouchableOpacity, BackHandler, Platform } from 'react-native'
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useTheme, useRoute, useFocusEffect } from '@react-navigation/native'
import styles from './styles'
import { BackButton, notificationHelper } from '../../../commonComponents'
import { TotalFair } from './component'
import appColors from '../../../theme/appColors'
import { DriverProfile } from '../../../commonComponents'
import { Button } from '../../../commonComponents'
import { useDispatch, useSelector } from 'react-redux'
import { ArrivedMap } from '../../../commonComponents/maps/arrivedMap'
import { useAppNavigation } from '../../../utils/navigation'
import { cancelationDataGet, rideDataPut } from '../../../api/store/action'
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'
import appFonts from '../../../theme/appFonts'
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated'
import { useValues } from '../../../utils/context'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'
import { AppDispatch } from '../../../api/store'
import { firebaseConfig } from '../../../../firebase'
import { FAB } from 'react-native-paper'
import Icons from '../../../utils/icons/icons'
import ContentLoader, { Rect } from 'react-content-loader/native'
import NativeAdComponent from '../../../commonComponents/ads/google/NativeAdCard'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const CustomBackdrop = ({ animatedIndex, style }: BottomSheetBackdropProps) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 0.5],
      Extrapolate.CLAMP,
    ),
  }))

  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  )

  return <Animated.View style={containerStyle} pointerEvents="box-none" />
}

export function AcceptFare() {
  const navigation = useAppNavigation()
  const { colors } = useTheme()
  const route = useRoute()
  const { ride_Id }: any = route.params
  const { selfDriver } = useSelector((state: any) => state.account)
  const { canceldata } = useSelector((state: any) => state.cancelationReason)
  const [arrivedLoading, setArrivedLoading] = useState<boolean>(false)
  const [cancelLoading, setCancelloading] = useState<boolean>(false)
  const Driver_Id = selfDriver?.id
  const [rideData, setRideData] = useState<null | any>(null)
  const dispatch = useDispatch<AppDispatch>()
  const ambulanceRef = useRef<BottomSheetModal>(null)
  const cancelReasonRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [Platform.OS === 'ios' ? '43%' : '47.5%'], [])
  const snapCancelReason = useMemo(() => ['40%'], [])
  const { isDark } = useValues()
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting)
  const [cancelationreason, setCancelationReason] = useState<any>(null)
  const [selectedId, setSelectedId] = useState<null>(null)
  const [showActions, setShowActions] = useState<boolean>(false)


  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        navigation.navigate('Home')
        return true
      }
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      )
      return () => backHandler.remove()
    }, [navigation]),
  )

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => <CustomBackdrop {...props} />,
    [],
  )

  useEffect(() => {
    const ride_start = 'after'
    dispatch(cancelationDataGet({ ride_start }))
  }, [cancelReasonRef])

  useEffect(() => {
    if (!ride_Id) return

    const unsub = onSnapshot(
      doc(db, 'rides', ride_Id.toString()),
      docSnap => {
        if (docSnap.exists()) {
          const data: any = docSnap.data()

          setRideData(data)

          if (data?.ride_status?.slug === 'cancelled') {
            navigation.goBack()
          }
        } else {
          setRideData(null)
        }
      },
      error => {
      },
    )

    return () => unsub()
  }, [ride_Id])

  const gotoPickup = async () => {
    setArrivedLoading(true)
    dispatch(
      rideDataPut({
        data: { status: 'arrived' },
        ride_id: ride_Id,
      }),
    ).then(async (res: any) => {
      navigation.navigate('OtpRide', { rideData: rideData, ride_Id: ride_Id })
      setArrivedLoading(false)
    })
  }

  const cancelOpen = () => {
    ambulanceRef.current?.close()
    cancelReasonRef.current?.present()
  }

  const cancelRide = () => {
    setCancelloading(true)
    dispatch(
      rideDataPut({
        status: 'cancelled',
        cancellation_reason: cancelationreason,
        ride_id: ride_Id,
      }),
    )
      .then(async (res: any) => {
        setCancelloading(false)
        if (res?.payload?.ride_status?.slug == 'cancelled') {
          cancelReasonRef.current?.close()
          navigation.navigate('TabNav')
          notificationHelper('', translateData.rideCancelled, 'error')
        }
      })
      .catch((error: any) => {
        setCancelloading(true)
        notificationHelper('', error, 'error')
      })
  }

  useEffect(() => {
    ambulanceRef.current?.present()
  }, [])

  const handleSelect = (item: any) => {
    if (selectedId === item?.id) {
      setCancelationReason(item)
      setSelectedId(null)
    } else {
      setCancelationReason(item)
      setSelectedId(item?.id)
    }
  }

  const gotoOtherMap = (maptype: any) => {
    navigation.navigate('MapWebView', {
      lat: rideData?.location_coordinates?.[
        rideData?.location_coordinates?.length - 1
      ]?.lat,
      lng: rideData?.location_coordinates?.[
        rideData?.location_coordinates?.length - 1
      ]?.lng,
      type: maptype,
    })
  }

  // Shimmer effect component for loading state
  const ShimmerLoader = useMemo(() => (
    <ContentLoader
      speed={1.5}
      width={'100%'}
      height={windowHeight(40)}
      backgroundColor={isDark ? appColors.darkborder : appColors.border}
      foregroundColor={isDark ? appColors.bgDark : appColors.graybackground}
    >
      <Rect x="10" y="0" rx="4" ry="4" width="60" height="60" />
      <Rect x="90" y="0" rx="4" ry="4" width="190" height="20" />
      <Rect x="90" y="30" rx="4" ry="4" width="130" height="15" />
      <Rect x="10" y="70" rx="4" ry="4" width="332" height="15" />
      <Rect x="10" y="100" rx="4" ry="4" width="210" height="15" />
      <Rect x="10" y="140" rx="4" ry="4" width="332" height="40" />
      <Rect x="10" y="190" rx="4" ry="4" width="332" height="40" />
      <Rect x="10" y="255" rx="4" ry="4" width="332" height="50" />

    </ContentLoader>
  ), [isDark]);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <View style={styles.mapSection}>
          <ArrivedMap
            Pickuplocation={rideData?.location_coordinates[0]}
            driverId={Driver_Id}
          />
        </View>
        <View style={styles.backButton}>
          <BackButton />
        </View>
        <FAB
          icon={Icons.Map}
          style={[
            styles.fab,
            {
              backgroundColor: isDark
                ? appColors.darkThemeSub
                : appColors.white,
            },
          ]}
          onPress={() => setShowActions(!showActions)}
        />
        {showActions && (
          <>
            <FAB
              icon={Icons.GoogleMap}
              style={[
                styles.fabMini,
                {
                  backgroundColor: isDark
                    ? appColors.darkThemeSub
                    : appColors.white,
                },
                { bottom: '55.5%' },
              ]}
              onPress={() => gotoOtherMap('google')}
            />
            <FAB
              icon={Icons.Wazemap}
              style={[
                styles.fabMini,
                {
                  backgroundColor: isDark
                    ? appColors.darkThemeSub
                    : appColors.white,
                },
                { bottom: '47%' },
              ]}
              onPress={() => gotoOtherMap('waze')}
            />
            <FAB
              icon={Icons.BingMap}
              style={[
                styles.fabMini,
                {
                  backgroundColor: isDark
                    ? appColors.darkThemeSub
                    : appColors.white,
                },
                { bottom: '38.5%' },
              ]}
              onPress={() => gotoOtherMap('bing')}
            />
          </>
        )}

        <BottomSheetModal
          ref={ambulanceRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          handleIndicatorStyle={{
            width: '13%',
            backgroundColor: appColors.primary,
          }}
          backdropComponent={renderBackdrop}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
        >
          <BottomSheetView>
            {rideData ? (
              <>
                <View
                  style={[
                    styles.additionalSection,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <DriverProfile
                    iconColor={appColors.primary}
                    backgroundColor={appColors.graybackground}
                    borderRadius={windowHeight(25)}
                    showInfoIcon={true}
                    userDetails={rideData?.rider}
                    rideDetails={rideData}
                  />
                </View>
                <TotalFair
                  onPress={gotoPickup}
                  totalAmount={rideData?.total}
                  paymentMethod={rideData?.payment_method}
                />
                <View style={{ marginBottom: windowHeight(2) }}>
                  <Button
                    title={translateData.arrived}
                    backgroundColor={appColors.primary}
                    color={appColors.white}
                    onPress={gotoPickup}
                    loading={arrivedLoading}
                  />
                </View>
                {taxidoSettingData?.taxido_values?.ads?.native_enable == 1 && (
                  <NativeAdComponent adsHeight={windowHeight(20)} />
                )}
                <View style={{ marginBottom: windowHeight(2) }}>
                  <Button
                    title={translateData.cancelTextT}
                    backgroundColor={isDark ? appColors.darkThemeSub : appColors.lightGray}
                    color={isDark ? appColors.white : appColors.iconColor}
                    onPress={cancelOpen}
                  />
                </View>
              </>
            ) : (
              <View style={{ padding: windowWidth(4) }}>
                {ShimmerLoader}
              </View>
            )}
          </BottomSheetView>
        </BottomSheetModal>

        <BottomSheetModal
          ref={cancelReasonRef}
          index={1}
          snapPoints={snapCancelReason}
          enablePanDownToClose={true}
          onDismiss={() => {
            ambulanceRef.current?.present()
          }}
          handleIndicatorStyle={{
            width: '13%',
            backgroundColor: appColors.primary,
          }}
          backdropComponent={renderBackdrop}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
        >
          <BottomSheetView>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: appFonts.medium,
                fontSize: fontSizes.FONT4,
                marginVertical: windowHeight(2),
                color: isDark ? appColors.darkText : appColors.black,
              }}
            >
              {translateData.whyyouWanttoCancel}
            </Text>

            {canceldata?.data
              ?.filter((item: any) => item.status === 1)
              .map((item: any, index: number) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  key={index}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: windowHeight(1),
                      backgroundColor:
                        selectedId === item.id
                          ? appColors.primaryBg
                          : isDark
                            ? appColors.darkThemeSub
                            : appColors.graybackground,
                      marginHorizontal: windowWidth(3.5),
                      padding: windowHeight(1.5),
                      borderRadius: windowHeight(0.8),
                    },
                    selectedId === item.id && {
                      borderColor: appColors.primary,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: item?.icon_image_url }}
                    style={{
                      height: windowHeight(3.5),
                      width: windowHeight(3.5),
                    }}
                  />
                  <View
                    style={{
                      borderLeftWidth: 1,
                      borderLeftColor: appColors.border,
                      marginHorizontal: windowWidth(2),
                      height: '100%',
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: appFonts.regular,
                      color: isDark ? appColors.darkText : appColors.black,
                    }}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            <View style={{ marginTop: windowHeight(3) }}>
              <Button
                title={translateData.confirm}
                backgroundColor={appColors.primary}
                color={appColors.white}
                onPress={cancelRide}
                loading={cancelLoading}
              />
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}
