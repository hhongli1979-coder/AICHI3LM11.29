import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from './styles'
import { useTheme } from '@react-navigation/native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { useDispatch, useSelector } from 'react-redux'
import { PaymentRideInterface } from '../../../../../api/interface/walletInterface'
import { allpayment } from '../../../../../api/store/action'
import { useAppNavigation } from '../../../../../utils/navigation'
import { AppDispatch } from '../../../../../api/store'

export function Bill({ pressRefresh, rideData }: any) {
  const { colors } = useTheme()
  const { translateData } = useSelector((state: any) => state.setting)
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useAppNavigation()

  const handleCashReceived = () => {
    let payload: PaymentRideInterface = {
      ride_id: rideData?.id,
      payment_method: 'cash',
    }

    dispatch(allpayment(payload))
      .unwrap()
      .then(async (res: any) => {
        navigation.navigate('TabNav')
      })
  }

  return (
    <View
      style={[
        styles.billbox,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.completedPaymentView}>
        <Text style={styles.completedPayment}>
          {translateData.paymentPending}
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={pressRefresh}
            style={styles.refreshView}
            activeOpacity={0.7}
          >
            <Text
              style={{ color: appColors.white, fontFamily: appFonts.regular }}
            >
              {translateData.refresh}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCashReceived}
            style={styles.refreshView}
            activeOpacity={0.7}
          >
            <Text
              style={{ color: appColors.white, fontFamily: appFonts.regular }}
            >
              {translateData.collectCash}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
