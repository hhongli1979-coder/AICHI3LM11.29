import React from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'
import Images from '../../../utils/images/images'
import Icons from '../../../utils/icons/icons'
import { useAppNavigation } from '../../../utils/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { dashBoardData } from '../../../api/store/action'
import { AppDispatch } from '../../../api/store'
import { useValues } from '../../../utils/context'

export function FleetDashBoard() {
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)
  const dispatch = useDispatch<AppDispatch>()
  const { navigate } = useAppNavigation();
  const { fleetDriver } = useSelector((state: any) => state.fleet)
  const { isDark } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)

  const gotoDriverDashboard = (driverData: any) => {
    const unit = zoneValue?.distance_type
    const zoneId = zoneValue?.id
    const driver_id = driverData?.id
    dispatch(dashBoardData({ unit, zoneId, driver_id }))
    navigate('FleetDriverDashBoard', { driverData })
  }

  const DriverCard = ({ name, email, driverData }: { name: string, email: string, driverData: any }) => (
    <TouchableOpacity
      style={{
        backgroundColor: isDark?appColors.darkThemeSub: appColors.white,
        borderWidth: windowHeight(0.1),
        borderColor:isDark?appColors.darkborder: appColors.border,
        width: '89%',
        marginTop: windowHeight(2),
        alignSelf: 'center',
        borderRadius: windowHeight(0.9),
        bottom: windowHeight(2),
        paddingVertical: windowHeight(1.8),
      }}
      onPress={() => gotoDriverDashboard(driverData)}
    >
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: windowHeight(2),
        }}
      >
        <Image
          source={Images.user}
          resizeMode="contain"
          style={{ height: windowHeight(6.5), width: windowHeight(6.5) }}
        />
        <View style={{ flexDirection: 'column', flex: 1, marginHorizontal: windowWidth(2), justifyContent: 'center' }}>
          <Text
            style={{
              color: isDark?appColors.white: appColors.black,
              fontFamily: appFonts.medium,
              fontSize: fontSizes.FONT3SMALL,
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              color: appColors.iconColor,
              fontFamily: appFonts.medium,
              fontSize: fontSizes.FONT3SMALL,
              marginTop: windowHeight(0.5),
            }}
          >
            {email}
          </Text>
        </View>
      </View>

      <View
        style={{
          borderWidth: windowHeight(0.1),
          borderColor: isDark?appColors.darkborder: appColors.border,
          width: '90%',
          alignSelf: 'center',
          marginVertical: windowHeight(1.5),

        }}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: windowWidth(4),
        }}
      >
        <View
        >
          <Text style={{
            color: appColors.iconColor, fontFamily: appFonts.regular,
            fontSize: fontSizes.FONT3HALF
          }}>{translateData.totalReviews}:</Text>
        </View>

        <View
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <Text style={{
            color: appColors.iconColor, fontFamily: appFonts.regular,
            fontSize: fontSizes.FONT3HALF
          }}>{translateData.totalEarning}:</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: windowWidth(3.5), marginTop: windowHeight(0.4) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {Array.from({ length: 5 }).map((_, index) => {
            const full = index + 1 <= driverData?.rating;
            const half = index + 0.5 <= driverData?.rating && index + 1 > driverData?.rating;

            if (full) return <Icons.RatingStar key={index} />;
            if (half) return <Icons.RatingHalfStar key={index} />;
            return <Icons.RatingEmptyStar key={index} />;
          })}
          <Text style={{ left: windowHeight(1), color: isDark?appColors.white: appColors.black, fontSize: fontSizes.FONT3, fontFamily: appFonts.regular }}>{driverData?.rating_count}</Text>
          <Text style={{ marginHorizontal: windowHeight(1.5), color: appColors.iconColor, fontSize: fontSizes.FONT3, fontFamily: appFonts.regular }}>({driverData?.review_count})</Text>
        </View>
        <Text style={{ color: appColors.primary, fontFamily: appFonts.bold, fontSize: fontSizes.FONT4 }}>{driverData?.wallet_balance}</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ marginBottom: windowHeight(0), backgroundColor: isDark ? appColors.bgDark : appColors.lightGray }}
    >
      <View>
        <View
          style={{ backgroundColor: isDark ? appColors.darkThemeSub : appColors.white, height: windowHeight(10) }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: windowHeight(3),
              marginTop: windowHeight(2),
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: isDark ? appColors.white : appColors.primaryFont,
                fontFamily: appFonts.medium,
                fontSize: fontSizes.FONT5,
              }}
            >
              {translateData.drivers}
            </Text>
            <View
              style={{
                backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                borderColor: isDark ? appColors.darkBorderBlack : appColors.border,
                borderWidth: windowHeight(0.1),
                width: windowHeight(5.5),
                height: windowHeight(5.5),
                borderRadius: windowHeight(3),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icons.Notification color={isDark ? appColors.white : appColors.black} />
            </View>
          </View>
        </View>


        <View
          style={{
            marginTop: windowHeight(2.6),

          }}
        >
          {fleetDriver?.data && fleetDriver.data.length > 0 ? (
            fleetDriver.data.map((driver: any) => (
              <DriverCard key={driver.id} {...driver} driverData={driver} />
            ))
          ) : (
            <View style={{ alignItems: 'center', marginTop: windowHeight(8) }}>
              <Image source={Images.noVehicle} style={{ height: windowHeight(40), width: windowHeight(40), resizeMode: 'contain' }} />
              <Text style={{
                color: isDark ? appColors.white : appColors.primaryFont,
                fontFamily: appFonts.medium,
                fontSize: fontSizes.FONT4HALF
              }}>
                {translateData.noDataFound}
              </Text>
              <Text style={{ textAlign: 'center', fontFamily: appFonts.regular, marginTop: windowHeight(1), color: appColors.secondaryFont, }}>{translateData.noDataDesc}</Text>
            </View>
          )}
        </View>

      </View>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    marginTop: windowHeight(2.6),
    backgroundColor: appColors.white,
    marginHorizontal: windowHeight(2.5),
    borderRadius: windowHeight(0.8),
    paddingBottom: windowHeight(2.3),
    borderWidth: windowHeight(0.1),
    borderColor: appColors.border,
  },
  centerText: {
    position: 'absolute',
    top: '34%',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.FONT3HALF,
    color: appColors.black,
    fontFamily: appFonts.medium,
  },
  count: {
    fontSize: fontSizes.FONT4HALF,
    fontFamily: appFonts.bold,
    color: appColors.primary,
    top: '15%',
  },
  legendValue: {
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: windowHeight(4),
    width: '100%',
    backgroundColor: appColors.white,
  },
  statusBox: {
    alignItems: 'center',
  },
  statusTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: windowHeight(1.6),
    height: windowHeight(0.6),
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabel: {
    fontSize: fontSizes.FONT3HALF,
    color: appColors.iconColor,
    fontFamily: appFonts.regular,
  },
  statusValue: {
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.regular,
    color: appColors.black,
    left: windowWidth(2.8),
  },
})
