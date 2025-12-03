import { View, ScrollView, BackHandler, TouchableOpacity, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../../auth/registration/bankDetails/styles'
import appColors from '../../../theme/appColors'
import { Header, Input, Button, notificationHelper } from '../../../commonComponents'
import { useTheme } from '@react-navigation/native'
import { TitleView } from '../../auth/component'
import Icons from '../../../utils/icons/icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../api/store'
import { BankDetailsinterface } from '../../../api/interface/accountInterface'
import { selfDriverData, updateBankDetails } from '../../../api/store/action'
import { useAppNavigation } from '../../../utils/navigation'
import { windowHeight, windowWidth } from '../../../theme/appConstant'


type FormDataType = {
  holdername: string;
  accountnumber: string;
  routingNumber: string;
  bank: string;
  swiftid: string;
  paypalid: string;
};


export function BankDetails() {


  const navigation = useAppNavigation()
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const { colors } = useTheme()
  const { selfDriver } = useSelector((state: any) => state.account)
  const { translateData } = useSelector((state: any) => state.setting)
  const dispatch = useDispatch<AppDispatch>()
  const [loader, setLoader] = useState<boolean>(false)
  const [paypalWarning, setPaypalWarning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'bank' | 'paypal'>('bank')

  const [formData, setFormData] = useState<FormDataType>({
    holdername: '',
    accountnumber: '',
    routingNumber: '',
    bank: '',
    swiftid: '',
    paypalid: ''
  });

  const [initialFormData, setInitialFormData] = useState<any>(null)

  useEffect(() => {
    if (selfDriver) {
      const data = {
        holdername: selfDriver?.payment_account.bank_holder_name || '',
        accountnumber: selfDriver?.payment_account.bank_account_no || '',
        routingNumber: selfDriver?.payment_account.routing_number || '',
        bank: selfDriver?.payment_account.bank_name || '',
        swiftid: selfDriver?.payment_account.swift || '',
        paypalid: selfDriver?.payment_account.paypal_email || '',
      }
      setFormData(data)
      setInitialFormData(data)
    }
  }, [selfDriver])

  const isChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData)

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleChange = (key: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [key]: value,
    }))
  }
  const [isPrimary, setIsPrimary] = useState<null | 'bank' | 'paypal'>(null);



  const isValidHolderName = (name: string): boolean => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  const isFormValid = () => {
    const { holdername, accountnumber, routingNumber, bank, swiftid, paypalid } = formData;

    if (isPrimary === 'bank') {
      return (
        holdername.trim() !== '' &&
        accountnumber.trim() !== '' &&
        routingNumber.trim() !== '' &&
        bank.trim() !== '' &&
        swiftid.trim() !== ''
      );
    }

    if (isPrimary === 'paypal') {
      return paypalid.trim() !== '' && isValidEmail(paypalid);
    }

    return false;
  };


  const gotoDocument = () => {


    if (!isPrimary) {
      notificationHelper('', translateData?.selectOption, 'error');
      return;
    }


    if (isPrimary === 'bank') {
      setShowWarning(true)
    }
    else {
      setPaypalWarning(true)
    }

    if (!isChanged) {
      notificationHelper('',translateData?.nochangefound, 'info')
      return
    }
    if (isPrimary === 'bank') {
      if (!isValidHolderName(formData.holdername)) {
        setShowWarning(true)
        return
      }
    }

    if (!isFormValid()) {
      notificationHelper('', translateData.pleaseFillAllFieldsCorrectly, 'error')
      return
    }

    const payload: BankDetailsinterface = {
      bank_name: formData.bank,
      bank_holder_name: formData.holdername,
      bank_account_no: formData.accountnumber,
      routing_number: formData.routingNumber,
      swift: formData.swiftid,
      paypal_email: formData.paypalid,
      default: isPrimary
    }


    setLoader(true)
    dispatch(updateBankDetails(payload))
      .unwrap()
      .then((res: any) => {
        setLoader(false)
        if (!res?.success) {
          setShowWarning(false)
          navigation.goBack()
          notificationHelper('', translateData.detailsUpdateSuccessfully, 'success')
          dispatch(selfDriverData())
        } else {
          notificationHelper('', translateData.somethingwentwrong, 'error')
        }
      })
  }
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
    <ScrollView style={[styles.main, { backgroundColor: colors.background, marginBottom: windowWidth(5) }]}>
      <Header title={translateData.bankDetails} />

      <View style={{ flexDirection: "row", margin: 10, marginTop: windowHeight(3) }}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: windowWidth(3),
            backgroundColor: activeTab === "bank" ? appColors.primary : colors.card,
            borderRadius: windowWidth(2),
            alignItems: "center",
            marginHorizontal: windowWidth(2)
          }}
          onPress={() => {
            setActiveTab("bank");
            setShowWarning(false); // 🔹 reset warning
          }}        >
          <Text style={{ color: activeTab === "bank" ? appColors.white : appColors.secondaryFont }}>
            {translateData.bankDetails}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            padding: windowWidth(3),
            backgroundColor: activeTab === "paypal" ? appColors.primary : colors.card,
            borderRadius: windowWidth(2),
            alignItems: "center",
            marginHorizontal: windowWidth(2)
          }}
          onPress={() => {
            setActiveTab("paypal");
            setPaypalWarning(false);
          }}
        >
          <Text style={{ color: activeTab === "paypal" ? appColors.white : appColors.secondaryFont }}>
            {translateData?.payPal}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.subView, { backgroundColor: colors.background }]}>

        {activeTab === "bank" && (
          <View style={styles.inputfildView}>
            <TitleView
              title={translateData.bankDetails}
              subTitle={translateData.registerContent}
              primary={true}
              onPress={() =>
                setIsPrimary(prev => (prev === "bank" ? null : "bank"))
              }
              selected={isPrimary === "bank"}
            />
            <Input
              titleShow
              title={translateData.holderName}
              placeholder={translateData.enterHolderName}
              value={formData.holdername}
              onChangeText={text => handleChange('holdername', text)}
              showWarning={
                showWarning &&
                (formData.holdername.trim() === '' || !isValidHolderName(formData.holdername))
              }
              warning={
                formData.holdername.trim() === ''
                  ? translateData.enterYourholderName
                  : 'Holder name cannot contain numbers or special characters'
              }
              backgroundColor={colors.card}
              icon={<Icons.UserName />}
            />

            <Input
              titleShow
              title={translateData.accountNumber}
              placeholder={translateData.enterAccountNumber}
              keyboardType="default"
              value={formData.accountnumber}
              onChangeText={text => handleChange('accountnumber', text)}
              showWarning={showWarning && formData.accountnumber.trim() === ''}
              warning={translateData.enterYouraccountNumber}
              backgroundColor={colors.card}
              icon={<Icons.AccountNo />}
            />

            <Input
              titleShow
              title={translateData.routingnumber}
              placeholder={translateData.enterRoutingNumber}
              value={formData.routingNumber}
              onChangeText={text => handleChange('routingNumber', text)}
              showWarning={showWarning && formData.routingNumber.trim() === ''}
              warning={translateData.enterYourifscCode}
              backgroundColor={colors.card}
              icon={<Icons.AccountIFSC />}
              keyboardType="default"
            />

            <Input
              titleShow
              title={translateData.bankName}
              placeholder={translateData.enterBankName}
              value={formData.bank}
              onChangeText={text => handleChange('bank', text)}
              showWarning={showWarning && formData.bank.trim() === ''}
              warning={translateData.enterYorebankName}
              backgroundColor={colors.card}
              icon={<Icons.Bank color={appColors.secondaryFont} />}
            />

            <Input
              titleShow
              title={translateData.bankDetailsSwiftId}
              placeholder={translateData.bankDetailsSwiftIdPlaceHolder}
              value={formData.swiftid}
              onChangeText={text => handleChange('swiftid', text)}
              showWarning={showWarning && formData.swiftid.trim() === ''}
              warning={translateData.bankDetailsSwiftIdWarning}
              backgroundColor={colors.card}
              icon={<Icons.Bank color={appColors.secondaryFont} />}
            />
          </View>
        )}

        {/* 🔹 PayPal Tab */}
        {activeTab === "paypal" && (
          <View style={styles.inputfildView}>
            <TitleView
              title={translateData?.pauPal}
              subTitle={translateData.registerContent}
              primary={true}
              onPress={() =>
                setIsPrimary(prev => (prev === "paypal" ? null : "paypal"))
              }
              selected={isPrimary === "paypal"}
            />
            <Input
              titleShow
              title={translateData.bankDetailsPaypalId}
              placeholder={translateData.bankDetailsEnterPaypalId}
              value={formData.paypalid}
              onChangeText={text => handleChange('paypalid', text)}
              showWarning={
                paypalWarning &&
                (formData.paypalid.trim() === '' || !isValidEmail(formData.paypalid))
              }
              warning={
                formData.paypalid.trim() === ''
                  ? translateData.bankDetailsPaypalIdWarning
                  : 'Please enter a valid email address'
              }
              backgroundColor={colors.card}
              icon={<Icons.Bank color={appColors.secondaryFont} />}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>
        )}
        <View style={{ marginTop: windowHeight(1.5) }}>
          <Button
            onPress={gotoDocument}
            title={translateData.update}
            backgroundColor={appColors.primary}
            color={appColors.white}
            loading={loader}

          />
        </View>
      </View>
    </ScrollView>
  )
}
