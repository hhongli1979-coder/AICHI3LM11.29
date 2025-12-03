import { View, ScrollView, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './styles'
import appColors from '../../../../theme/appColors'
import { ProgressBar } from '../component'
import { Input, Button, notificationHelper } from '../../../../commonComponents'
import { useIsFocused, useTheme } from '@react-navigation/native'
import { Header, TitleView } from '../../component'
import { useValues } from '../../../../utils/context'
import { getValue, setValue } from '../../../../utils/localstorage/index'
import { useDispatch, useSelector } from 'react-redux'
import { URL } from '../../../../api/config'
import { useAppNavigation } from '../../../../utils/navigation'
import { selfDriverData } from '../../../../api/store/action'
import { AppDispatch } from '../../../../api/store'

export function BankDetail() {
  const navigation = useAppNavigation()
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [fcmToken, setFcmToken] = useState<string>('')
  const isFocused = useIsFocused();
  const { colors } = useTheme()
  const { accountDetail, documentDetail, vehicleDetail, setToken, isDark } = useValues()
  const dispatch = useDispatch<AppDispatch>()

  const [formDatas, setFormData] = useState({
    holdername: '',
    accountnumber: '',
    ifsecode: '',
    bank: '',
    swift: '',
    paypalID: '',
  })
  const { translateData } = useSelector((state: any) => state.setting)

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    const fetchToken = async () => {
      let fcmToken = await getValue('fcmToken')
      if (fcmToken) {
        setFcmToken(fcmToken)
      }
    }
    fetchToken()
  }, [isFocused])

  const handleChange = (key: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [key]: value,
    }))
  }

  const gotoDocument = () => {
    const isFormValid = Object.values(formDatas).every(
      value => value.trim() !== '',
    )

    if (!isFormValid) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
      handleRegister()
    }
  }


  const handleRegister = async () => {
    setLoading(true);
    try {

      const formData = new FormData();
      formData.append('username', accountDetail.username);
      formData.append('name', accountDetail.name);
      formData.append('email', accountDetail.email);
      formData.append('country_code', accountDetail.countryCode?.callingCode?.[0] || '');
      formData.append('phone', accountDetail.phoneNumber);
      formData.append('password', accountDetail.password);
      formData.append('password_confirmation', accountDetail.confirmPassword);
      formData.append('ambulance[name]', vehicleDetail.ambulanceName);
      formData.append('ambulance[description]', vehicleDetail.ambulanceDescription);
      formData.append('service_id', vehicleDetail.serviceName);
      formData.append('service_category_id', vehicleDetail.serviceCategory);
      formData.append('vehicle[vehicle_type_id]', vehicleDetail.vehicleType);
      formData.append('vehicle[model]', vehicleDetail.vehicleName);
      formData.append('vehicle[plate_number]', vehicleDetail.vehicleNumber);
      formData.append('vehicle[color]', vehicleDetail.vehicleColor);
      formData.append('vehicle[seat]', vehicleDetail.maximumSeats);
      formData.append('payment_account[bank_name]', formDatas.bank);
      formData.append('payment_account[bank_holder_name]', formDatas.holdername);
      formData.append('payment_account[bank_account_no]', formDatas.accountnumber);
      formData.append('payment_account[swift]', formDatas.swift);
      formData.append('payment_account[ifsc]', formDatas.ifsecode);
      formData.append('payment_account[paypal_email]', formDatas.paypalID);
      formData.append('fcm_token', fcmToken);

      Object.keys(documentDetail).forEach((key, index) => {
        const doc = documentDetail[key]?.file?.[0];
        const expiryDate = documentDetail[key]?.expiryDate;

        if (doc) {
          formData.append(`documents[${index}][file]`, {
            uri: doc.uri,
            type: doc.type,
            name: doc.name,
            size: doc.size || null,
            fileCopyUri: doc.fileCopyUri || null,
          });
          formData.append(`documents[${index}][slug]`, key);
          if (expiryDate) {
            formData.append(`documents[${index}][expired_at]`, expiryDate);
          }
        }
      });

      const response = await fetch(`${URL}/api/driver/register`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      const data = await response.json();

      if (data?.ok == true) {

        await setValue('token', data.access_token);
        setToken(data.access_token);
        notificationHelper('', translateData.registerSuccessfully, 'success');

        await dispatch(selfDriverData());

        if (data?.is_verified == 1) {
          navigation.replace('TabNav');
        } else {
          navigation.navigate('Verification');
        }
      } else {
        notificationHelper('', data?.message, 'error');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Header backgroundColor={isDark ? colors.card : appColors.white} />
      <ProgressBar fill={4} />
      <ScrollView
        style={[styles.main, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.subView, { backgroundColor: colors.background }]}>
          <View style={styles.inputfildView}>
            <TitleView
              title={translateData.bankDetails}
              subTitle={translateData.registerContent}
            />
            <Input
              title={translateData.holderName}
              titleShow={true}
              backgroundColor={
                isDark ? appColors.darkThemeSub : appColors.white
              }
              placeholder={translateData.enterHolderName}
              value={formDatas.holdername}
              onChangeText={text => handleChange('holdername', text)}
              showWarning={showWarning && formDatas.holdername === ''}
              warning={translateData.enterYourholderName}
              keyboardType="default"
            />
            <View style={styles.accNumber}>
              <Input
                title={translateData.accountNumber}
                titleShow={true}
                backgroundColor={
                  isDark ? appColors.darkThemeSub : appColors.white
                }
                placeholder={translateData.enterAccountNumber}
                keyboardType="number-pad"
                value={formDatas.accountnumber}
                onChangeText={text => handleChange('accountnumber', text)}
                showWarning={showWarning && formDatas.accountnumber === ''}
                warning={translateData.enterYouraccountNumberrrr}
              />
            </View>
            <View style={styles.code}>
              <Input
                title={translateData.ifscCode}
                titleShow={true}
                placeholder={translateData.enterIFSCCode}
                value={formDatas.ifsecode}
                onChangeText={text => handleChange('ifsecode', text)}
                showWarning={showWarning && formDatas.ifsecode === ''}
                warning={translateData.enterYourifscCodeeeeee}
                backgroundColor={
                  isDark ? appColors.darkThemeSub : appColors.white
                }
                keyboardType="default"
              />
            </View>
            <View style={styles.bank}>
              <Input
                title={translateData.bankName}
                titleShow={true}
                placeholder={translateData.enterBankName}
                value={formDatas.bank}
                onChangeText={text => handleChange('bank', text)}
                showWarning={showWarning && formDatas.bank === ''}
                warning={translateData.enterYorebankNameeee}
                backgroundColor={
                  isDark ? appColors.darkThemeSub : appColors.white
                }
                keyboardType="default"
              />
            </View>
            <View style={styles.swiftCode}>
              <Input
                title={translateData.swiftCode}
                titleShow={true}
                placeholder={translateData.enterSwiftCode}
                value={formDatas.swift}
                onChangeText={text => handleChange('swift', text)}
                showWarning={showWarning && formDatas.swift === ''}
                warning={translateData.enterYourSwiftttt}
                backgroundColor={
                  isDark ? appColors.darkThemeSub : appColors.white
                }
                keyboardType="default"
              />
            </View>
            <View style={styles.payPal}>
              <Input
                title={translateData.paypalID}
                titleShow={true}
                placeholder={translateData.enterpaypalID}
                value={formDatas.paypalID}
                onChangeText={text => handleChange('paypalID', text)}
                showWarning={showWarning && formDatas.paypalID === ''}
                warning={translateData.idpaypalll}
                backgroundColor={
                  isDark ? appColors.darkThemeSub : appColors.white
                }
                keyboardType="default"
              />
            </View>
          </View>

          <View style={styles.buttonView1}>
            <Button
              onPress={gotoDocument}
              title={translateData.register}
              backgroundColor={appColors.primary}
              color={appColors.white}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
