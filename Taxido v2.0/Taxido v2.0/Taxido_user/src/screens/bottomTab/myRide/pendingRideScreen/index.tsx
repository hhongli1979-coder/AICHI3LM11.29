import { ScrollView, View, TouchableOpacity, Image, Text, TextInput, TouchableWithoutFeedback, Linking } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Header, notificationHelper } from '@src/commonComponent';
import { external } from '../../../../styles/externalStyle';
import { PendingDetails } from './pendingDetails/index';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { useValues } from '@src/utils/context/index';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { CalenderSmall, Call, ClockSmall, Gps, PickLocation, RatingEmptyStart, RatingHalfStar, RatingStar, StarEmpty, StarFill } from '@src/utils/icons';
import { styles } from '../rideContainer/style';
import Images from '@src/utils/images';
import { useDispatch, useSelector } from 'react-redux';
import { clearValue, getValue } from '@src/utils/localstorage';
import { allRide, paymentsData, driverReviewPost, allRides, rideDataPut, cancelationDataGet } from '@src/api/store/actions';
import { URL } from '@src/api/config';
import { UserRegistrationPayload } from '@src/api/interface/authInterface';
import styless from './styles';
import { commonStyles } from '@src/styles/commonStyle';
import firestore from '@react-native-firebase/firestore';
import { apiformatDates } from '@src/utils/functions';
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';

export function PendingRideScreen() {
  const { bgFullStyle, textColorStyle, viewRTLStyle, textRTLStyle, isDark, isRTL } = useValues();
  const route = useRoute();
  const { item, vehicleDetail, rideStatus } = route?.params;
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { rideData } = useSelector((state: any) => state.allRide);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const { translateData } = useSelector(state => state.setting);
  const navigation = useNavigation();
  const { zoneValue } = useSelector((state: any) => state.zone);
  const { self } = useSelector((state: any) => state.account);
  const [loader, setLoader] = useState(false)
  const [paymentLoading, setpaymentLoading] = useState(false);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const { canceldata } = useSelector((state) => state.cancelationReason);
  const sheetRef = useRef<BottomSheet>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);


  useEffect(() => {
    dispatch(cancelationDataGet());
  }, []);


  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['74%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );


  const viewInvoice = async () => {
    setLoader(true)
    const token = await getValue('token');
    const response = await fetch(
      `${URL}/api/ride/rider-invoice/${rideData?.invoice_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      },
    );


    if (response.status == 200) {
      setLoader(false)
      navigate('PdfViewer', {
        pdfUrl: response?.url,
        token: token,
        rideNumber: rideData?.invoice_id
      });
    }
  };

  const cancelRental = () => {
    sheetRef.current?.snapToIndex(0);
  }


  const cancelRide = (selectedItem) => {
    const ride_id = item?.id;

    let payload: ReviewInterface = {
      status: "cancelled",
      cancellation_reason: selectedItem.title,
    };

    dispatch(rideDataPut({ payload, ride_id }))
      .unwrap()
      .then((res: any) => {
        sheetRef.current?.close();
        if (res?.ride_status?.slug == "cancelled") {
          const rideId = res?.id;
          if (rideId) {
            navigate("MyTabs");
            dispatch(allRides());
            notificationHelper("", translateData.rideCancelNotification, 'error')
          } else {
            console.warn("rideId not found");
            notificationHelper("", translateData.somethingWrong, 'error')
          }
        }
      });
  };


  const gotoTrack = () => {
    try {
      setLoader(true);
      if (item?.service_category?.service_category_type === "package") {
        navigate("PaymentRental", { rideId: item?.id });
      } else {
        navigate("Payment", { rideId: item?.id });
      }
    } catch (e) {
    } finally {
      setLoader(false);
    }
  };


  const payNow = () => {
    setpaymentLoading(true);
    const rideData = item;
    navigate('PaymentMethod', { rideData });
    setpaymentLoading(false)
  };

  const review = () => {
    bottomSheetRef.current?.expand();
    setIsBottomSheetVisible(true);

  };

  const reviewSubmit = async () => {
    let payload: UserRegistrationPayload = {
      ride_id: item?.id,
      driver_id: item?.driver_id,
      rating: rating,
      message: reviewText,
    };
    dispatch(driverReviewPost(payload))
      .unwrap()
      .then((res: any) => {
        if (res?.success === false) {
          notificationHelper('', res.message, 'error');
          bottomSheetRef.current?.close();
          setIsBottomSheetVisible(false);
        } else {
          dispatch(allRides())
          bottomSheetRef.current?.close();
          setIsBottomSheetVisible(false);
          notificationHelper('', translateData.reviewSubmited, 'success');
          navigation.goBack();
        }
      })
      .catch(err => {
        notificationHelper('', err, 'error');
      });
  };

  useFocusEffect(
    useCallback(() => {
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
        .catch(error => {
          console.error('Error in paymentsData:', error);
        });

      dispatch(allRide({ ride_id: item.id }))
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
        .catch(error => {
          console.error('Error in allRide:', error);
        });
    }, [item.id]),
  );

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const gotoOtpRide = async () => {
    setLoader(true)
    try {
      const rideId = item?.id;
      if (!rideId) {
        console.warn('Ride ID is missing.');
        setLoader(true)
        return;
      }

      const rideDoc = await firestore()
        .collection('rides')
        .doc(rideId.toString())
        .get();

      if (rideDoc.exists) {
        const rideData = rideDoc.data();
        setLoader(false)
        navigation.navigate('RideActive', { activeRideOTP: rideData });
      } else {
        console.warn('No ride found with the provided ID.');
        notificationHelper('', translateData.noRecordsFound, 'error');
        setLoader(false)
      }
    } catch (error) {
      console.error('Error fetching ride data:', error);
      setLoader(false)
    }
  };

  const gotoMessage = item => {
    navigate("ChatScreen", {
      driverId: item?.driver?.id,
      riderId: item?.rider?.id,
      rideId: item?.id,
      driverName: item?.driver?.name,
      driverImage: item?.driver?.profile_image_url,
    });
  };

  const gotoCall = item => {
    const phoneNumber = `${item?.driver?.phone}`;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const formattedDate = apiformatDates(item.created_at);
  const hasProfileImage = !!item?.driver?.driver_profile_image_url;

  const handleSheetChange = useCallback((index) => {
  }, []);


  const onConfirmCancel = () => {
    if (!selectedItem) return;
    cancelRide(selectedItem);
  };


  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = selectedItem?.id === item.id;

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          key={item.id}
          style={[
            styles.container2,
            {
              backgroundColor: isSelected ? appColors.dotLight : appColors.lightGray,
              flexDirection: viewRTLStyle,
            },
          ]}
          onPress={() => setSelectedItem(item)}
        >
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.text,
                { color: textColorStyle, textAlign: textRTLStyle },
              ]}
            >
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [selectedItem]
  );


  return (
    <View>
      <ScrollView>
        <Header
          value={`${rideStatus} ${translateData.ride}`}
          container={
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: windowHeight(10) }}>
              <View style={[styles.container]}>
                <View
                  style={[
                    styles.rideInfoContainer,
                    { backgroundColor: bgFullStyle },
                  ]}>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ backgroundColor: isDark ? appColors.bgDark : appColors.lightGray, paddingHorizontal: windowHeight(10), paddingVertical: windowHeight(5), borderRadius: windowHeight(15) }}>
                      <Text
                        style={[
                          styles.tripIDText,
                          { color: textColorStyle, textAlign: textRTLStyle },
                        ]}>
                        #{item.ride_number}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontSize: fontSizes.FONT17, color: appColors.regularText, fontFamily: appFonts.medium }}>{formattedDate.date}</Text>
                      <View style={{ borderLeftWidth: 1.5, borderColor:isDark?appColors.darkBorder: appColors.border, marginHorizontal: windowWidth(5), height: windowHeight(10),alignSelf:'center' }} />
                      <Text style={{ fontSize: fontSizes.FONT17, color: appColors.regularText, fontFamily: appFonts.medium }}>{formattedDate.time}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.dashedLine,
                      {
                        borderColor: isDark
                          ? appColors.darkBorder
                          : appColors.border,
                      },
                    ]}
                  />

                  <View style={[{ flexDirection: viewRTLStyle }]}>
                    {hasProfileImage ? (
                      <Image
                        style={[styles.profileImage, { borderRadius: windowHeight(30) }]}
                        source={{ uri: item.driver.driver_profile_image_url }}
                      />
                    ) : (
                      <View
                        style={{
                          width: windowWidth(60),
                          height: windowWidth(60),
                          borderRadius: windowHeight(21),
                          backgroundColor: appColors.primary,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: fontSizes.FONT19,
                            fontFamily: appFonts.bold,
                            color: appColors.whiteColor,
                          }}>
                          {item?.driver?.name?.charAt(0)?.toUpperCase() || 'D'}
                        </Text>
                      </View>
                    )}
                    <View style={styles.profileTextContainer}>
                      <Text
                        style={[
                          styles.profileName,
                          { color: textColorStyle },
                          { textAlign: textRTLStyle },
                        ]}>
                        {item?.driver?.name}
                      </Text>
                      <View style={{ flexDirection: viewRTLStyle }}>
                        <View
                          style={{
                            flexDirection: viewRTLStyle,
                          }}>
                          {Array.from({ length: 5 }).map((_, index) => {
                            const fullStarThreshold = index + 1;
                            const halfStarThreshold = index + 0.5;
                            if (item?.driver?.rating_count >= fullStarThreshold) {
                              return <RatingStar key={index} />;
                            } else if (
                              item?.driver?.rating_count >= halfStarThreshold
                            ) {
                              return <RatingHalfStar key={index} />;
                            } else {
                              return <RatingEmptyStart key={index} />;
                            }
                          })}
                        </View>
                        <View style={{ flexDirection: viewRTLStyle, marginHorizontal: windowWidth(4) }}>
                          <Text
                            style={[
                              commonStyles.mediumTextBlack12,
                              ,
                              {
                                color: isDark
                                  ? appColors.whiteColor
                                  : appColors.blackColor,
                              },
                            ]}>
                            {Number(item?.driver?.rating_count).toFixed(1)}
                          </Text>
                          <Text
                            style={[
                              commonStyles.regularText,
                              { color: appColors.regularText },
                            ]}>
                            ({item?.driver?.review_count})
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        height: windowHeight(40)
                      }}>

                      <Text
                        style={[
                          commonStyles.mediumTextBlack12,
                          {
                            color: isDark
                              ? appColors.whiteColor
                              : appColors.primaryText,
                            fontSize: fontSizes.FONT22
                          },
                        ]}>
                        {zoneValue.currency_symbol}
                        {item?.total}
                      </Text>
                      <View style={styles.service_name_view}>
                        <Text style={styles.service_name}>{item?.service?.name}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: viewRTLStyle, justifyContent: 'space-between', marginBottom: windowHeight(8), marginTop: windowHeight(10) }}>
                    <TouchableOpacity
                      onPress={() => gotoMessage(item)}
                      style={[
                        styles.message,
                        {
                          backgroundColor: isDark
                            ? appColors.bgDark
                            : appColors.lightGray,
                          height: windowHeight(40),
                          width: windowWidth(325),
                          alignItems: 'flex-start'
                        },
                      ]}
                      activeOpacity={0.7}>
                      <Text style={{ marginHorizontal: windowWidth(10), fontFamily: appFonts.regular, color: appColors.regularText }}>{translateData.sendMessage}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => gotoCall(item)}
                      activeOpacity={0.7}
                      style={[
                        styles.call,
                        {
                          backgroundColor: appColors.primary,
                        },
                      ]}
                    >
                      <Call color={appColors.whiteColor} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity activeOpacity={0.7} style={{ marginTop: windowHeight(2) }}>
                    <Image source={isDark?Images.rideDark:Images.map} resizeMode='stretch' style={{ height: windowHeight(80), width: '100%' }} />
                  </TouchableOpacity>
                  <View style={{ flexDirection: viewRTLStyle, marginTop: windowHeight(10) }}>
                    <View>
                      <View
                        style={[
                          styless.calenderSmallView,
                          {
                            flexDirection: viewRTLStyle,
                          },
                        ]}>
                        <PickLocation
                          height={12}
                          width={12}
                          colors={
                            isDark ? appColors.whiteColor : appColors.primaryText
                          }
                        />
                        <Text
                          style={[
                            styles.itemStyle,
                            { color: textColorStyle },
                            {
                              textAlign: textRTLStyle,
                              marginHorizontal: windowWidth(10),
                              fontFamily: appFonts.medium
                            },
                          ]}>
                          {item.locations[0]}
                        </Text>
                      </View>
                      {item?.service?.slug !== 'ambulance' &&
                        item.locations.length > 1 && (
                          <View style={{ marginVertical: windowHeight(10) }}>
                            <View
                              style={[
                                styless.calenderSmallView,
                                {
                                  flexDirection: viewRTLStyle
                                },
                              ]}>
                              <Gps
                                height={12}
                                width={12}
                                colors={
                                  isDark
                                    ? appColors.whiteColor
                                    : appColors.primaryText
                                }
                              />
                              <Text
                                style={[
                                  styles.pickUpLocationStyles,
                                  {
                                    color: textColorStyle,
                                    marginHorizontal: windowWidth(10),
                                    fontFamily: appFonts.medium
                                  },
                                ]}>
                                {item.locations[1]}
                              </Text>
                            </View>
                          </View>
                        )}
                    </View>
                  </View>
                </View>
              </View>

              {item?.service_category?.slug === 'rental' && (
                <View style={[styless.rentalMainView, { backgroundColor: bgFullStyle }]}>
                  <View
                    style={[
                      styless.rentalView,
                      {
                        flexDirection: viewRTLStyle,
                        backgroundColor: bgFullStyle,
                      },
                    ]}>
                    <View style={styless.viewRental}>
                      <Text
                        style={[
                          styless.startDateText,
                          {
                            color: isDark
                              ? appColors.whiteColor
                              : appColors.primaryText,
                          },
                        ]}>
                        {translateData.startDate}
                      </Text>
                      <View
                        style={[
                          styless.vieww,
                          {
                            flexDirection: viewRTLStyle,
                          },
                        ]}>
                        <CalenderSmall />
                        <Text style={styless.timeText}> {formattedDate.date}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styless.linee,
                        {
                          borderColor: isDark
                            ? appColors.darkBorder
                            : appColors.border,
                        },
                      ]}
                    />
                    <View style={styless.viewRental}>
                      <Text
                        style={[
                          styless.startDateText,
                          {
                            color: isDark
                              ? appColors.whiteColor
                              : appColors.primaryText,
                          },
                        ]}>
                        {translateData.startTime}
                      </Text>
                      <View
                        style={[
                          styless.vieww,
                          {
                            flexDirection: viewRTLStyle,
                          },
                        ]}>
                        <ClockSmall />
                        <Text style={styless.timeText}> {formattedDate.time}</Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styless.rentalView,
                      {
                        flexDirection: viewRTLStyle,
                        backgroundColor: bgFullStyle,
                      },
                    ]}>
                    <View style={styless.viewRental}>
                      <Text
                        style={[
                          styless.startDateText,
                          {
                            color: isDark
                              ? appColors.whiteColor
                              : appColors.primaryText,
                          },
                        ]}>
                        {translateData.endDate}
                      </Text>
                      <View
                        style={[
                          styless.vieww,
                          {
                            flexDirection: viewRTLStyle,
                          },
                        ]}>
                        <CalenderSmall />
                        <Text
                          style={{
                            color: appColors.regularText,
                            fontFamily: appFonts.regular,
                          }}>
                          {' '}
                          {formattedDate.date}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styless.rentalLine,
                        {
                          borderColor: isDark
                            ? appColors.darkBorder
                            : appColors.border,
                        },
                      ]}
                    />
                    <View style={styless.viewRental}>
                      <Text
                        style={{
                          color: isDark
                            ? appColors.whiteColor
                            : appColors.primaryText,
                          fontFamily: appFonts.medium,
                        }}>
                        {translateData.endTime}
                      </Text>
                      <View
                        style={[
                          styless.vieww,
                          {
                            flexDirection: viewRTLStyle,
                          },
                        ]}>
                        <ClockSmall />
                        <Text style={styless.timeText}> {formattedDate.time}</Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styless.rentalView,
                      {
                        flexDirection: viewRTLStyle,
                        backgroundColor: bgFullStyle,
                      },
                    ]}>
                    <View style={styless.totalDaysView}>
                      <Text style={styless.timeText}>
                        {translateData.totalDays}
                      </Text>
                      <View
                        style={[
                          styless.vieww,
                          {
                            flexDirection: viewRTLStyle,
                          },
                        ]}>
                        <CalenderSmall />
                        <Text style={styless.timeText}> 5 Days</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              {item?.service_category?.slug === 'schedule' && (
                <View
                  style={[
                    styless.scheduleView,
                    {
                      flexDirection: viewRTLStyle,
                      backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor,
                      borderColor: isDark ? appColors.darkBorder : appColors.border,
                    },
                  ]}>
                  <View style={styless.viewRental}>
                    <Text style={[styless.startDateText, { color: isDark ? appColors.whiteColor : appColors.blackColor }]}>
                      {translateData.startDate}
                    </Text>
                    <View
                      style={[
                        styless.clockSmall,
                        {
                          flexDirection: viewRTLStyle,
                        },
                      ]}>
                      <CalenderSmall />
                      <Text style={styless.timeText}>{formattedDate.date}</Text>
                    </View>
                  </View>
                  <View style={[styless.rentalLine, { borderColor: isDark ? appColors.darkBorder : appColors.border }]} />
                  <View style={[styless.viewRental, { alignItems: "flex-end" }]}>
                    <Text style={[styless.startDateText, { color: isDark ? appColors.whiteColor : appColors.blackColor }]}>
                      {translateData.startTime}
                    </Text>
                    <View
                      style={[
                        styless.clockSmall,
                        {
                          flexDirection: viewRTLStyle,
                        },
                      ]}>
                      <ClockSmall />
                      <Text style={styless.timeText}>{formattedDate.time}</Text>
                    </View>
                  </View>
                </View>
              )}

              {item?.service_category?.service_category_type !== 'schedule' &&
                item?.service_category?.service_category_type !== 'package' &&
                item?.service_category?.service_category_type !== 'ride' && (
                  <View
                    style={[
                      styless.scheduleView,
                      {
                        flexDirection: viewRTLStyle,
                        top: windowHeight(4.5),
                        backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor
                      },
                    ]}>
                    <View style={styless.viewRental}>
                      <Text style={styless.startDateText}>
                        {translateData.startDate}
                      </Text>
                      <View
                        style={[
                          styless.clockSmall,
                          {
                            flexDirection: viewRTLStyle,
                          },
                        ]}>
                        <CalenderSmall />
                        <Text style={styless.timeText}>{formattedDate.date}</Text>
                      </View>
                    </View>
                    <View style={styless.rentalLine} />
                    <View style={[styless.viewRental, { alignItems: "flex-end" }]}>
                      <Text style={[styless.startDateText, { marginHorizontal: windowWidth(4.5) }]}>
                        {translateData.startTime}
                      </Text>
                      <View
                        style={[
                          styless.clockSmall,
                          {
                            flexDirection: viewRTLStyle,
                          },
                        ]}>
                        <View style={{ right: windowWidth(5) }}>
                          <ClockSmall />
                        </View>
                        <Text style={styless.timeText}>{formattedDate.time}</Text>
                      </View>
                    </View>
                  </View>
                )}
              {item?.service_category?.service_category_type === 'schedule' && (
                <View
                  style={[
                    styless.scheduleView,
                    {
                      flexDirection: viewRTLStyle,
                      backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor,
                      borderColor: isDark ? appColors.darkBorder : appColors.border,
                    },
                  ]}>
                  <View style={styless.viewRental}>
                    <Text style={[styless.startDateText, { color: isDark ? appColors.whiteColor : appColors.blackColor }]}>
                      {translateData.startDate}
                    </Text>
                    <View
                      style={[
                        styless.clockSmall,
                        {
                          flexDirection: viewRTLStyle,
                        },
                      ]}>
                      <CalenderSmall />
                      <Text style={styless.timeText}>{formattedDate.date}</Text>
                    </View>
                  </View>
                  <View style={[styless.rentalLine, { borderColor: isDark ? appColors.darkBorder : appColors.border }]} />
                  <View style={[styless.viewRental, { alignItems: "flex-end" }]}>
                    <Text style={[styless.startDateText, { color: isDark ? appColors.whiteColor : appColors.blackColor }]}>
                      {translateData.startTime}
                    </Text>
                    <View
                      style={[
                        styless.clockSmall,
                        {
                          flexDirection: viewRTLStyle,
                        },
                      ]}>
                      <ClockSmall />
                      <Text style={styless.timeText}>{formattedDate.time}</Text>
                    </View>
                  </View>
                </View>
              )}

              <View style={[external.mt_10]}>
                {item.ride_status.slug === 'cancelled' ? (
                  <View style={styless.cancelledView}>
                    <Text style={styless.cancellation_reasonText}>
                      {translateData.reason}
                    </Text>

                    <View style={styless.cancellation_reasonView}>
                      <Text style={styless.cancellation_reasonText}>
                        {rideData?.cancellation_reason}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <PendingDetails rideDetails={item} vehicleData={vehicleDetail} />
                )}
              </View>

              {item.ride_status.slug != 'cancelled' && (
                <View
                  style={[styless.ride_statusView, { backgroundColor: bgFullStyle }]}>
                  <View style={[styless.paymentMethodView, {
                    backgroundColor: isDark ? appColors.darkBorder : appColors.lightGray
                  }]} />

                  <View
                    style={[
                      styless.paymentMethodLine,
                      {
                        borderColor: isDark
                          ? appColors.darkBorder
                          : appColors.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.title,
                        {
                          color: isDark
                            ? appColors.whiteColor
                            : appColors.primaryText,
                          textAlign: textRTLStyle,
                        },
                      ]}>
                      {translateData.paymentMethod}
                    </Text>
                    <View
                      style={[
                        styles.border,
                        {
                          borderColor: isDark
                            ? appColors.darkBorder
                            : appColors.border,
                        },
                      ]}
                    />
                    <View style={[styles.contain, { flexDirection: viewRTLStyle }]}>
                      <Text style={[styles.type, { color: appColors.regularText }]}>
                        {translateData.paymentMethod}
                      </Text>
                      <Text
                        style={[
                          styles.type,
                          {
                            color: isDark
                              ? appColors.whiteColor
                              : appColors.primaryText,
                          },
                        ]}>
                        {item?.payment_method}
                      </Text>
                    </View>
                    <View style={[styles.contain, { flexDirection: viewRTLStyle }]}>
                      <Text style={[styles.type, { color: appColors.regularText }]}>
                        {translateData.status}
                      </Text>
                      <Text
                        style={[
                          styles.type,
                         {
    color:
      item?.payment_status === 'paid' || item?.payment_status === 'COMPLETED'
        ? appColors.price
        : item?.payment_status === 'PENDING'
        ? appColors.lightYellow
        : appColors.alertRed,
  
}

                        ]}>
                        {item?.payment_status}
                      </Text>
                    </View>
                  </View>
                  <Image source={Images.subtract} style={{ tintColor: isDark ? appColors.bgDark : appColors.lightGray, width: '100%', resizeMode: 'stretch' }} />
                </View>
              )}

              <TouchableOpacity activeOpacity={0.7} onPress={() => navigate('ChatScreen', { from: "help", riderId: self && self?.id })} style={styless.needHelpView}>
                <Text
                  style={[
                    styless.needHelpText,
                    {
                      textAlign: isRTL ? 'left' : 'right',
                    },
                  ]}>
                  {translateData.needHelp}
                </Text>
              </TouchableOpacity>
              {(item?.ride_status?.slug == 'accepted' || item?.ride_status?.slug == 'arrived') && item?.service_category?.service_category_type != "rental" && (
                <View style={{ marginHorizontal: windowWidth(20) }}>
                  <Button
                    backgroundColor={appColors.primary}
                    textColor={appColors.whiteColor}
                    title={translateData.startRide}
                    onPress={gotoOtpRide}
                    loading={loader}
                  />
                </View>
              )
              }

              <View style={styless.ride_status}>
                {item?.ride_status?.slug == 'completed' &&
                  item?.payment_status == 'PENDING' && (
                    <Button title={translateData.payNow} onPress={payNow} loading={paymentLoading} />
                  )}
                {item?.ride_status?.slug == 'completed' &&
                  item?.payment_status == 'COMPLETED' && item?.riderReview == null && (
                    <Button title={translateData.review} onPress={review} />
                  )}
                {item?.ride_status?.slug == 'started' && item?.service_category?.service_category_type != "rental" && (
                  <Button title={translateData.trackRide} onPress={gotoTrack} loading={loader} />
                )}
                {item?.ride_status?.slug == 'completed' &&
                  item?.payment_status == 'COMPLETED' && (
                    <Button title={translateData.viewInvoice} onPress={viewInvoice} loading={loader} />
                  )}
                {item?.service_category?.service_category_type == "rental" && item?.ride_status?.slug == 'accepted' && (
                  <Button title={translateData.modelCancelText} onPress={cancelRental} backgroundColor={appColors.alertRed} loading={loader} />
                )}
              </View>

            </ScrollView>
          }
        />
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: bgFullStyle }}
      >
        <BottomSheetView >
          <TouchableWithoutFeedback >
            <View style={styles.bgmodal}>
              <TouchableWithoutFeedback onPress={() => { }}>
                <View
                  style={[styles.background, { backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor }]}>


                  <Text style={[styles.title, { color: textColorStyle }]}>
                    {translateData.modalTitle}
                  </Text>

                  <View style={styles.userAlign}>
                    <Image
                      style={styles.modalImage}
                      source={
                        item?.driver?.driver_profile_image_url
                          ? { uri: item?.driver?.driver_profile_image_url }
                          : Images.defultImage
                      }
                    />
                    <Text style={[styles.modalName, { color: textColorStyle }]}>
                      {item?.driver?.name}
                    </Text>
                    <Text style={[styles.modalMail, { color: textColorStyle }]}>
                      {item?.driver?.email}
                    </Text>
                  </View>

                  <Image
                    source={Images.lineBottom}
                    style={styles.lineImage}
                    tintColor={isDark ? appColors.darkBorder : appColors.whiteColor}
                  />
                  <Text
                    style={[
                      styles.rate,
                      { color: textColorStyle, textAlign: textRTLStyle, right: windowWidth(5) },
                    ]}>
                    {translateData.driverRating}
                  </Text>

                  <View
                    style={[
                      styles.containerReview,
                      { borderColor: isDark ? appColors.darkBorder : appColors.primaryGray },
                      { flexDirection: viewRTLStyle },
                    ]}>
                    {[1, 2, 3, 4, 5].map(index => (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        key={index}
                        onPress={() => handleStarPress(index)}
                        style={styles.starIcon}>
                        {index <= rating ? <StarFill /> : <StarEmpty />}
                      </TouchableOpacity>
                    ))}
                    <View
                      style={[
                        styles.ratingView,
                        { flexDirection: viewRTLStyle },
                      ]}>
                      <View style={[styles.borderVertical, { borderColor: isDark ? appColors.darkBorder : appColors.border }]} />
                      <Text style={[styles.rating, { color: textColorStyle }]}>
                        {rating}/5
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.comment,
                      { color: textColorStyle, textAlign: textRTLStyle, right: windowWidth(6) },
                    ]}>
                    {translateData.addComments}
                  </Text>

                  <View style={[styless.textinput,]}>
                    <TextInput
                      style={[
                        styles.textinput,
                        { color: textColorStyle, textAlign: textRTLStyle },
                        { borderColor: isDark ? appColors.darkBorder : appColors.border }
                      ]}
                      multiline={true}
                      textAlignVertical="top"
                      value={reviewText}
                      onChangeText={text => setReviewText(text)}
                    />
                  </View>

                  <View style={styles.border2} />
                  <View style={styless.reviewSubmit}>
                    <Button
                      width={windowWidth(420)}
                      backgroundColor={appColors.primary}
                      textColor={appColors.whiteColor}
                      title={translateData.submit}
                      onPress={reviewSubmit}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </BottomSheetView>
      </BottomSheet>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        index={-1}
        enablePanDownToClose
      >
        <BottomSheetFlatList
          data={canceldata?.data}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        />

        <View style={{ padding: windowHeight(10) }}>
          <TouchableOpacity
            disabled={!selectedItem}
            onPress={() => onConfirmCancel()}
            style={{
              backgroundColor: selectedItem ? appColors.primary : appColors.gray,
              padding: windowHeight(10),
              borderRadius: windowHeight(8),
              alignItems: "center",
            }}
          >
            <Text style={styles.cancelText}>{translateData.confirm}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

    </View>
  );
}

