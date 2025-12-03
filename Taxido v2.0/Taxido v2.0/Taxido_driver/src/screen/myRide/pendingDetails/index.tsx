import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Header, Button, notificationHelper } from '../../../commonComponents'
import appColors from '../../../theme/appColors'
import { Details } from '../component'
import { Bill } from '../../home/endRide/component'
import { Payment } from '../../home/endRide/component'
import { useNavigation, useTheme, useRoute } from '@react-navigation/native'
import appFonts from '../../../theme/appFonts'
import Icons from '../../../utils/icons/icons'
import OTPTextView from 'react-native-otp-textinput'
import { useDispatch, useSelector } from 'react-redux'
import {
  allpayment,
  rideDataGets,
  rideDataPut,
  rideStartData,
  userReview,
} from '../../../api/store/action'
import { useValues } from '../../../utils/context'
import styles from './styles'
import { CommonModal } from '../../../commonComponents/commonModal'
import { windowHeight, windowWidth } from '../../../theme/appConstant'
import { getValue } from '../../../utils/localstorage'
import { URL } from '../../../api/config'
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'
import { firebaseConfig } from '../../../../firebase'
import { PaymentRideInterface } from '../../../api/interface/walletInterface'
import { AppDispatch } from '../../../api/store'
import Images from '../../../utils/images/images'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export function PendingDetails() {
  const route = useRoute<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const { item, vehicleDetail, status, rideStatus } = route.params
  const [otpModalVisible, setOtpModalVisible] = useState<boolean>(false)
  const [warning, setWarning] = useState<string>('')
  const [enteredOtp, setEnteredOtp] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const { viewRtlStyle, textRtlStyle, isDark } = useValues()
  const { colors } = useTheme()
  const { translateData } = useSelector((state: any) => state.setting)
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)
  const navigation = useNavigation<any>()
  const [paymentMethod, setPaymentMethod] = useState<any>(null)
  const [paymentStatus, setpaymentStatus] = useState<any>()
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [completeLoading, setCompleteLoading] = useState<boolean>(false)
  const [loaderInvoice, setLoaderInvoice] = useState<boolean>(false)
  const bottomSheetReviewRef = useRef<BottomSheetModal>(null)
  const [isBottomSheetReviewOpen, setIsBottomSheetReviewOpen] =
    useState<boolean>(false)
  const [rating, setRating] = useState<number>(0)
  const [reviewText, setReviewText] = useState<string>('')

  useEffect(() => {
    if (!item?.id) return

    const rideId = String(item.id)
    const rideRef = doc(db, 'rides', rideId)
    const unsubscribe = onSnapshot(rideRef, docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data()

        setPaymentMethod(data.payment_method)
        setpaymentStatus(data.payment_status)
      } else {
      }
    })

    return () => unsubscribe()
  }, [item?.id])
  const reviewSubmit = () => {
    let payload: any = {
      ride_id: item?.id,
      rating: rating,
      description: reviewText,
    }

    dispatch(userReview(payload))
      .unwrap()
      .then((res: any) => {
        if (res?.id) {
          gotoReview()
          notificationHelper('', translateData.reviewSuccess, 'success')
          dispatch(rideDataGets())
          navigation.goBack()
        }
        setOtpModalVisible(false)
      })
  }

  const gotoPickup = () => {
    navigation.navigate('RideComplete', { rideData: item })
  }

  const gotoReview = () => {
    if (isBottomSheetReviewOpen) {
      bottomSheetReviewRef.current?.close()
      setIsBottomSheetReviewOpen(false)
    } else {
      bottomSheetReviewRef.current?.present()
      setIsBottomSheetReviewOpen(true)
    }
  }

  const gotoInvoice = async (rideData: any) => {
    setLoaderInvoice(true)
    const token = await getValue('token')
    const response = await fetch(
      `${URL}/api/ride/driver-invoice/${rideData?.invoice_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (response.status == 200) {
      setLoaderInvoice(false)

      navigation.navigate('PdfViewer', {
        pdfUrl: response?.url,
        token: token,
        rideNumber: rideData?.invoice_id,
      })
    } else {
      setLoaderInvoice(true)
    }
  }

  const gotoCompleteRental = () => {
    setCompleteLoading(true)
    dispatch(
      rideDataPut({
        status: 'completed',
        ride_id: item?.id,
      }),
    ).then(async (res: any) => {
      if (res?.payload?.ride_status?.slug == 'completed') {
        navigation.navigate('TabNav')
        dispatch(rideDataGets())
        notificationHelper('', translateData.rideComplete, 'success')
        setCompleteLoading(false)
      }
    })
  }

  const gotoStart = () => {
    navigation.navigate('AcceptFare', { ride_Id: item?.id, ride_Details: item })
  }

  const gotoVerify = () => {
    navigation.navigate('OtpRide', { rideData: item, ride_Id: item?.id })
  }

  const handleCashReceived = () => {
    let payload: PaymentRideInterface = {
      ride_id: item?.id,
      payment_method: 'cash',
    }

    dispatch(allpayment(payload))
      .unwrap()
      .then(async (res: any) => {})
    setIsConfirming(true)
  }

  const handleConfirm = () => {
    notificationHelper('', translateData.cashCustomer, 'success')
    navigation.goBack()
    dispatch(rideDataGets())
  }

  const handleChange = (otp: string) => {
    setEnteredOtp(otp)
    if (otp.length == 5) {
      setWarning('')
    }
  }
  const closeModal = () => {
    setOtpModalVisible(false)
    setLoading(true)
    let payload: any = {
      ride_id: item?.id,
      otp: enteredOtp,
    }

    dispatch(rideStartData(payload))
      .unwrap()
      .then((res: any) => {
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const handleSheetChanges = useCallback((index: number) => {}, [])

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating)
  }

  const totalExtraAmount = item?.extra_charges?.reduce(
    (sum, cur) => sum + Number(cur?.amount || 0),
    0,
  )
  return (
    <View style={styles.main}>
      <Header title={`${rideStatus} Ride`} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <>
          <Details rideDetails={item} vehicleDetail={vehicleDetail} />
          <View style={styles.completedMainView}>
            {status === 'completed' ? (
              <>
                <Bill rideDetails={item} />
                <Payment rideDetails={item} />
              </>
            ) : null}
          </View>
          <View style={styles.billMainView}>
            <View
              style={[
                styles.viewBill,
                {
                  backgroundColor: isDark ? colors.card : appColors.white,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={{
                  paddingHorizontal: windowWidth(3),
                }}
              >
                <Text
                  style={[
                    styles.rideText,
                    {
                      color: isDark ? appColors.white : appColors.primaryFont,
                      textAlign: textRtlStyle,
                    },
                  ]}
                >
                  {translateData.billSummary}
                </Text>
                <View
                  style={[
                    styles.billBorder,
                    { borderBottomColor: colors.border },
                  ]}
                />
                {item?.ride_fare > 0 && (
                  <View
                    style={[
                      styles.platformContainer,
                      { flexDirection: viewRtlStyle },
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {translateData.baseDistanceFare}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {Number(item?.ride_fare).toFixed(2)}
                    </Text>
                  </View>
                )}
                {item?.additional_distance_charge > 0 && (
                  <View
                    style={[
                      styles.platformContainer,
                      { flexDirection: viewRtlStyle },
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {translateData.additionalFare}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {Number(item?.additional_distance_charge).toFixed(2)}
                    </Text>
                  </View>
                )}
                {item?.extra_charges?.length !== 0 && (
                  <>
                    {item?.extra_charges?.map((ex, index) => (
                      <View
                        key={index}
                        style={[
                          styles.platformContainer,
                          { flexDirection: viewRtlStyle },
                        ]}
                      >
                        <Text
                          style={[
                            styles.text,
                            {
                              color: isDark
                                ? appColors.white
                                : appColors.primaryFont,
                            },
                          ]}
                        >
                          {ex?.title}
                        </Text>

                        <Text
                          style={[
                            styles.text,
                            {
                              color: isDark
                                ? appColors.white
                                : appColors.primaryFont,
                            },
                          ]}
                        >
                          {zoneValue?.currency_symbol}
                          {Number(ex?.amount).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </>
                )}

                {item?.vehicle_rent > 0 && (
                  <View
                    style={[
                      styles.platformContainer,
                      { flexDirection: viewRtlStyle },
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {translateData.vehicleFare}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {Number(item?.vehicle_rent).toFixed(2)}
                    </Text>
                  </View>
                )}
                {item?.driver_rent > 0 && (
                  <View
                    style={[
                      styles.platformContainer,
                      { flexDirection: viewRtlStyle },
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {translateData.driverFare}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {Number(item?.driver_rent).toFixed(2)}
                    </Text>
                  </View>
                )}
                {item?.additional_minute_charge > 0 && (
                  <View
                    style={[
                      styles.platformContainer,
                      { flexDirection: viewRtlStyle },
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {translateData.timeFare}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {Number(item?.additional_minute_charge).toFixed(2)}
                    </Text>
                  </View>
                )}
                {item?.platform_fees > 0 && (
                  <View
                    style={[
                      styles.platformContainer,
                      { flexDirection: viewRtlStyle },
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {translateData.platformFees}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {Number(item?.platform_fees).toFixed(2)}
                    </Text>
                  </View>
                )}
                {item?.tax > 0 && (
                  <View
                    style={[
                      styles.platformContainer,
                      { flexDirection: viewRtlStyle },
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {translateData.tax}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {Number(item?.tax).toFixed(2)}
                    </Text>
                  </View>
                )}
                {item?.commission > 0 && (
                  <View
                    style={[styles.billView, { flexDirection: viewRtlStyle }]}
                  >
                    <Text
                      style={{
                        fontFamily: appFonts.regular,
                        color: isDark ? appColors.white : appColors.primaryFont,
                      }}
                    >
                      {translateData.commision}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {Number(item?.commission).toFixed(2)}
                    </Text>
                  </View>
                )}
                {item?.additional_weight_charge > 0 && (
                  <View
                    style={[styles.billView, { flexDirection: viewRtlStyle }]}
                  >
                    <Text
                      style={{
                        fontFamily: appFonts.regular,
                        color: isDark ? appColors.white : appColors.primaryFont,
                      }}
                    >
                      {translateData.additionalWeightCharge}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {Number(item?.additional_weight_charge).toFixed(2)}
                    </Text>
                  </View>
                )}
                {item?.bid_extra_amount > 0 && (
                  <View
                    style={[styles.billView, { flexDirection: viewRtlStyle }]}
                  >
                    <Text
                      style={{
                        fontFamily: appFonts.regular,
                        color: isDark ? appColors.white : appColors.primaryFont,
                      }}
                    >
                      {translateData.bidExtra}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isDark
                            ? appColors.white
                            : appColors.primaryFont,
                        },
                      ]}
                    >
                      {zoneValue?.currency_symbol}
                      {Number(item?.bid_extra_amount).toFixed(2)}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.billBorder,
                    { borderBottomColor: colors.border },
                  ]}
                />
                <View
                  style={[styles.billView, { flexDirection: viewRtlStyle }]}
                >
                  <Text
                    style={{
                      fontFamily: appFonts.regular,
                      color: isDark ? appColors.white : appColors.primaryFont,
                    }}
                  >
                    {translateData.total}
                  </Text>
                  <Text
                    style={{
                      fontFamily: appFonts.regular,
                      color: appColors.price,
                    }}
                  >
                    {zoneValue?.currency_symbol}
                    {Number(item?.total).toFixed(2)}
                  </Text>
                </View>
              </View>
              <Image
                source={Images.subtract}
                style={{
                  width: '100%',
                  resizeMode: 'stretch',
                  tintColor: isDark
                    ? appColors.primaryFont
                    : appColors.lightGray,
                  marginBottom: windowHeight(-0.1),
                }}
              />
            </View>
          </View>

          <View style={styles.pendingView}>
            {item?.payment_status == 'PENDING' ? (
              <View style={{ marginBottom: windowHeight(3) }}></View>
            ) : (
              <View style={styles.paymentView}>
                <Payment rideDetails={item} />
              </View>
            )}
          </View>
          {item?.ride_status?.slug == 'completed' &&
            item?.payment_status == 'COMPLETED' && (
              <View style={{ marginTop: windowHeight(3) }}>
                {item?.driverReview == null && (
                  <Button
                    backgroundColor={appColors.primary}
                    color={appColors.white}
                    title={translateData.reviewCustomer}
                    onPress={gotoReview}
                  />
                )}
                <View style={{ marginTop: windowHeight(3) }}>
                  <Button
                    backgroundColor={appColors.primary}
                    color={appColors.white}
                    title={translateData?.Invoice}
                    onPress={() => gotoInvoice(item)}
                    loading={loaderInvoice}
                  />
                </View>
              </View>
            )}
          <View style={styles.bottomView} />
        </>
      </ScrollView>
      <View style={styles.buttonView}>
        {item?.ride_status?.slug == 'accepted' && (
          <View
            style={{
              position: 'absolute',
              bottom: windowHeight(0),
              left: windowHeight(0),
              right: windowHeight(0),
              paddingVertical: windowHeight(3),
            }}
          >
            <Button
              backgroundColor={appColors.primary}
              color={appColors.white}
              title={translateData.pickupCustomer}
              onPress={gotoStart}
            />
          </View>
        )}
        {item?.ride_status?.slug == 'arrived' && (
          <View
            style={{
              position: 'absolute',
              bottom: windowHeight(0),
              left: windowHeight(0),
              right: windowHeight(0),
              paddingVertical: windowHeight(3),
            }}
          >
            <Button
              backgroundColor={appColors.primary}
              color={appColors.white}
              title={translateData.otpVerification}
              onPress={gotoVerify}
            />
          </View>
        )}
        {item?.ride_status?.slug == 'started' &&
          item?.service_category?.service_category_type != 'rental' && (
            <Button
              backgroundColor={appColors.primary}
              color={appColors.white}
              title={translateData.trackRide}
              onPress={gotoPickup}
            />
          )}

        {item?.ride_status?.slug == 'started' &&
          item?.service_category?.service_category_type == 'rental' && (
            <Button
              backgroundColor={appColors.primary}
              color={appColors.white}
              title={translateData?.complete}
              onPress={gotoCompleteRental}
              loading={completeLoading}
            />
          )}
        {/* {item?.ride_status?.slug == 'completed' &&
          item?.payment_status == 'PENDING' && (
            <>
              {paymentMethod === 'cash' ? (

                isConfirming ? (
                  <Button
                    backgroundColor={appColors.primary} // green or confirm color
                    color={appColors.white}
                    title={"Confirm"}
                    onPress={handleConfirm}
                  />
                ) : (
                  <Button
                    backgroundColor={appColors.primary}
                    color={appColors.white}
                    title={"Received Cash"}
                    onPress={handleCashReceived}
                  />
                )
              ) : (
                {paymentStatus === 'COMPLETED'?(
                <View style={{ marginHorizontal: windowWidth(4) }}>
                  <View style={{ flexDirection: 'row', width: '100%', backgroundColor: appColors.primary, borderRadius: windowWidth(1.5), alignItems: 'center', justifyContent: 'center', height: windowWidth(13.5) }}>
                    <TouchableOpacity >
                      <Text style={{ color: appColors.white, fontFamily: appFonts.medium, marginHorizontal: windowWidth(2) }}>Waiting For Payment</Text>
                    </TouchableOpacity>
                    <ActivityIndicator
                      size="large"
                      color={appColors.white}
                    />
                  </View>
                </View>
                ):(
                <Button
                  backgroundColor={appColors.primary}
                  color={appColors.white}
                  title={'Paymet Recived'}
                  onPress={handleConfirm}
                )}
              )}
            </>
          )} */}
        {item?.ride_status?.slug === 'completed' &&
          item?.payment_status === 'PENDING' && (
            <>
              {paymentMethod === 'cash' ? (
                isConfirming ? (
                  <Button
                    backgroundColor={appColors.primary}
                    color={appColors.white}
                    title={translateData?.Confirm}
                    onPress={handleConfirm}
                  />
                ) : (
                  <Button
                    backgroundColor={appColors.primary}
                    color={appColors.white}
                    title={translateData?.Recivedcash}
                    onPress={handleCashReceived}
                  />
                )
              ) : paymentStatus === 'COMPLETED' ? (
                <Button
                  backgroundColor={appColors.primary}
                  color={appColors.white}
                  title={translateData?.paymentreceived}
                  onPress={handleConfirm}
                />
              ) : (
                <View style={{ marginHorizontal: windowWidth(4) }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      backgroundColor: appColors.primary,
                      borderRadius: windowWidth(1.5),
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: windowWidth(13.5),
                    }}
                  >
                    <Text
                      style={{
                        color: appColors.white,
                        fontFamily: appFonts.medium,
                        marginHorizontal: windowWidth(2),
                      }}
                    >
                      {translateData?.waitPayemt}
                    </Text>
                    <ActivityIndicator size="large" color={appColors.white} />
                  </View>
                </View>
              )}
            </>
          )}
      </View>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetReviewRef}
          index={1}
          snapPoints={['42%']}
          onChange={handleSheetChanges}
          onDismiss={() => setIsBottomSheetReviewOpen(false)}
          style={{ zIndex: 2 }}
          handleIndicatorStyle={{
            backgroundColor: appColors.primary,
            width: '13%',
          }}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View>
              <Text
                style={[
                  styles.title,
                  { color: isDark ? appColors.white : appColors.primaryFont },
                ]}
              >
                {translateData.rateaCustomer}
              </Text>
              <View
                style={[
                  styles.container,
                  { flexDirection: viewRtlStyle, borderColor: colors.border },
                ]}
              >
                {[1, 2, 3, 4, 5].map(index => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleStarPress(index)}
                    style={styles.starIcon}
                  >
                    {index <= rating ? (
                      <Icons.StarFill />
                    ) : (
                      <Icons.StarEmpty
                        fill={
                          isDark ? appColors.darkThemeSub : appColors.border
                        }
                      />
                    )}
                  </TouchableOpacity>
                ))}

                <View
                  style={[styles.ratingView, { flexDirection: viewRtlStyle }]}
                >
                  <View
                    style={[
                      styles.borderVertical,
                      { borderColor: colors.border },
                    ]}
                  />
                  <Text
                    style={[
                      styles.rating,
                      {
                        color: isDark ? appColors.white : appColors.primaryFont,
                      },
                    ]}
                  >
                    {rating}/5
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.message,
                  { color: colors.text, textAlign: textRtlStyle },
                ]}
              >
                {translateData.customMessage}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: isDark ? appColors.white : appColors.primaryFont,
                    textAlign: textRtlStyle,
                  },
                ]}
                placeholder={translateData.writeHere}
                placeholderTextColor={appColors.secondaryFont}
                multiline
                numberOfLines={2}
                value={reviewText}
                onChangeText={setReviewText}
              />
              <View style={{ width: '110%', alignSelf: 'center' }}>
                <Button
                  title={translateData.submit}
                  color={appColors.white}
                  backgroundColor={appColors.primary}
                  onPress={reviewSubmit}
                />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>

      <CommonModal
        isVisible={otpModalVisible}
        closeModal={closeModal}
        onPress={closeModal}
        value={
          <View>
            <TouchableOpacity
              style={[styles.closeBtn, { flexDirection: viewRtlStyle }]}
              onPress={closeModal}
              activeOpacity={0.7}
            >
              <Icons.Close />
            </TouchableOpacity>
            <Text
              style={[
                styles.modalText,
                { color: isDark ? colors.text : appColors.primaryFont },
              ]}
            >
              {translateData.otpConfirm}
            </Text>
            <Text
              style={[
                styles.otpTitle,
                { textAlign: textRtlStyle },
                { color: isDark ? colors.text : appColors.primaryFont },
              ]}
            >
              {translateData.enterOTP}
            </Text>
            <OTPTextView
              containerStyle={[
                styles.otpContainer,
                { flexDirection: viewRtlStyle },
              ]}
              textInputStyle={[
                styles.otpInput,
                {
                  backgroundColor: isDark
                    ? colors.background
                    : appColors.graybackground,
                },
                { color: colors.text },
              ]}
              handleTextChange={handleChange}
              inputCount={4}
              keyboardType="numeric"
              tintColor="transparent"
              offTintColor="transparent"
            />
            <TouchableOpacity
              onPress={closeModal}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Button
                title={translateData.verify}
                color={appColors.white}
                onPress={closeModal}
                backgroundColor={appColors.primary}
                margin="0"
              />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  )
}
