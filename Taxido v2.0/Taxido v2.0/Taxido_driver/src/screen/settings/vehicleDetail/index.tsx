import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, Alert, BackHandler } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useTheme } from '@react-navigation/native'
import styles from '../../auth/registration/vehicleRegistration/styles'
import vehicleStyles from './styles'
import appColors from '../../../theme/appColors'
import { Input, Button, Header, notificationHelper } from '../../../commonComponents'
import { TitleView } from '../../auth/component'
import { RenderCategoryList, RenderVehicleList } from '../../auth/registration/vehicleRegistration/component'
import { selfDriverData, updateVehicle } from '../../../api/store/action'
import { serviceDataGet } from '../../../api/store/action/serviceAction'
import { categoryDataGet } from '../../../api/store/action/categoryAction'
import { updateVehicleInterface } from '../../../api/interface/accountInterface'
import { windowHeight } from '../chat/context'
import { useValues } from '../../../utils/context'
import { useAppNavigation } from '../../../utils/navigation'
import { RenderServiceList } from './renderServiceList'
import { AppDispatch } from '../../../api/store'

export function VehicleDetail() {

  const { goBack } = useAppNavigation()
  const dispatch = useDispatch<AppDispatch>()
  const { colors } = useTheme()
  const { isDark, textRtlStyle, viewRtlStyle, categoryIndex, setCategoryIndex }: any = useValues()
  const { selfDriver } = useSelector((state: any) => state.account)
  const { translateData } = useSelector((state: any) => state.setting)
  const { vehicleTypedata } = useSelector((state: any) => state.vehicleType)

  const [formData, setFormData] = useState<any>({
    serviceName: '',
    serviceCategory: '',
    vehicleType: '',
    vehicleName: '',
    vehicleNumber: '',
    maximumSeats: '',
    vehicleColor: '',
    model: '',
    ambulanceName: '',
    ambulanceDescription: '',
  })

  const [selectedServiceID, setSelectedServiceID] = useState<number | null>(null)
  const [selectedCategoryID, setSelectedCategoryID] = useState<number | null>(null)
  const [selectedVehicleID, setSelectedVehicleID] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [vehicleIndex, setVehicleIndex] = useState<number | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [loader, setLoader] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    dispatch(selfDriverData())
    dispatch(serviceDataGet())
    dispatch(categoryDataGet())
  }, [dispatch])

  useEffect(() => {
    if (selfDriver?.vehicle_info) {
      const vehicle = selfDriver?.vehicle_info

      setFormData({
        serviceName: selfDriver?.service_id?.toString() || '',
        serviceCategory: selfDriver?.service_category_id?.toString() || '',
        vehicleType: vehicle?.vehicle_type_id?.toString() || '',
        vehicleName: vehicle?.name || '',
        model: vehicle?.model || '',
        vehicleNumber: vehicle?.plate_number || '',
        vehicleColor: vehicle?.color || '',
        maximumSeats: vehicle?.seat?.toString() || '',
        description: vehicle?.description || '',
        ambulanceDescription: vehicle?.description || '',
        ambulanceName: vehicle?.name || ''
      })
      setSelectedServiceID(selfDriver?.service_id || null)
      setSelectedCategoryID(selfDriver?.service_category_id || null)
      setSelectedVehicleID(vehicle?.vehicle_type_id || null)
    }
  }, [selfDriver])

  const foundVehicle = vehicleTypedata?.data?.find(
    (v: any) =>
      selfDriver?.vehicle_info.model &&
      selfDriver?.vehicle_info.model.toLowerCase().includes(v.name.toLowerCase())
  );




  const handleChange = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }))
  }

  const handleItemPress = (index: number, name: string, id: number) => {
    setSelectedServiceID(id)
    setFormData((prev: any) => ({ ...prev, serviceName: id.toString() }))
  }

  const handleCategoryPress = (index: number, categoryName: string, categoryId?: string) => {
    setCategoryIndex(index)
    setSelectedCategory(categoryName)
    if (categoryId) setSelectedCategoryID(Number(categoryId))
  }

  const handleVehiclePress = (index: number, name: string, id: string) => {
    setVehicleIndex(index)
    setSelectedVehicle(name)
    setSelectedVehicleID(Number(id))
  }






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
    <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
      <Header title={translateData.vehicleRegistration} />
      <View style={[styles.subView, { backgroundColor: colors.background }]}>
        <View style={styles.subContainer}>
          <TitleView
            title={translateData.vehicleRegistration}
            subTitle={translateData.registerContent}
          />

          <Text style={[styles.selectTitle, { color: isDark ? appColors.white : appColors.primaryFont, textAlign: textRtlStyle }]}>
            {translateData.selectService}
          </Text>
          <View style={{ flexDirection: viewRtlStyle, marginTop: windowHeight(5) }}>
            <RenderServiceList
              selectedItemIndex={selectedItemIndex}
              handleItemPress={handleItemPress}
              serviceId={selfDriver?.service_id}
              setSelectedItemIndex={setSelectedItemIndex}
            />
          </View>

          {
            selectedItemIndex === 3 ? (
              <>
                <View style={[styles.vehicleNo, { marginTop: windowHeight(25) }]}>
                  <Input
                    title={translateData.ambulanceName}
                    titleShow={true}
                    placeholder={translateData.enterHospitalName}
                    value={formData.ambulanceName}
                    onChangeText={text => handleChange('ambulanceName', text)}
                    showWarning={showWarning && !formData.ambulanceName}
                    warning={translateData.pleaseEnterAmbulanceNameeeee}
                    backgroundColor={
                      isDark ? appColors.darkThemeSub : appColors.white
                    }
                  />
                </View>
                <View style={styles.vehicleColor}>
                  <Input
                    title={translateData.ambulanceDescription}
                    titleShow={true}
                    placeholder={translateData.enterAmbulanceDescription}
                    value={formData.ambulanceDescription}
                    onChangeText={text => handleChange('ambulanceDescription', text)}
                    showWarning={showWarning && !formData.ambulanceDescription}
                    warning={translateData.pleaseEnterAmbulanceDescriptionnnnn}
                    backgroundColor={
                      isDark ? appColors.darkThemeSub : appColors.white
                    }
                    editable={false}
                  />
                </View>
              </>
            ) :

              <>
                <Text style={[styles.selectTitle, { color: isDark ? appColors.white : appColors.primaryFont, textAlign: textRtlStyle, marginTop: windowHeight(7) }]}>
                  {translateData.selectCategory}
                </Text>
                <View style={[vehicleStyles.categoryList, { flexDirection: viewRtlStyle }]}>
                  <RenderCategoryList
                    categoryIndex={categoryIndex}
                    selectedService={selectedServiceID || selfDriver?.service_id}
                    selectedCategory={selectedCategory}
                    categoryId={selfDriver?.service_category_id}
                    handleItemPress={handleCategoryPress}
                  />
                </View>

                <Text style={[styles.selectTitle1, { color: isDark ? appColors.white : appColors.primaryFont, textAlign: textRtlStyle }]}>
                  {translateData.selectVehicle}
                </Text>
                <View style={{ flexDirection: viewRtlStyle }}>
                  <RenderVehicleList
                    vehicleIndex={vehicleIndex}
                    selectedItemIndex={selectedItemIndex}
                    selectedCategory={selectedCategoryID || selfDriver?.service_category_id}
                    selectedVehicle={selectedVehicleID || selfDriver?.vehicle_info?.vehicle_type_id}
                    serviceId={selectedServiceID || selfDriver?.service_id}
                    handleItemPress={handleVehiclePress}
                  />
                </View>

                <View style={vehicleStyles.vehicleName}>
                  <Input
                    titleShow
                    title={translateData.vehicleName}
                    placeholder={translateData.enterVehicleNames}
                    value={formData.model}
                    onChangeText={text => handleChange('model', text)}
                    showWarning={showWarning && !formData.model}
                    warning={translateData.enterYourvehicleName}
                    backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                    editable={false}
                  />
                </View>
                <View style={vehicleStyles.vehicle}>
                  <Input
                    titleShow
                    title={translateData.vehicleNo}
                    placeholder={translateData.rnterVehicleNo}
                    value={formData.vehicleNumber}
                    onChangeText={text => handleChange('vehicleNumber', text)}
                    showWarning={showWarning && !formData.vehicleNumber}
                    warning={translateData.pleaseEnterVehicleNo}
                    backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                    editable={false}
                  />
                </View>
                <View style={vehicleStyles.vehicle}>
                  <Input
                    titleShow
                    title={translateData.vehicleColor}
                    placeholder={translateData.enterVehicleColor}
                    value={formData.vehicleColor}
                    onChangeText={text => handleChange('vehicleColor', text)}
                    showWarning={showWarning && !formData.vehicleColor}
                    warning={translateData.enterYourvehicleColor}
                    backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                    editable={false}
                  />
                </View>
                <View style={vehicleStyles.datePicker}>
                  <Input
                    titleShow
                    title={translateData.maximumSeats}
                    placeholder={translateData.enterMaximumSeats}
                    value={formData.maximumSeats}
                    onChangeText={text => handleChange('maximumSeats', text)}
                    showWarning={
                      showWarning &&
                      (
                        !formData.maximumSeats ||
                        Number(formData.maximumSeats) > (foundVehicle?.seat || 0)
                      )
                    }
                    warning={
                      !formData.maximumSeats
                        ? translateData.enterYourmaximumSeats
                        : `${translateData?.maax} ${foundVehicle?.seat} ${translateData?.Seats}`
                    }
                    keyboardType="numeric"
                    backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
                    editable={false}
                  />

                </View>

              </>
          }
        </View>
        {/* <View style={{ marginTop: windowHeight(3), marginBottom: windowHeight(25) }}>
          <Button
            title={translateData.update}
            backgroundColor={appColors.primary}
            color={appColors.white}
            onPress={updateDetails}
            loading={loader}
          />
        </View> */}
      </View>
    </ScrollView>
  )
}
