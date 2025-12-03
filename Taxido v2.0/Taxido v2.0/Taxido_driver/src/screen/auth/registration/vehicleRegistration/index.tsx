import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import styles from './styles'
import appColors from '../../../../theme/appColors'
import { CustomCheckbox, ProgressBar } from '../component'
import { Input, Button, notificationHelper } from '../../../../commonComponents'
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native'
import { Header, TitleView } from '../../component'
import { RenderVehicleList, RenderServiceList, RenderCategoryReg, RenderColorList } from './component'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/main/types'
import { useValues } from '../../../../utils/context'
import { useDispatch, useSelector } from 'react-redux'
import { driverRuleGet } from '../../../../api/store/action/driverRuleAction'
import { fontSizes, windowHeight } from '../../../../theme/appConstant'
import { getValue, setValue } from '../../../../utils/localstorage'
import { selfDriverData } from '../../../../api/store/action'
import { URL } from '../../../../api/config'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';
import { TextInput } from 'react-native-gesture-handler'
import appFonts from '../../../../theme/appFonts'
import { AppDispatch } from '../../../../api/store'

type Navigation = NativeStackNavigationProp<RootStackParamList>

export function VehicleRegistration() {
  const navigation = useNavigation<Navigation>()
  const { colors } = useTheme()
  const { textRtlStyle, setVehicleDetail, viewRtlStyle, isDark, accountDetail, documentDetail, setToken } = useValues()
  const [showWarning, setShowWarning] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)
  const [selectedService, setSelectedService] = useState<string>('')
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [vehicleIndex, setVehicleIndex] = useState<number | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [selectedServiceID, setSelectedServiceID] = useState<any>()
  const [selectedCategoryID, setSelectedCategoryID] = useState<any>()
  const [selectedVehicleID, setSelectedVehicleID] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [fcmToken, setFcmToken] = useState<string>('')
  const isFocused = useIsFocused();
  const { translateData } = useSelector((state: any) => state.setting)
  const { vehicleTypedata } = useSelector((state: any) => state.vehicleType)
  const { preferenceList } = useSelector((state: any) => state.account)
  const dispatch = useDispatch<AppDispatch>()
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const preferences = preferenceList?.data as Array<{ id: string, name: string }> | undefined;

  const [formDatas, setFormData] = useState<any>({
    serviceName: '',
    serviceCategory: '',
    vehicleType: '',
    vehicleName: '',
    vehicleNumber: '',
    vehicleColor: '',
    maximumSeats: '',
    ambulanceName: '',
    ambulanceDescription: '',
  })

  useEffect(() => {
    const fetchToken = async () => {
      let fcmToken = await getValue('fcmToken')
      if (fcmToken) {
        setFcmToken(fcmToken)
      }
    }
    fetchToken()
  }, [isFocused])

  useEffect(() => {
    setFormData((prevData: any) => ({
      ...prevData,
      serviceName: selectedServiceID,
      serviceCategory: selectedCategoryID,
      vehicleType: selectedVehicleID,
    }))
  }, [selectedServiceID, selectedCategoryID, selectedVehicleID])

  useEffect(() => {
    getService()
  }, [])

  const getService = () => {
    dispatch(driverRuleGet())
  }
  const [vehicleColorError, setVehicleColorError] = useState(false);

  const handleChange = (key: string, value: string) => {
    if (key === 'vehicleColor') {
      const hasNumber = /\d/.test(value);
      if (hasNumber) {
        setVehicleColorError(true);
      } else {
        setVehicleColorError(false);
      }
      setFormData((prev: any) => ({ ...prev, [key]: value }));
      return;
    }

    setFormData((prev: any) => ({ ...prev, [key]: value }));

    if (key === 'maximumSeats' && selectedVehicleSeat) {
      const seat = Number(value);
      if (seat >= 1 && seat <= selectedVehicleSeat) {
        setSeatError(false);
      } else {
        setSeatError(true);
      }
    }
  };


  const togglePreference = (slug: string) => {
    setSelectedPrefs(prev =>
      prev.includes(slug)
        ? prev.filter(item => item !== slug) // uncheck
        : [...prev, slug] // check
    );
  };

  const handleItemPress = (index: number, slug: string, id: number, name: string) => {
    setSelectedItemIndex(index)
    setSelectedServiceID(id)
    setSelectedService(slug)
    setShowServiceError(false)
  }

  const handleCategoryPress = (
    index: number,
    categoryName: string,
    categoryId: number
  ) => {
    setCategoryIndex(index)
    setSelectedCategory(categoryName)
    setSelectedCategoryID(categoryId)
    setShowCategoryError(false)
  }


  const handleVehiclePress = (
    index: number,
    vehicleName: string,
    vehicleId: number
  ) => {
    setVehicleIndex(index)
    setSelectedVehicle(vehicleName)
    setSelectedVehicleID(vehicleId)
    setShowVehicleError(false);

    const selectedItem = vehicleTypedata?.data?.find((item: any) => item.id === vehicleId)
    if (selectedItem?.seat) {

      setSelectedVehicleSeat(selectedItem.seat)
    }
  }

  const [seatError, setSeatError] = useState(false)

  const gotoBankDetails = () => {
    const isAmbulance = selectedService === 'ambulance';

    let hasError = false;

    if (isAmbulance) {
      if (formDatas.ambulanceName.trim() === '' || formDatas.ambulanceDescription.trim() === '') {
        setShowWarning(true);
        hasError = true;
      } else {
        setShowWarning(false);
      }
    } else {
      const hasEmptyFields = ['vehicleName', 'vehicleNumber', 'vehicleColor', 'maximumSeats'].some(
        key => formDatas[key].trim() === ''
      );

      if (!selectedService) {
        setShowServiceError(true);
        hasError = true;
      }

      if (!selectedCategoryID) {
        setShowCategoryError(true);
        hasError = true;
      }

      if (!selectedVehicleID) {
        setShowVehicleError(true);
        hasError = true;
      }

      if (hasEmptyFields) {
        setShowWarning(true);
        hasError = true;
      } else {
        setShowWarning(false);
      }

      const seatValue = Number(formDatas.maximumSeats);
      if (seatValue < 1 || seatValue > selectedVehicleSeat) {
        setSeatError(true);
        hasError = true;
      } else {
        setSeatError(false);
      }
    }

    if (hasError) return;
    setVehicleDetail(formDatas);
    handleRegister()
  };


  const handleRegister = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', accountDetail?.username || '');
      formData.append('name', accountDetail?.name || '');
      formData.append('email', accountDetail?.email || '');
      formData.append('country_code', accountDetail?.countryCode?.callingCode?.[0] || '');
      formData.append('phone', accountDetail?.phoneNumber || '');
      formData.append('password', accountDetail?.password || '');
      formData.append('password_confirmation', accountDetail?.confirmPassword || '');
      formData.append('referral_code', accountDetail?.referral || '');
      formData.append('country_name', accountDetail?.countryName || '');
      formData.append('ambulance[name]', formDatas?.ambulanceName || '');
      formData.append('ambulance[description]', formDatas?.ambulanceDescription || '');
      formData.append('service_id', formDatas?.serviceName || '');
      formData.append('service_category_id', formDatas?.serviceCategory || '');
      formData.append('vehicle[vehicle_type_id]', formDatas?.vehicleType || '');
      formData.append('vehicle[model]', formDatas?.vehicleName || '');
      formData.append('vehicle[plate_number]', formDatas?.vehicleNumber || '');
      formData.append('vehicle[color]', formDatas?.vehicleColor || '');
      formData.append('vehicle[seat]', formDatas?.maximumSeats || '');
      formData.append('fcm_token', fcmToken);
      selectedPrefs.forEach((item, index) => {
        formData.append(`preferences[${index}]`, item);
      });

      Object.keys(documentDetail).forEach((key, index) => {
        const doc = documentDetail[key]?.file;
        const expiryDate = documentDetail[key]?.expiryDate;

        if (doc) {
          formData.append(`documents[${index}][file]`, {
            uri: doc.uri,
            type: doc.type,
            name: doc.name,
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



      if (response.ok && data?.success === true) {
        await setValue('token', data.access_token);
        setToken(data.access_token);
        notificationHelper('', translateData.registerSuccessfully, 'success');
        await dispatch(selfDriverData());

        messaging()
          .subscribeToTopic(`user_${data?.id}`)
          .then(() => {
          });
        await firestore()
          .collection('driverTrack')
          .doc(data.id.toString())
          .set({
            is_verified: data?.is_verified ?? '',
            driver_name: data?.name ?? '',
            vehicle_model: data?.model ?? '',
            plate_number: data?.plate_number ?? '',
            rating_count: data?.rating_count ?? '',
            review_count: data?.review_count ?? '',
            wallet_balance: data?.wallet_balance ?? '',
            is_on_ride: "0"
          })
          .then(() => {
          })
          .catch(error => {
            notificationHelper("", error, "error")
          });
        if (data?.is_verified == 1) {
          navigation.replace('TabNav');
        } else if (data?.is_verified == 0) {
          navigation.navigate('Verification');
        }
      } else {
        notificationHelper('', data?.message ?? translateData.somethingwentwrong, 'error');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }

    if (!selectedVehicleID) {
      setShowVehicleError(true);
    } else {
      setShowVehicleError(false);
    }
    setVehicleDetail(formDatas);
  };

  const [selectedVehicleSeat, setSelectedVehicleSeat] = useState<number | null | any>(null)
  const [showCategoryError, setShowCategoryError] = useState<boolean>(false)
  const [showVehicleError, setShowVehicleError] = useState<boolean>(false);
  const [showServiceError, setShowServiceError] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('');

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    handleChange('vehicleColor', color);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header backgroundColor={isDark ? colors.card : appColors.white} />
      <ProgressBar fill={3} />
      <ScrollView style={[styles.main]} showsVerticalScrollIndicator={false}>
        <View style={[styles.subView, { backgroundColor: colors.background }]}>
          <View style={styles.subContainer}>
            <TitleView
              title={translateData.vehicleRegistration}
              subTitle={translateData.registerContent}
            />

            <Text
              style={[
                styles.vehicleTitle,
                { textAlign: textRtlStyle },
                { color: isDark ? appColors.white : appColors.primaryFont },
              ]}
            >
              {translateData.selectService}
            </Text>
            <View style={{ flexDirection: viewRtlStyle }}>
              <RenderServiceList
                selectedItemIndex={selectedItemIndex}
                handleItemPress={handleItemPress}
              />
            </View>
            {showServiceError && (
              <Text style={{
                color: appColors.red,
                marginBottom: windowHeight(0.5),
                fontSize: fontSizes.FONT3
              }}>
                {translateData.plpleaseSelectaServiceErrorrr}
              </Text>
            )}


            {selectedService === 'ambulance' ? (

              null
            ) :
              <>
                <Text
                  style={[
                    styles.vehicleTitle,
                    { textAlign: textRtlStyle },
                    { color: isDark ? appColors.white : appColors.primaryFont },
                  ]}
                >
                  {translateData.selectCategory}
                </Text>
                <View style={{ flexDirection: viewRtlStyle }}>
                  <RenderCategoryReg
                    categoryIndex={categoryIndex}
                    handleItemPress={handleCategoryPress}
                    selectedService={selectedService}
                  />
                </View>
                {showCategoryError && (
                  <Text style={{
                    color: appColors.red,
                    fontSize: fontSizes.FONT3,
                    bottom: windowHeight(1.5)
                  }}>
                    {translateData.pleaseSelectaCategoryyyyErrorrr}
                  </Text>
                )}
              </>
            }
            {selectedCategory === 'Rental' ? (
              <View style={styles.rentalBg}>
                <Text style={styles.rentalDesc}>
                  {translateData.registrationNotice} '
                  <Text style={styles.boldText}>{translateData.vehicleList}</Text>
                  '.
                </Text>
              </View>
            ) : (
              <>
                {selectedService === 'ambulance' ? (
                  null
                ) :
                  <>
                    <View style={styles.vehicle}>
                      <Text
                        style={[
                          styles.vehicleTitle,
                          { textAlign: textRtlStyle },
                          {
                            color: isDark ? appColors.white : appColors.primaryFont,
                          },
                          { bottom: windowHeight(0) },
                        ]}
                      >
                        {translateData.selectVehicle}
                      </Text>
                      <View style={{ flexDirection: viewRtlStyle }}>
                        <View>
                          <RenderVehicleList
                            vehicleIndex={vehicleIndex}
                            handleItemPress={handleVehiclePress}
                            selectedCategory={selectedCategory}
                            serviceId={selectedServiceID}
                            categoryId={selectedCategoryID}
                            selectedVehicleID={selectedVehicleID}
                          />

                          {showVehicleError && (
                            <Text style={{
                              color: appColors.red,
                              fontSize: fontSizes.FONT3,
                              bottom: windowHeight(2),
                              marginBottom: windowHeight(0.3)
                            }}>
                              {translateData.pleaseSelectaVehicleeErrorrr}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                    <View style={styles.vehicleName}>
                      <Input
                        title={translateData.vehicleName}
                        titleShow={true}
                        placeholder={translateData.enterVehicleNames}
                        value={formDatas.vehicleName}
                        onChangeText={text => handleChange('vehicleName', text)}
                        showWarning={showWarning && formDatas.vehicleName === ''}
                        warning={translateData.enterYourvehicleName}
                        backgroundColor={
                          isDark ? appColors.darkThemeSub : appColors.white
                        }
                        icon={false}
                      />
                    </View>
                  </>
                }
                {selectedService === 'ambulance' ? (
                  <>
                    <View style={[styles.vehicleNo, { marginTop: windowHeight(3.5) }]}>
                      <Input
                        title={translateData.ambulanceName}
                        titleShow={true}
                        placeholder={translateData.enterHospitalName}
                        value={formDatas.ambulanceName}
                        onChangeText={text => handleChange('ambulanceName', text)}
                        showWarning={showWarning && formDatas.ambulanceName === ''}
                        warning={translateData.pleaseEnterAmbulanceNameeeee}
                        backgroundColor={
                          isDark ? appColors.darkThemeSub : appColors.white
                        }
                      />
                    </View>
                    <View style={styles.vehicleColor}>
                      <Text
                        style={{
                          marginBottom: windowHeight(1),
                          marginTop: windowHeight(2),
                          color: isDark ? appColors.white : appColors.primaryFont,
                          fontFamily: appFonts.medium,
                          textAlign: textRtlStyle,
                        }}
                      >
                        {translateData.ambulanceDescription}
                      </Text>
                      <TextInput
                        placeholder={translateData.enterAmbulanceDescription}
                        placeholderTextColor={
                          isDark ? appColors.darkText : appColors.secondaryFont
                        }
                        value={formDatas.ambulanceDescription}
                        onChangeText={text => handleChange('ambulanceDescription', text)}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                        style={[
                          styles.text,
                          {
                            textAlign: textRtlStyle,
                            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white
                          }
                        ]}
                      />
                      {showWarning && formDatas.ambulanceDescription === '' && <Text style={[styles.warning1, { textAlign: textRtlStyle }]}>{translateData.pleaseEnterAmbulanceDescriptionnnnn}</Text>}
                    </View>
                  </>
                ) :
                  <>
                    <View style={styles.vehicleNo}>
                      <Input
                        title={translateData.vehicleNo}
                        titleShow={true}
                        placeholder={translateData.rnterVehicleNo}
                        value={formDatas.vehicleNumber}
                        onChangeText={text => handleChange('vehicleNumber', text)}
                        showWarning={showWarning && formDatas.vehicleNumber === ''}
                        warning={translateData.pleaseEnterVehicleNo}
                        backgroundColor={
                          isDark ? appColors.darkThemeSub : appColors.white
                        }
                      />
                    </View>
                    <View style={styles.vehicleColor}>
                      <Text
                        style={{
                          marginBottom: windowHeight(1),
                          marginTop: windowHeight(2),
                          color: isDark ? appColors.white : appColors.primaryFont,
                          fontFamily: appFonts.medium,
                          textAlign: textRtlStyle,
                        }}
                      >
                        {translateData.vehicleColor}
                      </Text>
                      <RenderColorList
                        selectedColor={selectedColor}
                        handleColorSelect={handleColorSelect}
                      />
                    </View>
                    <View style={styles.maximumSeats}>
                      <Input
                        title={translateData.maximumSeats}
                        titleShow={true}
                        placeholder={
                          selectedVehicleSeat
                            ? `${translateData.enterMaximumSeats}`
                            : translateData.enterMaximumSeats
                        }
                        value={formDatas.maximumSeats}
                        onChangeText={text => handleChange('maximumSeats', text)}
                        showWarning={
                          (showWarning && formDatas.maximumSeats === '') || seatError
                        }
                        warning={
                          seatError
                            ? `${translateData?.Maximum} ${selectedVehicleSeat} ${translateData?.seatallow}`
                            : translateData.enterYourmaximumSeats
                        }
                        keyboardType="numeric"
                        editable={true}
                        backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                      />
                    </View>
                    <View style={styles.maximumSeats}>
                      <Text style={[
                        styles.vehicleTitle,
                        { textAlign: textRtlStyle },
                        { color: isDark ? appColors.white : appColors.primaryFont },
                      ]}>{translateData.selectPreferences}</Text>
                      {preferences && preferences.map((pref: { id: string, name: string }) => (
                        <View key={pref.name} style={{ marginVertical: 5 }}>
                          <CustomCheckbox
                            label={`   ${pref.name}`}
                            checked={selectedPrefs.includes(pref.id)}
                            onPress={() => togglePreference(pref.id)}
                          />
                        </View>
                      ))}
                    </View>
                  </>
                }
              </>
            )}
          </View>
          <View
            style={[{ marginBottom: windowHeight(3) }]}
          >
            <Button
              onPress={gotoBankDetails}
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