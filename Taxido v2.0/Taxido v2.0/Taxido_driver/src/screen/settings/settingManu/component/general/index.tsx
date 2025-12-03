import { View, Text, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './styles'
import Icons from '../../../../../utils/icons/icons'
import appColors from '../../../../../theme/appColors'
import { ListItem } from '../'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'
import { useSelector } from 'react-redux'
import { useAppNavigation } from '../../../../../utils/navigation'
import firestore from "@react-native-firebase/firestore";

export function General() {
  const navigation = useAppNavigation()
  const { colors } = useTheme()
  const { textRtlStyle, isDark } = useValues()
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting)
  const { selfDriver } = useSelector((state: any) => state.account);
  const adminId = 1;
  const chatId = [adminId, selfDriver?.id].sort().join('_')
  const [unreadCount, setUnreadCount] = useState<number | any>(0);


  useEffect(() => {
    const currentUserId = selfDriver?.id;
    if (!currentUserId || !chatId) return;
    const unsubscribe = firestore()
      .collection("chats")
      .doc(chatId)
      .onSnapshot(doc => {
        if (doc?.exists) {
          const data = doc.data();
          const counts = data?.unreadCount || {};
          const myUnread = counts[currentUserId] ?? 0;
          const otherUserId: any = Object.keys(counts).find(id => id !== String(currentUserId));
          const otherUnread = counts[otherUserId] ?? 0;
          setUnreadCount({ myUnread, otherUnread });
        }
      });
    return () => unsubscribe();
  }, [chatId, selfDriver?.id]);

  const gotoPolicy = () => {
    const url = taxidoSettingData?.taxido_values?.setting?.driver_privacy_policy;
    Linking.openURL(url).catch(err => err);
  };



  return (
    <View>
      <Text
        style={[
          styles.title,
          { color: colors.text, textAlign: textRtlStyle },
        ]}
      >
        {translateData.general}
      </Text>
      <View
        style={[
          styles.listView,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <>
          <ListItem
            icon={<Icons.UserSetting color={colors.text} />}
            text={translateData.profileSettings}
            backgroundColor={
              isDark ? colors.background : appColors.graybackground
            }
            color={isDark ? appColors.white : appColors.primaryFont}
            onPress={() => navigation.navigate('ProfileSetting')}
            showNextIcon={true}
          />

          <View style={[styles.border, { borderColor: colors.border }]} />
          <ListItem
            icon={<Icons.WalletSetting color={colors.text} />}
            text={translateData.myWallet}
            backgroundColor={
              isDark ? colors.background : appColors.graybackground
            }
            color={isDark ? appColors.white : appColors.primaryFont}
            onPress={() => navigation.navigate('MyWallet')}
            showNextIcon
          />

          <View style={[styles.border, { borderColor: colors.border }]} />
          <ListItem
            icon={<Icons.settingIcon color={colors.text} />}
            text={translateData.appSetting}
            backgroundColor={
              isDark ? colors.background : appColors.graybackground
            }
            color={isDark ? appColors.white : appColors.primaryFont}
            onPress={() => navigation.navigate('AppSettings')}
            showNextIcon
          />

          {taxidoSettingData?.taxido_values?.activation?.driver_subscription == 1 && selfDriver?.role == 'driver' && (
            <>
              <View style={[styles.border, { borderColor: colors.border }]} />
              <ListItem
                icon={<Icons.Subscription color={colors.text} />}
                text={translateData.subscriptionPlan}
                backgroundColor={
                  isDark ? colors.background : appColors.graybackground
                }
                color={isDark ? appColors.white : appColors.primaryFont}
                onPress={() => navigation.navigate('Subscription')}
                showNextIcon
              />
            </>
          )}
          <View style={[styles.border, { borderColor: colors.border }]} />
          {selfDriver?.service_category_id == 5 &&
            <>
              <ListItem
                icon={<Icons.VehicleList color={colors.text} />}
                text={translateData.rentalVehicle}
                backgroundColor={
                  isDark ? colors.background : appColors.graybackground
                }
                color={isDark ? appColors.white : appColors.primaryFont}
                onPress={() => navigation.navigate('VehicleList')}
                showNextIcon
              />
              <View style={[styles.border, { borderColor: colors.border }]} />
            </>
          }
          <ListItem
            icon={<Icons.MessageEmpty color={colors.text} />}
            text={translateData.supportTicket}
            backgroundColor={
              isDark ? colors.background : appColors.graybackground
            }
            color={isDark ? appColors.white : appColors.primaryFont}
            onPress={() => navigation.navigate('SupportTicket')}
            showNextIcon
          />
          <View style={[styles.border, { borderColor: colors.border }]} />
          <ListItem
            dot={unreadCount?.myUnread > 0}
            icon={<Icons.HelpSupport color={colors.text} />}
            text={translateData?.chatwithstaf}
            backgroundColor={
              isDark ? colors.background : appColors.graybackground
            }
            color={isDark ? appColors.white : appColors.primaryFont}
            onPress={() => navigation.navigate('Chat', {
              driverId: selfDriver?.id,
              from: "help",
              riderName: selfDriver?.name,
              setUnreadCount: setUnreadCount
            })}
            showNextIcon
          />

          {selfDriver?.role != 'driver' && (
            <>
              <View style={[styles.border, { borderColor: colors.border }]} />
              <ListItem
                icon={<Icons.VehicleList color={colors.text} />}
                text={translateData?.manageVehicle}
                backgroundColor={
                  isDark ? colors.background : appColors.graybackground
                }
                color={isDark ? appColors.white : appColors.primaryFont}
                onPress={() => navigation.navigate('ManageVehicle')}
                showNextIcon={true}
              />
            </>
          )}

          {selfDriver?.role != 'driver' && (
            <>
              <View style={[styles.border, { borderColor: colors.border }]} />
              <ListItem
                icon={<Icons.Driver color={colors.text} />}
                text={translateData?.manageDriver}
                backgroundColor={
                  isDark ? colors.background : appColors.graybackground
                }
                color={isDark ? appColors.white : appColors.primaryFont}
                onPress={() => navigation.navigate('DriverList')}
                showNextIcon={true}
              />
            </>
          )}
          {taxidoSettingData?.taxido_values?.setting?.driver_privacy_policy && (
            <>
              <View style={[styles.border, { borderColor: colors.border }]} />
              <ListItem
                icon={<Icons.privacyPolicy color={colors.text} />}
                text={translateData.privacyPolicy}
                backgroundColor={
                  isDark ? colors.background : appColors.graybackground
                }
                color={isDark ? appColors.white : appColors.primaryFont}
                onPress={gotoPolicy}
                showNextIcon
              />
            </>
          )}
          {taxidoSettingData?.taxido_values?.activation?.referral_enable == 1 && selfDriver?.role == 'driver' && (
            <>
              <View style={[styles.border, { borderColor: colors.border }]} />
              <ListItem
                icon={<Icons.Referral color={colors.text} />}
                text={translateData?.erarnMoney}
                backgroundColor={
                  isDark ? colors.background : appColors.graybackground
                }
                color={isDark ? appColors.white : appColors.primaryFont}
                onPress={() => navigation.navigate('ReferralHome')}
                showNextIcon={true}
              />
            </>
          )}
          {selfDriver?.role == 'driver' && taxidoSettingData?.taxido_values?.activation?.driver_incentive_enable == 1 && (
            <>
              <View style={[styles.border, { borderColor: colors.border }]} />
              <ListItem
                icon={<Icons.IncentiveIcon color={colors.text} />}
                text={translateData?.incentive}
                backgroundColor={
                  isDark ? colors.background : appColors.graybackground
                }
                color={isDark ? appColors.white : appColors.primaryFont}
                onPress={() => navigation.navigate('Incentive')}
                showNextIcon={true}
              />
            </>
          )}
        </>

      </View>
    </View>
  )
}
