import { View, BackHandler, ScrollView, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button, Header } from '@src/commonComponent';
import { ImageContainer } from './imageContainer/index';
import { DataContainer } from './dataContainer/index';
import { useValues } from '@src/utils/context/index';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { useDispatch, useSelector } from 'react-redux';
import { clearValue, getValue, setValue } from '../../../../utils/localstorage/index';
import { selfData } from '../../../../api/store/actions/accountAction';
import { useAppNavigation } from '@src/utils/navigation';
import { URL } from '@src/api/config';
import { notificationHelper } from '@src/commonComponent';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch } from '@src/api/store';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { Camera } from '@src/utils/icons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Gallery } from '@src/assets/icons/gallery';
import { Remove } from '@src/assets/icons/remove';

export function EditProfile() {
  const { goBack } = useAppNavigation();
  const { self, loading } = useSelector((state: any) => state.account);
  const { isDark, bgFullStyle, isRTL } = useValues();
  const [profileImg, setProfileImage] = useState<any>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigation = useNavigation();
  const { translateData } = useSelector((state: any) => state.setting);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (show) {
          setShow(false);
          return true;
        }
        return false;
      },
    );
    return () => {
      backHandler.remove();
    };
  }, [show]);


  const [phoneNumberError, setPhoneNumberError] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')

  const update = async (formDataObj: any) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (formDataObj.phoneNumber) {
      if (formDataObj.phoneNumber.length < 6) {
        setPhoneNumberError('Phone Number must be at least 6 digits')
        return true
      } else {
        setPhoneNumberError('')
      }
    }


    if (formDataObj?.email) {
      if (!formDataObj.email.trim()) {
        setEmailError('');
      } else if (!emailRegex.test(formDataObj.email.trim())) {
        setEmailError('Please enter a valid email address');
        return true;
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }


    if (!formDataObj) {
      notificationHelper('', translateData.fillAllFields, 'error');
      return;
    }

    setIsUpdating(true);
    const token = await getValue('token');

    try {
      const formData = new FormData();
      formData.append('name', formDataObj.username);
      formData.append('email', formDataObj.email);
      formData.append('country_code', formDataObj.countryCode);
      formData.append('phone', formDataObj.phoneNumber);
      formData.append('_method', 'PUT');

      if (profileImg) {
        formData.append('profile_image', {
          uri: profileImg.uri,
          type: profileImg.type,
          name: profileImg.fileName,
        });
      }

      const response = await fetch(`${URL}/api/updateProfile`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status === 403) {
        notificationHelper('', translateData.loginAgain, 'error');
        await clearValue('token');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
        return;
      }

      if (!response.ok) {
        const responseData = await response.json();
        console.error('Error updating profile:', responseData);
        notificationHelper('', translateData.profileFail, 'error');
      } else {
        dispatch(selfData())
          .unwrap()
          .then((res) => {
            setImageUri(res?.profile_image_url);
          })
          .catch((err) => {
            console.error("Failed to load self data:", err)
          })
        notificationHelper('', translateData.profileSuccessfully, 'success');
        goBack();
        if (profileImg) {
          setValue('profile_image_uri', profileImg.uri);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      notificationHelper('', translateData.profileFail, 'error');
    } finally {
      setIsUpdating(false);
    }
  };


  const RemoveUpdate = async (formDataObj: any) => {
    setIsUpdating(true);
    const token = await getValue('token');

    try {
      const formData = new FormData();
      formData.append('name', formDataObj.username);
      formData.append('email', formDataObj.email);
      formData.append('country_code', formDataObj.countryCode);
      formData.append('phone', formDataObj.phoneNumber);
      formData.append('profile_image_id', '');
      formData.append('_method', 'PUT');

      const response = await fetch(`${URL}/api/updateProfile`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status === 403) {
        notificationHelper('', translateData.loginAgain, 'error');
        await clearValue('token');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
        return;
      }

      if (!response.ok) {
        const responseData = await response.json();
        console.error('Error updating profile:', responseData);
        notificationHelper('', translateData.profileFail, 'error');
      } else {
        dispatch(selfData())
          .unwrap()
          .then((res) => {
            setImageUri(res?.profile_image_url);
          })
          .catch((err) => {
            console.error("Failed to load self data:", err)
          })
        notificationHelper('', translateData.profileSuccessfully, 'success');
        goBack();
        if (profileImg) {
          setValue('profile_image_uri', profileImg.uri);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      notificationHelper('', translateData.profileFail, 'error');
    } finally {
      setIsUpdating(false);
    }
  };


  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['35%'], []);
  const [imageUri, setImageUri] = useState<string | undefined>();

  const handleImageSelection = async (type: 'camera' | 'gallery') => {
    const options = { mediaType: 'photo', maxWidth: 300, maxHeight: 300, quality: 1 };
    const result = type === 'gallery'
      ? await launchImageLibrary(options)
      : await launchCamera(options);

    if (result.didCancel || result.errorCode) return;

    const selectedImage = result.assets?.[0];
    setProfileImage(selectedImage);

    if (selectedImage?.uri) {
      setImageUri(selectedImage.uri);
      await setValue('profile_image_uri', selectedImage.uri);
      bottomSheetModalRef.current?.dismiss();
    }
  };


  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: isDark ? appColors.darkHeader : appColors.lightGray }}>
        <Header
          value={translateData.profileSettings}
          container={
            <View
              style={{
                backgroundColor: isDark ? bgFullStyle : appColors.lightGray,
                height: '100%',
              }}>
              <View style={{ height: '75%' }}>
                <View
                  style={{
                    backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor,
                    height: windowHeight(400),
                    marginHorizontal: windowWidth(20),
                    marginTop: windowHeight(20),
                    borderWidth: 1,
                    borderColor: isDark ? appColors.darkBorder : appColors.border,
                    borderRadius: windowHeight(8),
                  }}>
                  <ImageContainer
                    data={self}
                    bottomSheetRef={bottomSheetModalRef}
                    imageUri={imageUri ?? self?.profile_image_url}
                    setImageUri={setImageUri}
                  />

                  <DataContainer
                    data={self}
                    updateProfile={update}
                    loading={loading}
                    showCountryPicker={showCountryPicker}
                    setShowCountryPicker={setShowCountryPicker}
                    show={show}
                    setShow={setShow}
                    Update={isUpdating}
                    setForm={setForm}
                    phoneNumberError={phoneNumberError}
                    emailError={emailError}
                  />
                </View>
              </View>

              <View
                style={{
                  paddingHorizontal: windowWidth(20),
                  paddingBottom: windowHeight(20),
                  backgroundColor: isDark ? appColors.darkHeader : appColors.lightGray,
                }}>
                <Button
                  title={translateData.updateProfile}
                  onPress={() => update(form)}
                  loading={isUpdating}
                />
              </View>
            </View>
          }
        />

      </ScrollView>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onDismiss={() => bottomSheetModalRef.current?.dismiss()}
          handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
          backgroundStyle={{ backgroundColor: isDark ? appColors.bgDark : appColors.whiteColor }}
        >
          <BottomSheetView style={{ padding: windowHeight(15) }}>
            <Text style={{ fontFamily: appFonts.medium, fontSize: fontSizes.FONT20, color: isDark ? appColors.whiteColor : appColors.blackColor, marginBottom: windowHeight(15) }}>
              {translateData.selectOne}
            </Text>
            <TouchableOpacity
              onPress={() => handleImageSelection('gallery')}
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: windowHeight(2) }}
            >
              <View style={{ backgroundColor: isDark ? appColors.dotDark : appColors.dotLight, height: windowHeight(35), width: windowHeight(35), borderRadius: windowHeight(30), justifyContent: 'center', alignItems: 'center' }}>
                <Gallery />
              </View>
              <Text style={{ fontSize: fontSizes.FONT17, fontFamily: appFonts.medium, marginHorizontal: windowWidth(10), color: isDark ? appColors.darkText : appColors.blackColor }}>
                {translateData.chooseFromGallery}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleImageSelection('camera')}
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', marginVertical: windowHeight(10) }}
            >
              <View style={{ backgroundColor: isDark ? appColors.dotDark : appColors.dotLight, height: windowHeight(35), width: windowHeight(35), borderRadius: windowHeight(30), justifyContent: 'center', alignItems: 'center' }}>
                <Camera />
              </View>
              <Text style={{ fontSize: fontSizes.FONT17, fontFamily: appFonts.medium, marginHorizontal: windowWidth(10), color: isDark ? appColors.darkText : appColors.blackColor }}>
                {translateData.openCamera}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                setImageUri('');
                RemoveUpdate(form)
                bottomSheetModalRef.current?.dismiss();
              }}
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}
            >
              <View style={{ backgroundColor: isDark ? appColors.dotDark : appColors.dotLight, height: windowHeight(35), width: windowHeight(35), borderRadius: windowHeight(30), justifyContent: 'center', alignItems: 'center' }}>
                <Remove />
              </View>
              <Text style={{ fontSize: fontSizes.FONT17, fontFamily: appFonts.semiBold, marginHorizontal: windowWidth(10), color: isDark ? appColors.darkText : appColors.blackColor }}>
                {translateData.removeImage}
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
}
