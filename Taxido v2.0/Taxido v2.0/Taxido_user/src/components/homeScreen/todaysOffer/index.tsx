import React, { useContext, useEffect, useMemo } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { external } from "../../../styles/externalStyle";
import { TitleContainer } from "@src/commonComponent";
import { Coupons } from "@src/screens/bottomTab/profileTab/promoCode/component/coupons";
import { couponListData } from "@src/api/store/actions";
import Images from "@src/utils/images";
import { NoInternet } from "@src/components/noInternet";
import { LocationContext } from "@src/utils/locationContext";
import { useValues } from "@src/utils/context/index";;
import styles from "./styles";
import { windowHeight } from "@src/themes";
import { AppDispatch } from "@src/api/store";

export function TodayOfferContainer({ couponsData }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { couponsList, statusCode } = useSelector((state: any) => state.coupon);
  const { categoryOptionID } = useContext(LocationContext);
  const { isDark, viewRTLStyle } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);

  useEffect(() => {
    dispatch(
      couponListData({
        service_category_id: 1,
        service_id: categoryOptionID,
        zoneIds: 2,
      })
    );
  }, [dispatch, categoryOptionID]);

  const displayedCoupons = useMemo(() => {
    if (!couponsData || couponsData.length === 0) return [];
    return couponsData.slice(0, 3);
  }, [couponsData]);

  return (
    <View>
      <View style={[styles.titleContainer, { marginHorizontal: windowHeight(12), marginTop: windowHeight(8) }]}>
        <TitleContainer title={translateData.trendingOffer} />
      </View>

      <View style={[styles.couponsList, external.mh_10]}>
        {couponsData && couponsData.length > 0 ? (
          <Coupons couponsList={{ ...couponsList, data: couponsData.slice(0, 3) }} />
        ) : couponsData === undefined || couponsData === null ? null : (
          <View style={[styles.NoInternetView, { flexDirection: viewRTLStyle }]}>
            <NoInternet
              btnHide
              title={translateData.noCoupons}
              details={translateData.noCouponDes}
              image={isDark ? Images.noOfferDark : Images.noOffer}
              infoIcon
              status={`${translateData.statusCode} ${statusCode || 204}`}
            />
          </View>
        )}

      </View>
    </View>
  );
}



