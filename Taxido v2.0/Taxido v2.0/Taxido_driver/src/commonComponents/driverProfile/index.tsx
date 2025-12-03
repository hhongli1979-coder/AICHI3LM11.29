import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import Icons from '../../utils/icons/icons'
import commanStyle from '../../style/commanStyles'
import styles from './styles'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../utils/context'
import { fontSizes, windowHeight, windowWidth } from '../../theme/appConstant'
import appColors from '../../theme/appColors'
import appFonts from '../../theme/appFonts'
import { useAppNavigation } from '../../utils/navigation'
import { DriverProfileProps } from './type'
import { useSelector } from 'react-redux'

export function DriverProfile({ borderRadius, userDetails, rideDetails,istrue }: DriverProfileProps | any) {

  const navigation: any = useAppNavigation()
  const { colors } = useTheme()
  const { viewRtlStyle, isDark, rtl } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)

  const [status, setStatus] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (rideDetails?.ride_status?.name) {
      setStatus(rideDetails?.ride_status?.name)
    }
  }, [rideDetails])

  if (!rideDetails || !rideDetails?.rider || !rideDetails?.ride_status) {
    return null
  }

  const gotoChat = () => {
    navigation.navigate('Chat', {
      driverId: rideDetails?.driver?.id,
      riderId: rideDetails?.rider?.id,
      rideId: rideDetails?.id,
      riderName: rideDetails?.rider?.name,
      riderImage: rideDetails?.rider?.profile_image?.original_url,
    })
  }

  const gotoCall = () => {
    const phoneNumber = rideDetails?.rider.phone
    Linking.openURL(`tel:${phoneNumber}`)
  }

  return (
    <View
      style={[
        styles.profile,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.subProfile, { flexDirection: viewRtlStyle }]}>
        {rideDetails?.rider?.driver_profile_image_url ? (
          <Image
            source={{ uri: rideDetails?.rider?.driver_profile_image_url }}
            style={[styles.userImage, { borderRadius: borderRadius }]}
          />
        ) : (
          <View
            style={[
              styles.userImage,
              {
                borderRadius: borderRadius,
                backgroundColor: appColors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
          >
            <Text
              style={{
                fontSize: fontSizes.FONT4HALF,
                fontFamily: appFonts.bold,
                color: appColors.white,
              }}
            >
              {rideDetails?.rider?.name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        )}

        <View>
          <View
            style={[
              commanStyle.directionRow,
              { flexDirection: viewRtlStyle, marginHorizontal: windowWidth(2) },
            ]}
          >
            <Text
              style={[
                styles.userName,
                { color: colors.text },
                { left: rtl ? windowWidth(1.6) : windowWidth(2) },
              ]}
            >
              {userDetails?.name || rideDetails?.rider?.name}
            </Text>
          </View>

          <View style={{ flexDirection: viewRtlStyle }}>
            <View style={[styles.starContainer, { flexDirection: viewRtlStyle }]}>
              {Array.from({ length: 5 }).map((_, index) => {
                const fullStarThreshold = index + 1
                const halfStarThreshold = index + 0.5
                if (rideDetails?.driver?.rating_count >= fullStarThreshold) {
                  return <Icons.RatingStar key={index} />
                } else if (rideDetails?.driver?.rating_count >= halfStarThreshold) {
                  return <Icons.RatingHalfStar key={index} />
                } else {
                  return <Icons.RatingEmptyStar key={index} />
                }
              })}
              <View style={{ flexDirection: viewRtlStyle }}>
                <Text
                  style={[
                    commanStyle.totalReview,
                    {
                      color: isDark ? appColors.white : appColors.primaryFont,
                      left: windowWidth(0.5),
                      top: windowHeight(0.1),
                    },
                  ]}
                >
                  {Number(rideDetails?.driver?.rating_count).toFixed(1)}
                </Text>
                <Text
                  style={{
                    color: appColors.secondaryFont,
                    left: windowWidth(0.5),
                    top: windowHeight(0.4),
                  }}
                >
                  ({rideDetails?.driver?.review_count})
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {status !== 'Completed' &&!istrue&& (
        <View
          style={[
            commanStyle.containerBtn,
            { flexDirection: viewRtlStyle },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              height: windowHeight(5.5),
              backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
              width: '85%',
              borderRadius: windowHeight(0.8),
              justifyContent: 'center',
            }}
            onPress={gotoChat}
          >
            <Text
              style={{
                fontFamily: appFonts.regular,
                marginHorizontal: windowWidth(2),
                color: isDark ? appColors.white : appColors.black,
              }}
            >
              {translateData.sendaMsg}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              commanStyle.iconButton,
              { backgroundColor: appColors.primary },
            ]}
            activeOpacity={0.7}
            onPress={gotoCall}
          >
            <Icons.Call color={appColors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
