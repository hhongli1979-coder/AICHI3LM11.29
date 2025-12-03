import React, { useCallback, useEffect, useState } from 'react'
import { View, TouchableOpacity, Text, TextInput, ScrollView, BackHandler } from 'react-native'
import appColors from '../../../../theme/appColors'
import { ProgressBar } from '../component'
import { Input, Button } from '../../../../commonComponents'
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native'
import { Header, TitleView } from '../../component'
import styles from './styles'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/main/types'
import Icons from '../../../../utils/icons/icons'
import { useValues } from '../../../../utils/context'
import { windowWidth } from '../../../intro/onBoarding/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useAppRoute } from '../../../../utils/navigation'
import { ValidatePhoneNumber } from '../../../../utils/validation'
import { windowHeight } from '../../../../theme/appConstant'
import CountrySelect from 'react-native-country-select';
import { AppDispatch } from '../../../../api/store'
import { countryData, preferenceData } from '../../../../api/store/action'
import DropDownPicker from 'react-native-dropdown-picker'

type navigation = NativeStackNavigationProp<RootStackParamList>

export function CreateAccount() {

  const navigation = useNavigation<navigation>()
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [emailFormatWarning, setEmailFormatWarning] = useState<string>('')
  const { colors } = useTheme()
  const { textRtlStyle, viewRtlStyle, isDark, setAccountDetail, rtl } = useValues()
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false)
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting)
  const route = useAppRoute();
  const usercredential = route.params?.phoneNumber ?? "1234567890";
  const rawCode = route.params?.countryCode ?? "91";
  const userType = route.params?.userType ?? "";
  const cleanCode = rawCode.replace('+', '');
  const [countryCode, setCountryCode] = useState({ callingCode: [cleanCode], cca2: route?.params?.cca2 ?? 'US' });
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState<string>("");
  const [isEmailUser, setIsEmailUser] = useState(false);
  const dispatch = useDispatch<AppDispatch>()
  const { countryList, selfDriver } = useSelector((state: any) => state.account)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string | null>(null)
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null)
  const [items, setItems] = useState<any[]>([])
  const [countryError, setCountryError] = useState<string>('');

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: countryCode,
    referral: '',
    countryName: '',
  })

  useEffect(() => {
    dispatch(countryData())
    dispatch(preferenceData())
  }, [])

  useFocusEffect(
    useCallback(() => {
      setShowWarning(false);
      setEmailFormatWarning('');
      setError({
        username: '',
        name: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        countryCode: countryCode,
      });
    }, [])
  );

  useEffect(() => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const isEmail = emailRegex.test(usercredential.trim());
    setIsEmailUser(isEmail);

    if (isEmail) {
      setEmail(usercredential.trim());
    } else {
      setPhoneNumber(usercredential.trim());
    }
  }, [usercredential]);

  const [error, setError] = useState<any>({
    username: '',
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: countryCode,
  })


  useEffect(() => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    const isEmail = emailRegex.test(usercredential.trim());
    if (isEmail) {
      const cleanEmail = usercredential.trim();
      setEmail(cleanEmail);
      setFormData(prev => ({ ...prev, email: cleanEmail }));
    } else {
      const cleanPhone = usercredential.trim();
      setPhoneNumber(cleanPhone);
      setFormData(prev => ({ ...prev, phoneNumber: cleanPhone }));
    }
  }, [usercredential]);

  useEffect(() => {
    if (selectedCountryName) {
      setFormData(prev => ({
        ...prev,
        countryName: selectedCountryName
      }));
    }
  }, [selectedCountryName]);

  useEffect(() => {
  }, [formData.countryName]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));

    if (key === 'email') {
      setEmail(value);
      setEmailFormatWarning('');
    }
  };


  const gotoDocument = () => {
    const name = formData.name.trim()
    const phone = formData.phoneNumber.trim();
    const emailValue = formData.email.trim();
    const newErrors: any = {
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let hasError = false;

    // Check if country is selected
    if (!value || !selectedCountryName) {
      setCountryError(translateData?.countrycodewarn); // or use translateData
      hasError = true;
    } else {
      setCountryError('');
    }

    // Make sure countryName is in formData before submitting
    if (selectedCountryName && !formData.countryName) {
      setFormData(prev => ({
        ...prev,
        countryName: selectedCountryName
      }));
    }

    const phoneError = ValidatePhoneNumber(phone);
    if (isEmailUser && phoneError) {
      newErrors.phoneNumber = phoneError;
      hasError = true;
    }

    if (name === '') {
      newErrors.name = translateData.pleaseEnterYourName;
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isEmailUser && emailValue === '') {
      newErrors.email = translateData.emailVerifyyyyy;
      hasError = true;
    } else if (!isEmailUser && !emailRegex.test(emailValue)) {
      newErrors.email = translateData.emailformateteee;
      hasError = true;
    }

    if (formData.password.trim() === '') {
      newErrors.password = translateData.password;
      hasError = true;
    }
    if (formData.confirmPassword.trim() === '') {
      newErrors.confirmPassword = translateData.confirmPassword;
      hasError = true;
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = translateData.doNotMatch;
      hasError = true;
    }

    if (hasError) {
      setError(newErrors);
      setShowWarning(true);
      return;
    }

    // Ensure countryName is set in formData before submitting
    if (selectedCountryName && !formData.countryName) {
      setFormData(prev => ({
        ...prev,
        countryName: selectedCountryName
      }));
    }

    setError({ phoneNumber: '', email: '', password: '', confirmPassword: '' });
    setShowWarning(false);
    setAccountDetail(formData);
    navigation.navigate('UploadedDocument');
  };


  const [visible, setVisible] = useState(false);
  const onSelect = (country: any) => {
    setCountryCode(country);
    setVisible(false);
  };


  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Login');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const formatted = countryList?.data?.map((item: any) => ({
      label: `${item.name}`,
      value: item.calling_code,
    })) || [];

    // Add a default option if no countries are available
    if (formatted.length === 0) {
      formatted.push({ label: translateData?.selectCountry, value: '' });
    }

    setItems(formatted);

    // Automatically set the country name if countryCode is pre-filled from route params
    if (countryCode?.callingCode?.[0] && formatted.length > 0) {
      const matchingCountry = formatted.find((item: any) => item.value === countryCode.callingCode[0]);
      if (matchingCountry) {
        // Set the dropdown value and country name
        setValue(countryCode.callingCode[0]);
        setSelectedCountryName(matchingCountry.label);

        // Update formData with the country name
        setFormData(prev => ({
          ...prev,
          countryName: matchingCountry.label
        }));
      }
    }
  }, [countryList, countryCode]);


  return (
    <View style={{ flex: 1 }}>
      <Header backgroundColor={isDark ? colors.card : appColors.white} />
      <ProgressBar fill={1} />
      <ScrollView
        style={[styles.subView, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.space}>
          <TitleView
            title={translateData.createAccount}
            subTitle={translateData.registerContent}
          />

          <View style={styles.name}>
            <Input
              title={translateData.name}
              titleShow={true}
              placeholder={translateData.enterYourName}
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
              showWarning={showWarning && formData.name === ''}
              warning={translateData.pleaseEnterYourName}
              backgroundColor={
                isDark ? appColors.darkThemeSub : appColors.white
              }
              borderColor={colors.border}
            />
          </View>
          <Text
            style={[
              styles.mobileNumber,
              {
                color: isDark ? appColors.white : appColors.primaryFont,

                textAlign: textRtlStyle,
              },
            ]}
          >
            {translateData.mobileNumber}
          </Text>

          <View style={styles.country}>
            <View style={{ flexDirection: viewRtlStyle, width: '100%' }}>
              <View
                style={[
                  styles.codeComponent,
                  { right: rtl ? windowWidth(12) : windowWidth(0.5) },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.countryCode,
                    {
                      backgroundColor: isDark
                        ? appColors.darkThemeSub
                        : appColors.white,
                      borderColor: colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <TouchableOpacity style={styles.pickerButton}
                    onPress={() => setVisible(true)}
                    disabled={!isEmailUser}
                    activeOpacity={0.9}
                  >
                    <CountrySelect
                      visible={visible}
                      onClose={() => setVisible(false)}
                      onSelect={onSelect}
                      showSearchInput={true}
                      showCloseButton={true}
                      showAlphabetFilter={true}
                    />
                    <Text style={[styles.codeText, { color: isDark ? appColors.white : appColors.black }]}>
                      +{countryCode.callingCode[0]}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.phone,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    flexDirection: viewRtlStyle,
                  },
                ]}
              >
                <TextInput
                  editable={isEmailUser}
                  placeholder={translateData.enterPhone}
                  placeholderTextColor={isDark ? appColors.darkText : appColors.secondaryFont}
                  value={phoneNumber}

                  onChangeText={(text) => {
                    const phoneNoError = ValidatePhoneNumber(text);
                    // setError(phoneNoError)

                    setPhoneNumber(text);
                    setFormData(prev => ({
                      ...prev,
                      phoneNumber: text,
                    }));
                  }}
                  keyboardType="phone-pad"
                  style={[
                    styles.number,
                    {
                      backgroundColor: isEmailUser ? (isDark ? appColors.darkThemeSub : appColors.white) : isDark ? appColors.darkThemeSub : appColors.loaderBackground,
                    },
                    { color: isDark ? appColors.white : appColors.black },
                    { textAlign: rtl ? 'right' : 'left' }
                  ]}
                />

              </View>
            </View>


            {isEmailUser && error.phoneNumber ? (
              <Text style={[styles.errorText, { textAlign: textRtlStyle }]}>
                {error.phoneNumber}
              </Text>
            ) : null}


          </View>
          <Text
            style={[
              styles.mobileNumber,
              {
                color: isDark ? appColors.white : appColors.primaryFont,

                textAlign: textRtlStyle,
                marginBottom: windowHeight(0.5),
                marginTop: windowHeight(2)
              },
            ]}
          >
            {translateData?.country}
          </Text>

          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              const newValue = typeof callback === 'function' ? callback(value) : callback;
              setValue(newValue);

              if (newValue) {
                const selectedItem = items.find((item: any) => item.value === newValue);
                if (selectedItem) {
                  setSelectedCountryName(selectedItem.label);
                }
              } else {
                setSelectedCountryName(null);
              }
            }}
            setItems={setItems}
            placeholder={items.length > 0 ? translateData?.selectCountry : translateData?.noCountryAvilbel}
            containerStyle={styles.container}
            placeholderStyle={[
              styles.placeholderStyles,
              { color: isDark ? appColors.darkText : appColors.secondaryFont },
            ]}
            style={{
              backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
              borderColor: colors.border,
              flexDirection: viewRtlStyle,
              paddingHorizontal: windowHeight(1.9),
            }}
            dropDownContainerStyle={{
              backgroundColor: isDark ? colors.card : appColors.dropDownColor,
              borderColor: colors.border,
            }}
            textStyle={[styles.text, { color: colors.text }]}
            labelStyle={[
              styles.text,
              { color: isDark ? appColors.white : appColors.black },
            ]}
            listItemLabelStyle={{
              color: isDark ? appColors.white : appColors.black,
            }}
            scrollViewProps={{
              showsVerticalScrollIndicator: false,
              nestedScrollEnabled: true,
            }}
            zIndex={2}
            listMode="SCROLLVIEW"
            dropDownDirection="AUTO"
            ListEmptyComponent={() => (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: windowHeight(1.3), zIndex: 2 }}>
                <Text style={{ color: colors.text }}>{translateData?.selectCountry}</Text>
              </View>
            )}
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
          {countryError !== '' && (
            <Text style={[styles.errorText, { textAlign: textRtlStyle }]}>
              {countryError}
            </Text>
          )}

          <View style={styles.email}>
            <Input
              editable={!isEmailUser}
              title={translateData.email}
              titleShow={true}
              placeholder={translateData.enterEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                handleChange('email', text);
              }}
              backgroundColor={
                !isEmailUser ? (isDark ? appColors.darkThemeSub : appColors.white) : appColors.loaderBackground
              }
              showWarning={!!error.email}
              warning={error.email}
              borderColor={colors.border}
            />
          </View>
          <View style={{ bottom: windowHeight(0.8) }}>
            {!isEmailUser && emailFormatWarning !== '' && (
              <Text style={[styles.errorText, { textAlign: textRtlStyle }]}>
                {emailFormatWarning}
              </Text>
            )}
          </View>



          <Input
            title={translateData.createaccount}
            titleShow={true}
            placeholder={translateData.password}
            value={formData.password}
            warning={
              showWarning && formData.password === ''
                ? translateData.password
                : formData.password.length > 0 && formData.password.length < 8
                  ? translateData.passwordMinLength
                  : ''
            }
            onChangeText={text => handleChange('password', text)}
            showWarning={
              showWarning &&
              (formData.password === '' || formData.password.length < 8)
            }
            backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
            borderColor={colors.border}
            rightIcon={
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <Icons.EyeOpen /> : <Icons.EyeClose />}
              </TouchableOpacity>
            }
            secureText={!isPasswordVisible}
            style={rtl ? styles.view : null}
          />


          <View style={styles.password}>
            <Input
              title={translateData.cPw}
              titleShow={true}
              placeholder={translateData.confirmPassword}
              value={formData.confirmPassword}
              onChangeText={text => handleChange('confirmPassword', text)}
              showWarning={!!error.confirmPassword}
              warning={error.confirmPassword}
              backgroundColor={isDark ? appColors.darkThemeSub : appColors.white}
              borderColor={colors.border}
              rightIcon={
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  {isConfirmPasswordVisible ? <Icons.EyeOpen /> : <Icons.EyeClose />}
                </TouchableOpacity>
              }
              secureText={!isConfirmPasswordVisible}
              style={rtl ? styles.view : null}
            />
          </View>
          {taxidoSettingData?.taxido_values?.activation?.referral_enable == 1 && userType == 'driver' && (
            <View style={styles.password}>
              <Input
                title={translateData?.referaalId}
                placeholder={translateData?.enterreferaalId}
                titleShow={true}
                keyboardType='email-address'
                autoCapitalize='none'
                value={referral}
                onChangeText={(text) => {
                  setReferral(text);
                  handleChange('referral', text);
                }}
                backgroundColor={
                  !isEmailUser ? (isDark ? appColors.darkThemeSub : appColors.white) : appColors.loaderBackground
                }
                borderColor={colors.border}
              />
            </View>
          )}
        </View>
        <View style={styles.margin}>
          <Button
            onPress={gotoDocument}
            title={translateData.next}
            backgroundColor={appColors.primary}
            color={appColors.white}
          />
        </View>
      </ScrollView>
    </View>
  )
}




