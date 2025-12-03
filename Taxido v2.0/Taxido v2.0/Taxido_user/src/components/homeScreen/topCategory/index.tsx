import { FlatList, Image, Text, TouchableOpacity, View, Vibration, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { styles } from "./styles";
import { TitleRenderItem } from "./titleRenderItem/index";
import { appColors, windowHeight } from "@src/themes";
import { BackArrow, History, Search } from "@src/utils/icons";
import { useValues } from "@src/utils/context/index";;
import { useAppNavigation } from "@src/utils/navigation";
import Images from "@src/utils/images";
import { useDispatch, useSelector } from "react-redux";
import { getValue } from "@src/utils/localstorage";
import { useIsFocused } from "@react-navigation/native";
import { notificationHelper } from "@src/commonComponent";
import { vehicleTypeDataGet } from "@src/api/store/actions";
import { AppDispatch, RootState } from "@src/api/store";
import useStoredLocation from "@src/components/helper/useStoredLocation";

export function TopCategory({ categoryData }: any) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState<null | string | any>(null);
  const { bgFullStyle, isDark, viewRTLStyle, textRTLStyle, Google_Map_Key, isRTL } = useValues()
  const { navigate }: any = useAppNavigation();
  const isScrollable = categoryData?.length > 4;
  const { translateData } = useSelector((state: any) => state.setting);
  const [recentDatas, setRecentDatas] = useState<string[]>([]);
  const flatListRef = useRef<any>(null);
  const isFocused = useIsFocused();
  const { walletTypedata }: any = useSelector((state: RootState) => state.wallet);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoadingOverlay, setIsLoadingOverlay] = useState<boolean>(false);
  const { latitude, longitude } = useStoredLocation();
  const { taxidoSettingData } = useSelector((state: any) => state.setting);
  const [fullAddress, setFullAddress] = useState<string>('');
  const [addressCoords, setAddressCoords] = useState<any | null>({
    lat: null,
    lng: null,
  });
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(categoryData.length > 4);

  useEffect(() => {
    const getAddress = async () => {
      let lat = await getValue('user_latitude_Selected');
      let lng = await getValue('user_longitude_Selected');

      let finalLat = lat ? parseFloat(lat) : latitude;
      let finalLng = lng ? parseFloat(lng) : longitude;
      setAddressCoords({
        lat: finalLat,
        lng: finalLng,
      });
      if (!finalLat || !finalLng || !Google_Map_Key) return;

      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${finalLat},${finalLng}&key=${Google_Map_Key}&result_type=street_address`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
          const fullAddr = data.results[0]?.formatted_address;

          setFullAddress(fullAddr || translateData.noAddressFound);
        } else {
          setFullAddress(translateData.noAddressFound);
          console.warn('Geocoding failed:', data.status);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        setFullAddress(translateData.noAddressError);
      }
    };
    getAddress();
  }, [latitude, longitude, taxidoSettingData, Google_Map_Key]);




  useEffect(() => {
    if (categoryData?.length > 0) {
      setSelectedSubcategory(categoryData[0]);
    }
  }, [categoryData]);

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        const stored = await getValue("locations");
        let parsedLocations = [];
        if (stored) {
          parsedLocations = JSON.parse(stored);
          if (!Array.isArray(parsedLocations)) {
            parsedLocations = [parsedLocations];
          }
        }
        setRecentDatas(parsedLocations);
      } catch (error) {
        console.error("Error parsing recent locations:", error);
        setRecentDatas([]); // fallback
      }
    };
    if (isFocused) {
      fetchRecentData();  // only run when screen is focused
    }
  }, [isFocused]);

  const handlePress = () => {
    if (walletTypedata?.balance < 0) {
      notificationHelper("", translateData.walletLow, 'error')
    } else {
      const item: any = selectedSubcategory;
      if (!item) return;
      if (item?.slug == 'intercity' || item?.slug == 'ride' || item?.slug == 'ride-freight' || item?.slug == 'intercity-freight' || item?.slug == 'intercity-parcel' || item?.slug == 'ride-parcel' || item?.slug == 'schedule-freight' || item?.slug == 'schedule-parcel') {
        navigate('Ride', {
          service_ID: item?.service_id,
          service_name: item?.service_type,
          service_category_ID: item?.id,
          service_category_slug: item?.slug,
          defultAddress: fullAddress,
          defultCoords: addressCoords,
        });
      } else if (item?.slug == 'package') {
        navigate('RentalLocation', {
          service_ID: item?.service_id,
          service_name: item?.service_type,
          service_category_ID: item?.id,
          service_category_slug: item?.slug,
        });
      } else if (item?.slug == 'schedule') {
        navigate('Ride', {
          service_ID: item?.service_id,
          service_name: item?.service_type,
          service_category_ID: item?.id,
          service_category_slug: item?.slug,
          defultAddress: fullAddress,
          defultCoords: addressCoords,

        });
      } else if (item?.slug == 'rental') {
        navigate('RentalBooking', {
          service_ID: item?.service_id,
          service_name: item?.service_type,
          service_category_ID: item?.id,
          service_category_slug: item?.slug,
        });
      }
    }
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollX = contentOffset.x;
    const totalWidth = contentSize.width;
    const visibleWidth = layoutMeasurement.width;

    setShowLeftArrow(scrollX > 0);
    setShowRightArrow(scrollX + visibleWidth < totalWidth);
  };

  const convertToCoords = async (address: string) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${Google_Map_Key}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.warn("No results for:", address, data.status);
        return null;
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  const convertStopsToCoords = async (stopList: string) => {
    const coordsArray = [];
    for (const stop of stopList) {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(stop)}&key=${Google_Map_Key}`
        );
        const data = await res.json();
        if (data.status === 'OK' && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          coordsArray.push({ latitude: lat, longitude: lng });
        } else {
          console.warn("No results for stop:", stop, data.status);
          coordsArray.push(null);
        }
      } catch (err) {
        console.error("Stop geocoding error:", err);
        coordsArray.push(null);
      }
    }
    return coordsArray;
  };

  const gotoBook = async (item: any) => {

    setIsLoadingOverlay(true);
    const pickup = await convertToCoords(item?.pickupLocation);
    const destination = await convertToCoords(item?.destinationFullAddress?.shortAddress);
    const stops = await convertStopsToCoords(item?.stops || []);

    const rawLocations = [
      pickup,
      stops[0],
      stops[1],
      stops[2],
      destination,
    ];

    const filteredLocations = rawLocations
      .filter(coord => coord && coord.latitude != null && coord.longitude != null)
      .map((coord: any) => ({
        lat: coord.latitude,
        lng: coord.longitude,
      }));

    const payload: any = {
      locations: filteredLocations,
      service_id: item?.service_ID,
      service_category_id: item?.service_category_ID,
    };

    dispatch(vehicleTypeDataGet(payload)).then((res: any) => {
      if (walletTypedata?.balance < 0) {
        notificationHelper("", translateData.walletLow, 'error')
        setIsLoadingOverlay(false);
      } else {
        navigate("BookRide", {
          destination: item?.destinationFullAddress?.shortAddress,
          stops: item?.stops,
          pickupLocation: item?.pickupLocation,
          service_ID: item?.service_ID,
          zoneValue: item?.zoneValue,
          scheduleDate: item?.scheduleDate,
          service_category_ID: item?.service_category_ID,
          service_name: item?.service_name,
          filteredLocations: filteredLocations,
          destinationCoords: item?.destinationCoords,
          pickupCoords: item?.pickupCoords
        });
        setIsLoadingOverlay(false);
      }
    });
  };


  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View style={[styles.mainLine, { backgroundColor: isDark ? appColors.go : appColors.sliderLine }]} />
        {showLeftArrow && (
          <TouchableOpacity
            style={[styles.backBtnStyle1, { left: 18, backgroundColor: isDark ? appColors.darkBorder : appColors.lightGray, borderColor: isDark ? appColors.darkBorder : appColors.border }]}
            onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
          >
            <View style={{ transform: [{ rotate: isRTL ? '0deg' : '180deg' }] }}>
              <BackArrow colors={appColors.primary} />
            </View>
          </TouchableOpacity>
        )}

        {showRightArrow && (
          <TouchableOpacity
            style={[styles.backBtnStyle, { right: 18, backgroundColor: isDark ? appColors.darkBorder : appColors.lightGray, borderColor: isDark ? appColors.darkBorder : appColors.border }]}
            onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
          >
            <View style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }}>
              <BackArrow colors={appColors.primary} />
            </View>
          </TouchableOpacity>
        )}
        <FlatList
          ref={flatListRef}
          data={categoryData}
          renderItem={({ item, index }) => (
            <TitleRenderItem
              item={item}
              index={index}
              selectedIndex={selectedIndex}
              onPress={async () => {
                setSelectedIndex(index);
                setSelectedSubcategory(item);
                Vibration.vibrate(42);
                if (item?.slug == 'package') {
                  navigate('RentalLocation', {
                    service_ID: item?.service_id,
                    service_name: item?.service_type,
                    service_category_ID: item?.id,
                    service_category_slug: item?.slug,
                  });
                } else if (item?.slug == 'rental') {
                  navigate('RentalBooking', {
                    service_ID: item?.service_id,
                    service_name: item?.service_type,
                    service_category_ID: item?.id,
                    service_category_slug: item?.slug,
                  });
                }
              }}
              isScrollable={isScrollable}
              totalItems={categoryData.length}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          inverted={isRTL}
          keyExtractor={(item) => item.name.toString()}
          onScroll={handleScroll}
        />
      </View>

      {categoryData?.length > 0 && (
        <>
          {selectedSubcategory?.slug != 'rental' && selectedSubcategory?.slug != 'package' && (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}
              style={[styles.packageMainView, {
                backgroundColor: bgFullStyle,
                borderColor: isDark ? appColors.darkBorder : appColors.border,
              }]}
            >
              <View
                style={[styles.searchView, {
                  backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray,
                  flexDirection: viewRTLStyle,
                }]}
              >
                <Search />
                <Text
                  style={[styles.whereNext, {

                    color: isDark ? appColors.whiteColor : appColors.primaryText
                  }]}
                >
                  {translateData.whereNext}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {!isLoadingOverlay && (
            <FlatList
              data={recentDatas && recentDatas?.slice(0, 2)}
              keyExtractor={(item, index) => index?.toString()}
              renderItem={({ item, index }: any) => (
                <>
                  {selectedSubcategory?.slug != 'rental' && selectedSubcategory?.slug != 'package' && (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.centerLocation,
                          { flexDirection: viewRTLStyle, backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border },
                          index == 0 && { marginTop: windowHeight(12) },
                        ]}
                        onPress={() => gotoBook(item)}
                      >
                        <View style={{ backgroundColor: isDark ? appColors.darkHeader : appColors.lightGray, padding: windowHeight(8), borderRadius: windowHeight(20) }}>
                          <History />
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.adajanText,
                              { color: isDark ? appColors.whiteColor : appColors.primaryText },
                              { textAlign: isRTL ? 'right' : 'left' }

                            ]}
                          >
                            {item?.destinationFullAddress?.shortAddress?.length > 30
                              ? item?.destinationFullAddress?.shortAddress?.slice(0, 30) + '...'
                              : item?.destinationFullAddress?.shortAddress}
                          </Text>
                          <Text
                            style={[
                              styles.titleTextDetail,
                              {
                                textAlign: textRTLStyle,
                              },
                            ]}
                          >
                            {item?.destinationFullAddress?.detailAddress?.length > 30
                              ? item?.destinationFullAddress?.detailAddress?.slice(0, 30) + '...'
                              : item?.destinationFullAddress?.detailAddress}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View
                        style={[
                          styles.locationLine,
                          { borderColor: isDark ? appColors.darkBorder : appColors.border }
                        ]}
                      />
                    </>
                  )}
                </>
              )}
            />
          )}
          {isLoadingOverlay && (
            <View style={styles.loaderAddress}>
              <ActivityIndicator size="large" color={appColors.primary} />
            </View>
          )}
          {selectedSubcategory?.slug == 'rental' && (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
              <Image source={Images.rentalBanner} style={styles.rentalImage} />
            </TouchableOpacity>
          )}
          {selectedSubcategory?.slug == 'package' && (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
              <Image source={Images.packagebanner} style={styles.rentalImage} />
            </TouchableOpacity>
          )}
        </>
      )
      }
    </View >
  );
}

