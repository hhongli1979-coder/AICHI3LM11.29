import { View, Text, TouchableOpacity, Alert, Image, TouchableWithoutFeedback, TextInput, ScrollView, FlatList, } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Header, Input, notificationHelper, } from '../../../commonComponents'
import appColors from '../../../theme/appColors'
import { fontSizes, windowHeight, windowWidth, } from '../../../theme/appConstant'
import Icons from '../../../utils/icons/icons'
import { launchImageLibrary } from 'react-native-image-picker'
import Swiper from 'react-native-swiper'
import Images from '../../../utils/images/images'
import DropDownPicker from 'react-native-dropdown-picker'
import { styles } from './styles'
import { Switch } from '../appSettings/component'
import { deleteRentalVehicle, rentalVehicleData, rentalVehicleTypesData, rentalZone, selfDriverData } from '../../../api/store/action'
import { useDispatch, useSelector } from 'react-redux'
import { getValue } from '../../../utils/localstorage'
import { useNavigation, useRoute, useTheme } from '@react-navigation/native'
import { URL } from '../../../api/config'
import { useValues } from '../../../utils/context'
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet'
import FastImage from 'react-native-fast-image'
import appFonts from '../../../theme/appFonts'
import { AppDispatch } from '../../../api/store'

export function AddVehicle() {
  const route = useRoute<any>()
  const { colors } = useTheme()
  const { viewRtlStyle, textRtlStyle, rtl, isDark } = useValues()
  const { screen } = route.params || {}
  const isEditMode = screen === 'editDetails';
  const { goBack } = useNavigation()
  const [updateLoad, setUpdateLoad] = useState<boolean>(false)
  const [deleteLoad, setDeleteLoad] = useState<boolean>(false)
  const { rentalVehicleDetailData } = useSelector((state: any) => state.rental)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [vehicleValue, setVehicleValue] = useState<any>(null)
  const [vehicleTypeopen, setvehicleTypeOpen] = useState<boolean>(false)
  const [zoneopen, setZoneOpen] = useState<boolean>(false)
  const [zoneValue, setZoneValue] = useState<any>(null)
  const [vehicleName, setVehicleName] = useState<any>(isEditMode ? rentalVehicleDetailData?.name : null)
  const [description, setDescription] = useState<any>(isEditMode ? rentalVehicleDetailData?.description : null)
  const [registrationNo, setRegistrationNo] = useState<any>(isEditMode ? rentalVehicleDetailData?.registration_no : "");
  const { translateData, settingData } = useSelector((state: any) => state.setting)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bagCount, setBagCount] = useState<string>('');
  const [driverPerDayPrice, setDriverperDayPrice] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false)
  const [selectedZone, setSelectedZone] = useState<any>(null);

  const [imageUri, setImageUri] = useState<any>(
    isEditMode && rentalVehicleDetailData?.normal_image
      ? {
        uri: rentalVehicleDetailData.normal_image.original_url,
        type: rentalVehicleDetailData.normal_image.mime_type,
        fileName: rentalVehicleDetailData.normal_image.name,
      }
      : null,
  );
  const [imageUriFront, setImageUriFront] = useState<any>(
    isEditMode && rentalVehicleDetailData?.front_view
      ?
      {
        uri: rentalVehicleDetailData?.front_view?.original_url,
        type: rentalVehicleDetailData?.front_view?.mime_type,
        fileName: rentalVehicleDetailData?.front_view?.name,
      } : null,
  )
  const [imageUriSide, setImageUriSide] = useState<any>(
    isEditMode && rentalVehicleDetailData?.side_view
      ?
      {
        uri: rentalVehicleDetailData?.side_view?.original_url,
        type: rentalVehicleDetailData?.side_view?.mime_type,
        fileName: rentalVehicleDetailData?.side_view?.name,
      } : null,
  )
  const [imageUriBoot, setImageUriBoot] = useState<any>(
    isEditMode && rentalVehicleDetailData?.boot_view
      ?
      {
        uri: rentalVehicleDetailData?.boot_view?.original_url,
        type: rentalVehicleDetailData?.boot_view?.mime_type,
        fileName: rentalVehicleDetailData?.boot_view?.name,
      } : null,
  )
  const [imageUriInterior, setImageUriInterior] = useState<any>(
    isEditMode && rentalVehicleDetailData?.interior_image
      ? {
        uri: rentalVehicleDetailData?.interior_image?.original_url,
        type: rentalVehicleDetailData?.interior_image?.mime_type,
        fileName: rentalVehicleDetailData?.interior_image?.name,
      } : null,
  )
  const [imageUriRegistration, setImageUriRegistration] = useState<any>(
    isEditMode && rentalVehicleDetailData?.rentalVehicleDetailData ?
      {
        uri: rentalVehicleDetailData?.rentalVehicleDetailData?.original_url,
        type: rentalVehicleDetailData?.rentalVehicleDetailData?.mime_type,
        fileName: rentalVehicleDetailData?.registration_image?.name,
      } : null,
  )

  useEffect(() => {
    if (rentalVehicleDetailData?.registration_no) {
      setRegistrationNo(rentalVehicleDetailData.registration_no);
    }
  }, [rentalVehicleDetailData, registrationNo]);

  useEffect(() => {
    if (rentalVehicleDetailData?.bag_count && isEditMode) {
      setBagCount(String(rentalVehicleDetailData.bag_count));
    }
  }, [rentalVehicleDetailData]);

  const [perDayPrice, setPerDayPrice] = useState<any>(
    isEditMode ? rentalVehicleDetailData?.vehicle_per_day_price : null
  );

  useEffect(() => {
    if (rentalVehicleDetailData && rentalVehicleDetailData.vehicle_per_day_price !== undefined && isEditMode) {
      setPerDayPrice(rentalVehicleDetailData.vehicle_per_day_price.toString());
    }
  }, [rentalVehicleDetailData]);


  useEffect(() => {
    if (rentalVehicleDetailData?.driver_per_day_charge && isEditMode) {
      setDriverperDayPrice(rentalVehicleDetailData.driver_per_day_charge.toString());
    }
  }, [rentalVehicleDetailData]);

  const [categoryType, setCategoryType] = useState<any>(
    isEditMode ? rentalVehicleDetailData?.vehicle_subtype : null,
  )
  const [fualType, setFualType] = useState<any>(isEditMode ? rentalVehicleDetailData?.fuel_type : null)
  const [vehicleSpeed, setvehicleSpeed] = useState<any>(isEditMode ?
    rentalVehicleDetailData?.vehicle_speed : null,
  )
  const [vehicleMileage, setVehicleMileage] = useState<any>(
    isEditMode ? rentalVehicleDetailData?.mileage : null,
  )
  const [withDriver, setWithDriver] = useState<any>(isEditMode ? rentalVehicleDetailData?.allow_with_driver : 0)
  const [vehicleStatus, setVehicleStatus] = useState<any>(isEditMode ? rentalVehicleDetailData?.status : 0)
  const [acStatus, setACStatus] = useState<number>(0)
  const { rentalVehicleTypedata } = useSelector((state: any) => state.vehicleType)
  const { rentalZones } = useSelector((state: any) => state.zoneUpdate)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(rentalVehicleTypesData())
    dispatch(rentalZone({ vehicle_type_id: vehicleValue }))
  }, [vehicleValue])

  const [vehicleType, setVehicleType] = useState([])

  useEffect(() => {
    if (isEditMode && rentalVehicleDetailData?.status !== undefined) {
      setVehicleStatus(Number(rentalVehicleDetailData.status));
    }
  }, [isEditMode, rentalVehicleDetailData?.status]);

  useEffect(() => {
    if (rentalVehicleTypedata?.data) {
      const dropdownItems = rentalVehicleTypedata.data.map((item: any) => ({
        label: item.name,
        value: item.id,
      }))
      setVehicleType(dropdownItems)
    }
  }, [rentalVehicleTypedata])

  const [rentalZoneType, setRentalZoneType] = useState([])


  useEffect(() => {
    if (rentalZones?.data) {
      const dropdownItems = rentalZones.data.map((item: any) => ({
        label: item.name,
        value: item.id,
        data: item?.currency_symbol
      }))
      setRentalZoneType(dropdownItems)
    }
  }, [rentalZones])

  useEffect(() => {
    if (rentalVehicleDetailData?.gear_type && isEditMode) {
      setValueGear(rentalVehicleDetailData.gear_type);
    }
  }, [rentalVehicleDetailData]);

  const [gearType, setGearType] = useState<any>([
    { label: `${translateData.manual}`, value: 'manual' },
    { label: `${translateData.auto}`, value: 'auto' },
  ])
  const [valuegear, setValueGear] = useState<any>(null)
  const [openGear, setOpenGear] = useState<boolean>(false)

  const [fields, setFields] = useState(() => {
    if (isEditMode && Array.isArray(rentalVehicleDetailData?.interior)) {
      const cleaned = rentalVehicleDetailData.interior.filter(
        (item: any) => typeof item === 'string' && item !== 'undefined' && item !== ''
      );

      return cleaned.length > 0
        ? cleaned.map((value: any, index: number) => ({ id: Date.now() + index, value }))
        : [{ id: Date.now(), value: '' }];
    }

    return [{ id: Date.now(), value: '' }];
  });



  const addNewField = () => {
    if (fields.length >= 5) {
      return
    }
    setFields([...fields, { id: Date.now(), value: '' }])
  }

  const removeField = (id: number) => {
    setFields(fields.filter((field: any) => field.id !== id))
  }

  const updateFieldValue = (id: number, newValue: string) => {
    const updatedFields = fields.map((field: any) =>
      field.id === id ? { ...field, value: newValue } : field,
    )
    setFields(updatedFields)
  }

  const openModal = () => {
    setModalVisible(true)
    ambulanceRef1.current?.present();
  }

  const closeModal = () => {
    setModalVisible(false)
    ambulanceRef1.current?.close();

  }

  const swiperData = [
    {
      image: Images.imgCarNormal,
      title: translateData.normalImage,
      description: translateData.normalDesc,
    },
    {
      image: Images.imgCarFront,
      title: translateData.frontView,
      description: translateData.frontDesc,
    },
    {
      image: Images.imgCarSide,
      title: translateData.sideView,
      description: translateData.sideDesc,
    },
    {
      image: Images.imgCarBoot,
      title: translateData.bootView,
      description: translateData.bootDesc,
    },
    {
      image: Images.imgCarInterior,
      title: translateData.interior,
      description: translateData.intDesc,
    },
  ]

  const handlePress = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
        } else {
          const { assets } = response
          if (assets && assets.length > 0) {
            const selectedImage: any = assets[0]
            setImageUri(selectedImage)
          }
        }
      },
    )
  }

  const onwithDriver = () => {
    setWithDriver((prevState: any) => (prevState === 0 ? 1 : 0))
  }

  const onvehicleStatus = () => {
    setVehicleStatus((prevState: any) => (prevState === 0 ? 1 : 0))
  }

  const onAcStatus = () => {
    setACStatus(prevState => (prevState === 0 ? 1 : 0))
  }

  const handlePressFront = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
        } else {
          const { assets } = response
          if (assets && assets.length > 0) {
            const selectedImage = assets[0]
            setImageUriFront(selectedImage)
          }
        }
      },
    )
  }

  const handlePressSide = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
        } else {
          const { assets } = response
          if (assets && assets.length > 0) {
            const selectedImage = assets[0]
            setImageUriSide(selectedImage)
          }
        }
      },
    )
  }

  const handlePressBoot = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
        } else {
          const { assets } = response
          if (assets && assets.length > 0) {
            const selectedImage = assets[0]
            setImageUriBoot(selectedImage)
          }
        }
      },
    )
  }

  const handlePressInterior = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
        } else {
          const { assets } = response
          if (assets && assets.length > 0) {
            const selectedImage = assets[0]
            setImageUriInterior(selectedImage)
          }
        }
      },
    )
  }

  const handlePressRegistration = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
        } else if (response.errorCode) {
        } else {
          const { assets } = response
          if (assets && assets.length > 0) {
            const selectedImage = assets[0]
            setImageUriRegistration(selectedImage)
          }
        }
      },
    )
  }
  const removemainImg = () => {
    setImageUri(null)
  }

  const removemainImgFront = () => {
    setImageUriFront(null)
  }

  const removemainImgSide = () => {
    setImageUriSide(null)
  }

  const removemainImgBoot = () => {
    setImageUriBoot(null)
  }

  const removemainImgInterior = () => {
    setImageUriInterior(null)
  }

  const removemainImgRegistration = () => {
    setImageUriRegistration(null)
  }

  const addVehicles = async () => {
    if (!validateForm()) {
      if (Object.keys(errors).length > 0) {
        const firstErrorKey = Object.keys(errors)[0];
      }
      return;
    }
    try {
      setLoader(true)
      const token = await getValue('token');
      const formData = new FormData();
      formData.append('name', vehicleName);
      formData.append('description', description);
      formData.append('vehicle_type_id', vehicleValue);
      formData.append('zone_ids[0]', zoneValue);
      formData.append('registration_no', registrationNo);
      formData.append('vehicle_per_day_price', perDayPrice);
      formData.append('allow_with_driver', withDriver.toString());

      if (withDriver === 1) {
        formData.append('driver_per_day_charge', driverPerDayPrice);
      } else {
        formData.append('driver_per_day_charge', '0');
      }

      if (withDriver === 1) {
        formData.append('driver_per_day_charge', perDayPrice);
      } else {
        formData.append('driver_per_day_charge', '0');
      }
      formData.append('vehicle_subtype', categoryType);
      formData.append('fuel_type', fualType);
      formData.append('gear_type', valuegear);
      formData.append('vehicle_speed', vehicleSpeed);
      formData.append('mileage', vehicleMileage);
      formData.append('bag_count', bagCount);
      fields.forEach((field: any, index: number) => {
        formData.append(`interior[${index}]`, field.value);
      });
      formData.append('status', vehicleStatus.toString());

      if (imageUri?.uri) {
        formData.append('normal_image', {
          uri: imageUri.uri,
          type: imageUri.type,
          name: imageUri.fileName,
        });

        formData.append('front_view', {
          uri: imageUriFront.uri,
          type: imageUriFront.type,
          name: imageUriFront.fileName,
        });

        formData.append('side_view', {
          uri: imageUriSide.uri,
          type: imageUriSide.type,
          name: imageUriSide.fileName,
        });

        formData.append('boot_view', {
          uri: imageUriBoot.uri,
          type: imageUriBoot.type,
          name: imageUriBoot.fileName,
        });

        formData.append('interior_image', {
          uri: imageUriInterior.uri,
          type: imageUriInterior.type,
          name: imageUriInterior.fileName,
        });
      } else {
        setErrors(prev => ({ ...prev, mainImage: 'Please upload an image' }));
        return;
      }


      const response = await fetch(`${URL}/api/rental-vehicle`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Accept-Lang': 'en',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.ok) {
        setLoader(false)
        const data = await response.json();

        dispatch(rentalVehicleData())
        notificationHelper('Vehicle Add', translateData.addSuccessfully, 'success');
        goBack();
        dispatch(selfDriverData())

        setErrors({});
        setVehicleName('');
        setDescription('');
        setVehicleValue('');
        setZoneValue('');
        setPerDayPrice('');
        setWithDriver(false);
        setDriverperDayPrice('');
        setCategoryType('');
        setFualType('');
        setValueGear('');
        setvehicleSpeed('');
        setVehicleMileage('');
        setImageUri(null);
      } else {
        setLoader(false)
        const errorText = await response.text();
        notificationHelper('Error', errorText, 'error');

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.errors) {
            const apiErrors: any = {};
            Object.keys(errorData.errors).forEach(key => {
              apiErrors[key] = errorData.errors[key][0];
            });
            setErrors(apiErrors);
            setLoader(false)
          } else {
            Alert.alert('Error', errorData.message || 'Something went wrong, please try again.');
            setLoader(false)
          }
        } catch (parseError) {
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      }
    } catch (error) {

    }
  };

  const updateVehicles = async () => {
    setUpdateLoad(true)
    try {
      const token = await getValue('token')
      const language = await getValue('selectedLanguage')
      const defultLng = await getValue('defaultLanguage')
      const defultLngValue = language || defultLng

      const formData = new FormData()
      formData.append('name', vehicleName)
      formData.append('description', description)
      formData.append('vehicle_type_id', vehicleValue)
      formData.append('zone_ids[0]', zoneValue)
      formData.append('vehicle_per_day_price', perDayPrice)
      formData.append('allow_with_driver', withDriver.toString())
      formData.append('driver_per_day_charge', driverPerDayPrice)
      formData.append('vehicle_subtype', categoryType)
      formData.append('fuel_type', fualType)
      formData.append('gear_type', valuegear);
      formData.append('vehicle_speed', vehicleSpeed)
      formData.append('mileage', vehicleMileage)
      formData.append('bag_count', bagCount);
      formData.append('registration_no', registrationNo);
      formData.append('currency_symbol', selectedZone?.data || settingData?.values?.general?.default_currency?.symbol);

      fields.forEach((field: any, index: number) => {
        formData.append(`interior[${index}]`, field.value);
      });
      formData.append('status', vehicleStatus.toString())

      if (imageUri?.uri) {
        formData.append('normal_image', {
          uri: imageUri.uri,
          type: imageUri.type,
          name: imageUri.fileName,
        })
      }
      if (imageUriFront?.uri) {
        formData.append('front_view', {
          uri: imageUriFront.uri,
          type: imageUriFront.type,
          name: imageUriFront.fileName,
        })
      }
      if (imageUriSide?.uri) {
        formData.append('side_view', {
          uri: imageUriSide.uri,
          type: imageUriSide.type,
          name: imageUriSide.fileName,
        })
      }
      if (imageUriBoot?.uri) {
        formData.append('boot_view', {
          uri: imageUriBoot.uri,
          type: imageUriBoot.type,
          name: imageUriBoot.fileName,
        })
      }
      if (imageUriInterior?.uri) {
        formData.append('interior_image', {
          uri: imageUriInterior.uri,
          type: imageUriInterior.type,
          name: imageUriInterior.fileName,
        })
      }
      formData.append('_method', 'PUT')

      const response = await fetch(`${URL}/api/rental-vehicle/${rentalVehicleDetailData.id}`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Lang': defultLngValue,
        },
      });


      const rawText = await response.text();
      let responseData = {};
      try {
        responseData = JSON.parse(rawText);
      } catch (e) {
        notificationHelper('Server Error', e.message, 'error')
        setUpdateLoad(false)
      }
      if (!response.ok) {
        notificationHelper('Server Error', responseData?.message, 'error')
        setUpdateLoad(false)
        return;
      }
      dispatch(rentalVehicleData())
      notificationHelper('Vehicle Update', "Vehicle Update Successfully", 'success')
      navigation.goBack()
      setUpdateLoad(false)
    } catch (error) {
      notificationHelper('Vehicle Update', error?.message, 'error')
      setUpdateLoad(false)
    }
  }


  const navigation = useNavigation()

  const deleteVehicle = () => {
    dispatch(deleteRentalVehicle(rentalVehicleDetailData.id));
    dispatch(rentalVehicleData());
    setModalVisible(false);
    ambulanceRef1.current?.close();
    navigation.goBack()
  };


  useEffect(() => {
    setVehicleValue(rentalVehicleDetailData?.vehicle_type_id || null)
    setZoneValue(rentalVehicleDetailData?.zone_id || null)
  }, [])


  const renderField = ({ item, index }: any) => (
    <View style={[styles.fieldContainer, { flexDirection: viewRtlStyle }]}>
      <Text
        style={[
          styles.bullet,
          { color: isDark ? appColors.white : appColors.primaryFont },
        ]}
      >
        .
      </Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border },
          { color: isDark ? appColors.white : appColors.black },
        ]}
        placeholder={translateData.enterText}
        placeholderTextColor={appColors.secondaryFont}
        value={item.value || item}
        onChangeText={text => updateFieldValue(item.id, text)}
      />
      {index === fields.length - 1 && fields.length < 5 ? (
        <TouchableOpacity style={styles.addButton} onPress={addNewField} activeOpacity={0.7}>
          <Icons.plus />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}

          style={styles.removeButton}
          onPress={() => removeField(item.id)}
        >
          <Icons.minus />
        </TouchableOpacity>
      )}
    </View>
  )

  const validateForm = () => {
    let valid = true;
    const newErrors: Record<string, string> = {};

    if (!vehicleValue) {
      newErrors.vehicleType = translateData.vehicleTypeIsRequireddddd;
      valid = false;
    }

    if (!zoneValue) {
      newErrors.zone = translateData.zoneIsRequiredddddd;
      valid = false;
    }

    if (!vehicleName || !vehicleName.trim()) {
      newErrors.vehicleName = translateData.vehicleNameIsRequiredddd;
      valid = false;
    } else if (vehicleName.length > 50) {
      newErrors.vehicleName = translateData.vehicleNameMustBe;
      valid = false;
    }

    if (!description || !description.trim()) {
      newErrors.description = translateData.descriptionRequireddddd;
      valid = false;
    } else if (description.length > 500) {
      newErrors.description = translateData.descriptionCharacters;
      valid = false;
    }

    if (!registrationNo || !registrationNo.trim()) {
      newErrors.registrationNo = translateData.RegistrationnumberIsRequiredddddd;
      valid = false;
    } else if (!/^[A-Z0-9-]{6,15}$/i.test(registrationNo)) {
      newErrors.registrationNo = translateData.InvalidRegistrationNumberformat;
      valid = false;
    }

    if (!imageUri?.uri) {
      newErrors.mainImage = translateData.vehicleImageIsRequiredddd;
      valid = false;
    }
    if (!imageUriFront?.uri) {
      newErrors.frontImage = translateData.frontViewImageIsRequired;
      valid = false;
    }
    if (!imageUriSide?.uri) {
      newErrors.sideImage = translateData.sideViewImageisrequired;
      valid = false;
    }
    if (!imageUriBoot?.uri) {
      newErrors.bootImage = translateData.bootViewimageisrequired;
      valid = false;
    }
    if (!imageUriInterior?.uri) {
      newErrors.interiorImage = translateData.Interiorimageisrequired;
      valid = false;
    }
    if (!imageUriRegistration?.uri) {
      newErrors.registrationImage = translateData.RegistrationImageisRequired;
      valid = false;
    }

    if (!perDayPrice || isNaN(Number(perDayPrice))) {
      newErrors.perDayPrice = translateData.vehiclePerDayPriceRequiredddd;
      valid = false;
    } else if (Number(perDayPrice) <= 0) {
      newErrors.perDayPrice = translateData.Pricemustthan;
      valid = false;
    }


    if (withDriver === 1) {
      if (!driverPerDayPrice || isNaN(Number(driverPerDayPrice))) {
        newErrors.driverPerDayPrice = translateData.ValiddriverRequiredddddddd;
        valid = false;
      } else if (Number(driverPerDayPrice) <= 0) {
        newErrors.driverPerDayPrice = translateData.Driverpricemustbe;
        valid = false;
      }
    }

    if (!categoryType || !categoryType.trim()) {
      newErrors.categoryType = translateData.vehicleTypeIsRequireddddddddd;
      valid = false;
    }

    if (!fualType || !fualType.trim()) {
      newErrors.fualType = translateData.fuelTypeIsRequiredddddd;
      valid = false;
    }

    if (!valuegear) {
      newErrors.gearType = translateData.geartypeisRequiredddddd;
      valid = false;
    }

    if (!vehicleSpeed || isNaN(Number(vehicleSpeed))) {
      newErrors.vehicleSpeed = translateData.Validspeedisrequiredddddd;
      valid = false;
    } else if (Number(vehicleSpeed) <= 0) {
      newErrors.vehicleSpeed = translateData.Speedgreater;
      valid = false;
    }

    if (!vehicleMileage || isNaN(Number(vehicleMileage))) {
      newErrors.vehicleMileage = translateData.ValidMileageIsRequireddddddddd;
      valid = false;
    } else if (Number(vehicleMileage) <= 0) {
      newErrors.vehicleMileage = translateData.mileagegreater;
      valid = false;
    }
    if (!bagCount) {
      newErrors.bagCount = translateData.bagCountIsRequiredddddd;
    } else if (isNaN(Number(bagCount))) {
      newErrors.bagCount = translateData.Pleaseenteravalidnumber;
    } else if (Number(bagCount) < 0) {
      newErrors.bagCount = translateData.Bagcountcannotbenegative;
    }

    if (fields.length === 0) {
      newErrors.interiorFeatures = translateData.Atinteriorfeaturerequired;
      valid = false;
    } else {
      fields.forEach((field: any, index: number) => {
        if (!field.value || !field.value.trim()) {
          newErrors[`interiorFeature_${index}`] = translateData.interiorFeatureCannotBeEmpty;
          valid = false;
        }
      });
    }

    setErrors(newErrors);
    return valid;
  };

  const [modalVisible1, setModalVisible1] = useState(false);

  const cancelDelete = () => {
    setModalVisible1(false);
    ambulanceRef.current?.close();


  };

  const renderError = (fieldName: string) => {
    return errors[fieldName] ? (
      <Text style={styles.errorText}>{errors[fieldName]}</Text>
    ) : null;
  };

  const handleDeleteClick = () => {
    setModalVisible1(true);
    ambulanceRef.current?.present();

  };


  const ambulanceRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%"], []);

  const ambulanceRef1 = useRef<BottomSheetModal>(null);
  const snapPoints1 = useMemo(() => ["55%"], []);

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header title={isEditMode ? "Edit Vehicle" : translateData.addVehicle} />
        <View style={styles.mainContainer}>
          <View style={styles.subContainer}>
            <Text
              style={[
                styles.title,
                { textAlign: textRtlStyle },
                { color: colors.text },
              ]}
            >
              {translateData.vehicleType}
            </Text>
            <View>
              <DropDownPicker
                open={vehicleTypeopen}
                value={vehicleValue}
                items={vehicleType}
                setOpen={setvehicleTypeOpen}
                setValue={(val) => {
                  setVehicleValue(val);
                  setErrors((prevErrors) => ({ ...prevErrors, vehicleType: '' }));
                }}
                setItems={setVehicleType}
                placeholder={translateData.selectVehicle}
                style={[styles.dropContainer, { borderColor: colors.border }]}
                zIndex={4}
                placeholderStyle={styles.vehiclePlaceholder}
                style={[
                  styles.vehicleStyle,
                  {
                    borderColor: isDark ? appColors.darkborder : appColors.border,
                    backgroundColor: isDark ? colors.card : appColors.white,
                    flexDirection: viewRtlStyle,
                  },
                ]}
                dropDownContainerStyle={{
                  backgroundColor: isDark ? colors.card : appColors.dropDownColor,
                  borderColor: colors.border,
                }}
                textStyle={[styles.vehicleText, { color: colors.text }]}
                labelStyle={[
                  styles.vehicleLabel,
                  { color: isDark ? appColors.white : appColors.black },
                ]}
                listItemLabelStyle={{
                  color: isDark ? appColors.white : appColors.black,
                }}
                tickIconStyle={{
                  tintColor: isDark ? appColors.white : appColors.black,
                }}
                arrowIconStyle={{
                  tintColor: isDark ? appColors.white : appColors.black,
                }}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  showsVerticalScrollIndicator: false,
                  nestedScrollEnabled: true,
                }}
                textStyle={{
                  textAlign: rtl ? 'right' : 'left',
                  fontSize: fontSizes.FONT4,
                }}
  ArrowDownIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '-90deg' }] }]}>
                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '90deg' }] }]}>

                                <Icons.Back color={colors.text} />
                            </View>
                        )}
              />
              {errors.vehicleType ? (
                <Text style={styles.errorText}>{errors.vehicleType}</Text>
              ) : null}
            </View>
            <Text
              style={[
                styles.title,
                { textAlign: textRtlStyle },
                { marginTop: windowHeight(1.8) },
                { color: colors.text },
              ]}
            >
              {translateData.zone}
            </Text>
            <View>
              <DropDownPicker
                open={zoneopen}
                value={zoneValue}
                items={rentalZoneType}
                setOpen={setZoneOpen}
                setValue={(callback) => {
                  const val = callback(); // e.g. 69
                  setZoneValue(val);

                  // Find full object by value
                  const selectedObj = rentalZoneType.find(item => item.value === val);
                  setSelectedZone(selectedObj);

                  setErrors((prevErrors) => ({ ...prevErrors, zone: '' }));
                }}

                setItems={setRentalZoneType}
                style={styles.dropContainer}
                placeholder={translateData.selectZone}
                placeholderStyle={styles.zonePlaceholder}
                zIndex={3}
                style={[
                  styles.zoneStyle,
                  {
                    borderColor: isDark ? appColors.darkborder : appColors.border,
                    backgroundColor: isDark ? colors.card : appColors.white,
                    flexDirection: viewRtlStyle,
                  },
                ]}
                dropDownContainerStyle={{
                  backgroundColor: isDark ? colors.card : appColors.dropDownColor,
                  borderColor: colors.border,
                }}
                textStyle={[styles.vehicleText, { color: colors.text }]}
                labelStyle={[
                  styles.vehicleLabel,
                  { color: isDark ? appColors.white : appColors.black },
                ]}
                listItemLabelStyle={{
                  color: isDark ? appColors.white : appColors.black,
                }}
                tickIconStyle={{
                  tintColor: isDark ? appColors.white : appColors.black,
                }}
                arrowIconStyle={{
                  tintColor: isDark ? appColors.white : appColors.black,
                }}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                textStyle={{
                  textAlign: rtl ? 'right' : 'left',
                  fontSize: fontSizes.FONT4,
                }}
  ArrowDownIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '-90deg' }] }]}>
                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '90deg' }] }]}>

                                <Icons.Back color={colors.text} />
                            </View>
                        )}
              />
              {errors.zone && (
                <Text style={styles.errorText}>{errors.zone}</Text>
              )}
            </View>
            <View>
              <View style={[styles.vehicleInput]}>
                <Input
                  placeholder={translateData.enterVehicleNames}
                  titleShow={true}
                  title={translateData.vehicleName}
                  backgroundColor={isDark ? colors.card : appColors.white}
                  onChangeText={(text) => {
                    setVehicleName(text);
                    if (!text.trim()) {
                      setErrors(prev => ({ ...prev, vehicleName: translateData.vehicleNameIsRequired }));
                    } else {
                      setErrors(prev => ({ ...prev, vehicleName: '' }));
                    }
                  }}
                  value={vehicleName}
                />
                {errors.vehicleName && (
                  <Text style={[styles.errorText, { bottom: windowHeight(1.8) }]}>{errors.vehicleName}</Text>
                )}
              </View>
            </View>

            <Text
              style={[
                styles.title,
                { textAlign: textRtlStyle },
                { marginTop: windowHeight(0.3) },
                { color: isDark ? appColors.white : appColors.primaryFont },
              ]}
            >
              {translateData.vehicleDescription}
            </Text>
            <View>
              <TextInput
                style={[
                  styles.descriptionField,
                  { textAlign: textRtlStyle },
                  { color: isDark ? appColors.white : appColors.primaryFont },
                  { backgroundColor: isDark ? colors.card : appColors.white },
                  { borderColor: isDark ? appColors.darkborder : appColors.border },
                ]}
                placeholder={translateData.writeHeres}
                placeholderTextColor={
                  isDark ? appColors.darkText : appColors.secondaryFont
                }
                multiline={true}
                numberOfLines={3}
                maxLength={500}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  if (!text.trim()) {
                    setErrors(prev => ({ ...prev, description: translateData.vehicleDescriptionIsRequired }));
                  } else {
                    setErrors(prev => ({ ...prev, description: '' }));
                  }
                }}
              />
              {renderError('description')}

            </View>
            <View style={styles.registrationInput}>
              <Input
                placeholder={translateData.enterRegistrationNo}
                titleShow={true}
                title={translateData.registrationNumber}
                backgroundColor={isDark ? colors.card : appColors.white}
                onChangeText={(text) => {
                  setRegistrationNo(text);
                  if (!text.trim()) {
                    setErrors(prev => ({ ...prev, registrationNo: translateData.registrationNoisRequired }));
                  } else {
                    setErrors(prev => ({ ...prev, registrationNo: '' }));
                  }
                }}
                value={registrationNo}
              />
              {errors.registrationNo && (
                <Text style={[styles.errorText, { bottom: windowHeight(1.8) }]}>{errors.registrationNo}</Text>
              )}
            </View>
          </View>

          <View
            style={[
              styles.uploadContainer,
              { backgroundColor: isDark ? colors.card : appColors.white },
              { borderColor: colors.border },
            ]}
          >
            <View
              style={[styles.uploadSubContainer, { flexDirection: viewRtlStyle }]}
            >
              <Text
                style={[
                  styles.uploadTitle,
                  { color: isDark ? appColors.white : appColors.primaryFont },
                ]}
              >
                {translateData.uploadFile}
              </Text>
              <TouchableOpacity onPress={openModal} activeOpacity={0.7}
              >
                <Icons.Help />
              </TouchableOpacity>
            </View>
            <View style={[styles.imgContainer, { flexDirection: viewRtlStyle }]}>
              <TouchableOpacity
                onPress={handlePress}
                style={[{ borderWidth: imageUri?.uri ? 0 : windowHeight(0.1) }, styles.imgUpload]}
                activeOpacity={0.7}

              >
                {imageUri?.uri ? (
                  <>
                    <Image
                      source={{ uri: imageUri?.uri }}
                      style={styles.uploadedImg}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}

                      onPress={removemainImg}
                      style={styles.imgClose}
                    >
                      <Icons.CloseSimple />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Icons.Download color={appColors.secondaryFont} />
                    <Text style={styles.placeHolder}>
                      {translateData.uploadImage}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePressFront}
                style={[
                  { borderWidth: imageUriFront?.uri ? 0 : windowHeight(0.1) },
                  styles.imgUpload,
                ]}
              >
                {imageUriFront?.uri ? (
                  <>
                    <Image
                      source={{ uri: imageUriFront?.uri }}
                      style={styles.uploadedImg}
                    />
                    <TouchableOpacity
                      onPress={removemainImgFront}
                      style={styles.imgClose}
                      activeOpacity={0.7}

                    >
                      <Icons.CloseSimple />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Icons.Download color={appColors.secondaryFont} />
                    <Text style={styles.placeHolder}>
                      {translateData.uploadFrontView}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={[styles.imgContainer, { flexDirection: viewRtlStyle }]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handlePressSide}
                style={[
                  { borderWidth: imageUriSide?.uri ? 0 : windowHeight(0.1) },
                  styles.imgUpload,
                ]}
              >
                {imageUriSide?.uri ? (
                  <>
                    <Image
                      source={{ uri: imageUriSide.uri }}
                      style={styles.uploadedImg}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={removemainImgSide}
                      style={styles.imgClose}
                    >
                      <Icons.CloseSimple />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Icons.Download color={appColors.secondaryFont} />
                    <Text style={styles.placeHolder}>
                      {translateData.uploadSideView}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handlePressBoot}
                style={[
                  { borderWidth: imageUriBoot?.uri ? 0 : windowHeight(0.1) },
                  styles.imgUpload,
                ]}
              >
                {imageUriBoot?.uri ? (
                  <>
                    <Image
                      source={{ uri: imageUriBoot.uri }}
                      style={styles.uploadedImg}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}

                      onPress={removemainImgBoot}
                      style={styles.imgClose}
                    >
                      <Icons.CloseSimple />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Icons.Download color={appColors.secondaryFont} />
                    <Text style={styles.placeHolder}>
                      {translateData.uploadBootView}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View style={[styles.imgContainer2, { flexDirection: viewRtlStyle }]}>
              <TouchableOpacity
                activeOpacity={0.7}

                onPress={handlePressInterior}
                style={[
                  { borderWidth: imageUriInterior?.uri ? 0 : windowHeight(0.1) },
                  styles.imgUpload,
                ]}
              >
                {imageUriInterior?.uri ? (
                  <>
                    <Image
                      source={{ uri: imageUriInterior.uri }}
                      style={styles.uploadedImg}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}

                      onPress={removemainImgInterior}
                      style={styles.imgClose}
                    >
                      <Icons.CloseSimple />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Icons.Download color={appColors.secondaryFont} />
                    <Text style={styles.placeHolder}>
                      {translateData.uploadInterior}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}

                onPress={handlePressRegistration}
                style={[
                  { borderWidth: imageUriRegistration?.uri ? 0 : windowHeight(0.1) },
                  styles.imgUpload,
                ]}
              >
                {imageUriRegistration?.uri ? (
                  <>
                    <Image
                      source={{ uri: imageUriRegistration.uri }}
                      style={styles.uploadedImg}
                    />
                    <TouchableOpacity
                      activeOpacity={0.7}

                      onPress={removemainImgRegistration}
                      style={styles.imgClose}
                    >
                      <Icons.CloseSimple />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Icons.Download color={appColors.secondaryFont} />
                    <Text style={styles.placeHolder}>
                      {translateData.uploadRegistration}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>


          </View>
          <View style={{ marginHorizontal: windowHeight(2.3), }}>
            {errors.mainImage && !imageUri?.uri && (
              <Text style={styles.errorText}>{errors.mainImage}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View>
              <Input
                iconText={selectedZone?.data || settingData?.values?.general?.default_currency?.symbol}
                placeholder={translateData.enterPerDayPrice}
                titleShow={true}
                title={translateData.vehiclePerDayPrice}
                backgroundColor={isDark ? colors.card : appColors.white}
                onChangeText={(text) => {
                  setPerDayPrice(text);

                  if (!text.trim()) {
                    setErrors(prev => ({
                      ...prev,
                      perDayPrice: translateData?.vehiclePerDayPriceRequired,
                    }));
                  } else if (isNaN(Number(text)) || Number(text) <= 0) {
                    setErrors(prev => ({
                      ...prev,
                      perDayPrice: translateData?.pricepositiveanumber,
                    }));
                  } else {
                    setErrors(prev => ({
                      ...prev,
                      perDayPrice: '',
                    }));
                  }
                }}
                keyboardType='number-pad'
                value={perDayPrice}
              />
              {errors.perDayPrice && (
                <Text style={[styles.errorText, { bottom: windowHeight(1.8) }]}>
                  {errors.perDayPrice}
                </Text>
              )}
            </View>

            <View style={[styles.driverAllow, { flexDirection: viewRtlStyle }]}>
              <Text
                style={[
                  styles.withDriver,
                  { color: isDark ? appColors.white : appColors.primaryFont },
                ]}
              >
                {translateData.withDriver}
              </Text>
              <Switch onPress={onwithDriver} switchOn={withDriver === 1} />
            </View>
            {withDriver === 1 && (
              <View>
                <Input
                  iconText={selectedZone?.data || settingData?.values?.general?.default_currency?.symbol}
                  placeholder={translateData.enterPerDayPrice}
                  titleShow={true}
                  title={translateData.driverPerDayPrice}
                  backgroundColor={isDark ? colors.card : appColors.white}
                  onChangeText={text => {
                    setDriverperDayPrice(text);
                    setErrors(prev => ({ ...prev, driverPerDayPrice: '' }));
                  }}
                  value={driverPerDayPrice}
                  keyboardType='number-pad'
                />
                {renderError('driverPerDayPrice')}
              </View>
            )}
            <View style={styles.vehicleType}>
              <Input
                placeholder={translateData.suv}
                titleShow={true}
                title={translateData.vehicleType}
                backgroundColor={isDark ? colors.card : appColors.white}
                onChangeText={text => {
                  setCategoryType(text);

                  if (!text.trim()) {
                    setErrors(prev => ({
                      ...prev,
                      categoryType: translateData.vehicleTypeIsRequired,
                    }));
                  } else {
                    setErrors(prev => ({
                      ...prev,
                      categoryType: '',
                    }));
                  }
                }}
                value={categoryType}
              />
              {errors.categoryType && (
                <Text style={[styles.errorText, { bottom: windowHeight(1.8) }]}>
                  {errors.categoryType}
                </Text>
              )}
            </View>

            <View
              style={[styles.statusContainer, { flexDirection: viewRtlStyle }]}
            >
              <Text
                style={[
                  styles.withDriver,
                  { color: isDark ? appColors.white : appColors.primaryFont },
                ]}
              >
                {translateData.aCNonAC}
              </Text>
              <Switch onPress={onAcStatus} switchOn={acStatus === 1} />
            </View>
            <View style={styles.fualType}>
              <Input
                placeholder={translateData.diesel}
                titleShow={true}
                title={translateData.fualType}
                backgroundColor={isDark ? colors.card : appColors.white}
                onChangeText={text => {
                  setFualType(text);

                  if (!text.trim()) {
                    setErrors(prev => ({
                      ...prev,
                      fualType: translateData.fuelTypeIsRequired,
                    }));
                  } else {
                    setErrors(prev => ({
                      ...prev,
                      fualType: '',
                    }));
                  }
                }}
                value={fualType}
              />
              {errors.fualType && (
                <Text style={[styles.errorText, { bottom: windowHeight(1.8) }]}>
                  {errors.fualType}
                </Text>
              )}
            </View>

            <Text
              style={[
                styles.gearTitle,
                { textAlign: textRtlStyle },
                { color: isDark ? appColors.white : appColors.primaryFont },
              ]}
            >
              {translateData.gearType}
            </Text>
            <View>
              <DropDownPicker
                open={openGear}
                value={valuegear}
                items={gearType}
                setOpen={setOpenGear}
                setValue={(val) => {
                  setValueGear(val);
                  if (val) {
                    setErrors(prev => ({ ...prev, gearType: '' }));
                  }
                }} setItems={setGearType}
                style={[styles.border, { borderColor: colors.border }]}
                placeholderStyle={styles.vehiclePlaceholder}
                style={[
                  {
                    borderColor: isDark ? appColors.darkborder : appColors.border,
                    flexDirection: viewRtlStyle,
                    backgroundColor: isDark ? colors.card : appColors.white,
                  },
                ]}
                dropDownContainerStyle={{
                  backgroundColor: isDark ? colors.card : appColors.dropDownColor,
                  borderColor: colors.border,
                }}
                textStyle={[styles.vehicleText, { color: colors.text }]}
                labelStyle={[
                  styles.vehicleLabel,
                  { color: isDark ? appColors.white : appColors.black },
                ]}
                listItemLabelStyle={{
                  color: isDark ? appColors.white : appColors.black,
                }}
                tickIconStyle={{
                  tintColor: isDark ? appColors.white : appColors.black,
                }}
                arrowIconStyle={{
                  tintColor: isDark ? appColors.white : appColors.black,
                }}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  showsVerticalScrollIndicator: false,
                  nestedScrollEnabled: true,
                }}
                textStyle={{
                  textAlign: rtl ? 'right' : 'left',
                  fontSize: fontSizes.FONT4,
                }}
  ArrowDownIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '-90deg' }] }]}>
                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '90deg' }] }]}>

                                <Icons.Back color={colors.text} />
                            </View>
                        )}
              />
              {errors.gearType && (
                <Text style={styles.errorText}>{errors.gearType}</Text>
              )}
            </View>
            <View style={styles.vehicleSpeed}>
              <Input
                keyboardType='numeric'
                placeholder={translateData.enterVehicleSpeed}
                titleShow={true}
                title={translateData.vehicleSpeed}
                backgroundColor={isDark ? colors.card : appColors.white}
                onChangeText={text => {
                  setvehicleSpeed(text);

                  if (!text.trim()) {
                    setErrors(prev => ({
                      ...prev,
                      vehicleSpeed: translateData.vehicleSpeedIsRequired,
                    }));
                  } else {
                    setErrors(prev => ({
                      ...prev,
                      vehicleSpeed: '',
                    }));
                  }
                }}
                value={vehicleSpeed}
              />
              {errors.vehicleSpeed && (
                <Text style={[styles.errorText, { bottom: windowHeight(1.8) }]}>
                  {errors.vehicleSpeed}
                </Text>
              )}
            </View>

            <View style={styles.vehicleMileage}>
              <Input
                placeholder={translateData.enterVehicleMileage}
                titleShow={true}
                keyboardType='number-pad'
                title={translateData.vehicleMileage}
                backgroundColor={isDark ? colors.card : appColors.white}
                onChangeText={text => {
                  setVehicleMileage(text);

                  if (!text.trim()) {
                    setErrors(prev => ({
                      ...prev,
                      vehicleMileage: translateData.vehicleMileageIsRequired,
                    }));
                  } else {
                    setErrors(prev => ({
                      ...prev,
                      vehicleMileage: '',
                    }));
                  }
                }}
                value={vehicleMileage}
              />
              {errors.vehicleMileage && (
                <Text style={[styles.errorText, { bottom: windowHeight(1.8) }]}>
                  {errors.vehicleMileage}
                </Text>
              )}
            </View>

            <View style={styles.bagCount}>
              <Input
                placeholder={translateData.enterbagCount}
                titleShow={true}
                title={translateData.bagCount}
                backgroundColor={isDark ? colors.card : appColors.white}
                keyboardType="number-pad"
                value={String(bagCount)}
                onChangeText={text => {
                  setBagCount(text);

                  if (!text.trim()) {
                    setErrors(prev => ({ ...prev, bagCount: translateData.bagCountIsRequired }));
                  } else if (isNaN(text) || parseInt(text) <= 0) {
                    setErrors(prev => ({ ...prev, bagCount: translateData.enterAValidBagCount }));
                  } else {
                    setErrors(prev => ({ ...prev, bagCount: '' }));
                  }
                }}
              />

              {errors.bagCount && (
                <Text style={[styles.errorText, { bottom: windowHeight(1.8) }]}>
                  {errors.bagCount}
                </Text>
              )}
            </View>


            <Text
              style={[
                styles.titleInterior,
                { textAlign: textRtlStyle },
                { color: isDark ? appColors.white : appColors.primaryFont },
              ]}
            >
              {translateData.moreInformation}
            </Text>
            <View
              style={[
                styles.listView,
                { backgroundColor: isDark ? colors.card : appColors.white },
                { borderColor: colors.border },
              ]}
            >
              <FlatList data={fields} renderItem={renderField} />
            </View>
            <View style={styles.vehicleStatusContainer}>
              <View
                style={[styles.statusContainer, { flexDirection: viewRtlStyle }]}
              >
                <Text
                  style={[
                    styles.withDriver,
                    { color: isDark ? appColors.white : appColors.primaryFont },
                  ]}
                >
                  {translateData.status}
                </Text>
                <Switch
                  onPress={onvehicleStatus}
                  switchOn={vehicleStatus === 1}
                />
              </View>
            </View>
          </View>
        </View>


        <View style={styles.buttonContainer}>
          {isEditMode ? (
            <View style={{ flexDirection: viewRtlStyle, width: '100%' }}>
              <View style={styles.handleDeleteClick}>

                <Button
                  title={translateData.update}
                  backgroundColor={appColors.primary}
                  color={appColors.white}
                  onPress={updateVehicles}
                  loading={updateLoad}
                />
              </View>
              <View style={styles.handleDeleteClick}>
                <Button
                  title={translateData.delete}
                  backgroundColor={appColors.red}
                  color={appColors.white}
                  onPress={handleDeleteClick}
                  loading={deleteLoad}
                />
              </View>
            </View>
          ) : (

            <Button
              title={translateData.upload}
              backgroundColor={appColors.primary}
              color={appColors.white}
              onPress={addVehicles}
              loading={loader}
            />

          )}
        </View>
      </ScrollView>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={ambulanceRef}
          index={1}
          enablePanDownToClose
          handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
          snapPoints={snapPoints}
          backdropComponent={(props) => <BottomSheetBackdrop {...props} pressBehavior="close" />}
        >

          <BottomSheetView >
            <TouchableWithoutFeedback onPress={cancelDelete}>
              <View>
                <FastImage source={Images.delete} resizeMode='contain' style={{ height: windowHeight(12.5), width: windowHeight(12.5), alignSelf: 'center' }} />
                <Text style={{ color: appColors.black, textAlign: 'center', width: '80%', alignSelf: 'center', fontFamily: appFonts.medium, fontSize: fontSizes.FONT4HALF, top: windowHeight(3) }}>{translateData.areYourVehicle}</Text>
                <View style={{ flexDirection: 'row', marginTop: windowHeight(7), gap: 16, justifyContent: 'space-around', paddingHorizontal: windowHeight(3) }}>
                  <TouchableOpacity onPress={cancelDelete} style={{ backgroundColor: appColors.graybackground, height: windowHeight(5.8), width: windowHeight(19.7), justifyContent: 'center', borderRadius: windowHeight(0.8) }}>
                    <Text style={{ color: 'gray', textAlign: 'center' }}>{translateData.cancelTextT}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={deleteVehicle} style={{ backgroundColor: appColors.red, height: windowHeight(5.8), width: windowHeight(19.7), justifyContent: 'center', borderRadius: windowHeight(0.8) }}>
                    <Text style={{ color: appColors.white, textAlign: 'center' }}>{translateData.deleteTextT}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>




      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={ambulanceRef1}
          index={1}
          enablePanDownToClose

          handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
          snapPoints={snapPoints1}
          backdropComponent={(props) => <BottomSheetBackdrop {...props} pressBehavior="close" />}
        >

          <BottomSheetView  >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                <View
                  style={[
                    styles.closeContainer,
                    { right: rtl ? windowWidth(82) : 0 },
                  ]}
                >
                </View>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color: isDark ? appColors.white : appColors.primaryFont,
                      textAlign: 'center',
                      marginTop: 12,
                    },
                  ]}
                >
                  {translateData.imageGuide}
                </Text>
                <View style={styles.swiperStyle}>
                  <Swiper
                    autoplay={true}
                    removeClippedSubviews={false}
                    scrollEnabled={true}
                    loop={true}
                    showsPagination={true}
                    dotColor={appColors.closeBg}
                    activeDotColor={appColors.primary}
                    paginationStyle={{ gap: windowHeight(0.5) }}
                    dotStyle={styles.swiperDot}
                    activeDotStyle={styles.swiperDot}
                  >
                    {swiperData?.map((item, index) => (
                      <View key={index} style={styles.sliderView}>
                        <Image source={item.image} style={styles.sliderImg} />
                        <Text
                          style={[
                            styles.sliderTitle,
                            {
                              color: isDark
                                ? appColors.white
                                : appColors.primaryFont,
                            },
                          ]}
                        >
                          {item.title}
                        </Text>
                        <Text style={styles.sliderDesc}>{item.description}</Text>
                      </View>
                    ))}
                  </Swiper>
                </View>
                <View style={styles.btnMargin}>
                  <Button
                    title={translateData.okay}
                    color={appColors.white}
                    backgroundColor={appColors.primary}
                    onPress={closeModal}
                  />
                </View>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  )

}