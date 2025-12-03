import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header, notificationHelper } from '@src/commonComponent';
import styles from './styles';
import { rentalVehicleList } from '@src/api/store/actions';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Images from '@src/utils/images';
import { Ac, Bag, Info, Star1 } from '@src/utils/icons';
import { Speed } from '@src/assets/icons/speed';
import { Seat } from '@src/assets/icons/seat';
import { GearType } from '@src/assets/icons/gearType';
import { Milage } from '@src/assets/icons/milage';
import { FuelType } from '@src/assets/icons/fuelType';
import { CarType } from '@src/assets/icons/carType';
import { useValues } from '@src/utils/context/index';
import { appColors } from '@src/themes';
import { rentalVehicleListDetsils } from '@src/api/store/actions/index';
import { clearValue } from '@src/utils/localstorage';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from '@reduxjs/toolkit';

interface VehicleItemProps {
  item: any;
  isSelected: boolean;
  isDark: boolean;
  onPress: (item: any) => void;
  appColors: any;
  styles: any;
}

interface VehicleDetailProps {
  item: any;
  isDark: boolean;
  viewRTLStyle: any;
  onPress: (id: any) => void;
  appColors: any;
  styles: any;
  translateData: any;
  zoneValue: any;
}

// Define route params type
type RentalVehicleSelectRouteProp = RouteProp<{
  RentalVehicleSelect: {
    startDate: string;
    pickUpCoords: { lat: number; lng: number };
    pickupLocation: string;
    dropLocation: string;
    dropCoords: { lat: number; lng: number };
    categoryId: string;
    endDate: string;
    startTime: string;
    endTime: string;
    getDriver: boolean;
  };
}, 'RentalVehicleSelect'>;

// Define state types
interface RootState {
  setting: {
    translateData: any;
  };
  zone: {
    zoneValue: any;
  };
  rentalVehicle: {
    rentalVehicleData: any[];
    rentalVehicleLists: any;
    loading: boolean;
  };
}

// Memoized components to prevent unnecessary re-renders
const VehicleItem = React.memo(({ item, isSelected, isDark, onPress, appColors, styles }: VehicleItemProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => onPress(item)}
    style={[
      [
        styles.vehicleItem,
        {
          backgroundColor: isDark
            ? appColors.darkPrimary
            : appColors.whiteColor,
          borderColor: isDark ? appColors.darkBorder : appColors.border,
        },
      ],
      isSelected && styles.selectedVehicleItem,
    ]}>
    <Image
      source={{
        uri: item.vehicle_image_url,
      }}
      style={styles.vehicleImage}
    />
    <View
      style={[
        styles.border,
        { borderColor: isDark ? appColors.darkBorder : appColors.border },
      ]}
    />
    <Text
      style={[
        styles.vehicleName,
        { color: isDark ? appColors.whiteColor : appColors.primaryText },
      ]}>
      {item.name}
    </Text>
  </TouchableOpacity>
));
const capitalizeFirst = text => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const VehicleDetail = React.memo(({
  item,
  isDark,
  viewRTLStyle,
  onPress,
  appColors,
  styles,
  translateData,
  zoneValue
}: VehicleDetailProps) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => onPress(item?.id)}
    style={[
      styles.listContainer,
      {
        backgroundColor: isDark
          ? appColors.darkPrimary
          : appColors.whiteColor,
      },
      { borderColor: isDark ? appColors.darkBorder : appColors.border },
    ]}>
    <Image
      source={{
        uri: item?.normal_image_url,
      }}
      style={styles.carImg}
    />
    <View style={[styles.titleContainer, { flexDirection: viewRTLStyle }]}>
      <Text
        style={[
          styles.carBrand,
          { color: isDark ? appColors.whiteColor : appColors.primaryText },
        ]}>
        {item?.name}
      </Text>
      <View style={[styles.direction, { flexDirection: viewRTLStyle }]}>
        <View style={styles.starIcon}>
          <Star1 />
        </View>
        <Text style={styles.rating}>
          {item?.driver?.rating_count ? Number(item?.driver?.rating_count).toFixed(1) : "0"}
        </Text>
      </View>
    </View>
    <View style={[styles.descContainer, { flexDirection: viewRTLStyle }]}>
      <Text style={styles.engineInfo}>{item?.description}</Text>
      <Text style={styles.rentPrice}>
        {zoneValue.currency_symbol}
        {item?.vehicle_per_day_price}
        <Text style={styles.perDay}>/{translateData.day}</Text>
      </Text>
    </View>
    <View
      style={[
        styles.dashLine,
        {
          borderBottomColor: isDark
            ? appColors.darkBorder
            : appColors.border,
        },
      ]}
    />
    <View style={[styles.descContainer, { flexDirection: viewRTLStyle }]}>
      <Text
        style={[
          styles.driverTitle,
          { color: isDark ? appColors.whiteColor : appColors.primaryText },
        ]}>
        {translateData.driverPrice}
      </Text>
      <Text style={styles.rentPrice}>
        {zoneValue.currency_symbol}
        {item?.driver_per_day_charge}
        <Text style={styles.perDay}>/{translateData.day}</Text>
      </Text>
    </View>
   
<View style={[styles.tagContainer, { flexDirection: viewRTLStyle }]}>
  <View
    style={[
      styles.iconBox,
      { flexDirection: viewRTLStyle },
      {
        backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
      },
    ]}>
    <CarType color={isDark ? appColors.darkText : appColors.regularText} />
    <Text style={[styles.iconTitle, { color: isDark ? appColors.darkText : appColors.regularText }]}>
      {capitalizeFirst(item?.vehicle_subtype)}
    </Text>
  </View>

  <View
    style={[
      styles.iconBox,
      { flexDirection: viewRTLStyle },
      {
        backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
      },
    ]}>
    <FuelType color={isDark ? appColors.darkText : appColors.regularText} />
    <Text style={[styles.iconTitle, { color: isDark ? appColors.darkText : appColors.regularText }]}>
      {capitalizeFirst(item?.fuel_type)}
    </Text>
  </View>

  <View
    style={[
      styles.iconBox,
      { flexDirection: viewRTLStyle },
      {
        backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
      },
    ]}>
    <Milage color={isDark ? appColors.darkText : appColors.regularText} />
    <Text style={[styles.iconTitle, { color: isDark ? appColors.darkText : appColors.regularText }]}>
      {item?.mileage}
    </Text>
  </View>

  <View
    style={[
      styles.iconBox,
      { flexDirection: viewRTLStyle },
      {
        backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
      },
    ]}>
    <GearType color={isDark ? appColors.darkText : appColors.regularText} />
    <Text style={[styles.iconTitle, { color: isDark ? appColors.darkText : appColors.regularText }]}>
      {capitalizeFirst(item?.gear_type)}
    </Text>
  </View>

  <View
    style={[
      styles.iconBox,
      { flexDirection: viewRTLStyle },
      {
        backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
      },
    ]}>
    <Seat color={isDark ? appColors.darkText : appColors.regularText} />
    <Text style={[styles.iconTitle, { color: isDark ? appColors.darkText : appColors.regularText }]}>
      {item?.seatingCapacity} {translateData.seat}
    </Text>
  </View>

  <View
    style={[
      styles.iconBox,
      { flexDirection: viewRTLStyle },
      {
        backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
      },
    ]}>
    <Speed color={isDark ? appColors.darkText : appColors.regularText} />
    <Text style={[styles.iconTitle, { color: isDark ? appColors.darkText : appColors.regularText }]}>
      {item?.vehicle_speed}
    </Text>
  </View>

  <View
    style={[
      styles.iconBox,
      { flexDirection: viewRTLStyle },
      {
        backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
      },
    ]}>
    <Ac color={isDark ? appColors.darkText : appColors.regularText} />
    <Text style={[styles.iconTitle, { color: isDark ? appColors.darkText : appColors.regularText }]}>
      {item?.vehicle_speed}
    </Text>
  </View>

  <View
    style={[
      styles.iconBox,
      { flexDirection: viewRTLStyle },
      {
        backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
      },
    ]}>
    <Bag color={isDark ? appColors.darkText : appColors.regularText} />
    <Text style={[styles.iconTitle, { color: isDark ? appColors.darkText : appColors.regularText }]}>
      {item?.bag_count}
    </Text>
  </View>
</View>







  </TouchableOpacity>
));

export function RentalVehicleSelect() {
  const route = useRoute<RentalVehicleSelectRouteProp>();
  const { startDate, pickUpCoords, pickupLocation, dropLocation, dropCoords, categoryId, endDate, startTime, endTime, getDriver } = route.params;
  const [startDates, setStartDate] = useState('');
  const { rentalVehicleData, rentalVehicleLists, loading } = useSelector((state: RootState) => state.rentalVehicle);
  const [_endDates, setEndDate] = useState(''); // Renamed to avoid unused variable warning
  const [selectedVehicleId, setSelectedVehicleId] = useState<any>(null);
  const [selectedVehicleTax, setSelectedVehicleTax] = useState(0);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const { isDark, textColorStyle, linearColorStyle, viewRTLStyle } = useValues();
  const { translateData } = useSelector((state: RootState) => state.setting);
  const { zoneValue } = useSelector((state: RootState) => state.zone);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MyTabs');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);


  const convertTo24HourFormat = useCallback((time: string) => {
    if (!time) return '';
    const [timePart, modifier] = time.split(' ');
    if (!timePart || !modifier) return '';

    let [hours, minutes] = timePart.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }, []);

  const convertedStartTime = useMemo(() => convertTo24HourFormat(startTime), [startTime, convertTo24HourFormat]);
  const convertedEndTime = useMemo(() => convertTo24HourFormat(endTime), [endTime, convertTo24HourFormat]);


  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return '';
    const monthMap: { [key: string]: number } = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    };

    const parts = dateString.split(' ');
    if (parts.length < 3) return '';
    const day = parseInt(parts[0], 10);
    const month = monthMap[parts[1]?.toUpperCase() as string];
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || month === undefined || isNaN(year)) {
      return '';
    }
    return new Date(year, month, day).toISOString().split('T')[0];
  }, []);

  useEffect(() => {
    if (startDate) {
      const formattedStartDate = formatDate(startDate);
      if (formattedStartDate) {
        setStartDate(formattedStartDate);
      }
    }

    if (endDate) {
      const formattedEndDate = formatDate(endDate);
      if (formattedEndDate) {
        setEndDate(formattedEndDate);
      }
    }
  }, [startDate, endDate, formatDate]);

  const handleSelectVehicle = useCallback((item: any) => {
    setSelectedVehicleTax(item?.tax)
    setSelectedVehicleId(item?.id);

    let formattedDateTime: string;

    if (startDates) {
      if (startDates.includes(':')) {
        formattedDateTime = startDates;
      } else {
        formattedDateTime = `${startDates} 09:00:00`;
      }
    } else {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const hh = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      formattedDateTime = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    }
    dispatch(
      rentalVehicleList({
        start_time: formattedDateTime,
        vehicle_type_id: item?.id,
        lat: pickUpCoords?.lat,
        lng: pickUpCoords?.lng,
      }) as any,
    );
  }, [dispatch, startDates, pickUpCoords]);

  useEffect(() => {
    if (rentalVehicleData?.length > 0 && initialLoadRef.current) {
      handleSelectVehicle(rentalVehicleData[0]);
      initialLoadRef.current = false;
    }
  }, [rentalVehicleData, handleSelectVehicle]);

  const parseDate = useCallback((dateStr: string) => {
    const [day, monthName, year] = dateStr.split(" ");
    const months: { [key: string]: number } = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };
    return new Date(Number(year), months[monthName], Number(day));
  }, []);

  const startDateValue = useMemo(() => parseDate(startDate), [startDate, parseDate]);
  const endDateValue = useMemo(() => parseDate(endDate), [endDate, parseDate]);
  const diffTime = useMemo(() => (endDateValue as any) - (startDateValue as any), [endDateValue, startDateValue]);
  const totalDays = useMemo(() => Math.ceil(diffTime / (1000 * 60 * 60 * 24)), [diffTime]);
  const driverValue = useMemo(() => getDriver ? 1 : 0, [getDriver]);

  // Memoized navigation handler
  const gotoDetails = useCallback((id: any) => {
    dispatch(rentalVehicleListDetsils({ vehicle_type_id: id, no_of_days: totalDays, is_with_driver: driverValue }) as any)
      .unwrap()
      .then((res: any) => {
        if (res.status == 403) {
          notificationHelper(
            '',
            translateData.loginAgain,
            'error',
          );
          clearValue(); // Using correct signature without parameters
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
          return;
        }
        navigation.navigate('RentalCarDetails', {
          startDate,
          pickUpCoords,
          pickupLocation,
          dropLocation,
          dropCoords,
          categoryId,
          endDate,
          convertedStartTime,
          convertedEndTime,
          selectedVehicleId,
          getDriver,
          selectedVehicleTax
        });
      })
      .catch((error: any) => {
        console.error('Error in rentalVehicleListDetsils:', error);
      });
  }, [
    dispatch,
    totalDays,
    driverValue,
    translateData.loginAgain,
    navigation,
    startDate,
    pickUpCoords,
    pickupLocation,
    dropLocation,
    dropCoords,
    categoryId,
    endDate,
    convertedStartTime,
    convertedEndTime,
    selectedVehicleId,
    getDriver,
    selectedVehicleTax
  ]);

  // Optimized FlatList item renderers with proper keys
  const renderVehicleItem = useCallback(({ item }: { item: any }) => {
    const isSelected = item.id === selectedVehicleId;
    return (
      <VehicleItem
        item={item}
        isSelected={isSelected}
        isDark={isDark}
        onPress={handleSelectVehicle}
        appColors={appColors}
        styles={styles}
      />
    );
  }, [selectedVehicleId, isDark, handleSelectVehicle]);

  const renderVehicleDetail = useCallback(({ item }: { item: any }) => {
    return (
      <VehicleDetail
        item={item}
        isDark={isDark}
        viewRTLStyle={viewRTLStyle}
        onPress={gotoDetails}
        appColors={appColors}
        styles={styles}
        translateData={translateData}
        zoneValue={zoneValue}
      />
    );
  }, [isDark, viewRTLStyle, gotoDetails, translateData, zoneValue]);

  // Memoized FlatList props for better performance
  const vehicleListProps = useMemo(() => ({
    data: rentalVehicleData,
    keyExtractor: (item: any) => item.id.toString(),
    renderItem: renderVehicleItem,
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: styles.flatListContainer,
    initialNumToRender: 10,
    maxToRenderPerBatch: 10,
    updateCellsBatchingPeriod: 50,
    windowSize: 10,
    getItemLayout: (data: any, index: number) => ({
      length: 90,
      offset: 90 * index,
      index,
    }),
  }), [rentalVehicleData, renderVehicleItem]);

  const vehicleDetailListProps = useMemo(() => ({
    data: rentalVehicleLists?.data,
    keyExtractor: (item: any) => item.id.toString(),
    renderItem: renderVehicleDetail,
    contentContainerStyle: styles.listStyle,
    showsVerticalScrollIndicator: false,
    initialNumToRender: 5,
    maxToRenderPerBatch: 5,
    updateCellsBatchingPeriod: 50,
    windowSize: 10,
    removeClippedSubviews: true,
    getItemLayout: (data: any, index: number) => ({
      length: 300,
      offset: 300 * index,
      index,
    }),
  }), [rentalVehicleLists?.data, renderVehicleDetail]);



  return (
    <View style={[styles.container, { backgroundColor: linearColorStyle }]}>
      <Header value={translateData.selectRide} />
      <Text style={[styles.title, { color: textColorStyle }]}>
        {translateData.vehicletype}
      </Text>
      <View style={styles.vehicleContainer}>
        {rentalVehicleData?.length > 0 && (
          <FlatList
            {...vehicleListProps}
          />
        )}
      </View>

      {loading ? (
        <View style={styles.noDateContainer}>
          <ActivityIndicator
            size="large"
            color={appColors.primary}
            style={{ alignSelf: 'center' }}
          />
        </View>
      ) : rentalVehicleLists?.data?.length > 0 ? (
        <View style={styles.listDateContainer}>
          <FlatList
            {...vehicleDetailListProps}
          />
        </View>
      ) : (
        <View style={styles.noDateContainer}>
          <Image
            source={isDark ? Images.noVehicleDark : Images.noVehicle}
            style={styles.noData}
          />
          <View style={[styles.direction, { flexDirection: viewRTLStyle }]}>
            <Text style={[styles.titles, { color: textColorStyle }]}>
              {translateData.emptyVehicle}
            </Text>
            <View style={styles.icon}>
              <Info />
            </View>
          </View>
          <Text style={styles.subTitle}>{translateData.noVehicle}</Text>
        </View>
      )}
    </View>
  );
}