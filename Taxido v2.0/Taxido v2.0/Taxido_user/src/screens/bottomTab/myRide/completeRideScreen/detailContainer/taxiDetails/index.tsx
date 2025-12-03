import { Image, Text, View } from 'react-native';
import React from 'react';
import { commonStyles } from '../../../../../../styles/commonStyle';
import { external } from '../../../../../../styles/externalStyle';
import { styles } from './styles';
import { useValues } from '@src/utils/context/index';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { Ac, Bag, PlatNumber, Right, Star1 } from '@src/utils/icons';
import { taxidetailsObject, vehicleInterface } from '@src/api/interface/vehicleTypeInterface';
import { CarType } from '@src/assets/icons/carType';
import { FuelType } from '@src/assets/icons/fuelType';
import { Milage } from '@src/assets/icons/milage';
import { GearType } from '@src/assets/icons/gearType';
import { Seat } from '@src/assets/icons/seat';
import { Speed } from '@src/assets/icons/speed';
import { useSelector } from 'react-redux';

type taxidetailsProps = {
  paddingHorizontal: any;
  texiDetail?: taxidetailsObject;
  vehicleData?: vehicleInterface;
};

export function TaxiDetails({ paddingHorizontal, texiDetail }: taxidetailsProps) {
  const { viewRTLStyle, textRTLStyle, isDark, bgFullStyle } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);
  const { zoneValue } = useSelector((state: any) => state.zone);

  return (
    <View>
      {texiDetail?.rental_vehicle ? (
        <View>
          <View
            style={[
              styles.container,
              {
                backgroundColor: bgFullStyle,
                flexDirection: viewRTLStyle,
              },
            ]}>
            <View
              style={{
                flexDirection: viewRTLStyle,
                alignItems: 'center',
                paddingVertical: windowHeight(2),
                paddingHorizontal: windowWidth(15),
              }}>
              <View
                style={[
                  styles.vehicleContainer1,
                  { backgroundColor: bgFullStyle },
                ]}>
                <Image
                  style={styles.imgContainer1}
                  source={{
                    uri: texiDetail?.rental_vehicle?.normal_image?.original_url,
                  }}
                />
              </View>
              <View style={{ flex: 1, marginStart: windowWidth(3) }}>
                <View
                  style={{
                    flexDirection: viewRTLStyle,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.vehicleText,
                      {
                        color: isDark
                          ? appColors.whiteColor
                          : appColors.primaryText,
                        textAlign: textRTLStyle,
                      },
                    ]}
                    numberOfLines={1}>
                    {texiDetail?.rental_vehicle.name}
                  </Text>

                  <View
                    style={{ flexDirection: viewRTLStyle, alignItems: 'center' }}>
                    <Star1 />
                    <Text style={styles.rating}>4.6</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.platNumberView,
                    { flexDirection: viewRTLStyle },
                  ]}>
                  <PlatNumber />
                  <Text
                    style={[
                      styles.vehicle_info,
                      {
                        textAlign: textRTLStyle,
                      },
                    ]}>
                    {texiDetail?.driver?.vehicle_info?.plate_number}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.descContainer, { flexDirection: viewRTLStyle }]}>
            <Text style={styles.engineInfo}>
              {texiDetail?.rental_vehicle.description}
            </Text>
            <Text style={styles.rentPrice}>
              {zoneValue.currency_symbol}
              {texiDetail?.rental_vehicle.vehicle_per_day_price * zoneValue?.exchange_rate}
              <Text
                style={{
                  color: appColors.gray,
                  fontFamily: appFonts.medium,
                  fontSize: fontSizes.FONT19,
                }}>
                /{translateData.day}
              </Text>
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: windowWidth(19),
              marginTop: windowHeight(9),
            }}>
            <View
              style={{
                borderBottomWidth: windowHeight(1),
                borderStyle: 'dashed',
                borderColor: isDark ? appColors.darkBorder : appColors.border,
              }}
            />
            <View
              style={{
                flexDirection: viewRTLStyle,
                justifyContent: 'space-between',
                marginTop: windowHeight(9),
              }}>
              <Text
                style={{
                  color: isDark ? appColors.whiteColor : appColors.primaryText,
                  fontFamily: appFonts.semiBold,
                  fontSize: fontSizes.FONT20,
                }}>
                {translateData.driverPriceText}
              </Text>
              <View style={{ flexDirection: viewRTLStyle }}>
                <Text
                  style={{
                    color: appColors.price,
                    fontFamily: appFonts.medium,
                    fontSize: fontSizes.FONT19,
                  }}>
                  {zoneValue.currency_symbol}
                  {texiDetail?.rental_vehicle.driver_per_day_charge * zoneValue?.exchange_rate}
                </Text>
                <Text
                  style={{
                    color: appColors.gray,
                    fontFamily: appFonts.medium,
                    fontSize: fontSizes.FONT19,
                  }}>
                  {translateData.days}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: windowHeight(1),
                borderStyle: 'dashed',
                borderColor: isDark ? appColors.darkBorder : appColors.border,
                marginTop: windowHeight(9),
              }}
            />
          </View>
          <View style={[styles.tagContainer, { flexDirection: viewRTLStyle }]}>
            <View
              style={[
                { flexDirection: viewRTLStyle },
                styles.iconView,
                {
                  backgroundColor: isDark
                    ? appColors.bgDark
                    : appColors.lightGray,
                },
              ]}>
              {' '}
              <CarType />
              <Text style={styles.iconTitle}>
                {texiDetail?.rental_vehicle.vehicle_subtype}
              </Text>
            </View>
            <View
              style={[
                { flexDirection: viewRTLStyle },
                styles.iconView,
                {
                  backgroundColor: isDark
                    ? appColors.bgDark
                    : appColors.lightGray,
                },
              ]}>
              {' '}
              <FuelType />
              <Text style={styles.iconTitle}>
                {texiDetail?.rental_vehicle.fuel_type}
              </Text>
            </View>
            <View
              style={[
                { flexDirection: viewRTLStyle },
                styles.iconView,
                {
                  backgroundColor: isDark
                    ? appColors.bgDark
                    : appColors.lightGray,
                },
              ]}>
              {' '}
              <Milage />
              <Text style={styles.iconTitle}>
                {texiDetail?.rental_vehicle.mileage}km/ltr
              </Text>
            </View>
            <View
              style={[
                { flexDirection: viewRTLStyle },
                styles.iconView,
                {
                  backgroundColor: isDark
                    ? appColors.bgDark
                    : appColors.lightGray,
                },
              ]}>
              {' '}
              <GearType />
              <Text style={styles.iconTitle}>
                {texiDetail?.rental_vehicle.gear_type}
              </Text>
            </View>
            <View
              style={[
                { flexDirection: viewRTLStyle },
                styles.iconView,
                {
                  backgroundColor: isDark
                    ? appColors.bgDark
                    : appColors.lightGray,
                },
              ]}>
              {' '}
              <Seat />
              <Text style={styles.iconTitle}>
                {texiDetail?.rental_vehicle.seatingCapacity}{' '}
                {translateData.seat}
              </Text>
            </View>
            <View
              style={[
                { flexDirection: viewRTLStyle },
                styles.iconView,
                {
                  backgroundColor: isDark
                    ? appColors.bgDark
                    : appColors.lightGray,
                },
              ]}>
              <Speed />
              <Text style={styles.iconTitle}>
                {texiDetail?.rental_vehicle.vehicle_speed}/h
              </Text>
            </View>
            <View
              style={[
                { flexDirection: viewRTLStyle },
                styles.iconView,
                {
                  backgroundColor: isDark
                    ? appColors.bgDark
                    : appColors.lightGray,
                },
              ]}>
              {' '}
              <Ac />
              <Text style={styles.iconTitle}>
                {texiDetail?.rental_vehicle.vehicle_speed}/h
              </Text>
            </View>
            <View
              style={[
                { flexDirection: viewRTLStyle },
                styles.iconView,
                {
                  backgroundColor: isDark
                    ? appColors.bgDark
                    : appColors.lightGray,
                },
              ]}>
              {' '}
              <Bag />
              <Text style={styles.iconTitle}>
                {texiDetail?.rental_vehicle.vehicle_speed}/h
              </Text>
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: windowHeight(1),
              borderStyle: 'dashed',
              borderColor: isDark ? appColors.darkBorder : appColors.border,
              bottom: windowHeight(8),
              marginHorizontal: windowWidth(19),
            }}
          />
          <Text
            style={{
              color: isDark ? appColors.whiteColor : appColors.primaryText,
              fontFamily: appFonts.semiBold,
              fontSize: fontSizes.FONT20,
              textAlign: textRTLStyle,
              marginHorizontal: windowWidth(18),
              marginTop: windowHeight(2),
            }}>
            {translateData.MoreTextInformation}
          </Text>

          <View
            style={{
              marginHorizontal: windowWidth(19),
              marginTop: windowHeight(5),
            }}>
            {texiDetail?.rental_vehicle?.interior?.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: viewRTLStyle,
                  alignItems: 'center',
                  marginBottom: windowHeight(5),
                }}>
                <Right />
                <Text
                  style={{
                    color: '#797D83',
                    marginHorizontal: windowWidth(12),
                    fontFamily: appFonts.regular,
                    fontSize: fontSizes.FONT18,
                  }}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.container,
            { paddingHorizontal: paddingHorizontal },
            {
              backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor,
              flexDirection: viewRTLStyle,
            },
          ]}>
          <View style={[styles.vehicleContainer, { backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray }]}>
            <Image
              style={styles.imgContainer}
              source={{
                uri:
                  texiDetail?.service?.service_type === "ambulance"
                    ? texiDetail?.ambulance_image_url
                    : texiDetail?.vehicle_type?.vehicle_image_url,
              }}
            />
          </View>
          <View style={{ flexDirection: viewRTLStyle }}>
            <View style={styles.vehicleView}>
              <Text
                style={[
                  external.mt_3,
                  {
                    textAlign: 'center',
                    fontFamily: appFonts.regular,
                    fontSize: fontSizes.FONT20,
                    color: isDark ? appColors.darkText : appColors.regularText,
                    marginHorizontal: windowHeight(5),

                  },
                ]}>
                {texiDetail?.color}{texiDetail?.vehicle_model}
              </Text>
              <View
                style={[styles.platNumberView, { flexDirection: viewRTLStyle }]}>
                <Text
                  style={[
                    styles.vehicle_info,
                    commonStyles.mediumTextBlack,
                    external.as_end,
                    { textAlign: textRTLStyle, fontSize: fontSizes.FONT25 },
                    {
                      color: appColors.primary,
                    }
                  ]}>
                  {texiDetail?.plate_number}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
