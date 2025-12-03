import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import appColors from '../../../../../theme/appColors'
import styles from './styles'
import { Button } from '../../../../../commonComponents'
import { InputBox } from '../../../component'
import LoginViewProps from '../../types'
import { useFocusEffect, useTheme } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../../../api/store'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import { AuthTitle } from '../authtitle'
import { taxidosettingDataGet, translateDataGet } from '../../../../../api/store/action'
import { validateEmail, ValidatePhoneNumber } from '../../../../../utils/validation'
import CountrySelect, { getAllCountries } from 'react-native-country-select';

export function LoginView({
  gotoOTP,
  phoneNumber,
  setPhoneNumber,
  setCountryCode,
  borderColor,
  setCca2,
  driverLoading,
  setDriverLoading,
  smsGateway,
  fleetLoading,
  setFleetLoading,
  gotoOTPFleet,
  countryCode
}: LoginViewProps) {


  const [error, setError] = useState<string>('')
  const { colors } = useTheme()
  const { textRtlStyle, viewRtlStyle, isDark, rtl } = useValues()
  const dispatch = useDispatch<AppDispatch>()
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting)
  const [numberShow, setNumberShow] = useState(true)
  const [country, setCountry] = useState<any>({
    callingCode: [`${taxidoSettingData?.taxido_values?.ride?.country_code || ""}`],
    cca2: '',
    emoji: '',
  });


  useEffect(() => {
    const fetchCountryFromCode = async () => {
      const code = taxidoSettingData?.taxido_values?.ride?.country_code;

      if (code) {
        try {
          const countries = await getAllCountries();
          const match = countries.find((c: any) =>
            c.idd.root === `+${code.toString()}`
          );

          if (match) {
            setCountry({
              callingCode: [code.toString()],
              cca2: match.cca2,
              emoji: '',
            });
          }
        } catch (err) {
        }
      }
    };

    fetchCountryFromCode();
  }, [taxidoSettingData?.taxido_values?.ride?.country_code]);


  useFocusEffect(
    useCallback(() => {
      dispatch(translateDataGet())
      dispatch(taxidosettingDataGet())
    }, [dispatch]),
  )

  const handlePhoneNumberChange = (newPhoneNumber: string) => {
    if (smsGateway === 'firebase') {
      const onlyNumbers = newPhoneNumber.replace(/[^0-9]/g, '');
      setPhoneNumber(onlyNumbers);
      setNumberShow(true);
      return;
    }

    setPhoneNumber(newPhoneNumber);

    const isNumeric = /^\d+$/.test(newPhoneNumber);
    setNumberShow(isNumeric);
  };


  const handleGetOTP = async (userType: string) => {
    setDriverLoading(true);
    const isNumeric = /^\d+$/.test(phoneNumber);

    if (isNumeric) {
      const errorMsg = ValidatePhoneNumber(phoneNumber);
      if (errorMsg) {
        setError(errorMsg);
        setDriverLoading(false);
        return;
      }
    } else if (phoneNumber.includes('@')) {
      const errorMsg = validateEmail(phoneNumber);
      if (errorMsg) {
        setError(errorMsg);
        setDriverLoading(false);
        return;
      }
    } else {
      setError(translateData.validPhoneEmail);
      setDriverLoading(false);
      return;
    }

    setError('');
    try {
      await gotoOTP(userType);
    } catch (error) {
    }
  };

  const handleGetOTPFleet = async (userType: string) => {
    if (setFleetLoading) setFleetLoading(true);
    const isNumeric = /^\d+$/.test(phoneNumber);

    if (isNumeric) {
      const errorMsg = ValidatePhoneNumber(phoneNumber);
      if (errorMsg) {
        setError(errorMsg);
        if (setFleetLoading) setFleetLoading(false);
        return;
      }
    } else if (phoneNumber.includes('@')) {
      const errorMsg = validateEmail(phoneNumber);
      if (errorMsg) {
        setError(errorMsg);
        if (setFleetLoading) setFleetLoading(false);
        return;
      }
    } else {
      setError(translateData.validPhoneEmail);
      if (setFleetLoading) setFleetLoading(false);
      return;
    }

    setError('');
    try {
      await gotoOTPFleet(userType);
    } catch (error) {
    }
  };


  const [visible, setVisible] = useState(false);


  const onSelect = (selectedCountry: any) => {
    // Extract calling code from IDD (International Direct Dialing) property
    const callingCode = selectedCountry?.idd?.root?.replace('+', '') || '';

    setCountry({
      ...selectedCountry,
      callingCode: [callingCode],
    });

    setVisible(false);

    if (setCountryCode && callingCode) {
      setCountryCode(`+${callingCode}`);
    }

    if (setCca2) {
      setCca2(selectedCountry.cca2);
    }
  };


  return (
    <View
      style={[
        styles.main,
        { backgroundColor: isDark ? appColors.darkThemeSub : appColors.white },
      ]}
    >
      <View style={styles.subView}>
        <AuthTitle
          title={translateData.authTitle}
          subTitle={translateData.subTitle}
        />

        <View
          style={[
            styles.countryCodeContainer,
            {
              flexDirection: viewRtlStyle,
              justifyContent: numberShow ? 'flex-start' : 'center',
              alignSelf: 'center',
              width: '100%',
            },
          ]}
        >
          {numberShow && (
            <View
              style={[
                styles.codeComponent,
                {
                  marginRight: rtl ? 0 : windowWidth(2),
                  marginLeft: rtl ? windowWidth(2) : 0,
                },
              ]}
            >

              <TouchableOpacity
                style={[
                  styles.countryCode,
                  {
                    backgroundColor: isDark ? appColors.primaryFont : appColors.graybackground,
                    borderColor: borderColor ? borderColor : colors.border,
                  },
                ]}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
              >
                <View style={styles.pickerButton}>
                  <CountrySelect
                    visible={visible}
                    onClose={() => setVisible(false)}
                    onSelect={onSelect}
                    showSearchInput={true}
                    showCloseButton={true}
                    showAlphabetFilter={true}
                  />

                  {country.callingCode[0] && <Text style={[styles.codeText, { color: isDark ? appColors.white : appColors.black }]}>+{countryCode}
                  </Text>}
                </View>
              </TouchableOpacity>

            </View>
          )}

          <InputBox
            placeholder={translateData.enterPhoneandEmailBoth}
            placeholderTextColor={
              isDark ? appColors.darkText : appColors.secondaryFont
            }
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType={
              smsGateway === 'firebase' ? 'phone-pad' : 'email-address'
            } backgroundColors={
              isDark ? appColors.primaryFont : appColors.graybackground
            }
            autoCapitalize='none'
            borderColor={
              isDark ? appColors.primaryFont : appColors.graybackground
            }
            style={{
              flex: 1,
              marginLeft: numberShow && !rtl ? windowWidth(1.5) : 0,
              marginRight: numberShow && rtl ? windowWidth(1.5) : 0,
              height: numberShow ? windowHeight(6) : windowHeight(6.7),
              color: isDark ? appColors.darkText : appColors.primaryFont,
              textAlign: rtl ? 'right' : 'left'
            }}
          />
        </View>

        {error && (
          <Text style={[styles.errorText, { textAlign: textRtlStyle }]}>
            {error}
          </Text>
        )}
      </View>

      <View style={styles.button}>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', paddingBottom: windowHeight(2)
        }}>
          <View style={{ width: '50%' }}>
            <Button
              onPress={() => handleGetOTP('driver')}
              title={translateData?.driver}
              backgroundColor={appColors.primary}
              color={appColors.white}
              loading={driverLoading} />
          </View>
          <View style={{ width: '50%' }}>
            <Button
              onPress={() => handleGetOTPFleet('fleet')}
              title={translateData?.fleet}
              backgroundColor={appColors.primary}
              color={appColors.white}
              loading={fleetLoading} />
          </View>
        </View>
      </View>
      <View style={styles.subView}></View>
    </View >
  )
}

