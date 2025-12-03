import { Image, ImageBackground, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Swiper from 'react-native-swiper'
import Images from '../../../utils/images/images'
import appColors from '../../../theme/appColors'
import { styles, windowHeight } from './styles'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/main/types'
import DropDownPicker from 'react-native-dropdown-picker'
import { useValues } from '../../../utils/context'
import Icons from '../../../utils/icons/icons'
import { useTheme } from '@react-navigation/native'
import { fontSizes } from '../../../theme/appConstant'
import { useDispatch, useSelector } from 'react-redux'
import { languageDataGet, settingDataGet, taxidosettingDataGet, translateDataGet } from '../../../api/store/action'
import { getValue, setValue } from '../../../utils/localstorage'
import FastImage from 'react-native-fast-image'
import { AppDispatch } from '../../../api/store'

type OnboardingProps = NativeStackNavigationProp<RootStackParamList>

export function OnBoarding() {
  const { navigate } = useNavigation<OnboardingProps>()
  const { colors } = useTheme()
  const { settingData, languageData, translateData, taxidoSettingData } = useSelector((state: any) => state.setting)
  const dispatch = useDispatch<AppDispatch>()
  const swiperRef = useRef<Swiper | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [items, setItems] = useState<{ label: string; value: string; icon: () => JSX.Element }[]>([])
  const { isDark, viewRtlStyle, setRtl } = useValues()
  const [open, setOpen] = useState(false)
  const imageDarkBottom = isDark ? Images.bgDarkOnboard : Images.bgOnboarding

  useFocusEffect(
    useCallback(() => {
      dispatch(languageDataGet())
      dispatch(settingDataGet())
      dispatch(translateDataGet())
    }, [dispatch]),
  )

  useEffect(() => {
    const setDefaultLanguage = async () => {
      const defaultLang = settingData?.values.general.default_language.locale
      await setValue('defaultLanguage', defaultLang)
    }
    setDefaultLanguage()
  }, [settingData])

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLang = await getValue('selectedLanguage')
        if (storedLang) {
          setSelectedLanguage(storedLang)
          return
        }

        if (!settingData?.values?.general?.default_language) {
          return
        }

        const defaultLangObj = settingData?.values.general.default_language

        if (typeof defaultLangObj !== 'object' || !defaultLangObj.locale) {
          return
        }

        const defaultLang = defaultLangObj?.locale
        if (!languageData?.data || languageData?.data.length === 0) {
          return
        }

        const matchingLang = languageData.data.find(
          (lang: any) => lang.locale === defaultLang,
        )

        if (matchingLang) {
          setSelectedLanguage(matchingLang.locale)
          await setValue('selectedLanguage', matchingLang.locale)
        } else {
        }
      } catch (error) { }
    }

    loadLanguage()
  }, [settingData, languageData])

  useEffect(() => {
    if (languageData?.data) {
      const formattedItems = languageData?.data.map((lang: any) => ({
        label: lang.name,
        value: lang.locale,
        icon: () => (
          <Image source={{ uri: lang.flag }} style={styles.flagImage} />
        ),
      }))
      setItems(formattedItems)
    }
  }, [languageData])

  const handleLanguageChange = async (selectedValue: string | null) => {

    if (selectedValue === 'ar') {
      setRtl(true)
    }
    else {
      setRtl(false)
    }
    if (!selectedValue) return
    setSelectedLanguage(selectedValue)
    try {
      await setValue('selectedLanguage', selectedValue)
    } catch (error) { }
  }

  const handleNavigation = () => {
    navigate('Login')
  }

  const handleNext = (index: number) => {
    if (index < (taxidoSettingData?.taxido_values?.onboarding?.length || 0) - 1) {
      swiperRef?.current?.scrollBy(1)
    } else {
      handleNavigation()
    }
  }

  const onboardingData = taxidoSettingData?.taxido_values?.onboarding || []

  return (
    <Swiper
      loop={false}
      ref={swiperRef}
      activeDotStyle={styles.activeStyle}
      removeClippedSubviews={true}
      paginationStyle={styles.paginationStyle}
      dotColor={isDark ? appColors.dotPrimary : appColors.subPrimary}
    >
      {onboardingData.map((slide: any, index: number) => {
        return (
          <TouchableWithoutFeedback
            onPress={() => {
              setOpen(false);
              Keyboard.dismiss();
            }}
          >
            <View
              style={[
                styles.slideContainer,
                { backgroundColor: colors.background },
              ]}
              key={index}
            >
              <View
                style={[styles.languageContainer, { flexDirection: viewRtlStyle }]}
              >
                <DropDownPicker
                  open={open}
                  value={selectedLanguage}
                  items={items}
                  setOpen={setOpen}
                  placeholder={'Language'}
                  setValue={async callback => {
                    const selectedValue =
                      callback instanceof Function
                        ? callback(selectedLanguage)
                        : callback
                    if (!selectedValue) return

                    setSelectedLanguage(selectedValue)
                    dispatch(settingDataGet())
                    dispatch(translateDataGet())
                    dispatch(taxidosettingDataGet())
                    try {
                      await setValue('selectedLanguage', JSON.stringify(selectedValue))
                    } catch (error) { }
                  }}
                  setItems={setItems}
                  onChangeValue={handleLanguageChange}
                  scrollViewProps={{
                    showsVerticalScrollIndicator: false,
                    nestedScrollEnabled: true,
                  }}
                  listMode="SCROLLVIEW"
                  dropDownContainerStyle={[
                    styles.dropdownManu,
                    { backgroundColor: colors.card },
                  ]}
                  labelStyle={[styles.labelStyle, { color: colors.text }]}
                  arrowIconStyle={{ right: windowHeight(8) }}
                  containerStyle={styles.dropdownContainer}
                  style={styles.dropdown}
                  textStyle={{ color: colors.text, fontSize: fontSizes.FONT4 }}
                  theme={isDark ? 'DARK' : 'LIGHT'}
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
                <TouchableOpacity activeOpacity={0.7} onPress={handleNavigation}>
                  <Text
                    style={[
                      styles.skipText,
                      { borderColor: isDark ? appColors.darkborder : appColors.border },
                    ]}
                  >
                    {translateData?.skip || 'Skip'}
                  </Text>
                </TouchableOpacity>
              </View>

              <FastImage
                style={styles.imageBackground}
                source={{
                  uri: slide?.onboarding_image_url || '',
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />

              <View
                style={[styles.imageBgView, { backgroundColor: colors.background }]}
              >
                <ImageBackground
                  resizeMode="stretch"
                  style={styles.img}
                  source={imageDarkBottom}
                >
                  <Text
                    style={[
                      styles.title,
                      { color: isDark ? appColors.white : appColors.primaryFont },
                    ]}
                  >
                    {slide?.title || ''}
                  </Text>
                  <Text style={styles.description}>
                    {slide?.description || ''}
                  </Text>
                  <TouchableOpacity
                    style={[styles.backArrow, { transform: [{ scaleX: -1 }] }]}
                    onPress={() => handleNext(index)}
                    activeOpacity={0.7}
                  >
                    <Icons.Back color={appColors.white} />
                  </TouchableOpacity>
                </ImageBackground>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )
      })}
    </Swiper>
  )
}
