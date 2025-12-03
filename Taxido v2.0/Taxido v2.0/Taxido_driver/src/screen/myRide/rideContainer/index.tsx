import { FlatList, Image, Text, TouchableOpacity, View, ActivityIndicator, Linking } from 'react-native'
import React, { useState } from 'react'
import Images from '../../../utils/images/images'
import { styles } from './style'
import { useValues } from '../../../utils/context'
import Icons from '../../../utils/icons/icons'
import { useSelector } from 'react-redux'
import { useTheme } from '@react-navigation/native'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'
import { LoaderRide } from './loaderRide'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'
import { apiformatDates } from '../../../utils/functions'
import { useAppNavigation } from '../../../utils/navigation'

export default function RideContainer({ status }) {
  const { navigate } = useAppNavigation()
  const { viewRtlStyle, textRtlStyle, isDark } = useValues()
  const { colors } = useTheme()
  const { rideGets } = useSelector(state => state.ride)
  const { allVehicle } = useSelector(state => state.vehicleType)
  const { translateData } = useSelector(state => state.setting)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMoreData, setHasMoreData] = useState(true)
  const { zoneValue } = useSelector(state => state.zoneUpdate)
  const acceptedRides = rideGets?.data?.filter(ride => {
    const rideStatus = ride?.ride_status?.slug?.toLowerCase()
    const categorySlug = ride?.service_category?.name?.toLowerCase()
    const currentStatus = status?.toLowerCase()?.trim()
    if (!rideStatus) return false
    if (currentStatus === 'schedule') {
      return categorySlug === 'schedule' && rideStatus !== 'cancelled'
    }
    if (currentStatus === 'accepted') {
      return (
        categorySlug !== 'schedule' &&
        rideStatus !== 'completed' &&
        rideStatus !== 'cancelled'
      )
    }
    return rideStatus === currentStatus
  })

  const statusMapping = {
    accepted: {
      text: 'Pending',
      color: appColors.completeColor,
    },
    started: {
      text: 'Active',
      color: appColors.activeColor,
    },
    schedule: {
      text: 'Scheduled',
      color: appColors.scheduleColor,
    },
    cancelled: {
      text: 'Cancel',
      color: appColors.alertRed,
    },
    completed: {
      text: 'Completed',
      color: appColors.primary,
    },
    arrived: {
      text: 'Pending',
      color: appColors.completeColor,
    },
  }
  const paginatedData = acceptedRides?.slice(0, page * 5) || []

  const gotoMessage = item => {
    navigate('Chat', {
      driverId: item?.driver?.id,
      riderId: item?.rider?.id,
      rideId: item?.id,
      riderName: item?.rider?.name,
      riderImage: item?.rider?.profile_image?.original_url,
    })
  }

  const gotoCall = item => {
    const phoneNumber = item?.driver?.phone
    Linking.openURL(`tel:${phoneNumber}`)
  }


  const loadMoreData = () => {
    if (!loading && hasMoreData) {
      setLoading(true)
      if (paginatedData.length < acceptedRides?.length) {
        setPage(prevPage => prevPage + 1)
      } else {
        setHasMoreData(false)
      }
      setLoading(false)
    }
  }

  const handlePress = (selectedItem, vehicleData) => {
    let rideStatus = statusMapping[selectedItem.ride_status.slug]?.text

    navigate('PendingDetails', {
      item: selectedItem,
      vehicleDetail: vehicleData,
      rideStatus: rideStatus,
    })
  }

  const renderItem = ({ item }) => {
    const { vehicle_type_id } = item.vehicle_type_id || {}

    const vehicleData = Array.isArray(allVehicle)
      ? allVehicle.find(vehicle => vehicle?.id == vehicle_type_id)
      : undefined

    const formattedDate = apiformatDates(item.created_at)
    const hasProfileImage = !!item?.rider?.driver_profile_image_url

    return (
      <View style={[styles.container]}>
        <TouchableOpacity
          onPress={() => handlePress(item, vehicleData)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.rideInfoContainer,
              {
                backgroundColor: isDark ? colors.card : appColors.white,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                { flexDirection: viewRtlStyle, justifyContent: 'space-between' },
              ]}
            >
              <View style={{ flexDirection: viewRtlStyle }}>
                {hasProfileImage ? (
                  <Image
                    style={styles.profileImage}
                    source={{ uri: item.rider.driver_profile_image_url }}
                  />
                ) : (
                  <View
                    style={{
                      width: windowWidth(13),
                      height: windowWidth(13),
                      borderRadius: windowHeight(10),
                      backgroundColor: appColors.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizes.FONT4HALF,
                        fontFamily: appFonts.bold,
                        color: appColors.white,
                      }}
                    >
                      {item?.rider?.name?.charAt(0)?.toUpperCase() || 'D'}
                    </Text>
                  </View>
                )}
                <View style={styles.profileTextContainer}>
                  <Text
                    style={[
                      styles.profileName,
                      { color: isDark ? appColors.white : appColors.primaryFont },
                      { textAlign: textRtlStyle },
                    ]}
                  >
                    {item?.rider?.name}
                  </Text>
                  <View
                    style={[
                      styles.carInfoContainer,
                    ]}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      {Array.from({ length: 5 }).map((_, index) => {
                        const fullStarThreshold = index + 1
                        const halfStarThreshold = index + 0.5
                        if (item?.driver?.rating_count >= fullStarThreshold) {
                          return <Icons.RatingStar key={index} />
                        } else if (item?.rider?.rating_count >= halfStarThreshold) {
                          return <Icons.RatingHalfStar key={index} />
                        } else {
                          return <Icons.RatingEmptyStar key={index} />
                        }
                      })}
                    </View>
                    <View
                      style={[
                        {
                          flexDirection: viewRtlStyle,
                          alignSelf: 'flex-end',
                          marginHorizontal: windowHeight(0.4)
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.rating_count,
                          {
                            color: isDark
                              ? appColors.white
                              : appColors.primaryFont,

                          },
                        ]}
                      >
                        {Number(item?.driver?.rating_count).toFixed(1)}
                      </Text>
                      <Text style={styles.reviews_count}>
                        ({item?.driver?.review_count})
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View>
                <Text
                  style={[styles.tripCostText, { textAlign: textRtlStyle }]}
                >
                  {zoneValue?.currency_symbol}
                  {item.total}
                </Text>
              </View>
              {item?.ride_status?.slug === 'accepted' &&
                item?.ride_status?.slug === 'pending' &&
                item?.ride_status?.slug === 'arrived' &&
                item?.ride_status?.slug === 'schedule' && (
                  <View
                    style={[
                      styles.acceptedContainer,
                      {
                        flexDirection: viewRtlStyle,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.callContainer,
                        {
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => gotoMessage(item)}
                    >
                      <Icons.Message color={appColors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.callContainer,
                        {
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => gotoCall(item)}
                    >
                      <Icons.Call color={appColors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
            </View>


            {item?.ride_status?.slug !== 'completed' &&
              item?.ride_status?.slug !== 'cancelled' && (
                <View
                  style={[
                    styles.acceptedContainer,
                    {
                      flexDirection: viewRtlStyle,
                      marginTop: windowHeight(1.5),
                      width: '100%'
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.callContainer,
                      {
                        width: windowWidth(70),
                        alignItems: 'flex-start',
                        backgroundColor: isDark ? appColors.bgDark : appColors.lightGray

                      },
                    ]}
                    onPress={() => gotoMessage(item)}
                  >
                    <Text style={{ fontFamily: appFonts.regular, marginHorizontal: windowWidth(3), color: isDark ? appColors.white : appColors.primaryFont }}>{translateData?.sendaMsg}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={[
                      styles.callContainer,
                      {
                        borderColor: colors.border,
                        backgroundColor: appColors.primary
                      },
                    ]}
                    onPress={() => gotoCall(item)}
                  >
                    <Icons.Call color={appColors.white} />
                  </TouchableOpacity>
                </View>
              )}

            <View
              style={[
                styles.dashedLine,
                {
                  borderColor: colors.border,
                },
              ]}
            />
            {item.locations && item.locations.length > 0 && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={{ marginTop: windowHeight(0.3), marginRight: windowWidth(2) }} >
                  <Icons.location
                    color={isDark ? appColors.secondaryFont : appColors.primaryFont}
                  />
                </View>
                <Text style={{ fontFamily: appFonts.medium, color: isDark ? appColors.secondaryFont : appColors.primaryFont }} numberOfLines={1} ellipsizeMode="tail">
                  {item.locations[0]?.length > 30 ? `${item.locations[0].substring(0, 30)}...` : item.locations[0] || ''}
                </Text>
              </View>
            )}
  <View
              style={[
                styles.dashedLine,
                {
                  borderColor: colors.border,
                  width:'101%',
                  alignSelf:'center'
                },
              ]}
            />            {item.locations && item.locations.length > 1 && (
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={{ marginTop: windowHeight(0.3), marginRight: windowWidth(2) }} >
                  <Icons.gps
                    color={isDark ? appColors.secondaryFont : appColors.primaryFont}
                  />
                </View>
                <Text style={{ fontFamily: appFonts.medium, color: isDark ? appColors.secondaryFont : appColors.primaryFont }} numberOfLines={1} ellipsizeMode="tail">
                  {item.locations[item.locations.length - 1]?.length > 30 ? `${item.locations[item.locations.length - 1].substring(0, 30)}...` : item.locations[item.locations.length - 1] || ''}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: viewRtlStyle, marginHorizontal: windowWidth(0), marginTop: windowHeight(1.2),alignItems:'center' }}>
              <View style={{flexDirection:viewRtlStyle,alignItems:'center'}}>
              <Icons.CalanderBig />
              <Text style={{ fontFamily: appFonts.regular, color: appColors.secondaryFont,marginHorizontal:windowWidth(1) }}>{formattedDate.date}</Text>
              </View>
              <View style={{ height: windowHeight(1.5), borderRightWidth: 1, borderRightColor: isDark?appColors.secondaryFont:appColors.border, marginHorizontal: windowWidth(2) }} />
                      <View style={{flexDirection:viewRtlStyle,alignItems:'center'}}>
              <Icons.Clock />
              <Text style={{ fontFamily: appFonts.regular, color: appColors.secondaryFont,marginHorizontal:windowWidth(1)}}>{formattedDate.time}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity >
      </View >
    )
  }

  return (
    <View style={styles.listContainer}>
      {loading && acceptedRides?.length > 0 ? (
        <LoaderRide />
      ) : acceptedRides?.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Image source={Images.noRides} style={styles.noDataImage} />
          <Text style={styles.noDataText}>{translateData.norideTitle}</Text>
          <Text style={styles.noDataDesc}>
            {translateData.norideDescription}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={paginatedData}
            scrollEnabled={true}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.9}
            ListFooterComponent={
              loading && (
                <ActivityIndicator
                  size="large"
                  color={appColors.buttonBg}
                  style={{ marginTop: 10 }}
                />
              )
            }
          />
          <View style={styles.bottomView} />
        </>
      )}
    </View>
  );

}
