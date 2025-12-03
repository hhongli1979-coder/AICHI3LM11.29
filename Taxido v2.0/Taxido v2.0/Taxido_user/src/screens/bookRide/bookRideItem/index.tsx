import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { useEffect, memo } from 'react';
import { external } from '../../../styles/externalStyle';
import { styles } from '../styles';
import { commonStyles } from '../../../styles/commonStyle';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { Info, UserFillSmall } from '@src/utils/icons';
import { BookRideItemType, ItemType } from './types';
import { useValues } from '@src/utils/context/index';

export const BookRideItem = memo(function BookRideItem({ item, onPress, isSelected, onPressAlternate, isDisabled,
  couponsData, onPriceCalculated, selectedPrefsValue }: BookRideItemType) {
  const { bgFullLayout, isDark } = useValues();

  const originalFare = Number(item?.charges?.total ?? 0);
  if (originalFare <= 0) return null;

  const prefsTotal = isSelected && Array.isArray(selectedPrefsValue)
    ? selectedPrefsValue.reduce((sum, pref) => sum + Number(pref.price ?? 0), 0)
    : 0;

  let finalFare = Number((originalFare + prefsTotal).toFixed(2));

  const isCouponApplicable =
    couponsData?.success &&
    (couponsData?.is_apply_all === 1 || couponsData?.applicable_vehicles?.includes(item?.id));

  let discountedFare = originalFare;
  let couponSaving = 0;

  if (isCouponApplicable) {
    const discountValue = `${couponsData?.amount ?? 0}`;
    const flatValue = couponsData?.total_coupon_discount ?? 0;

    if (couponsData?.coupon_type === 'percentage') {
      couponSaving = originalFare * (Number(discountValue) / 100);
    } else {
      couponSaving = flatValue;
    }

    couponSaving = Number(couponSaving.toFixed(2));

    discountedFare = Math.max(0, Number((originalFare - couponSaving).toFixed(2)));

    // Add preferences price only for selected vehicle
    if (isSelected) {
      discountedFare = Number((discountedFare + prefsTotal).toFixed(2));
    }
  }

  // Decide final price to show and send in callback
  const finalPrice = isCouponApplicable ? discountedFare : finalFare;

  useEffect(() => {
    if (onPriceCalculated) {
      onPriceCalculated(item?.id, finalPrice);
    }
  }, [finalPrice, selectedPrefsValue, isSelected]);

  const handlePress = (item: ItemType | any) => {
    if (isSelected) {
      onPressAlternate?.(item);
    } else {
      onPress?.(item);
    }
  };


  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? isDark?appColors.bgDark:appColors.lightGray : isDark ? bgFullLayout : appColors.whiteColor,
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: windowWidth(80),
          marginVertical:windowHeight(2)
        },
      ]}
      onPress={() => handlePress(item)}
      disabled={isDisabled}
    >
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: windowWidth(60),
            width: windowWidth(90),
            backgroundColor: isSelected ? isDark?appColors.bgDark:appColors.whiteColor : isDark ? bgFullLayout : appColors.lightGray,
            margin: windowHeight(7.5),
            borderRadius: windowHeight(4),
            borderWidth: 1,
            borderColor: isSelected ? appColors.primary : isDark ? appColors.darkPrimary : appColors.lightGray,
          }}
        >
          <Image
            style={[
              styles.img,
              isDisabled && !isSelected && { opacity: 0.5 },
            ]}
            source={{ uri: item?.vehicle_image_url }}
          />
        </View>

        <View style={[external.js_space, external.mh_5, external.mv_5, { height: windowHeight(30), marginTop: windowHeight(7.5) }]}>
          <View style={external.fd_row}>
            <Text
              style={[
                styles.vehicleName,
                { fontFamily: isSelected ? appFonts.medium : appFonts.regular },
               {color:isDark?appColors.iconColor: appColors.primaryText}
              ]}
            >
              {item?.name}
            </Text>
            <View style={[external.fd_row, { alignItems: 'center', marginHorizontal: windowWidth(3) }]}>
              <UserFillSmall />
              <Text
                style={[
                  commonStyles.regularText,
                  styles.vehicleName,
           {color:isDark?appColors.iconColor: appColors.primaryText} 
                ]}
              >
                {item?.max_seat}
              </Text>
            </View>
          </View>
          <View style={[external.fd_row, { alignItems: 'center', }]}>
            <Text
              style={[
                commonStyles.regularText,
                {
                  fontSize: fontSizes.FONT16,
                  color: appColors.regularText,
                },
              { color:isDark?appColors.darkText: appColors.primaryText, fontFamily: appFonts.regular },
              ]}
            >
              {item?.description}
            </Text>
          </View>
        </View>
      </View>


      <View style={{ marginHorizontal: windowWidth(12), marginBottom: windowWidth(5) }}>
        {isCouponApplicable ? (
          <View style={{ marginTop: windowHeight(5) }}>
            <Text
              style={{
                fontFamily: appFonts.regular,
                fontSize: fontSizes.FONT17,
                textDecorationLine: 'line-through',
                color: appColors.primaryText,
              }}
            >
              {item?.currency_symbol}{originalFare.toFixed(2)}
            </Text>
            <Text
              style={{
                fontFamily: isSelected ? appFonts.medium : appFonts.regular,
                fontSize: fontSizes.FONT22,
                color: appColors.price,
              }}
            >
              {item?.currency_symbol}{discountedFare.toFixed(2)}
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: windowHeight(5) }}>
            <Text
              style={{
                fontFamily: isSelected ? appFonts.medium : appFonts.regular,
                fontSize: isSelected ? fontSizes.FONT22 : fontSizes.FONT20,
                color: isDark ? appColors.darkText : appColors.primaryText,
                marginHorizontal: windowWidth(5),
              }}
            >
              {item?.currency_symbol}{finalFare.toFixed(2)}
            </Text>
            <View>
              <Info />
            </View>
          </View>
        )}
      </View>

      {isDisabled && !isSelected && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: appColors.transparentBlack,
            borderRadius: styles.container.borderRadius,
          }}
          pointerEvents="none"
        />
      )}
    </TouchableOpacity>
  );
});





