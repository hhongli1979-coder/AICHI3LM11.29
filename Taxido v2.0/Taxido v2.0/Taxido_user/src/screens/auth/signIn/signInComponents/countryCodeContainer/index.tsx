import React, { useEffect, useState } from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import { commonStyles } from "../../../../../styles/commonStyle";
import { external } from "../../../../../styles/externalStyle";
import { appColors } from "@src/themes";
import styles from "../../styles";
import { useValues } from '@src/utils/context/index';
import { useSelector } from "react-redux";
import CountryPicker, { getCountriesByCallingCode } from "react-native-country-select";
import { ICountry } from 'react-native-country-select/lib/interface/country';
import { CountryCodeContainerProps } from "./types";

export function CountryCodeContainer({ setCca2, setCountryCode, phoneNumber, setPhoneNumber, width, backGroundColor, borderColor, borderColor1,
  smsGateway, countryCode, error, setError }: CountryCodeContainerProps) {
  const { viewRTLStyle, isDark, textRTLStyle } = useValues();
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);
  const [country, setCountry] = useState<ICountry | null>(null);
  const [numberShow, setNumberShow] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const syncCountryFromProp = () => {
      if (countryCode) {
        const codeOnly = countryCode.replace("+", "");
        const matches = getCountriesByCallingCode(codeOnly);
        if (matches && matches.length > 0) {
          setCountry(matches[0]); // Use the first match
          return;
        }
      }

      const defaultCode = taxidoSettingData?.taxido_values?.ride?.country_code;
      if (defaultCode) {
        try {
          const matches = getCountriesByCallingCode(defaultCode.toString());

          if (matches && matches.length > 0) {
            setCountry(matches[0]); // Use the first match
          }
        } catch (err) {
          console.error("Error fetching default country:", err);
        }
      }
    };

    syncCountryFromProp();
  }, [countryCode, taxidoSettingData?.taxido_values?.ride?.country_code]);

  const handleTextChange = (newPhoneNumber: string) => {
    if (error) {
      setError("");
    }
    if (smsGateway == "firebase") {
      const onlyNumbers = newPhoneNumber.replace(/[^0-9]/g, "");
      setPhoneNumber(onlyNumbers);
      setNumberShow(true);
      return;
    }
    setPhoneNumber(newPhoneNumber);
    const isNumeric = /^\d*$/.test(newPhoneNumber);
    setNumberShow(isNumeric);
  };

  const onSelect = (selectedCountry: ICountry) => {
    setCountry(selectedCountry);
    setVisible(false);
    if (setCountryCode) {
      const root = selectedCountry.idd?.root || '+1';
      setCountryCode(root);
    }
    if (setCca2) {
      setCca2(selectedCountry.cca2);
    }
  };

  const getPrimaryCallingCode = (): string => {
    if (!country) {
      const defaultCode = taxidoSettingData?.taxido_values?.ride?.country_code;
      if (defaultCode) {
        return `+${defaultCode}`;
      }
      return '+1';
    }
    const root = country.idd?.root || '+1';
    return root;
  };

  return (
    <View>
      <View>
        <View
          style={[
            external.fd_row,
            external.ai_center,
            external.mt_5,
            { flexDirection: viewRTLStyle },
          ]}>
          {numberShow && (
            <TouchableOpacity
              style={[
                styles.countryCodeContainer,
                {
                  backgroundColor: backGroundColor,
                  borderColor: borderColor1
                    ? borderColor1
                    : isDark
                      ? appColors.darkPrimary
                      : appColors.border,
                },
              ]}
              onPress={() => setVisible(true)}>
              <View style={styles.pickerButton}>
                <CountryPicker
                  visible={visible}
                  onClose={() => setVisible(false)}
                  onSelect={onSelect}
                  theme={isDark ? 'dark' : 'light'}
                  showAlphabetFilter={true}
                  showSearchInput={true}
                />
                <Text
                  style={[
                    styles.codeText,
                    {
                      color: isDark
                        ? appColors.whiteColor
                        : appColors.primaryText,
                    },
                  ]}>
                  {countryCode}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <View
            style={[
              styles.phoneNumberInput,
              {
                width: (numberShow ? width ?? "74%" : "100%") as any,
                backgroundColor: backGroundColor,
                flexDirection: viewRTLStyle as "row" | "row-reverse" | "column" | "column-reverse",
                borderColor: borderColor,
                right: numberShow ? 0 : 3,
              },
            ]}>
            <TextInput
              style={[
                [
                  commonStyles.regularText,
                  { color: isDark ? appColors.whiteColor : appColors.blackColor },
                ],
                [styles.inputText, { textAlign: textRTLStyle }],
              ]}
              placeholderTextColor={
                isDark ? appColors.darkText : appColors.regularText
              }
              placeholder={translateData.enterNumberandEmailBoth}
              keyboardType={smsGateway === "firebase" ? "phone-pad" : "email-address"}
              autoCapitalize="none"
              value={phoneNumber}
              onChangeText={handleTextChange}
            />
          </View>
        </View>
        {error && <Text style={styles.warningText}>{error}</Text>}
      </View>
    </View>
  );
}