import React, { useState, useCallback, useMemo, useRef } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";
import { useDispatch, useSelector } from "react-redux";
import { userSaveLocation, deleteSaveLocation } from "@src/api/store/actions/saveLocationAction";
import { Button, notificationHelper, VerticalLine } from "@src/commonComponent";
import { NoInternet } from "@src/components";
import { useValues } from '@src/utils/context/index';
import { styles } from "./style";
import { external } from "../../../../styles/externalStyle";
import { commonStyles } from "../../../../styles/commonStyle";
import { appColors, fontSizes, windowHeight } from "@src/themes";
import { Delete, Edit, Back, Add, HomeLocation, WorkLocation, OtherLocation, Copy, PickLocation } from "@utils/icons";
import Images from "@src/utils/images";
import { LocationLoader } from "./locationLoader";
import { clearValue } from "@src/utils/localstorage";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import appFonts from "@src/themes/appFonts";
import FastImage from "react-native-fast-image";

export function SavedLocation() {
  const { bgFullStyle, linearColorStyle, textColorStyle, viewRTLStyle, textRTLStyle, isDark, Google_Map_Key } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { saveLocationDataGet, statusCode, loading } = useSelector((state: any) => state.saveLocation);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const { selectedLocation, savefield, service_ID, service_name, service_category_ID, service_category_slug, formattedDate, formattedTime } = route.params || {};
  const deleteBottomSheetRef = useRef<BottomSheet>(null);
  const deleteSnapPoints = useMemo(() => ['1%', '35%'], []);

  const gotoAdd = useCallback(() => {
    navigation.navigate("LocationSave");
  }, [navigation]);

  const editAddress = useCallback(
    (locationDetails: number) => {
      navigation.navigate("LocationSave", { mode: "edit", locationID: locationDetails?.id, locationDetails: locationDetails });
    },
    [navigation]
  );

  const openDeleteBottomSheet = useCallback((itemId: number) => {
    setSelectedItemId(itemId);
    deleteBottomSheetRef.current?.expand();
  }, []);

  const closeDeleteBottomSheet = useCallback(() => {
    setSelectedItemId(null);
    deleteBottomSheetRef.current?.close();
  }, []);

  const handleBottomSheetChanges = useCallback((index: number) => {
    if (index <= 0 && selectedItemId !== null) {
      closeDeleteBottomSheet();
    }
  }, [selectedItemId, closeDeleteBottomSheet]);


  const deleteAddress = useCallback(() => {
    if (selectedItemId !== null) {
      dispatch(deleteSaveLocation(selectedItemId))
        .unwrap()
        .then((res: any) => {
          if (res.status == 403) {
            notificationHelper('', translateData.loginAgain, 'error');
            clearValue('token').then(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              });
            });
            return;
          }
          if (res.status === 200) {
            notificationHelper('', translateData.addressDelSuccess, 'success');
            dispatch(userSaveLocation());
          }
        })
        .catch((error) => {
          console.error('Delete location error:', error);
          notificationHelper('', translateData.failDelAddress, 'error');
        })
        .finally(() => {
          closeDeleteBottomSheet();
        });
    }
  }, [dispatch, selectedItemId, closeDeleteBottomSheet, navigation]);

  const getCoordinatesFromAddress = async (address: string) => {
    try {

      const encodedAddress = encodeURIComponent(address);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${Google_Map_Key}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        throw new Error('No location found');
      }
    } catch (error) {
      console.error('Geocoding Error:', error);
      return null;
    }
  };


  const selectLocation = useCallback(
    async (location: string) => {
      const coordinates = await getCoordinatesFromAddress(location);

      if (!coordinates) {
        notificationHelper('', translateData.failedCoordinates, 'danger');
        return;
      }

      const { lat, lng } = coordinates;

      if (selectedLocation === 'locationDrop') {
        navigation.navigate('Ride', {
          selectedAddress: location,
          fieldValue: savefield,
          pinLatitude: lat,
          pinLongitude: lng,
          service_ID: service_ID,
          service_name: service_name,
          service_category_ID: service_category_ID,
          service_category_slug: service_category_slug,
          formattedDate: formattedDate,
          formattedTime: formattedTime,
        });
      } else {
        Clipboard.setString(`${location} (Lat: ${lat}, Lng: ${lng})`);
        notificationHelper('', translateData.copyClipboard, 'success');
      }
    },
    [navigation, selectedLocation, savefield, translateData.copyClipboard]
  );


  const renderLocationIcon = (type: string) => {
    switch (type) {
      case "home":
        return <HomeLocation />;
      case "work":
        return <WorkLocation />;
      default:
        return <OtherLocation />;
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const renderSavedLocationList = useMemo(() => {
    if (!saveLocationDataGet?.data?.length) {
      return (
        <View style={[styles.noDataContainer, { flexDirection: viewRTLStyle }]}>
          <NoInternet
            btnHide
            title={translateData.noLocation}
            details={translateData.noLocationDes}
            image={isDark ? Images.noLocationDark : Images.noLocation}
            infoIcon
            status={`${translateData.statusCode}: ${statusCode}`}
          />
        </View>
      );
    }

    return (
      <ScrollView style={[styles.mainView, external.mh_20]} showsVerticalScrollIndicator={false}>
        {saveLocationDataGet.data.map((item: any) => (
          <View
            key={item.id}
            style={[
              external.mb_10,
              styles.containerList,
              {
                backgroundColor: bgFullStyle,
                borderColor: isDark ? appColors.darkBorder : appColors.border,
              },
            ]}
          >
            <View
              style={[
                styles.listItemContainer,
                { flexDirection: viewRTLStyle },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: linearColorStyle },
                ]}
              >
                {renderLocationIcon(item.type)}
              </View>

              <View style={styles.detailsContainer}>
                <Text
                  style={[
                    commonStyles.mediumTextBlack12,
                    {
                      color: textColorStyle,
                      textAlign: textRTLStyle,
                      fontSize: fontSizes.FONT21,
                    },
                  ]}
                >
                  {item.title}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={external.mh_3}
                onPress={() => selectLocation(item.location)}
              >
                <Copy />
              </TouchableOpacity>

              <VerticalLine dynamicHeight="36%" />

              <TouchableOpacity
                activeOpacity={0.7}
                style={external.mh_3}
                onPress={() => editAddress(item)}
              >
                <Edit />
              </TouchableOpacity>

              <VerticalLine dynamicHeight="36%" />

              <TouchableOpacity
                activeOpacity={0.7}
                style={external.mh_2}
                onPress={() => {
                  openDeleteBottomSheet(item.id);
                }}
              >
                <Delete iconColor={appColors.alertRed} />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.dashLine,
                {
                  borderBottomColor: isDark
                    ? appColors.darkBorder
                    : appColors.primaryGray,
                },
              ]}
            />

            <View
              style={[
                styles.locationContainer,
                { flexDirection: viewRTLStyle },
              ]}
            >
              <View style={styles.pickLocationView}>
                <PickLocation
                  height={12}
                  width={12}
                  colors={isDark ? appColors.whiteColor : appColors.primaryText}
                />
              </View>

              <Text
                style={[styles.locationText, {
                  color: isDark ? appColors.whiteColor : appColors.primaryText, textAlign: textRTLStyle,
                }]}
              >
                {item.location?.length > 70
                  ? `${item.location.slice(0, 70)}...`
                  : item.location}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }, [
    saveLocationDataGet,
    bgFullStyle,
    isDark,
    textColorStyle,
    textRTLStyle,
    viewRTLStyle,
    selectLocation,
    editAddress,
    openDeleteBottomSheet,
    translateData.noLocation,
    translateData.noLocationDes,
    translateData.statusCode,
    statusCode
  ]);


  return (
    <View style={[styles.container, { backgroundColor: linearColorStyle }]}>
      <View
        style={{
          backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor,
        }}
      >
        <View
          style={[styles.headerContainers, { flexDirection: viewRTLStyle }]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={navigation.goBack}
            style={[
              styles.backButton,
              { borderColor: isDark ? appColors.darkBorder : appColors.border },
            ]}
          >
            <Back />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: textColorStyle }]}>
            {translateData.savedLocation}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.backButton,
              { borderColor: isDark ? appColors.darkBorder : appColors.border },
            ]}
            onPress={gotoAdd}
          >
            <Add colors={textColorStyle} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.locationListView}>
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <View key={index} style={{ marginBottom: windowHeight(12) }}>
              <LocationLoader />
            </View>
          ))
        ) : (
          renderSavedLocationList
        )}
      </View>

      {!loading && <BottomSheet
        ref={deleteBottomSheetRef}
        index={-1}
        snapPoints={deleteSnapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        onChange={handleBottomSheetChanges}
        style={{ zIndex: 5 }}
        handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
        backgroundStyle={{ backgroundColor: bgFullStyle }}
      >
        <BottomSheetView >
          <View>
            <View style={{ alignSelf: 'center' }}>
              <FastImage source={Images.delete} style={{ height: windowHeight(80), width: windowHeight(80) }} resizeMode="center" />
            </View>
            <View style={{ width: '100%', paddingHorizontal: windowHeight(50), marginTop: windowHeight(2) }}>
              <Text
                style={[
                  commonStyles.mediumText23,
                  external.ti_center,
                  { color: textColorStyle, fontFamily: appFonts.medium, fontSize: fontSizes.FONT21, textAlign: 'center', top: windowHeight(10) },
                ]}
              >
                {translateData.deleteAddress}
              </Text>
            </View>

            <View
              style={[

                external.mt_25,
                { flexDirection: viewRTLStyle, gap: 10, left: windowHeight(15), top: windowHeight(15) },
              ]}
            >
              <Button
                backgroundColor={appColors.lightGray}
                title={translateData.cancel}
                width="43.5%"
                onPress={closeDeleteBottomSheet}
                textColor={appColors.primaryText}
              />
              <Button
                backgroundColor={appColors.textRed}
                title={translateData.deleteBtn}
                width="43.5%"
                onPress={deleteAddress}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>}
    </View>
  );
}




