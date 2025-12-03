import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { ridesStatusData } from '../../../../data/rideStatus/index';
import { appColors, windowHeight } from '@src/themes';
import { styles } from './styles';
import { commonStyles } from '../../../../styles/commonStyle';
import { UpcomingRide } from './upcomingRide/index';
import { CombinedActiveRide } from './combinedActiveRide/index';
import { CombinedPastRide } from './combinedPastRide/index';
import { SkeletonRideStatus } from './component';
import { useFocusEffect } from '@react-navigation/native';
import { useValues } from '@src/utils/context';
import { useLoadingContext } from '@src/utils/loadingContext';

export function RideStatus() {
  const { isRTL, isDark, bgContainer } = useValues();
  const { addressLoaded, setAddressLoaded } = useLoadingContext();
  const [selected, setSelected] = useState(0);
  const rideStatusData = ridesStatusData();
  const isMounted = useRef(false);
  const selectedTabRef = useRef(0);
  const hasInitiallyLoaded = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      setSelected(selectedTabRef.current);
    }, [])
  );

  useEffect(() => {
    if (!isMounted.current && !addressLoaded) {
      isMounted.current = true;
      setAddressLoaded(true);
    }
  }, [addressLoaded, setAddressLoaded]);

  useEffect(() => {
    selectedTabRef.current = selected;
  }, [selected]);

  const renderRideContent = useMemo(() => {
    switch (selected) {
      case 0:
        return <UpcomingRide />;
      case 1:
        return <CombinedActiveRide />;
      case 2:
        return <CombinedPastRide />;
      default:
        return null;
    }
  }, [selected]);

  const handleTabPress = useCallback((tabId) => {
    setSelected(tabId);
  }, []);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => handleTabPress(item.id)}
      style={[
        styles.container,
        {
          backgroundColor:
            item.id === selected
              ? appColors.primary
              : isDark
                ? appColors.darkPrimary
                : appColors.whiteColor,

        },
        { borderColor: isDark ? appColors.darkBorder : appColors.border },
        item.id === selected ? { borderColor: appColors.primary } : null,
      ]}>
      <Text
        style={[
          commonStyles.mediumTextBlack12,
          item.id === selected
            ? { color: appColors.whiteColor }
            : { color: appColors.primary },
        ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  ), [selected, isDark, handleTabPress]);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  if (!addressLoaded && !hasInitiallyLoaded.current) {
    return <SkeletonRideStatus />;
  }

  if (addressLoaded && !hasInitiallyLoaded.current) {
    hasInitiallyLoaded.current = true;
  }

  return (
    <View>
      <View style={styles.mainView}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          data={rideStatusData}
          inverted={isRTL}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          contentContainerStyle={{
            justifyContent: 'space-between', width: '100%', backgroundColor: bgContainer, borderRadius: windowHeight(5),
          }}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderRideContent}
      </ScrollView>
    </View>
  );
}
