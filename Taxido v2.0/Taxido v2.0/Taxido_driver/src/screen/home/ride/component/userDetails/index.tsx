import { View, Text, Image } from 'react-native'
import React from 'react'
import Icons from '../../../../../utils/icons/icons'
import appColors from '../../../../../theme/appColors'
import commanStyles from '../../../../../style/commanStyles'
import styles from './styles'
import { AddressData } from '../../../../../commonComponents'
import { useValues } from '../../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import appFonts from '../../../../../theme/appFonts'
import { fontSizes } from '../../../../../theme/appConstant'

interface UserDetailsProps {
  RideData: any
}

export function UserDetails({ RideData }: UserDetailsProps) {
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)
  const { viewRtlStyle, isDark } = useValues()
  const { colors } = useTheme()


  const date = new Date(RideData?.created_at)

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }
  const formattedDate = date
    .toLocaleDateString('en-US', options)
    .replace(/,/g, '')

    const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <View
      style={[
        styles.additionalSection,
        {  backgroundColor: colors.background,  borderColor: colors.border },
      ]}
    >
      <View style={[styles.profile, { flexDirection: viewRtlStyle }]}>
        <View style={[styles.subProfile, { flexDirection: viewRtlStyle }]}>
          {RideData?.rider?.profile_image?.original_url ? (
            <Image
              source={{ uri: RideData.rider.profile_image.original_url }}
              style={styles.userImage}
            />
          ) : (
            <View style={[styles.userImage, styles.initialCircle]}>
              <Text style={{
                fontSize: fontSizes.FONT3HALF,
                color: appColors.white,
                fontFamily: appFonts.bold,
              }}>
                {RideData?.rider?.name?.charAt(0)?.toUpperCase() || 'D'}
              </Text>
            </View>
          )}
          <View style={styles.riderDataView}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {RideData?.rider.name}
            </Text>
            <View style={{ flexDirection: viewRtlStyle }}>
              {Array.from({ length: 5 }).map((_, index) => {
                const fullStarThreshold = index + 1
                const halfStarThreshold = index + 0.5
                if (RideData?.rider?.rating_count >= fullStarThreshold) {
                  return <Icons.RatingStar key={index} />
                } else if (RideData?.rider?.rating_count >= halfStarThreshold) {
                  return <Icons.RatingHalfStar key={index} />
                } else {
                  return <Icons.RatingEmptyStar key={index} />
                }
              })}
              <Text
                style={[
                  styles.rating_count,
                  {
                    color: isDark ? appColors.white : appColors.primaryFont,
                  },
                ]}
              >
                {RideData?.rider?.rating_count}
              </Text>
              <Text style={styles.reviews_count}>
                ({RideData?.rider?.reviews_count})
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.price}>
          {zoneValue?.currency_symbol}
          {RideData?.total}
        </Text>
      </View>

      <View
        style={[
          styles.date,
          { backgroundColor: colors.background, flexDirection: viewRtlStyle },
        ]}
      >
        <View style={[styles.iconView, { flexDirection: viewRtlStyle }]}>
          <View style={[styles.iconView, { flexDirection: viewRtlStyle }]}>
            <Icons.CalanderSmall />
            <Text style={styles.formattedDate}>{formattedDate}</Text>
          </View>
          <View
            style={[
              styles.clockBorder,
              {
                borderColor: colors.border,
              },
            ]}
          />
          <View style={[styles.iconView, { flexDirection: viewRtlStyle }]}>
            <Icons.Clock />
            <Text style={styles.formattedTime}>{formattedTime}</Text>
          </View>
        </View>
        <View
          style={[commanStyles.directionRow, { flexDirection: viewRtlStyle }]}
        >
          <View style={styles.spaceTop}>
            <Icons.location color={appColors.primary} />
          </View>
          <Text style={styles.distance}>
            {' '}
            {parseFloat(RideData?.distance).toFixed(1)}
          </Text>
          <Text style={styles.distance}> {RideData?.distance_unit}</Text>
        </View>
      </View>

      <View style={[styles.address, { flexDirection: viewRtlStyle }]}>
        <AddressData locationDetails={RideData?.locations} />
      </View>
    </View>
  )
}
