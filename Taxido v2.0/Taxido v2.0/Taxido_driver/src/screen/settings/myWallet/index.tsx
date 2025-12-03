import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, Image, TouchableOpacity, FlatList, BackHandler } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Menu, MenuOptions, MenuTrigger, renderers } from 'react-native-popup-menu'
import { BalanceTopup, List, Selection } from './component/'
import { Header, notificationHelper } from '../../../commonComponents'
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native'
import { fleetWithdrawRequestData, paymentsData, withdrawRequestData } from '../../../api/store/action/walletActions'
import Images from '../../../utils/images/images'
import appColors from '../../../theme/appColors'
import Icons from '../../../utils/icons/icons'
import commonStyles from '../../../style/commanStyles'
import styles from './styles'
import { useValues } from '../../../utils/context'
import { SkeletonWallet } from './component/List/skeletonWallet'
import { windowWidth } from '../../../theme/appConstant'
import { AppDispatch } from '../../../api/store'
const { Popover } = renderers

export function MyWallet() {
  const { viewRtlStyle, isDark, textRtlStyle } = useValues()
  const { colors } = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const { walletTypedata, statusCode, withdrawRequestValue } = useSelector((state: any) => state.wallet)
  const { translateData } = useSelector((state: any) => state.setting)
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)
  const [activeTab, setActiveTab] = useState<'wallet' | 'withdraw'>('wallet')
  const { selfDriver } = useSelector((state: any) => state.account)

  useFocusEffect(
    useCallback(() => {
      dispatch(paymentsData())
    }, [dispatch])
  )

  useEffect(() => {
    if (selfDriver?.role == 'fleet_manager') {
      dispatch(fleetWithdrawRequestData())
    } else {
      dispatch(withdrawRequestData())
    }
  }, [dispatch])

  const [loading, setLoading] = useState(false)

  const handleButtonPress = (tab: 'wallet' | 'withdraw') => {
    setActiveTab(tab)
  }


  const renderItem = useCallback(
    ({ item }: any) => (
      <View
        style={[
          styles.listItem,
          {
            flexDirection: viewRtlStyle,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.leftSection}>
          <Text style={[styles.dateText, { textAlign: textRtlStyle }]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          <Text
            style={[
              styles.paymentTypeText,
              { color: colors.text, textAlign: textRtlStyle },
            ]}
          >
            {item.payment_type.charAt(0).toUpperCase() + item.payment_type.slice(1)}
          </Text>
        </View>
        <View style={styles.rightSection}>
          <Text
            style={[
              styles.amountText,
              { color: isDark ? appColors.white : appColors.primaryFont },
            ]}
          >
            {zoneValue?.currency_symbol}
            {(zoneValue?.exchange_rate * item.amount).toFixed(2)}
          </Text>
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === 'rejected' ? appColors.red : appColors.price,
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    ),
    [colors, isDark, viewRtlStyle, textRtlStyle, zoneValue]
  )

  const renderEmptyState = () => (
    <View style={styles.noDataContainer}>
      <Image source={Images.noDataWallet} style={styles.noDataImg} />
      <View style={[styles.walletContainer, { flexDirection: viewRtlStyle }]}>
        <Text
          style={[
            styles.msg,
            { color: isDark ? colors.text : appColors.primaryFont },
          ]}
        >
          {translateData.walletBalanceEmpty}
        </Text>
        <Menu
          renderer={Popover}
          rendererProps={{
            preferredPlacement: 'bottom',
          }}
        >
          <MenuTrigger style={styles.menuTrigger}>
            <Icons.Info />
          </MenuTrigger>
          <MenuOptions customStyles={{ optionsContainer: commonStyles.popupContainer }}>
            <Text style={commonStyles.popupText}>
              {`${translateData.statusCode} ${statusCode}`}
            </Text>
          </MenuOptions>
        </Menu>
      </View>
      <Text style={styles.detail}>{translateData.clickrefresh}</Text>
      <TouchableOpacity
        style={styles.refreshContainer}
        activeOpacity={0.7}
        onPress={() => {
          if (activeTab === 'wallet') {
            setLoading(true)
            dispatch(paymentsData()).finally(() => setLoading(false))
            notificationHelper("", translateData?.dataUpdated, "success");
          } else {
            setLoading(true)
            if (selfDriver?.role == 'fleet_manager') {
              dispatch(fleetWithdrawRequestData()).finally(() => setLoading(false))
            } else {
              dispatch(withdrawRequestData()).finally(() => setLoading(false))
            }

            notificationHelper("", translateData?.dataUpdated, "success");

          }
        }}
      >
        <Text style={styles.refreshText}>{translateData.refresh}</Text>
      </TouchableOpacity>

    </View>
  )

  const navigation = useNavigation();
  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <Header title={translateData.myWallet} />
      <BalanceTopup walletTypedata={walletTypedata?.balance} />
      <Selection onButtonPress={handleButtonPress} activeTab={activeTab} />

      {loading ? (
        <SkeletonWallet />
      ) : activeTab === 'wallet' ? (
        walletTypedata?.histories?.length > 0 ? (
          <List walletTypedata={walletTypedata?.histories} />
        ) : (
          renderEmptyState()
        )
      ) : activeTab === 'withdraw' ? (
        withdrawRequestValue?.data?.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={withdrawRequestValue?.data}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
            style={{ marginBottom: windowWidth(5), paddingBottom: windowWidth(55) }}
          />
        ) : (
          renderEmptyState()
        )
      ) : null}

    </View>
  )
}
