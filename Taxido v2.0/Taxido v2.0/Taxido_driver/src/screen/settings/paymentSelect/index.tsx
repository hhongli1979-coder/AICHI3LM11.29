import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { paymentsData, purchaseData } from '../../../api/store/action'
import {
  Button,
  CustomRadioButton,
  Header,
  notificationHelper,
} from '../../../commonComponents'
import appColors from '../../../theme/appColors'
import styles from './styles'
import { PurchasePlanDataInterface } from '../../../api/interface/walletInterface'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useValues } from '../../../utils/context'
import { windowHeight } from '../chat/context'
import { clearValue } from '../../../utils/localstorage'
import { AppDispatch } from '../../../api/store'

export function PaymentSelect() {

  const route = useRoute<any>()
  const { viewRtlStyle, textRtlStyle } = useValues()
  const { planId } = route.params
  const { paymentMethodData } = useSelector((state: any) => state.wallet)
  const { translateData } = useSelector((state: any) => state.setting)
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const dispatch = useDispatch<AppDispatch>()
  const { navigate } = useNavigation<any>()
  const navigation = useNavigation<any>()
  const { isDark } = useValues()

  useEffect(() => {
    dispatch(paymentsData())
      .unwrap()
      .then(res => {
        if (res?.status === 403) {
          notificationHelper('', translateData.pleaseloginagain, 'error')
          clearValue().then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          })
        }
      })
      .catch(err => {
      })
  }, [])

  const paymentData = (index: number, name: any) => {
    setSelectedItem(index === selectedItem ? null : index)
    setSelectedPaymentMethod(index === selectedItem ? null : name)
  }

  const purchaPlan = () => {
    let payload: PurchasePlanDataInterface = {
      plan_id: planId,
      payment_method: selectedPaymentMethod,
    }

    dispatch(purchaseData(payload))
      .unwrap()
      .then((res: any) => {
        if (res.is_redirect) {
          notificationHelper('', translateData.purchasedsuccessfully, 'success')
          navigate('PaymentWebView', {
            url: res.url,
            selectedPaymentMethod: selectedPaymentMethod,
          })
        } else {
          notificationHelper('', res.message, 'error')
        }
      })
  }

  const filteredPaymentMethods = paymentMethodData.filter(
    (item: any) => item.slug !== 'cash',
  )

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      onPress={() => paymentData(index, item.slug)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.modalPaymentView,
          {
            flexDirection: viewRtlStyle,
          },
        ]}
      >
        <View
          style={{ flexDirection: viewRtlStyle, marginTop: windowHeight(14) }}
        >
          <View
            style={[
              styles.imageBg,
              {
                borderColor: isDark
                  ? appColors.darkBorderBlack
                  : appColors.border,
              },
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.paymentImage} />
          </View>
          <View style={styles.mailInfo}>
            <Text
              style={[
                styles.mail,
                { color: isDark ? appColors.darkText : appColors.primaryFont },
              ]}
            >
              {item.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.payBtn} activeOpacity={0.7}>
          <CustomRadioButton selected={index === selectedItem} />
        </TouchableOpacity>
      </View>
      {index !== 3 ? (
        <View
          style={[
            styles.borderPayment,
            {
              borderColor: isDark ? appColors.bgDark : appColors.graybackground,
            },
          ]}
        />
      ) : null}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Header title={translateData.PaymentTextMethod} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.selectContainer}>
          <Text style={[styles.selectText, { textAlign: textRtlStyle }]}>
            {translateData.selectMethod}
          </Text>
          <FlatList
            data={filteredPaymentMethods}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
          />
        </View>
        <View style={styles.payNowContainer}>
          <Button
            title={translateData.PayNow}
            backgroundColor={appColors.primary}
            color={appColors.white}
            onPress={purchaPlan}
          />
        </View>
      </ScrollView>
    </View>
  )
}
