import { FlatList, Image, Linking, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useMemo, useRef } from "react";
import Images from "@utils/images";
import { styles } from "./style";
import { commonStyles } from "../../../../styles/commonStyle";
import { useValues } from '@src/utils/context/index';
import { Call, Info, Message, PickLocation, RatingEmptyStart, RatingHalfStar, RatingStar, Rebook, SafetyCall } from "@utils/icons";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { useAppNavigation } from "@src/utils/navigation";
import { RideLoader } from "./rideLoader";
import { external } from "@src/styles/externalStyle";
import { apiformatDates } from "@src/utils/functions";
import { notificationHelper } from "@src/commonComponent";
import { userRideLocation, vehicleTypeDataGet } from "@src/api/store/actions";

export default function RideContainer({ status }) {
  const { navigate } = useAppNavigation();
  const { bgFullStyle, textColorStyle, viewRTLStyle, textRTLStyle, isDark, iconColorStyle, Google_Map_Key } = useValues();
  const { colors } = useTheme();
  const { rideDatas } = useSelector(state => state.allRide);
  const { allVehicle } = useSelector(state => state.vehicleType);
  const { translateData } = useSelector(state => state.setting);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [rebookingRideId, setRebookingRideId] = useState(null);
  const prevStatusRef = useRef(status);
  const { zoneValue } = useSelector((state: any) => state.zone);
  const dispatch = useDispatch();

  useEffect(() => {
    if (prevStatusRef.current !== status) {
      setPage(1);
      setHasMoreData(true);
      prevStatusRef.current = status;
    }
  }, [status]);

  const acceptedRides = useMemo(() => {
    return rideDatas?.data?.filter(ride => {
      const rideStatus = ride?.ride_status?.slug?.toLowerCase();
      const categorySlug = ride?.service_category?.name?.toLowerCase();
      const currentStatus = status?.toLowerCase()?.trim();

      if (!rideStatus) return false;

      if (currentStatus === "active_combined") {
        return (
          categorySlug !== "schedule" &&
          rideStatus !== "completed" &&
          rideStatus !== "cancelled" &&
          (rideStatus === "accepted" || rideStatus === "started" || rideStatus === "arrived")
        );
      }

      if (currentStatus === "past_combined") {
        return rideStatus === "completed" || rideStatus === "cancelled";
      }

      if (currentStatus === "schedule") {
        return categorySlug === "schedule";
      }
      if (currentStatus === "accepted") {
        return (
          categorySlug !== "schedule" &&
          rideStatus !== "completed" &&
          rideStatus !== "cancelled"
        );
      }
      return rideStatus === currentStatus;
    });
  }, [rideDatas?.data, status]);

  const statusMapping = {
    accepted: {
      text: "Pending",
      color: appColors.completeColor,
      backgroundColor: appColors.lightYellow,
    },
    started: {
      text: "Active",
      color: appColors.activeColor,
      backgroundColor: appColors.grayLight,
    },
    schedule: {
      text: "Scheduled",
      color: appColors.scheduleColor,
      backgroundColor: appColors.lightPink,
    },
    cancelled: {
      text: "Cancel",
      color: appColors.alertRed,
      backgroundColor: appColors.iconRed,
    },
    completed: {
      text: "Completed",
      color: appColors.primary,
      backgroundColor: appColors.selectPrimary,
    },
    arrived: {
      text: "Pending",
      color: appColors.completeColor,
      backgroundColor: appColors.lightYellow,
    },
  };
  useEffect(() => {
    if (rideDatas?.data) {
      if (rideDatas.data.length > 0) {
        setInitialLoading(false);
      } else {
        setInitialLoading(false);
      }
    } else {
      setInitialLoading(false);
    }
  }, [rideDatas]);


  const gotoMessage = item => {
    navigate("ChatScreen", {
      driverId: item?.driver?.id,
      riderId: item?.rider?.id,
      rideId: item?.id,
      driverName: item?.driver?.name,
      driverImage: item?.driver?.profile_image_url,
    });
  };

  const gotoCall = item => {
    const phoneNumber = `${item?.driver?.phone}`;
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const paginatedData = useMemo(() =>
    acceptedRides?.slice(0, page * 5) || [],
    [acceptedRides, page]
  );

  const loadMoreData = () => {
    if (!paginationLoading && hasMoreData) {
      setPaginationLoading(true);
      setTimeout(() => {
        if (paginatedData.length < acceptedRides?.length) {
          setPage(prev => prev + 1);
        } else {
          setHasMoreData(false);
        }
        setPaginationLoading(false);
      }, 1000);
    }
  };

  const handlePress = (selectedItem, vehicleData) => {
    let rideStatus =
      status === "Schedule"
        ? statusMapping[selectedItem?.service_category?.service_category_type]
          ?.text
        : statusMapping[selectedItem.ride_status.slug]?.text;
    navigate("PendingRideScreen", {
      item: selectedItem,
      vehicleDetail: vehicleData,
      rideStatus: rideStatus,
    });
  };

  const convertToCoords = async (address) => {
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

  const convertStopsToCoords = async (stopList) => {
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

  const gotoBook = async (item) => {
    setRebookingRideId(item.id);
    const locations = item?.locations || [];
    const pickupLocation = locations[0] || null;
    const destination = locations.length > 1 ? locations[locations.length - 1] : null;
    const stops = locations.length > 2 ? locations.slice(1, locations.length - 1) : [];

    try {
      const pickupCoords = await convertToCoords(pickupLocation);
      const destinationCoords = await convertToCoords(destination);
      const stopCoords = await convertStopsToCoords(stops || []);
      const ride_number = item?.id;
      const res = await dispatch(userRideLocation({ ride_number })).unwrap();
      const zoneValue = res?.data?.[0];

      const rawLocations = [
        pickupCoords,
        stopCoords[0],
        stopCoords[1],
        stopCoords[2],
        destinationCoords,
      ];

      const filteredLocations = rawLocations
        .filter(coord => coord && coord.latitude != null && coord.longitude != null)
        .map(coord => ({
          lat: coord.latitude,
          lng: coord.longitude,
        }));

      const payload = {
        locations: filteredLocations,
        service_id: item?.service_id,
        service_category_id: item?.service_category_id,
      };
      dispatch(vehicleTypeDataGet(payload)).then((_: any) => {
        const categoryId = item?.service_id;
        const categoryOptionID = item?.service_category_id;
        const scheduleDate = null;
        const service_name = item?.service?.service_type;
        const slug = item?.service_category?.slug;
        const pickupCoords1 = item?.location_coordinates[0];
        const destinationCoords1 = item?.location_coordinates.length > 1 ? item?.location_coordinates[item?.location_coordinates.length - 1] : null;

        if (slug === 'intercity' || slug === 'ride') {
          navigate("BookRide", {
            destination,
            stops,
            pickupLocation,
            service_ID: categoryId,
            zoneValue,
            scheduleDate,
            service_category_ID: categoryOptionID,
            filteredLocations: filteredLocations,
            pickupCoords: pickupCoords1,
            destinationCoords: destinationCoords1
          });
        } else if (slug === 'package') {
          navigate("Rental", {
            pickupLocation,
            service_ID: categoryId,
            service_category_ID: categoryOptionID,
            zoneValue,
          });
        } else if (service_name === 'parcel' || service_name === 'freight') {
          navigate("Outstation", {
            destination,
            stops,
            pickupLocation,
            service_ID: categoryId,
            zoneValue,
            service_name,
            service_category_ID: categoryOptionID,
            filteredLocations: filteredLocations,
            pickupCoords: pickupCoords1,
            destinationCoords: destinationCoords1
          });
        }
        setRebookingRideId(null);
      })
    } catch (error) {
      console.error('Booking failed:', error);
      notificationHelper('', error, "error");
      setRebookingRideId(null);
    } finally {
    }
  };


  const renderItem = ({ item }) => {
    const { vehicle_type_id } = item.vehicle_type_id || {};
    const vehicleData = Array.isArray(allVehicle)
      ? allVehicle.find(vehicle => vehicle?.id == vehicle_type_id)
      : undefined;
    const formattedDate = apiformatDates(item.created_at);

    return (
      <View>
        <TouchableOpacity
          style={[styles.container, { backgroundColor: bgFullStyle }]}
          onPress={() => handlePress(item, vehicleData)}
          activeOpacity={0.7}>
          <View
            style={[styles.rideInfoContainer, { backgroundColor: bgFullStyle }]}>
            <View
              style={[
                styles.profileInfoContainer,
                { flexDirection: viewRTLStyle },
              ]}>
              <View style={{ height: windowHeight(45), width: windowHeight(50), backgroundColor:isDark?appColors.bgDark: appColors.lightGray, alignItems: 'center', justifyContent: 'center', borderRadius: windowHeight(5) }}>
                {item?.service?.slug != 'ambulance' ? (
                  <Image
                    style={styles.profileImage}
                    source={{ uri: item?.vehicle_type?.vehicle_image_url }}
                  />
                ) : (
                  <Image
                    style={styles.profileImage}
                    source={{ uri: item?.ambulance_image_url }}
                  />
                )}
              </View>
              <View style={[styles.profileTextContainer, { height: windowHeight(40), justifyContent: 'center' }]}>
                <Text
                  style={[
                    styles.profileName,
                    { color: textColorStyle },
                    { textAlign: textRTLStyle },
                  ]}>
                  {item?.driver?.name}
                </Text>
                <View
                  style={[
                    styles.carInfoContainer,
                    {
                      flexDirection: viewRTLStyle
                    },
                  ]}>
                  <View
                    style={{
                      flexDirection: viewRTLStyle,
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    {Array.from({ length: 5 }).map((_, index) => {
                      const fullStarThreshold = index + 1;
                      const halfStarThreshold = index + 0.5;
                      if (item?.driver?.rating_count >= fullStarThreshold) {
                        return <RatingStar key={index} />;
                      } else if (
                        item?.driver?.rating_count >= halfStarThreshold
                      ) {
                        return <RatingHalfStar key={index} />;
                      } else {
                        return <RatingEmptyStart key={index} />;
                      }
                    })}
                    <View style={{ flexDirection: viewRTLStyle, marginHorizontal: windowWidth(5) }}>
                      <Text
                        style={[
                          commonStyles.mediumTextBlack12,
                          {
                            color: isDark
                              ? appColors.whiteColor
                              : appColors.primaryText,
                          },
                        ]}>
                        {Number(item?.driver?.rating_count).toFixed(1)}
                      </Text>
                      <Text style={[styles.carInfoText]}>
                        ({item?.driver?.review_count})
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  height: windowHeight(40)
                }}>

                <Text
                  style={[
                    commonStyles.mediumTextBlack12,
                    {
                      color: isDark
                        ? appColors.whiteColor
                        : appColors.primaryText,
                      fontSize: fontSizes.FONT22
                    },
                  ]}>
                  {zoneValue.currency_symbol}
                  {item?.total}
                </Text>
                <View style={styles.service_name_view}>
                  <Text style={styles.service_name}>{item?.service?.name}</Text>
                </View>
              </View>
            </View>
            <View
              style={[
                styles.dashedLine,
                { borderColor: isDark ? appColors.darkBorder : colors.border },
              ]}
            />
            <View
              style={[
                { flexDirection: viewRTLStyle, alignItems: 'center' },
              ]}>
              <View
                style={[external.fd_column]}>
                <PickLocation
                  height={12}
                  width={12}
                  colors={iconColorStyle}
                />
              </View>
              <Text
                style={[
                  styles.itemStyle1,
                  external.mh_5,
                  { color: textColorStyle },
                  { textAlign: textRTLStyle },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item?.locations?.length > 30
                  ? item.locations.substring(0, 30) + '...'
                  : item?.locations}
              </Text>
            </View>
            <View style={{ flexDirection: viewRTLStyle, marginTop: windowHeight(4), marginHorizontal: windowWidth(22) }}>
              <Text style={{ fontSize: fontSizes.FONT16, color: appColors.regularText, fontFamily: appFonts.medium }}>{formattedDate.date}</Text>
              <View style={{ borderLeftWidth: 1, borderColor: appColors.border, marginHorizontal: windowWidth(5) }} />
              <Text style={{ fontSize: fontSizes.FONT16, color: appColors.regularText, fontFamily: appFonts.medium }}>{formattedDate.time}</Text>
            </View>
          </View>
          <View style={external.mh_10}>
            <View
              style={[
                styles.dashedLine,
                {
                  borderColor: isDark ? appColors.darkBorder : colors.border,
                },
              ]}
            />
            <View
              style={[styles.serviceMainView]}>

              {item?.ride_status?.slug === "accepted" &&
                item?.ride_status?.slug === "pending" &&
                item?.ride_status?.slug === "schedule" && (
                  <View
                    style={[
                      styles.MessageMainView,
                      {
                        flexDirection: viewRTLStyle,
                      },
                    ]}>
                    <TouchableOpacity
                      style={[
                        styles.MessageView,
                        {
                          borderColor: isDark
                            ? appColors.darkBorder
                            : colors.border,
                        },
                      ]}
                      activeOpacity={0.7}
                      onPress={() => gotoMessage(item)}>
                      <Message />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.safetyCallView,
                        {
                          borderColor: isDark
                            ? appColors.darkBorder
                            : colors.border,
                        },
                      ]}
                      onPress={() => gotoCall(item)}>
                      <SafetyCall color={appColors.primary} />
                    </TouchableOpacity>
                  </View>
                )}
              {item?.ride_status?.slug !== "completed" &&
                item?.ride_status?.slug !== "cancelled" && (
                  <View style={{ flexDirection: viewRTLStyle, justifyContent: 'space-between', marginBottom: windowHeight(8), marginTop: windowHeight(4) }}>
                    <TouchableOpacity
                      onPress={() => gotoMessage(item)}
                      style={[
                        styles.message,
                        {
                          backgroundColor: isDark
                            ? appColors.darkPrimary
                            : appColors.lightGray,
                          height: windowHeight(40),
                          width: windowWidth(315),
                          alignItems: 'flex-start'
                        },
                      ]}
                      activeOpacity={0.7}>
                      <Text style={{ marginHorizontal: windowWidth(10), fontFamily: appFonts.regular, color: appColors.regularText }}>{translateData.sendMessage}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => gotoCall(item)}
                      activeOpacity={0.7}
                      style={[
                        styles.call,
                        {
                          backgroundColor: appColors.primary,
                        },
                      ]}
                    >
                      <Call color={appColors.whiteColor} />
                    </TouchableOpacity>
                  </View>
                )}
              {item?.ride_status?.slug == "completed" && (
                <TouchableOpacity
                  onPress={() => gotoBook(item)}
                  activeOpacity={0.7}
                  style={{ backgroundColor: appColors.primary, flexDirection: viewRTLStyle, justifyContent: 'center', alignItems: 'center', height: windowHeight(35), borderRadius: windowHeight(5), marginBottom: windowHeight(12) }}
                  disabled={rebookingRideId === item.id}
                >
                  {rebookingRideId === item.id ? (
                    <ActivityIndicator size="small" color={appColors.whiteColor} />
                  ) : (
                    <>
                      <Rebook />
                      <Text style={{ color: appColors.whiteColor, fontFamily: appFonts.medium, marginHorizontal: windowWidth(5) }}>{translateData.rebook}</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
              {item?.ride_status?.slug == "cancelled" && (
                <TouchableOpacity
                  onPress={() => gotoBook(item)}
                  activeOpacity={0.7}
                  style={{ backgroundColor: appColors.primary, flexDirection: viewRTLStyle, justifyContent: 'center', alignItems: 'center', height: windowHeight(35), borderRadius: windowHeight(5), marginBottom: windowHeight(12) }}
                  disabled={rebookingRideId === item.id}
                >
                  {rebookingRideId === item.id ? (
                    <ActivityIndicator size="small" color={appColors.whiteColor} />
                  ) : (
                    <>
                      <Rebook />
                      <Text style={{ color: appColors.whiteColor, fontFamily: appFonts.medium, marginHorizontal: windowWidth(5) }}>{translateData.rebook}</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.main}>
      {initialLoading && acceptedRides?.length > 0 ? (
        <RideLoader />
      ) : acceptedRides?.length === 0 ? (
        <View style={styles.noDataView}>
          <Image
            source={isDark ? Images.noRideDark : Images.noRide}
            style={styles.noRideImage}
            resizeMode="contain"
          />
          <View style={[styles.noRIdeView, { flexDirection: viewRTLStyle }]}>
            <Text
              style={[
                styles.noRIde,
                {
                  color: isDark ? appColors.whiteColor : appColors.primaryText,
                  fontFamily: appFonts.bold,
                },
              ]}>
              {translateData.noRIde}
            </Text>
            <View style={styles.Info}>
              <Info />
            </View>
          </View>
          <Text
            style={[
              styles.noRideDes,
              {
                color: isDark ? appColors.whiteColor : appColors.regularText,
                fontFamily: appFonts.regular,
              },
            ]}>
            {translateData.noRideDes}
          </Text>
        </View>
      ) : (
        <View style={styles.flatlistView}>
          <FlatList
            data={paginatedData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.containerStyle}
            initialNumToRender={3}
            maxToRenderPerBatch={2}
            windowSize={3}
            removeClippedSubviews={true}
            ListFooterComponent={() => {
              if (
                paginationLoading &&
                hasMoreData &&
                acceptedRides?.length > paginatedData.length
              ) {
                return (
                  <ActivityIndicator
                    size="large"
                    color={appColors.buttonBg}
                    style={{ marginTop: windowHeight(10) }}
                  />
                );
              }
              return null;
            }}
          />
        </View>
      )}
    </View>
  );
}
