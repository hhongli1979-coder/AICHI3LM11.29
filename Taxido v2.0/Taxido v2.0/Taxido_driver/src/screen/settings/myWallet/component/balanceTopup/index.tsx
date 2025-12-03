import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import styles from './styles'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../../navigation/main/types'
import { useSelector } from 'react-redux'
import appFonts from '../../../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../../../../theme/appConstant'
import appColors from '../../../../../theme/appColors'
import Images from '../../../../../utils/images/images'
import Icons from '../../../../../utils/icons/icons'
import { notificationHelper } from '../../../../../commonComponents'

type NavigationProps = NativeStackNavigationProp<RootStackParamList>

interface BalanceTopupProps {
  walletTypedata: number
}

export function BalanceTopup({ walletTypedata }: BalanceTopupProps) {
  const navigation = useNavigation<NavigationProps>()
  const { taxidoSettingData, translateData } = useSelector((state: any) => state.setting)
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)

  const [isVisible, setIsVisible] = useState(true);
  const rawAmount = `${zoneValue?.currency_symbol}${((walletTypedata ?? 0)).toFixed(2)}`;
  const maskNumber = (amount: string): string => {
    const numericPart = amount.replace(/[^0-9.]/g, "");
    const masked = numericPart.replace(/[0-9]/g, "*");
    return `${zoneValue.currency_symbol}${masked}`;
  };
  const { selfDriver } = useSelector((state: any) => state.account);

  const maskedAmount = maskNumber(rawAmount);
  const gotoTopWithDraw = () => {
    if (walletTypedata >= taxidoSettingData?.taxido_values?.driver_commission?.min_withdraw_amount) {
      navigation.navigate('TopupWallet')
    } else {
      notificationHelper("", `${translateData.minimumAmount} ${zoneValue?.currency_symbol}${(zoneValue?.exchange_rate * taxidoSettingData?.taxido_values?.driver_commission?.min_withdraw_amount).toFixed(2)}.`, "error")
    }
  }

  const gotoTopUp = () => {
    navigation.navigate('TopUp')
  }


  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.mainBalance}>
      <Image source={Images.cardBackground} style={styles.walletImage} />
      <View style={[styles.subBalance]}>
        <View style={{ marginHorizontal: windowWidth(4) }}>
          <View style={styles.balanceView}>
            <Text style={styles.balanceTitle}>{translateData.availableBalance}</Text>
          </View>
          <View style={{ borderBottomWidth: 1, borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed', width: '100%', borderColor: appColors.value }} />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: windowHeight(2.2),
              alignItems: 'center',
            }}
          >
            <Text
              style={[
                styles.totalBalance,
                {
                  fontVariant: ['tabular-nums'],
                  minWidth: 100,
                  textAlign: 'center',
                },
              ]}
            >
              {isVisible ? rawAmount : maskedAmount}
            </Text>

            <TouchableOpacity
              onPress={() => setIsVisible(prev => !prev)}
              style={{
                marginHorizontal: windowWidth(2),
                alignItems: 'center',
                justifyContent: 'center',
                height: windowHeight(3),
              }}
            >
              {isVisible ? <Icons.WalletEye /> : <Icons.WalletEyeClose />}
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {selfDriver?.role == 'driver' && (
              <TouchableOpacity activeOpacity={0.9} onPress={gotoTopUp} style={{ backgroundColor: appColors.white, height: windowHeight(4.4), width: '47.5%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: windowHeight(0.8) }}>
                <Icons.TopUp />
                <Text style={{ color: appColors.primary, marginHorizontal: windowWidth(1.5), fontFamily: appFonts.medium }}>{translateData.topUp}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity activeOpacity={0.9} onPress={gotoTopWithDraw} style={{ backgroundColor: appColors.white, height: windowHeight(4.4), width: '47.5%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: windowHeight(0.8) }}>
              <Icons.DollorLarge />
              <Text
                style={{
                  color: appColors.primary,
                  marginHorizontal: windowWidth(1.5),
                  fontFamily: appFonts.medium,
                }}
              >
                {translateData.topupWallet}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={{ color: appColors.toup, fontFamily: appFonts.regular, fontSize: fontSizes.FONT4, textAlign: 'center', marginTop: windowHeight(1) }}>{translateData?.balanceOf} {formattedDate} </Text>
    </View>
  )
}
