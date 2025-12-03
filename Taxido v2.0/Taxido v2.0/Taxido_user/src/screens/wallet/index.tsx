import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { BalanceTopup, List } from "./component/index";
import { Header, notificationHelper } from "@src/commonComponent";
import { useValues } from '@src/utils/context/index';
import { appColors } from "@src/themes";
import { useDispatch, useSelector } from "react-redux";
import Images from "@src/utils/images";
import { NoInternet } from "@src/components";
import styles from "./styles";
import { SkeltonAppPage } from "../bottomTab/profileTab/appPageScreen/component";
import { useNavigation } from "@react-navigation/native";
import { paymentsData } from "@src/api/store/actions";
import { clearValue } from "@src/utils/localstorage";

export function Wallet() {
  const dispatch = useDispatch();
  const { textColorStyle, isDark, bgFullLayout } = useValues();
  const { walletTypedata, statusCode } = useSelector((state: any) => state.wallet);
  const [loading, setLoading] = useState(true);
  const { translateData } = useSelector((state: any) => state.setting);
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(paymentsData())
      .unwrap()
      .then(async (res: any) => {
        if (res?.status == 403) {
          notificationHelper('', translateData.loginAgain, 'error');
          await clearValue('token');
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
          return;
        }
      })
      .catch((error: any) => {
        console.error('Error fetching paymentsData:', error);
      });
  }, []);


  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: isDark ? appColors.primaryText : appColors.lightGray,
        },
      ]}
    >
      <Header value={translateData.myWallet} />
      <BalanceTopup balance={walletTypedata?.balance || 0} />
      <Text style={[styles.title, { color: textColorStyle }]}>
        {translateData.history}
      </Text>

      {!loading ? (
        <View
          style={[
            styles.dataView,
            { backgroundColor: bgFullLayout, borderColor: appColors.border },
            {
              borderColor: isDark ? appColors.darkBorder : appColors.border
            }
          ]}
        >
          <View style={styles.skeltonAppPage}>
            <SkeltonAppPage />
          </View>
        </View>
      ) : walletTypedata?.histories?.length > 0 ? (
        <List dataList={walletTypedata?.histories} />
      ) : (
        <View style={styles.noInternet}>
          <NoInternet
            btnHide
            title={translateData.noBalance}
            details={translateData.noBalanceDes}
            image={isDark ? Images.noBalanceDark : Images.noBalance}
            infoIcon
            status={`${translateData.statusCode} ${statusCode}`}
          />
        </View>
      )}
    </View>
  );
}
