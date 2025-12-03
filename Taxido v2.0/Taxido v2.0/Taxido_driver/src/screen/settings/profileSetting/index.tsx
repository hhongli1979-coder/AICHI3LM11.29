import { View, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, Text, Image, BackHandler } from 'react-native';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import appColors from '../../../theme/appColors';
import styles from './styles';
import { Button, Header, Input, notificationHelper } from '../../../commonComponents';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useValues } from '../../../utils/context';
import { setValue, getValue, deleteValue } from '../../../utils/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCountries } from 'react-native-country-select/lib/utils/countryHelpers';
import { InputBox } from '../../auth/component';
import { selfDriverData } from '../../../api/store/action';
import { ImageContainer } from './imageContainer';
import { URL } from '../../../api/config';
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant';
import { useLoadingContext } from '../../../utils/loadingContext';
import { SkeletonEditProfile } from './skeletonEditProfile';
import { ValidatePhoneNumber } from '../../../utils/validation';
import Images from '../../../utils/images/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import appFonts from '../../../theme/appFonts';
import Icons from '../../../utils/icons/icons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AppDispatch } from '../../../api/store';

const findCountryByCallingCode = async (code: string) => {
  const countries = await getAllCountries();
  return countries.find(country => country.idd.root === `+${code}`);
};

export function ProfileSetting() {

  const dispatch = useDispatch<AppDispatch>();
  const { goBack } = useNavigation();
  const navigation = useNavigation<any>();
  const { viewRtlStyle } = useValues();
  const [showWarning, setShowWarning] = useState(false);
  const [emailFormatWarning, setEmailFormatWarning] = useState('');
  const { colors } = useTheme();
  const { isDark, rtl, textRtlStyle } = useValues();
  const { selfDriver } = useSelector((state: any) => state.account);
  const [loadingShimmer, setLoadingShimmer] = useState(false);
  const { addressLoaded, setAddressLoaded }: any = useLoadingContext();
  const { translateData } = useSelector((state: any) => state.setting);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    countryCode: '',
  });
  const [error, setError] = useState('');
  const [profileImg, setProfileImage] = useState<any>();
  const [countryCode1, setCountryCode1] = useState(null);

  useEffect(() => {
    const loadCountry = async () => {
      try {
        let selected = null;

        if (selfDriver?.country_code) {
          const code = selfDriver.country_code.replace('+', '');
          const found = await findCountryByCallingCode(code);
          if (found) {
            selected = {
              callingCode: [found.idd.root.replace('+', '')],
              cca2: found.cca2,
            };
          }
        }

        if (!selected) {
          const saved = await AsyncStorage.getItem('selectedCountry');
          if (saved) {
            selected = JSON.parse(saved);
          }
        }

        setCountryCode1(selected);
        setFormData(prev => ({
          ...prev,
          countryCode: selected ? `+${selected.callingCode[0]}` : '',
          username: selfDriver?.name ?? '',
          phoneNumber: selfDriver?.phone ?? '',
          email: selfDriver?.email ?? '',
        }));
      } catch (err) {
      }
    };

    loadCountry();
  }, [selfDriver]);


  useEffect(() => {
    if (!addressLoaded) {
      setLoadingShimmer(true);
      setLoadingShimmer(false);
      setAddressLoaded(true);
    }
  }, [addressLoaded, setAddressLoaded]);


  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    const errorMsg = ValidatePhoneNumber(newPhoneNumber);
    setFormData(prevData => ({
      ...prevData,
      phoneNumber: newPhoneNumber,
    }));
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError('');
  };


  const [imageRemove, setImageRemove] = useState(false)

  const update = async () => {
    setLoading(true);
    const token = await getValue('token');

    try {
      const updateFormData = new FormData();
      updateFormData.append('name', formData.username);
      updateFormData.append('email', formData.email);
      updateFormData.append('country_code', formData.countryCode);
      updateFormData.append('phone', formData.phoneNumber);
      updateFormData.append('_method', 'PUT');

      if (profileImg) {
        updateFormData.append('profile_image', {
          uri: profileImg?.uri,
          type: profileImg?.type,
          name: profileImg?.fileName,
        });
      }


      const response = await fetch(`${URL}/api/updateProfile`, {
        method: 'POST',
        body: updateFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status == 403) {
        notificationHelper('', translateData.pleaseloginagain, 'error');
        await deleteValue('token');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }

      if (!response.ok) {
        notificationHelper('', translateData.failedprofile, 'error');
      }

      dispatch(selfDriverData()).unwrap()
        .then((res) => {
          setImageUri(res?.profile_image_url);

        })
      notificationHelper('', translateData.profileUpdatedSuccessfully, 'success');
      goBack();
      if (profileImg) {
        setValue('profile_image_uri', profileImg?.uri);
      }
    } catch (error) {
      notificationHelper('', translateData.profileupdatefailed, 'error');
    } finally {
      setLoading(false);
    }
  };

  const Reomveupdate = async () => {
    setLoading(true);
    const token = await getValue('token');

    try {
      const updateFormData = new FormData();
      updateFormData.append('name', formData.username);
      updateFormData.append('email', formData.email);
      updateFormData.append('country_code', formData.countryCode);
      updateFormData.append('phone', formData.phoneNumber);
      updateFormData.append(
        'profile_image_id', '');
      updateFormData.append('_method', 'PUT');


      const response = await fetch(`${URL}/api/updateProfile`, {
        method: 'POST',
        body: updateFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status == 403) {
        notificationHelper('', translateData.pleaseloginagain, 'error');
        await deleteValue('token');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        return;
      }

      if (!response.ok) {
        notificationHelper('', translateData.failedprofile, 'error');
      }

      dispatch(selfDriverData()).unwrap()
        .then((res) => {
          setImageUri(res?.profile_image_url);

        })
      notificationHelper('', translateData.profileUpdatedSuccessfully, 'success');
      goBack();
      if (profileImg) {
        setValue('profile_image_uri', profileImg?.uri);
      }
    } catch (error) {
      notificationHelper('', translateData.profileupdatefailed, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData(prevData => ({ ...prevData, [key]: value }));
    if (key === 'email') {
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
      setEmailFormatWarning(emailRegex.test(value) ? '' : 'Invalid email format');
    }
  };



  const [imageUri, setImageUri] = useState<string | undefined>(undefined)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['35%'], [])

  const handleImageSelection = async (type: 'gallery' | 'camera') => {
    const options: any = { mediaType: 'photo', maxWidth: 300, maxHeight: 300, quality: 1 };
    const result = type === 'gallery'
      ? await launchImageLibrary(options)
      : await launchCamera(options);

    if (result.didCancel) return;
    if (result.errorCode) {
      return;
    }
    const selectedImage = result.assets?.[0];
    if (selectedImage?.uri) {
      setImageUri(selectedImage.uri);
      setProfileImage(selectedImage);
      try {
        await setValue('profile_image_uri', selectedImage.uri);
      } catch (error) {
      }
      bottomSheetModalRef.current?.dismiss();
    }
  };


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

  const gotoEdit = (field: string) => {
    navigation.navigate('EditDetails' as any, { field })
  }



  return (
    <KeyboardAvoidingView style={styles.main} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}>
      <Header title={translateData.profileSettings} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileView, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {loadingShimmer ? (
            <SkeletonEditProfile />
          ) : (
            <>
              <View style={{ position: 'absolute', width: '100%', height: windowHeight(90) }}>
                <Image source={Images.profileBackground} style={{ width: '100%', height: windowHeight(12.9), bottom: windowHeight(7), borderTopLeftRadius: windowHeight(1), borderTopRightRadius: windowHeight(1) }} />
              </View>
              <ImageContainer
                data={selfDriver}
                setImageUri={setImageUri}
                imageUri={imageUri ?? selfDriver?.profile_image_url}
                openBottomSheet={() => bottomSheetModalRef.current?.present()}
              />
              <View style={styles.fieldView}>
                <Input title={translateData.userName} titleShow={true} placeholder={translateData.enterUserName} keyboardType="default" value={formData.username} onChangeText={text => handleChange('username', text)} showWarning={showWarning && formData.username === ''} warning={translateData.enterYouruserName} backgroundColor={isDark ? appColors.bgDark : appColors.graybackground} borderColor={isDark ? appColors.bgDark : appColors.graybackground} />
                <Text style={[styles.mobileNumber, { color: isDark ? appColors.white : appColors.primaryFont, textAlign: textRtlStyle }]}>{translateData.mobileNumber}</Text>
                <TouchableOpacity onPress={() => gotoEdit('mobile')} activeOpacity={0.9} style={[styles.countryContainer, { flexDirection: viewRtlStyle }]}>
                  <View style={[styles.codeComponent, { right: rtl ? windowWidth(2.5) : windowWidth(0) }]}>
                    <View style={[styles.pickerButton, { backgroundColor: isDark ? appColors.bgDark : appColors.graybackground, borderColor: isDark ? appColors.bgDark : appColors.graybackground }]}>
                      <Text style={[styles.codeText, { color: isDark ? appColors.white : appColors.secondaryFont }]}>{formData.countryCode}</Text>
                    </View>
                  </View>
                  <InputBox placeholder={translateData.enterPhone} placeholderTextColor={isDark ? appColors.darkText : appColors.secondaryFont} value={String(formData.phoneNumber)} onChangeText={handlePhoneNumberChange} keyboardType={'phone-pad'} backgroundColors={isDark ? appColors.bgDark : appColors.graybackground} backgroundColor={isDark ? appColors.bgDark : appColors.graybackground} borderColor={isDark ? appColors.bgDark : appColors.graybackground} editable={false} style={{ color: appColors.secondaryFont }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => gotoEdit('email')} activeOpacity={0.9} style={styles.emailContainer}>
                  <Input titleShow title={translateData.email} placeholder={translateData.enterEmail} keyboardType="email-address" value={formData.email} backgroundColor={isDark ? appColors.bgDark : appColors.graybackground} borderColor={isDark ? appColors.bgDark : appColors.graybackground} onChangeText={text => handleChange('email', text)} showWarning={showWarning && (formData.email === '' || emailFormatWarning !== '')} warning={emailFormatWarning !== '' ? translateData.enterYouremail : translateData.emailVerify} editable={false} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      {!loadingShimmer && (
        <View style={styles.updateBtn}>
          <Button title={translateData.updateProfile} backgroundColor={appColors.primary} color={appColors.white} onPress={update} loading={loading} />
        </View>
      )}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          onDismiss={() => bottomSheetModalRef.current?.dismiss()}
          handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
          backgroundStyle={{
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
          }}
        >
          <BottomSheetView style={{ padding: windowHeight(2) }}>
            <Text style={{ fontFamily: appFonts.medium, fontSize: fontSizes.FONT4HALF, color: isDark ? appColors.white : appColors.black, marginBottom: windowHeight(2) }}>
              {translateData.selectOne}
            </Text>

            <TouchableOpacity
              onPress={() => handleImageSelection('gallery')}
              style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: windowHeight(2) }}
            >
              <View style={{ backgroundColor: isDark ? appColors.dotDark : appColors.cardicon, height: windowHeight(5), width: windowHeight(5), borderRadius: windowHeight(3), justifyContent: 'center', alignItems: 'center' }}>
                <Icons.Gallery />
              </View>
              <Text style={{ fontSize: fontSizes.FONT3HALF, fontFamily: appFonts.medium, marginLeft: windowWidth(3), color: isDark ? appColors.darkText : appColors.black,marginHorizontal:windowWidth(3) }}>
                {translateData.chooseFromGallery}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleImageSelection('camera')}
              style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: windowHeight(2) }}
            >
              <View style={{ backgroundColor: isDark ? appColors.dotDark : appColors.cardicon, height: windowHeight(5), width: windowHeight(5), borderRadius: windowHeight(3), justifyContent: 'center', alignItems: 'center' }}>
                <Icons.Camera1 />
              </View>
              <Text style={{ fontSize: fontSizes.FONT3HALF, fontFamily: appFonts.medium, marginLeft: windowWidth(3), color: isDark ? appColors.darkText : appColors.black ,marginHorizontal:windowWidth(3)}}>
                {translateData.openCamera}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setImageUri('')
                setImageRemove(true)
                Reomveupdate()
                bottomSheetModalRef.current?.dismiss();
              }}
              style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center' }}
            >
              <View style={{ backgroundColor: isDark ? appColors.dotDark : appColors.cardicon, height: windowHeight(5), width: windowHeight(5), borderRadius: windowHeight(3), justifyContent: 'center', alignItems: 'center' }}>
                <Icons.remove />
              </View>
              <Text style={{ fontSize: fontSizes.FONT3HALF, fontFamily: appFonts.medium, color: isDark ? appColors.darkText : appColors.black ,marginHorizontal:windowWidth(3)}}>
                {translateData.removeImage}
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </KeyboardAvoidingView>
  );
}
