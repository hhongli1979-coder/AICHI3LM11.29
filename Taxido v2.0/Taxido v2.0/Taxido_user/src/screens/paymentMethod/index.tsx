import { View, Text, Image, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Header, Button, RadioButton, notificationHelper } from '@src/commonComponent';
import { useValues } from "@src/utils/context/index";
import styles from './styles';
import { appColors, appFonts, windowHeight, windowWidth } from '@src/themes';
import { paymentsData } from '../../api/store/actions/paymentAction';
import { useDispatch, useSelector } from 'react-redux';
import PaymentDetails from './component';
import { allpayment, allRides, couponVerifyData, walletData } from '@src/api/store/actions';
import { CustomBackHandler } from '@src/components';
import { useAppNavigation, useAppRoute } from '@src/utils/navigation';
import { external } from '@src/styles/externalStyle';
import { clearValue } from '@src/utils/localstorage';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { CustomRadioButton } from '@src/commonComponent/radioButton/customRadioButton';
import { CloseIcon, OnlinePayment, Wallet } from '@src/utils/icons';
import NotificationHelper from '@src/components/helper/localNotificationHelper';
import { AppDispatch } from '@src/api/store';
import { BackHandler } from 'react-native';

export function PaymentMethod() {
  const { navigate } = useAppNavigation();
  const route = useAppRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { rideData } = route?.params || {};
  const { zoneValue } = useSelector((state: any) => state.zone);
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);
  const { linearColorStyle, bgContainer, textColorStyle, textRTLStyle, viewRTLStyle, isDark } = useValues();
  const tipValues = [5, 10, 15, 'Custom'];
  const [selectedValue, setSelectedValue] = useState<number | "Custom" | null>(null);
  const [customTipInput, setCustomTipInput] = useState("");
  const [appliedCustomTip, setAppliedCustomTip] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const navigation = useNavigation();
  const [rideDetails, setRideDetails] = useState<any>();
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'online' | 'wallet' | null>('cash');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [coupon, setCoupon] = useState<null | any>(null);
  const [inputValue, setInputValue] = useState('');

  const getRideData = async (rideId: string) => {
    try {
      const doc = await firestore().collection('rides').doc(rideId.toString()).get();

      if (doc.exists) {
        const data = doc.data();
        setRideDetails(data);
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching ride data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchRide = async () => {
      const data = await getRideData(rideData?.id);
      if (data) {

      }
    };

    fetchRide();
  }, []);

  useEffect(() => {
    setInputValue(coupon?.code || '');
  }, [coupon]);

  useEffect(() => {
    dispatch(paymentsData())
      .unwrap()
      .then((res: any) => {

        if (res?.status == 403) {
          notificationHelper(
            '',
            translateData.loginAgain,
            'error',
          );
          clearValue('token').then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          });
        }
      })
      .catch((error: any) => {
        console.error('Error in paymentsData:', error);
      });
  }, []);

  // Add back handler to navigate to home screen
  useEffect(() => {
    const backAction = () => {
      navigate('MyTabs' as any);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigate]);

  const handlePressTips = (value: any) => {
    setSelectedValue(prev => (prev === value ? null : value));
    if (value !== "Custom") {
      setCustomTipInput("");
      setAppliedCustomTip(0);
    }
  };

  const paymentData = async (index: number, name: any) => {
    setSelectedItem(index === selectedItem ? null : index);
    setSelectedPaymentMethod(index === selectedItem ? null : name);

    try {
      const rideDocRef = firestore().collection('rides').doc(rideData?.id.toString());
      await rideDocRef.update({ payment_method: name });
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  const calculateTipAmount = () => {
    if (selectedValue === "Custom") {
      return appliedCustomTip;
    }
    return selectedValue ? Number(selectedValue) : 0;
  };


  const calculateCouponDiscount = totalBill => {
    if (!coupon || !coupon.type) return 0;
    if (coupon.type === 'fixed') {
      return parseFloat(coupon.amount);
    }
    if (coupon.type === 'percentage') {
      return (totalBill * parseFloat(coupon.amount)) / 100;
    }
    return 0;
  };


  const addTip = () => {
    if (customTipInput && !isNaN(Number(customTipInput))) {
      setSelectedValue("Custom");
      setAppliedCustomTip(Number(customTipInput));
    }
  };

  const [couponError, setCouponError] = useState<string>('')

  const handlePress = () => {
    const payload = {
      coupon: inputValue,
      service_id: rideData?.service_id,
      vehicle_type_id: rideData?.vehicle_type_id,
      locations: rideData?.location_coordinates,
      hourly_package_id: rideData?.hourly_package_id,
      service_category_id: rideData?.service_category_id,
      weight: rideData?.weight
    };


    dispatch(couponVerifyData(payload)).then((res: any) => {
      if (res?.payload?.success) {
        setSuccessMessage(translateData.couponsApply);
        setCouponDiscount(res?.payload?.total_coupon_discount)
        setCouponError('')
      } else {
        setCouponDiscount(0)
        setCouponError(res?.payload?.message)
        setSuccessMessage('');
      }
    })
  };

  const gotoCoupon = () => {
    setCouponError('')
    navigate('PromoCodeScreen', { from: 'payment', getCoupon });
  };

  const getCoupon = val => {
    setCoupon(val);
  };

  const gotoPay = async () => {
    setPaymentLoading(true)
    const formattedCoupon = inputValue.replace('#', '');

    const tipamount = selectedValue || '0';

    let payload: PaymentInterface = {
      ride_id: rideData?.id,
      driver_tip: tipamount,
      coupon: formattedCoupon,
      payment_method: selectedPaymentMethod,
    };
    dispatch(allpayment(payload))
      .unwrap()
      .then(async (res: any) => {
        setPaymentLoading(false)
        if (res?.is_redirect && res?.url) {
          navigate('PaymentWebView', {
            url: res?.url,
            selectedPaymentMethod: selectedPaymentMethod,
            dataValue: res
          });
        } else if (res?.payment_status == 'COMPLETED') {
          dispatch(allRides())
          navigate('MyTabs')
          dispatch(walletData());
          notificationHelper('', `${translateData.paymentComplete}`, 'success');
          try {
            const rideDocRef = firestore().collection('rides').doc(rideData?.id.toString());
            const docSnapshot = await rideDocRef.get();
            if (docSnapshot.exists) {
              await rideDocRef.update({ payment_status: 'COMPLETED' });
              navigation.navigate('MyTabs');
              dispatch(walletData());
              NotificationHelper.showNotification({
                title: translateData.paymentComplete,
                message: translateData.paymentDescription,
              })
            } else {
            }
          } catch (error) {
          }

        } else {
          notificationHelper(
            "",
            res?.message,
            'error',
          );
        }
      });
  };

  const renderItem = ({ item, index, length }) => (
    <TouchableOpacity
      onPress={() => paymentData(index, item?.slug)}
      activeOpacity={0.7}>
      <View
        style={[
          styles.modalPaymentView,
          { backgroundColor: bgContainer, flexDirection: viewRTLStyle },
        ]}>
        <CustomBackHandler />
        <View style={[external.main, { flexDirection: viewRTLStyle }]}>
          <View style={styles.imageBg}>
            <Image source={{ uri: item.image }} style={styles.paymentImage} />
          </View>
          <View style={styles.mailInfo}>
            <Text
              style={[
                styles.mail,
                { color: textColorStyle, textAlign: textRTLStyle },
              ]}>
              {item.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.payBtn} activeOpacity={0.7}>
          <RadioButton
            checked={index === selectedItem}
            color={appColors.primary}
          />
        </TouchableOpacity>
      </View>
      {index !== length - 1 && <View style={[styles.borderPayment, { borderColor: isDark ? appColors.darkBorder : appColors.primaryGray }]} />}
    </TouchableOpacity>
  );


  const cashSelect = async () => {
    try {
      setSelectedPaymentMethod('cash');
      setSelectedMethod('cash');

      const rideId = rideData?.id;
      const rideDocRef = firestore().collection('rides').doc(rideId.toString());
      const docSnapshot = await rideDocRef.get();

      if (docSnapshot.exists) {
        const currentPaymentMethod = docSnapshot.data()?.payment_method;

        if (currentPaymentMethod !== 'cash') {
          await rideDocRef.update({ payment_method: 'cash' });
        } else {
        }
      } else {
        console.warn('Ride document does not exist');
      }
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  }

  const walletSelect = () => {
    setSelectedPaymentMethod('wallet');
    setSelectedMethod('wallet')
  }

  const onlineSelect = () => {
    setSelectedMethod('online')
  }
  const removeTip = () => {
    setAppliedCustomTip(0);
    setCustomTipInput("");
    setSelectedValue(null);
  };

  return (
    <View style={[external.main, { backgroundColor: linearColorStyle }]}>
      <View style={styles.headerView}>
        <Header value={translateData.payment} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent} >

        <View style={styles.sideSpace}>
          {taxidoSettingData?.taxido_values?.activation?.driver_tips == 1 ? (
            <View>
              <Text
                style={[
                  styles.tips,
                  { color: textColorStyle, textAlign: textRTLStyle },
                ]}>
                {translateData.tip}
              </Text>
              <View style={[styles.buttonContainer, { flexDirection: viewRTLStyle }]}>
                {tipValues.map((value, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      {
                        borderColor:
                          selectedValue === value
                            ? appColors.primary
                            : isDark
                              ? appColors.darkBorder
                              : appColors.border,
                        backgroundColor: bgContainer,
                      },
                    ]}
                    onPress={() => handlePressTips(value)}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          color:
                            selectedValue === value
                              ? appColors.primary
                              : "#797D83",
                        },
                      ]}
                    >
                      {value === "Custom"
                        ? translateData.custom
                        : `${zoneValue?.currency_symbol}${value}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={external.mb_10} />
          )}


          {selectedValue === 'Custom' ? (
            <View
              style={[
                styles.containerCoupon,
                { flexDirection: viewRTLStyle },
                {
                  backgroundColor: bgContainer,
                  borderColor: isDark ? appColors.darkBorder : appColors.border,
                },
              ]}>
              <TextInput
                style={[styles.input, { color: textColorStyle }]}
                placeholder={translateData.tipAmount}
                placeholderTextColor={appColors.regularText}
                keyboardType="number-pad"
                value={customTipInput}
                onChangeText={setCustomTipInput}
              />
              {appliedCustomTip > 0 ? (
                <TouchableOpacity style={[styles.closeIconView, { backgroundColor: isDark ? appColors.darkHeader : appColors.lightGray }]} onPress={removeTip}>
                  <CloseIcon fill={appColors.primary} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.buttonAdd} onPress={addTip}>
                  <Text style={styles.buttonAddText}>{translateData.add}</Text>
                </TouchableOpacity>
              )}

            </View>
          ) : null}


          {taxidoSettingData?.taxido_values?.activation?.coupon_enable == 1 && (
            <>
              <View
                style={[
                  styles.containerCoupon,
                  { flexDirection: viewRTLStyle },
                  {
                    backgroundColor: bgContainer,
                    borderColor: isDark ? appColors.darkBorder : appColors.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: textColorStyle }]}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder={translateData.applyPromoCode}
                  placeholderTextColor={appColors.regularText}
                />

                {coupon && successMessage ? (
                  <TouchableOpacity
                    style={[styles.closeIconView, { backgroundColor: isDark ? appColors.darkHeader : appColors.lightGray }]}
                    onPress={() => {
                      setCoupon(null);
                      setInputValue('');
                      setCouponDiscount(0);
                      setSuccessMessage('');
                    }}
                  >
                    <CloseIcon fill={appColors.primary} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.buttonAdd}
                    onPress={handlePress}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.buttonAddText}>{translateData.apply}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View>
                {successMessage && (
                  <Text style={[styles.successMessage, { color: isDark ? appColors.primary : appColors.greenColor }]}>{successMessage}</Text>
                )}
                {
                  couponError && (
                    <Text style={[styles.successMessage, { color: appColors.alertRed }, {
                      marginHorizontal: windowWidth(5),
                      width: windowWidth(290)
                    }]}>{couponError}</Text>
                  )
                }
                <TouchableOpacity onPress={gotoCoupon} activeOpacity={0.7}>
                  <Text style={styles.viewCoupon}>{translateData.allCoupon}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <Text
            style={[
              styles.bill,
              { color: textColorStyle },
              { marginTop: couponError ? windowHeight(40) : null }
            ]}
          >
            {translateData.billSummary}
          </Text>
          <View
            style={[
              styles.billContainer,
              {
                backgroundColor: bgContainer,
                borderColor: isDark ? appColors.darkBorder : appColors.border,
              },
            ]}>
            {rideData?.ride_fare > 0 && (
              <PaymentDetails
                title={translateData.rideFare}
                rideAmount={Number(rideData?.ride_fare).toFixed(2)}
              />
            )}
            {rideData?.tax > 0 && (
              <PaymentDetails
                title={translateData.tax}
                rideAmount={Number(rideData?.tax).toFixed(2)}
              />
            )}
            {calculateTipAmount() > 0 && (
              <View style={[styles.rideContainer, { flexDirection: viewRTLStyle }]}>
                <Text style={[styles.billTitle, { color: textColorStyle }]}>
                  {translateData.driverTips}
                </Text>
                <Text style={{ color: textColorStyle }}>
                  {zoneValue?.currency_symbol}{Number(calculateTipAmount()).toFixed(2)}
                </Text>
              </View>
            )}



            {rideData?.platform_fees > 0 && (
              <PaymentDetails
                title={translateData.platformFees}
                rideAmount={Number(rideData?.platform_fees).toFixed(2)}
              />
            )}
            {rideData?.vehicle_rent > 0 && (
              <PaymentDetails
                title={translateData.vehicleFare}
                rideAmount={Number(rideData?.vehicle_rent).toFixed(2)}
              />
            )}
            {rideData?.driver_rent > 0 && (
              <PaymentDetails
                title={translateData.driverFare}
                rideAmount={Number(rideData?.driver_rent).toFixed(2)}
              />
            )}
            {rideData?.bid_extra_amount > 0 && (
              <PaymentDetails
                title={translateData.bidExtra}
                rideAmount={Number(rideData?.bid_extra_amount).toFixed(2)}
              />
            )}
            {rideData?.additional_distance_charge > 0 && (
              <PaymentDetails
                title={translateData.additionalFare}
                rideAmount={Number(rideData?.additional_distance_charge).toFixed(2)}
              />
            )}
            {rideData?.additional_minute_charge > 0 && (
              <PaymentDetails
                title={translateData.minuteFare}
                rideAmount={Number(rideData?.additional_minute_charge).toFixed(2)}
              />
            )}
            {rideData?.total_extra_charge > 0 && (
              <PaymentDetails
                title={'Extra Charge'}
                rideAmount={Number(rideData?.total_extra_charge).toFixed(2)}
              />
            )}
            {rideData?.commission > 0 && (
              <PaymentDetails
                title={translateData.commission}
                rideAmount={Number(rideData?.commission).toFixed(2)}
              />
            )}
            {coupon && couponDiscount > 0 && (
              <View
                style={[styles.rideContainer, { flexDirection: viewRTLStyle }]}
              >
                <Text style={[styles.billTitle, { color: textColorStyle }]}>{translateData.couponSavings}</Text>
                <Text style={{ color: appColors.price }}>-{zoneValue?.currency_symbol}{Number(couponDiscount).toFixed(2)}</Text>
              </View>
            )}
            <View
              style={[
                styles.billBorder,
                { borderColor: isDark ? appColors.darkBorder : appColors.border },
              ]}
            />
            <View style={[styles.totalBillView, { flexDirection: viewRTLStyle }]}>
              <Text style={[styles.billTitle, { color: textColorStyle }]}>
                {translateData.totalBill}
              </Text>
              <Text style={styles.totalAmount}>
                {rideData?.currency_symbol}
                {(Number(rideData?.total).toFixed(2) - couponDiscount) + calculateTipAmount()}
              </Text>
            </View>

          </View>
          <Text
            style={[
              styles.payment,
              { color: textColorStyle, textAlign: textRTLStyle },
            ]}>
            {translateData.paymentMethod}
          </Text>
          <View
            style={{
              flexDirection: viewRTLStyle,
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: windowHeight(10)
            }}
          >
            {taxidoSettingData?.taxido_values?.activation?.rider_wallet == 1 && (
              <TouchableOpacity
                onPress={cashSelect}
                activeOpacity={0.9}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: windowWidth(200),
                  height: windowHeight(40),
                  borderWidth: 1.5,
                  borderColor: isDark ? appColors.darkBorder : appColors.border,
                  borderRadius: windowHeight(5),
                  paddingHorizontal: 10,
                  justifyContent: 'space-between',
                  backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Wallet colors={isDark ? appColors.whiteColor : appColors.primaryText} />
                  <Text style={{ fontFamily: appFonts.medium, marginLeft: 6, color: isDark ? appColors.whiteColor : appColors.blackColor }}>{translateData.Wallet}</Text>
                </View>
                <View style={{ marginHorizontal: windowWidth(-20) }}>
                  <CustomRadioButton
                    selected={selectedMethod === 'wallet'}
                    onPress={walletSelect}
                  />
                </View>
              </TouchableOpacity>
            )}
            {taxidoSettingData?.taxido_values?.activation?.online_payments == 1 && (
              <TouchableOpacity
                onPress={onlineSelect}
                activeOpacity={0.9}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: windowWidth(200),
                  height: windowHeight(40),
                  borderWidth: 1.5,
                  borderColor: isDark ? appColors.darkBorder : appColors.border,
                  borderRadius: windowHeight(5),
                  paddingHorizontal: 10,
                  justifyContent: 'space-between',
                  backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <OnlinePayment colors={isDark ? appColors.whiteColor : appColors.primaryText} />
                  <Text style={{ fontFamily: appFonts.medium, marginLeft: 6, color: isDark ? appColors.whiteColor : appColors.blackColor }}>{translateData.online}</Text>
                </View>
                <View style={{ marginHorizontal: windowWidth(-20) }}>
                  <CustomRadioButton
                    selected={selectedMethod === 'online'}
                    onPress={onlineSelect}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {selectedMethod === 'online' && (
            <View
              style={[
                styles.paymentContainer,
                { borderColor: isDark ? appColors.darkBorder : appColors.border },
              ]}>
              <FlatList
                data={zoneValue?.payment_method?.filter(item => item.name.toLowerCase() !== 'cash')}
                renderItem={({ item, index }) =>
                  renderItem({
                    item,
                    index,
                    length: zoneValue?.payment_method?.filter(i => i.name.toLowerCase() !== 'cash').length,
                  })
                }
                keyExtractor={item => item.id}
              />
            </View>
          )}
        </View>
      </ScrollView>
      <View style={[styles.buttonContainer2, { backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor }]}>
        <Button
          backgroundColor={appColors.primary}
          textColor={appColors.whiteColor}
          title={translateData.proceedtoPay}
          onPress={gotoPay}
          loading={paymentLoading}
        />
      </View>
    </View>
  );
}
