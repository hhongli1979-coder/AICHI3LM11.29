import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icons from '../../../utils/icons/icons'
import appColors from '../../../theme/appColors'
import styles from './styles'
import { useNavigation, useTheme } from '@react-navigation/native'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'
import { Switch } from '../appSettings/component'
import { useDispatch, useSelector } from 'react-redux'
import { rentalVehicleDetail, rentalVehicleUpdate } from '../../../api/store/action'
import { useValues } from '../../../utils/context'
import FastImage from 'react-native-fast-image'
import Images from '../../../utils/images/images'
import appFonts from '../../../theme/appFonts'
import { AppDispatch } from '../../../api/store'

export function VehicleList() {
  const navigation = useNavigation<any>()
  const [toggleStates, setToggleStates] = useState<any>({})
  const { rentalVehicleList } = useSelector((state: any) => state.rental)
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { viewRtlStyle, isDark, rtl } = useValues()
  const { colors } = useTheme()
  const { translateData } = useSelector((state: any) => state.setting)
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)

  const gotoAdd = () => {
    navigation.navigate('AddVehicle')
  }

  useEffect(() => {
    if (rentalVehicleList?.data) {
      const initialToggleStates: any = {}
      rentalVehicleList.data.forEach((item: any) => {
        initialToggleStates[item.id] = item.status === 1
      })
      setToggleStates(initialToggleStates)
    }
  }, [rentalVehicleList])

  const handleToggle = (id: number) => {
    setToggleStates((prevState: any) => ({
      ...prevState,
      [id]: !prevState[id],
    }))
    dispatch(
      rentalVehicleUpdate({
        rentalVehicleId: id,
        status: toggleStates[id] ? 0 : 1,
      }),
    ).then((res: any) => { })
  }
  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  const gotoUpdate = async (editData: any) => {
    try {
      const res = await dispatch(
        rentalVehicleDetail({ id: editData.id }),
      ).unwrap()

      if (res) {
        navigation.navigate('AddVehicle', { screen: 'editDetails' })
      } else {
      }
    } catch (error) {
    }
  }
  const renderVehicleItem = ({ item }: any) => {
    const isSwitchOn = toggleStates[item.id] || false
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => gotoUpdate(item)}
        style={[
          styles.listContainer,
          { backgroundColor: colors.card },
          { borderColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.titleContainer,
            { flexDirection: viewRtlStyle },
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={[styles.carBrand, { color: colors.text }]}>
            {item.name}
          </Text>
          <Switch
            switchOn={isSwitchOn}
            onPress={() => handleToggle(item.id)}
            background={appColors.closeBg}
          />
        </View>
        <View style={styles.imageView}>
          <Image
            source={{
              uri: item?.normal_image_url,
            }}
            style={styles.carImg}
          />
        </View>
        <View style={[styles.descContainer, { flexDirection: viewRtlStyle }]}>
          <Text style={styles.engineInfo}>{item.description}</Text>
          <Text style={styles.rentPrice}>
            {zoneValue?.currency_symbol}
            {item.vehicle_per_day_price}
            <Text style={styles.perDay}>/{translateData.day}</Text>
          </Text>
        </View>
        <View style={[styles.dashLine, { borderBottomColor: colors.border }]} />
        <View style={[styles.descContainer, { flexDirection: viewRtlStyle }]}>
          <Text style={[styles.driverTitle, { color: colors.text }]}>
            {translateData.driverPrice}
          </Text>
          <Text style={styles.rentPrice}>
            {zoneValue?.currency_symbol}
            {item.driver_per_day_charge}
            <Text style={styles.perDay}>/{translateData.day}</Text>
          </Text>
        </View>
        <View style={[styles.tagContainer, { flexDirection: viewRtlStyle }]}>

          <View
            style={[
              styles.iconBox,
              { flexDirection: viewRtlStyle },
              {
                backgroundColor: isDark
                  ? appColors.primaryFont
                  : appColors.graybackground,
              },
              { marginRight: rtl ? windowWidth(0) : windowWidth(3) },
            ]}
          >
            <Icons.CarType
              color={isDark ? appColors.darkText : appColors.secondaryFont}
            />
            <Text
              style={[
                styles.iconTitle,
                {
                  color: isDark ? appColors.darkText : appColors.secondaryFont,
                },
              ]}
            >
              {capitalizeFirst(item?.vehicle_subtype)}
            </Text>
          </View>

          <View
            style={[
              styles.iconBox1,
              { flexDirection: viewRtlStyle },
              {
                backgroundColor: isDark
                  ? appColors.primaryFont
                  : appColors.graybackground,
              },
              { marginRight: rtl ? windowWidth(3) : windowWidth(3) },
            ]}
          >
            <Icons.FuelType
              color={isDark ? appColors.darkText : appColors.secondaryFont}
            />
            <Text
              style={[
                styles.iconTitle,
                {
                  color: isDark ? appColors.darkText : appColors.secondaryFont,
                },
              ]}
            >
              {capitalizeFirst(item?.fuel_type)}
            </Text>
          </View>

          <View
            style={[
              styles.iconBox,
              { flexDirection: viewRtlStyle },
              {
                backgroundColor: isDark
                  ? appColors.primaryFont
                  : appColors.graybackground,
              },
              { marginRight: rtl ? windowWidth(3) : windowWidth(3) },
            ]}
          >
            <Icons.Milage
              color={isDark ? appColors.darkText : appColors.secondaryFont}
            />
            <Text
              style={[
                styles.iconTitle,
                {
                  color: isDark ? appColors.darkText : appColors.secondaryFont,
                },
              ]}
            >
              {item?.mileage} km/ltr
            </Text>
          </View>

          <View
            style={[
              styles.iconBox,
              { flexDirection: viewRtlStyle },
              {
                backgroundColor: isDark
                  ? appColors.primaryFont
                  : appColors.graybackground,
              },
              { marginRight: rtl ? windowWidth(0) : windowWidth(3) },
            ]}
          >
            <Icons.GearType
              color={isDark ? appColors.darkText : appColors.secondaryFont}
            />
            <Text
              style={[
                styles.iconTitle,
                {
                  color: isDark ? appColors.darkText : appColors.secondaryFont,
                },
              ]}
            >
              {capitalizeFirst(item?.gear_type)}
            </Text>
          </View>

          <View
            style={[
              styles.iconBox1,
              { flexDirection: viewRtlStyle },
              {
                backgroundColor: isDark
                  ? appColors.primaryFont
                  : appColors.graybackground,
              },
              { marginRight: rtl ? windowWidth(3) : windowWidth(3) },
            ]}
          >
            <Icons.CarSeat
              color={isDark ? appColors.darkText : appColors.secondaryFont}
            />
            <Text
              style={[
                styles.iconTitle,
                {
                  color: isDark ? appColors.darkText : appColors.secondaryFont,
                },
              ]}
            >
              {item?.seatingCapacity} {translateData?.seat}
            </Text>
          </View>

          <View
            style={[
              styles.iconBox,
              { flexDirection: viewRtlStyle },
              {
                backgroundColor: isDark
                  ? appColors.primaryFont
                  : appColors.graybackground,
              },
              { marginRight: rtl ? windowWidth(3) : windowWidth(3) },
            ]}
          >
            <Icons.Speed
              color={isDark ? appColors.darkText : appColors.secondaryFont}
            />
            <Text
              style={[
                styles.iconTitle,
                {
                  color: isDark ? appColors.darkText : appColors.secondaryFont,
                },
              ]}
            >
              {item?.vehicle_speed}/h
            </Text>
          </View>

        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={[styles.mainContainer, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.main,
          { flexDirection: viewRtlStyle },
          { backgroundColor: colors.card },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.backIcon, { borderColor: colors.border }]}
          onPress={() => navigation.goBack()}
        >
          <Icons.Back color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {translateData.vehicleList}
        </Text>
        <TouchableOpacity
          onPress={gotoAdd}
          activeOpacity={0.7}
          style={[styles.backIcon, { borderColor: colors.border }]}
        >
          <Icons.Add color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={rentalVehicleList?.data || []}
        renderItem={renderVehicleItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        contentContainerStyle={[
          styles.contentContaine,
          {
            flexGrow: 1,
            justifyContent: rentalVehicleList?.data?.length
              ? 'flex-start'
              : 'center',
            alignItems: rentalVehicleList?.data?.length ? 'stretch' : 'center',
          },
        ]}
        ListEmptyComponent={
          <View style={{ marginBottom: windowHeight(5), alignItems: 'center' }}>
            <FastImage
              source={Images.noVehicle}
              style={{
                height: windowHeight(30),
                width: windowHeight(30),
              }}
              resizeMode="contain"
            />

            <View
              style={{
                flexDirection: viewRtlStyle,
                alignItems: 'center',
                marginTop: windowHeight(2),
              }}
            >
              <Text
                style={{
                  color: isDark ? appColors.white : appColors.black,
                  fontSize: fontSizes.FONT4HALF,
                  fontFamily: appFonts.medium,
                  textAlign: 'center',
                  marginRight: 6,
                }}
              >
                {translateData.EmptyVehicleList}
              </Text>
              <FastImage
                source={Images.infoCircle}
                style={{
                  height: windowHeight(2.5),
                  width: windowHeight(2.5),
                }}
                resizeMode="contain"
              />
            </View>

            <Text
              style={{
                textAlign: 'center',
                paddingHorizontal: windowWidth(5),
                color: appColors.darkBorderBlack,
                marginTop: windowHeight(1),
              }}
            >
              {translateData.Pleasetryrefreshing}
            </Text>
          </View>
        }
      />
    </View >
  )
}
