import React from 'react'
import { View, Text, Image, FlatList, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import { Header } from '../../../../commonComponents'
import {
  fontSizes,
  windowHeight,
  windowWidth,
} from '../../../../theme/appConstant'
import appColors from '../../../../theme/appColors'
import appFonts from '../../../../theme/appFonts'
import Images from '../../../../utils/images/images'
import { useValues } from '../../../../utils/context'

export function ReferralList() {
  const { referralList } = useSelector((state: any) => state.refer)
  const referralData = referralList?.data?.data || []
  const { isDark } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)

  const renderItem = ({ item }: any) => {
    const referredUser = item?.referred || {}
    const status = item?.status || ''
    const isPending = status === 'pending'

    const statusColor = isPending ? '#FFB400' : '#28A745' // yellow or green
    const bgColor = isPending ? '#FFF7E5' : '#E8F4F1' // light yellow or light green

    return (
      <View style={styles.itemContainer}>
        {!item?.referred?.profile_image_url ? (
          <View style={styles.userImage1}>
            <Text
              style={[
                styles.nameText,
                { fontSize: fontSizes.FONT5, color: appColors.white },
              ]}
            >
              {referredUser?.name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: item?.referred?.profile_image_url }}
            style={styles.userImage}
            resizeMode="cover"
          />
        )}

        <View style={styles.textContainer}>
          <Text style={styles.nameText}>
            {referredUser?.name || translateData.unknownUser}
          </Text>
          {item?.referrer_bonus_amount > 0 && (
            <Text style={styles.amountText}>
              +{item?.referrer_bonus_amount}
            </Text>
          )}{' '}
        </View>

        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: bgColor,
              paddingHorizontal: windowWidth(5),
              paddingVertical: windowHeight(1),
              borderRadius: windowHeight(7),
            },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Header title={translateData.referralsList} />
      <FlatList
        data={referralData}
        keyExtractor={item => item.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: windowHeight(2) }}
        ItemSeparatorComponent={() => (
          <View style={{ marginVertical: windowHeight(1) }} />
        )}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
              marginTop: windowHeight(11),
            }}
          >
            <Image
              source={isDark ? Images.noReferralDark : Images.noReferrals}
              style={{
                height: windowHeight(45),
                width: windowWidth(85),
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontFamily: appFonts.bold,
                fontSize: fontSizes.FONT4HALF,
                color: isDark ? appColors.white : appColors.black,
              }}
            >
              {translateData.noReferralList}{' '}
            </Text>
            <Text
              style={{
                fontFamily: appFonts.regular,
                color: appColors.secondaryFont,
                textAlign: 'center',
                marginTop: windowHeight(1.2),
              }}
            >
              {translateData.noReferralDetail}
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appColors.white,
    padding: windowHeight(2),
    borderRadius: windowHeight(0.8),
    borderWidth: windowHeight(0.1),
    borderColor: appColors.border,
  },
  userImage: {
    height: windowHeight(6),
    width: windowHeight(6),
    borderRadius: windowHeight(7),
  },
  userImage1: {
    height: windowHeight(6),
    width: windowHeight(6),
    borderRadius: windowHeight(6),
    backgroundColor: appColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: windowWidth(3),
  },
  nameText: {
    fontSize: fontSizes.FONT4,
    color: appColors.primary,
    fontFamily: appFonts.medium,
  },
  amountText: {
    fontSize: fontSizes.FONT3HALF,
    color: appColors.primary,
    fontFamily: appFonts.regular,
    marginTop: 2,
  },
  statusContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.medium,
  },
})
