import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import appColors from '../../../../theme/appColors'
import images from '../../../../utils/images/images'
import styles from './styles'
import { useValues } from '../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { apiformatDates, } from '../../../../utils/functions'
import { fontSizes, windowHeight, windowWidth } from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'
import Icons from '../../../../utils/icons/icons'
import { useAppNavigation } from '../../../../utils/navigation'

export function Details({ rideDetails }: any) {
  const { viewRtlStyle, isDark, textRtlStyle } = useValues()
  const { colors } = useTheme()
  const navigation = useNavigation<any>()
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)
  const formattedDate = apiformatDates(rideDetails.created_at)
  const { navigate } = useAppNavigation()

  const gotoPath = () => {
    navigation.navigate('MapDetails', {
      location: rideDetails?.location_coordinates,
    })
  }
  const hasProfileImage = !!rideDetails?.rider?.driver_profile_image_url

  const gotoMessage = (item: any) => {
    navigate('Chat', {
      driverId: item?.driver?.id,
      riderId: item?.rider?.id,
      rideId: item?.id,
      riderName: item?.rider?.name,
      riderImage: item?.rider?.profile_image?.original_url,
    })
  }

  const gotoCall = (item: any) => {
    const phoneNumber = item?.driver?.phone
    Linking.openURL(`tel:${phoneNumber}`)
  }
  const { translateData } = useSelector((state: any) => state.setting)

  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          paddingVertical: windowHeight(1.5),
        },
      ]}
    >
      <View style={{ flexDirection: viewRtlStyle, justifyContent: 'space-between', marginHorizontal: windowWidth(3), marginBottom: windowHeight(0.5) }}>
        <View style={{ backgroundColor: isDark ? appColors.bgDark : appColors.lightGray, paddingHorizontal: windowWidth(3), paddingVertical: windowWidth(1), borderRadius: windowHeight(5) }}>
          <Text style={{ fontFamily: appFonts.regular, color: isDark ? appColors.white : appColors.primaryFont }}>#{rideDetails?.ride_number}</Text>
        </View>
        <View style={{ flexDirection: viewRtlStyle, alignItems: 'center' }}>
          <Text style={styles.date}>{formattedDate.date}</Text>
          <View style={{ height: windowHeight(1.5), borderLeftWidth: 1.5, marginHorizontal: windowWidth(2), borderColor:isDark?appColors.darkborder: appColors.lightGray }} />
          <Text style={styles.date}>{formattedDate.time}</Text>
        </View>
      </View>


      <View
        style={{
          flexDirection: viewRtlStyle,
          justifyContent: 'space-between',
          margin: windowHeight(1)
        }}
      >
        <View style={{ flexDirection: viewRtlStyle }}>
          {hasProfileImage ? (
            <Image
              style={styles.profileImage}
              source={{ uri: rideDetails.rider.driver_profile_image_url }}
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
                {rideDetails?.rider?.name?.charAt(0)?.toUpperCase() || 'D'}
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
              {rideDetails?.rider?.name}
            </Text>
            <View
              style={[
                styles.carInfoContainer,
                {flexDirection:viewRtlStyle}
              ]}
            >
              <View style={{ flexDirection: 'row' }}>
                {Array.from({ length: 5 }).map((_: any, index: number) => {
                  const fullStarThreshold = index + 1
                  const halfStarThreshold = index + 0.5
                  if (rideDetails?.driver?.rating_count >= fullStarThreshold) {
                    return <Icons.RatingStar key={index} />
                  } else if (rideDetails?.rider?.rating_count >= halfStarThreshold) {
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
                  {Number(rideDetails?.driver?.rating_count).toFixed(1)}
                </Text>
                <Text style={styles.reviews_count}>
                  ({rideDetails?.driver?.review_count})
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
            {rideDetails.total}
          </Text>
        </View>

      </View>
      <View style={{ marginHorizontal: windowWidth(3) }}>
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
            onPress={() => gotoMessage(rideDetails)}
          >
            <Text style={{ fontFamily: appFonts.regular, marginHorizontal: windowWidth(3), color: isDark ? appColors.white : appColors.primaryFont }}>{translateData.sendaMsg}</Text>
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
            onPress={() => gotoCall(rideDetails)}
          >
            <Icons.Call color={appColors.white} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.border, { borderColor: colors.border }]} />
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.mapView, { flexDirection: viewRtlStyle }]}
        onPress={gotoPath}
      >
        {isDark ? (
          <Image source={images.mapDark} style={styles.mapImage} />
        ) : (
          <Image source={images.map} style={styles.mapImage} />
        )}
      </TouchableOpacity>

      <View style={{ marginHorizontal: windowWidth(3) ,marginTop:windowHeight(2)}}>
        {rideDetails.locations && rideDetails.locations.length > 0 && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <View style={{ marginTop: windowHeight(0.3), marginRight: windowWidth(2) }} >
              <Icons.location
                color={isDark ? appColors.secondaryFont : appColors.primaryFont}
              />
            </View>
            <Text style={{ fontFamily: appFonts.medium, color: isDark ? appColors.secondaryFont : appColors.primaryFont }}>
              {rideDetails.locations[0] || '--'}
            </Text>
          </View>
        )}
        <View style={{ width: '95%', borderBottomWidth: 1.5, borderColor: isDark?appColors.darkborder: appColors.border, borderStyle: 'dashed', marginVertical: windowHeight(1), marginLeft: '5%' }} />
        {rideDetails.locations && rideDetails.locations.length > 1 && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <View style={{ marginTop: windowHeight(0.3), marginRight: windowWidth(2) }} >
              <Icons.gps
                color={isDark ? appColors.white : appColors.primaryFont}
              />
            </View>
            <Text style={{ fontFamily: appFonts.medium, color: isDark ? appColors.white : appColors.primaryFont }}>
              {rideDetails.locations[rideDetails.locations.length - 1] || '--'}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}