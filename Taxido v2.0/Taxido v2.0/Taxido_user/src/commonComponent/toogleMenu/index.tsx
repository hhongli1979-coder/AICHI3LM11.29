import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, View, ScrollView, TouchableWithoutFeedback, Pressable } from 'react-native';
import { useValues } from '@src/utils/context/index';
import { commonStyles } from '../../styles/commonStyle';
import { styles } from './styles';
import { external } from '../../styles/externalStyle';
import { ArrowLeft } from '@utils/icons';
import { SolidLine } from '../solidLine';
import { appColors, appFonts, fontSizes, windowHeight } from '@src/themes';
import { FillClock } from '../../assets/icons/fillClock';
import { Coins } from '../../assets/icons/coins';
import { useSelector } from 'react-redux';
import { toggleMenuProp } from '../type';

export function ToggleMenu({ title, options, onSelect, initialPlaceholder, position, iconShow, icon, titleShow }: toggleMenuProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const menuRef = useRef(null);
  const { bgContainer, textColorStyle, viewRTLStyle, textRTLStyle, isDark } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: any) => {
    onSelect(option);
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleOutsidePress = () => {
    setIsOpen(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View>
        {titleShow ? null : (
          <Text
            style={[styles.title, {
              color: textColorStyle,
              textAlign: textRTLStyle
            }]}>
            {title}
          </Text>
        )}
        <Pressable onPress={toggleMenu}>
          <View
            style={[isOpen ? styles.topContainerStyle : styles.topContainer, { backgroundColor: bgContainer, flexDirection: viewRTLStyle }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
            <View style={[external.fg_1, { flexDirection: viewRTLStyle }]}>
              <View>
                {iconShow && selectedOption && icon && (
                  <View style={styles.icon}><FillClock /></View>
                )}
              </View>

              {iconShow && <View style={[external.mt_2, external.mh_3]}>
                <Coins />
              </View>}

              <Text
                style={[
                  commonStyles.mediumTextBlack12,
                  {
                    lineHeight: windowHeight(18),
                    fontSize: fontSizes.FONT16,
                  },
                  selectedOption
                    ? { color: title === translateData.selectPaymentMethodtoogle ? appColors.primary : textColorStyle, fontFamily: appFonts.regular }
                    : {
                      fontSize: fontSizes.FONT16,
                      color: title === translateData.selectPaymentMethodtoogle ? appColors.primary : textColorStyle, fontFamily: appFonts.regular,
                    }
                ]}
              >
                {selectedOption || initialPlaceholder}
              </Text>
            </View>
            <View>
              <ArrowLeft />
            </View>
          </View>
        </Pressable>
        <View>
          {isOpen && (
            <View
              ref={menuRef}
              style={[position ? styles.postionContainer : styles.container, { backgroundColor: bgContainer }]}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.toggleHeight}>
                {options?.map((option: any, index: Number) => (
                  <View key={option}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleOptionSelect(option)}>
                      {iconShow ? (
                        <View style={[external.fd_row, external.ai_center]}>
                          <Text
                            style={[
                              commonStyles.regularText,
                              { color: textColorStyle, marginVertical: 3 },
                            ]}>
                            {option}
                          </Text>
                        </View>
                      ) : (
                        <Text
                          style={[
                            commonStyles.regularText,
                            { color: textColorStyle, textAlign: textRTLStyle, marginVertical: 3 },
                          ]}>
                          {option}
                        </Text>
                      )}
                      {index !== options?.length - 1 && (
                        <SolidLine color={appColors.lightGray} />
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View >
    </TouchableWithoutFeedback >
  );
};
