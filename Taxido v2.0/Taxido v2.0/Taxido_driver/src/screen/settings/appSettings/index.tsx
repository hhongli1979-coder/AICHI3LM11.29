import { Image, TouchableOpacity, TouchableWithoutFeedback, View, Text, BackHandler } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LanguageModal, Notification, DarkTheme, Rtl } from './component/';
import styles from './styles';
import { CustomRadioButton, Header } from '../../../commonComponents';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { languageDataGet, translateDataGet } from '../../../api/store/action';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { fontSizes, windowHeight } from '../../../theme/appConstant';
import appColors from '../../../theme/appColors';
import appFonts from '../../../theme/appFonts';
import { useValues } from '../../../utils/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch } from '../../../api/store';

export function AppSettings() {

  const { colors } = useTheme();
  const { translateData, languageData } = useSelector((state: any) => state.setting);
  const dispatch = useDispatch<AppDispatch>();
  const { viewRtlStyle, setRtl } = useValues();
  const bottomSheetRef = useRef<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState<string>('en');


  useEffect(() => {
    dispatch(languageDataGet());
  }, []);


  useEffect(() => {
    (async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
        const rtlValue = await AsyncStorage.getItem('rtl');

        if (storedLanguage) {
          setSelectedLanguage(storedLanguage);
          setTempSelectedLanguage(storedLanguage);
        }

        if (rtlValue !== null) {
          setRtl(JSON.parse(rtlValue));
        } else {
          setRtl(storedLanguage === 'ar');
        }
      } catch (error) {
      }
    })();
  }, []);

  const openSheet = () => {
    setTempSelectedLanguage(selectedLanguage);
    bottomSheetRef.current?.expand();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const closeModal = async () => {
    bottomSheetRef.current?.close();
    setSelectedLanguage(tempSelectedLanguage);
    await AsyncStorage.setItem('selectedLanguage', tempSelectedLanguage);
    await AsyncStorage.setItem('rtl', JSON.stringify(tempSelectedLanguage === 'ar'));
    setRtl(tempSelectedLanguage === 'ar');
    dispatch(translateDataGet());
  };

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
    <View style={[styles.main, { backgroundColor: colors.background }]}>
      <Header title={translateData.appSetting} />
      <View style={styles.container}>
        <View
          style={[
            styles.listContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <>
            <DarkTheme />
            <Rtl />
            <LanguageModal openSheet={openSheet} tempSelectedLanguage={selectedLanguage} />
          </>
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['60%']}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
        backgroundStyle={{ backgroundColor: colors.card }}
      >
        <BottomSheetView style={{ paddingHorizontal: windowHeight(2) }}>
          <View>
            <Text
              style={{
                color: colors.text,
                textAlign: 'center',
                fontFamily: appFonts.medium,
                fontSize: fontSizes.FONT4HALF,
                marginBottom: windowHeight(1),
                marginTop: windowHeight(2),
              }}
            >
              {translateData.changeLanguage}
            </Text>

            {languageData?.data?.map((item: any) => (
              <View key={item.locale}>
                <TouchableOpacity
                  style={[styles.modalAlign, { flexDirection: viewRtlStyle }]}
                  onPress={() => setTempSelectedLanguage(item.locale)}
                >
                  <View style={[styles.selection, { flexDirection: viewRtlStyle }]}>
                    <Image source={{ uri: item.flag }} style={styles.imageCountry} />
                    <Text
                      style={[
                        styles.name,
                        {
                          color: colors.text,
                          fontWeight:
                            tempSelectedLanguage === item.locale ? '500' : '300',
                        },
                      ]}
                    >
                      {item.name.toLowerCase()}
                    </Text>
                  </View>
                  <View style={{ left: windowHeight(1.5) }}>
                    <CustomRadioButton selected={tempSelectedLanguage === item.locale} />
                  </View>
                </TouchableOpacity>
                <View style={[styles.borderBottom, { borderColor: colors.border }]} />
              </View>
            ))}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={closeModal}
              style={styles.buttonView}
            >
              <Text style={styles.buttonTitle}>{translateData.update}</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
