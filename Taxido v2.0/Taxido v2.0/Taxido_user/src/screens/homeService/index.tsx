import { View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Header } from '@src/commonComponent';
import { appColors } from '@src/themes';
import { useSelector } from 'react-redux';
import styles from './styles';
import { useValues } from '@src/utils/context/index';
import { HomeSlider, TodayOfferContainer, TopCategory } from '@src/components';
import { Recentbooking } from '../recentBooking';
import { BottomTitle } from '@src/components';
import { HomeServiceLoader } from './component';


export function HomeService() {
  const route = useRoute();
  const { itemName } = route.params || {};
  const { homeScreenData, loading } = useSelector((state: any) => state.home);
  const { isDark, linearColorStyle } = useValues()
  const [isScrolling, setIsScrolling] = useState(true);

  const isDataEmpty =
    !homeScreenData ||
    Object.keys(homeScreenData).length === 0 ||
    homeScreenData === null;

  return (
    <View style={[styles.mainView, { backgroundColor: isDark ? linearColorStyle : appColors.lightGray }]}>
      <Header value={itemName} />
      {loading || isDataEmpty ? (
        <HomeServiceLoader />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          nestedScrollEnabled={true}
          scrollEnabled={isScrolling}
          contentContainerStyle={[
            styles.containerStyle,
            { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray },
          ]}
        >
          <HomeSlider
            onSwipeStart={() => setIsScrolling(false)}
            onSwipeEnd={() => setIsScrolling(true)}
            bannerData={homeScreenData?.banners}
          />
          <TopCategory categoryData={homeScreenData?.service_categories} />
          <Recentbooking recentRideData={homeScreenData?.recent_rides} />
          <TodayOfferContainer couponsData={homeScreenData?.coupons} />
          <BottomTitle />
        </ScrollView>
      )}
    </View>
  );
}

