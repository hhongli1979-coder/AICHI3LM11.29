import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useState, useRef, useCallback } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { styles } from './styles'
import { Button, Header, Input } from '../../../commonComponents'
import { useValues } from '../../../utils/context'
import { useDispatch, useSelector } from 'react-redux'
import appColors from '../../../theme/appColors'
import {
  windowHeight,
  windowWidth,
  fontSizes,
} from '../../../theme/appConstant'
import appFonts from '../../../theme/appFonts'
import CountrySelect from 'react-native-country-select'
import { ICountry } from 'react-native-country-select/lib/interface/country'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import OTPTextInput from 'react-native-otp-textinput'
import {
  selfDriverData,
  updateMobileEmail,
  verifyMobileEmail,
} from '../../../api/store/action'
import { UpdateProfileInterface } from '../../../api/interface/accountInterface'

export function EditDetails() {
  const route = useRoute()
  const navigation = useNavigation()
  const { field } = route.params as { field: string }
  const { isDark, viewRtlStyle, rtl } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null)
  const [countryPickerVisible, setCountryPickerVisible] = useState(false)
  const [otp, setOtp] = useState('')
  const [isOtpSheetOpen, setIsOtpSheetOpen] = useState(false)
  const dispatch = useDispatch()

  const otpBottomSheetRef = useRef<BottomSheetModal>(null)
  const otpInputRef = useRef<OTPTextInput>(null)
  const textInputRef = useRef<any>()

  const getPrimaryCallingCode = useCallback((country: ICountry | null): string => {
    if (!country) return '+1'
    const root = country.idd?.root || '+'
    const suffix = country.idd?.suffixes?.[0] || ''
    return root + suffix
  }, [])

  const handleCountrySelect = useCallback((country: ICountry) => {
    setSelectedCountry(country)
    setCountryPickerVisible(false)
  }, [])

  const handleVerify = useCallback(() => {
    const payload: UpdateProfileInterface = {
      email: email,
      phone: phoneNumber,
      country_code: (selectedCountry?.idd?.root || '1').replace('+', ''),
    }
    dispatch(updateMobileEmail(payload) as any)
      .unwrap()
      .then((res: any) => {})
      .catch((err: any) => {})

    textInputRef.current?.blur()
    setIsOtpSheetOpen(true)
    otpBottomSheetRef.current?.present()
  }, [email, phoneNumber, selectedCountry, dispatch])

  const handleOtpVerify = useCallback(() => {
    const payload: UpdateProfileInterface = {
      token: otp,
      email_or_phone: phoneNumber || email,
      country_code: (selectedCountry?.idd?.root || '1').replace('+', ''),
    }

    dispatch(verifyMobileEmail(payload) as any)
      .unwrap()
      .then((res: any) => {
        dispatch(selfDriverData())
        navigation.goBack()
      })
      .catch((err: any) => {})

    otpBottomSheetRef.current?.close()
    navigation.goBack()
  }, [navigation, otp, phoneNumber, email, dispatch])

  const handleOpenCountryPicker = useCallback(() => {
    setCountryPickerVisible(true)
  }, [])

  const handleCloseCountryPicker = useCallback(() => {
    setCountryPickerVisible(false)
  }, [])

  const formatPhoneNumber = useCallback((): string => {
    if (!selectedCountry) return '+1'
    return getPrimaryCallingCode(selectedCountry)
  }, [selectedCountry, getPrimaryCallingCode])

  return (
    <BottomSheetModalProvider>
      <View
        style={{
          flex: 1,
          backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
        }}
      >
        <Header
          title={
            field === 'email'
              ? translateData.email
              : translateData?.mobileNumber
          }
        />

        <View
          style={{
            paddingHorizontal: windowWidth(2),
            backgroundColor: isDark ? appColors.bgDark : appColors.white,
            marginTop: windowHeight(2),
            borderWidth: 1,
            borderColor: isDark ? appColors.darkborder : appColors.border,
            borderRadius: windowHeight(2),
            marginHorizontal: windowWidth(2),
          }}
        >
          <Text
            style={{
              color: isDark ? appColors.white : appColors.black,
            }}
          >
            {field === 'mobile'
              ? translateData.updatePhoneNumber
              : translateData.updateEmail}
          </Text>

          {field === 'mobile' ? (
            <View style={{ marginHorizontal: windowWidth(2) }}>
              <Text
                style={{
                  color: isDark ? appColors.white : appColors.primaryFont,
                  marginBottom: windowHeight(1),
                }}
              >
                {translateData.mobileNumber}
              </Text>
              <View
                style={{
                  flexDirection: viewRtlStyle,
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.countryCodeContainer,
                    isDark && styles.darkCountryCodeContainer,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isDark
                        ? appColors.darkThemeSub
                        : appColors.lightGray,
                    },
                  ]}
                  onPress={handleOpenCountryPicker}
                  disabled={isOtpSheetOpen}
                >
                  <Text
                    style={[
                      styles.codeText,
                      {
                        color: isDark
                          ? appColors.white
                          : appColors.secondaryFont,
                        fontSize: fontSizes.FONT3,
                      },
                    ]}
                  >
                    {formatPhoneNumber()}
                  </Text>
                </TouchableOpacity>

                <View
                  style={[
                    styles.phoneNumberInput,
                    isDark && styles.darkPhoneNumberInput,
                    {
                      width: '78%',
                    },
                  ]}
                >
                  <TextInput
                    ref={textInputRef}
                    editable={!isOtpSheetOpen}
                    style={{
                      left: rtl ? windowWidth(10) : windowWidth(4),
                      color: isDark ? appColors.white : appColors.secondaryFont,
                      width: '90%',
                      fontFamily: appFonts.regular,
                      fontSize: fontSizes.FONT3HALF,
                    }}
                    placeholderTextColor={
                      isDark ? appColors.darkText : appColors.secondaryFont
                    }
                    placeholder={translateData.enterPhone}
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={{ marginHorizontal: windowWidth(2) }}>
              <Input
                ref={textInputRef}
                editable={!isOtpSheetOpen}
                title={translateData.email}
                titleShow={true}
                borderColor={
                  isDark ? appColors.darkborder : appColors.lightGray
                }
                backgroundColor={
                  isDark ? appColors.darkThemeSub : appColors.lightGray
                }
                placeholder={translateData.enterEmail}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>
          )}

          <View
            style={{
              marginTop: windowHeight(3),
              marginBottom: windowHeight(2),
              marginHorizontal: windowWidth(-2),
            }}
          >
            <Button
              title={translateData.verify}
              onPress={handleVerify}
              backgroundColor={appColors.primary}
              color={appColors.white}
              disabled={isOtpSheetOpen}
            />
          </View>

          {countryPickerVisible && (
            <CountrySelect
              visible={true}
              onClose={handleCloseCountryPicker}
              onSelect={handleCountrySelect}
              theme={isDark ? 'dark' : 'light'}
              showAlphabetFilter={true}
              showSearchInput={true}
            />
          )}

          <BottomSheetModal
            ref={otpBottomSheetRef}
            snapPoints={['28%']}
            onChange={(index) => {
              if (index >= 0) setIsOtpSheetOpen(true)
              else setIsOtpSheetOpen(false)
            }}
            handleIndicatorStyle={{
              backgroundColor: appColors.primary,
              width: '13%',
            }}
            backgroundStyle={{
              backgroundColor: isDark ? appColors.bgDark : appColors.white,
            }}
          >
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <BottomSheetView
                style={{
                  padding: windowWidth(2),
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: isDark ? appColors.white : appColors.primaryFont,
                    marginBottom: windowHeight(1),
                    fontFamily: appFonts.regular,
                  }}
                >
                  {translateData.otpSendTo}{' '}
                  {field === 'mobile' ? phoneNumber : email}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: windowHeight(3),
                  }}
                >
                  <OTPTextInput
                    ref={otpInputRef}
                    inputCount={6}
                    handleTextChange={value => {
                      setOtp(value)
                    }}
                    textInputStyle={{
                      width: windowHeight(6),
                      height: windowHeight(6),
                      borderWidth: windowWidth(0.45),
                      borderColor: isDark
                        ? appColors.darkborder
                        : appColors.border,
                      borderRadius: windowHeight(1),
                      backgroundColor: isDark
                        ? appColors.darkThemeSub
                        : appColors.lightGray,
                      borderBottomWidth: windowWidth(0.45),
                    }}
                    keyboardType="numeric"
                    tintColor={appColors.primary}
                    offTintColor={
                      isDark ? appColors.darkborder : appColors.lightGray
                    }
                    defaultValue={otp}
                  />
                </View>

                <Button
                  title={translateData.verify}
                  onPress={handleOtpVerify}
                  backgroundColor={appColors.primary}
                  color={appColors.white}
                />
              </BottomSheetView>
            </KeyboardAvoidingView>
          </BottomSheetModal>
        </View>
      </View>
    </BottomSheetModalProvider>
  )
}
