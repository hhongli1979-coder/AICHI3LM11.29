import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollView, View, Text, Platform, TouchableOpacity, BackHandler, Modal } from 'react-native';
import { ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import appColors from '../../../../theme/appColors';
import { ProgressBar } from '../component';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Header, TitleView } from '../../component';
import styles from '../../registration/documentVerify/styles';
import { useValues } from '../../../../utils/context';
import { useDispatch, useSelector } from 'react-redux';
import { documentGet } from '../../../../api/store/action/documentAction';
import RenderUpload from './component';
import { Button } from '../../../../commonComponents';
import { fontSizes, windowHeight, windowWidth } from '../../../../theme/appConstant';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Icons from '../../../../utils/icons/icons';
import appFonts from '../../../../theme/appFonts';
import { AppDispatch } from '../../../../api/store';
import { useAppNavigation } from '../../../../utils/navigation';
import { getValue } from '../../../../utils/localstorage';

export function UploadedDocument() {

  const { navigate } = useAppNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useTheme();
  const { textRtlStyle, setDocumentDetail, isDark, rtl } = useValues();
  const { documentData } = useSelector((state: any) => state.documents);
  const { translateData } = useSelector((state: any) => state.setting);
  const { selfDriver } = useSelector((state: any) => state.account)
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, any>>({});
  const [expiryDates, setExpiryDates] = useState<Record<string, string | null> | any>({});
  const [showWarning, setShowWarning] = useState<Record<string, boolean> | any>({});
  const [showDatePicker, setShowDatePicker] = useState<any>({ visible: false, slug: null });
  const [documentType, setDocumnetType] = useState<any>()

  useEffect(() => {
    if (selfDriver?.role == 'fleet_manager') {
      dispatch(documentGet({ type: 'fleet_manager' }));
    } else {
      dispatch(documentGet({ type: 'vehicle' }));
    }
  }, []);

  const navigation = useNavigation();
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleDocumentUpload = async (documentType: string, source: 'camera' | 'gallery' = 'gallery') => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 1,
      }; const res: any = source === 'camera' ? await launchCamera(options) : await launchImageLibrary(options);

      if (res?.assets?.length > 0) {
        const file = res.assets[0];
        setUploadedDocuments((prev) => ({
          ...prev,
          [documentType]: {
            uri: file.uri!,
            type: file.type!,
            name: file.fileName || `file_${Date.now()}`,
          },
        }));
        setShowWarning((prev) => ({ ...prev, [documentType]: false }));
      }
    } catch (err) {
    }
  };

  const onDateChange = (event: any, selectedDate: number) => {
    const currentSlug = showDatePicker.slug;

    if (event.type === 'set' && selectedDate && currentSlug) {
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

      const updatedDates = {
        ...expiryDates,
        [currentSlug]: formattedDate,
      };

      setExpiryDates(updatedDates);

      Object.entries(updatedDates).forEach(([slug, date]) => {
      });
    } else {
    }

    setShowDatePicker({ visible: false, slug: null });
  };

  const driverDocs = documentData?.data?.filter((doc: any) => doc.type === 'driver') || [];
  const vehicleDocs = documentData?.data?.filter((doc: any) => doc.type === 'vehicle') || [];

  const gotoDocument = async () => {
    let hasErrors = false;
    const warnings: Record<string, boolean> = {};

    documentData?.data?.forEach((doc) => {
      const uploaded = uploadedDocuments[doc.slug];
      const requiresDate = doc.need_expired_date === 1;
      if (!uploaded || (requiresDate && !expiryDates[doc.slug])) {
        warnings[doc.slug] = true;
        hasErrors = true;
      }
    });

    setShowWarning(warnings);
    if (hasErrors) return;

    const finalData = Object.keys(uploadedDocuments).reduce((acc, key) => {
      acc[key] = {
        file: uploadedDocuments[key],
        expiryDate: expiryDates[key] ?? null,
      };
      return acc;
    }, {});

    setDocumentDetail(finalData);

    const userType = await getValue('userType');
    if (userType == 'driver') {
      navigate('VehicleRegistration');
    } else if (userType == 'fleet') {
      navigate('FleetDetails');
    } else {
      navigate('VehicleRegistration');
    }
  };


  const getValidDate = (value: string) => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
  };
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
  }, []);


  const handleRemoveDocument = (documentType: string) => {
    setUploadedDocuments((prev) => {
      const updated = { ...prev };
      delete updated[documentType];
      return updated;
    });

    setExpiryDates((prev: any) => {
      const updated = { ...prev };
      delete updated[documentType];
      return updated;
    });

    setShowWarning((prev: any) => {
      const updated = { ...prev };
      delete updated[documentType];
      return updated;
    });
  };


  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1 }}>
        <Header backgroundColor={isDark ? colors.card : appColors.white} />
        <ProgressBar fill={2} />

        <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
          <View style={[styles.sub, { backgroundColor: colors.background }]}>

            <View style={styles.spaceHorizantal}>
              {driverDocs?.length > 0 && (
                <>
                  <TitleView
                    title={translateData.driverDocuments}
                    subTitle={translateData.equireddocumentsdriver}
                  />
                  {driverDocs.map((doc: any) => (
                    <View key={doc.id} style={styles.dateContainer}>
                      <RenderUpload
                        uploadedDocuments={uploadedDocuments}
                        handleDocumentUpload={handleDocumentUpload}
                        setDocumnetType={setDocumnetType}
                        documentType={doc.slug}
                        label={`${translateData.upload} ${doc.name}`}
                        expiryDate={expiryDates[doc.slug]}
                        needExpiryDate={doc.need_expired_date === 1}
                        onPressDate={(slug) =>
                          setShowDatePicker({ visible: true, slug })
                        }
                        handlePresentModalPress={handlePresentModalPress}
                        handleRemoveDocument={handleRemoveDocument}
                      />
                      {showWarning[doc.slug] && (
                        <Text
                          style={[
                            styles.titleText,
                            {
                              textAlign: textRtlStyle,
                              color: appColors.red,
                              marginTop: 5,
                            },
                          ]}
                        >
                          {uploadedDocuments[doc.slug] &&
                            doc.need_expired_date === 1 &&
                            !expiryDates[doc.slug]
                            ? translateData.expiryDateRequired
                            : `${doc.name} ${translateData.isRequired}`}
                        </Text>
                      )}
                    </View>
                  ))}
                </>
              )}
              <View style={{ borderColor: isDark ? appColors.darkborder : appColors.border, borderWidth: windowHeight(0.1), marginTop: windowHeight(0.8) }}></View>
              {vehicleDocs?.length > 0 && (
                <View style={{ marginTop: windowHeight(1) }}>
                  <TitleView
                    title={translateData.vehicleDocuments}
                    subTitle={translateData.requireddocumentsforverification}
                  />
                  {vehicleDocs.map((doc: any) => (
                    <View key={doc.id} style={styles.dateContainer}>
                      <RenderUpload
                        uploadedDocuments={uploadedDocuments}
                        handleDocumentUpload={handleDocumentUpload}
                        handleRemoveDocument={handleRemoveDocument}
                        setDocumnetType={setDocumnetType}
                        documentType={doc.slug}
                        label={`${translateData.upload} ${doc.name}`}
                        expiryDate={expiryDates[doc.slug]}
                        needExpiryDate={doc.need_expired_date === 1}
                        onPressDate={(slug) => setShowDatePicker({ visible: true, slug })}
                        handlePresentModalPress={handlePresentModalPress}
                      />

                      {showWarning[doc.slug] && (
                        <Text
                          style={[
                            styles.titleText,
                            {
                              textAlign: textRtlStyle,
                              color: appColors.red,
                              marginTop: 5,
                            },
                          ]}
                        >
                          {uploadedDocuments[doc.slug] &&
                            doc.need_expired_date === 1 &&
                            !expiryDates[doc.slug]
                            ? translateData.expiryDateRequired
                            : `${doc.name} ${translateData.isRequired}`}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>

          </View>
        </ScrollView>

        <View style={styles.buttonView}>
          <Button
            onPress={gotoDocument}
            title={translateData.next}
            backgroundColor={appColors.primary}
            color={appColors.white}
          />
        </View>
        {showDatePicker.visible && showDatePicker.slug && (
          Platform.OS === "ios" ? (
            <Modal transparent animationType="slide">
              <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: appColors.modelBg,
              }}>
                <View style={{ backgroundColor: "white", borderRadius: 10 }}>
                  <DateTimePicker
                    value={getValidDate(expiryDates[showDatePicker.slug])}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={getValidDate(expiryDates[showDatePicker.slug])}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )
        )}
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            snapPoints={['27%']}
            handleIndicatorStyle={{ backgroundColor: appColors.primary, width: '13%' }}
            backgroundStyle={{ backgroundColor: isDark ? appColors.darkThemeSub : appColors.white }}
          >
            <BottomSheetView style={styles.contentContainer}>
              <View
                style={{
                  backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                  borderRadius: windowHeight(1),
                  width: '98%',
                  alignSelf: 'center',

                }}
              >
                <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: windowHeight(0.5) }}>

                  <Text style={{ alignSelf: 'center', color: isDark ? appColors.white : appColors.black, fontFamily: appFonts.medium, fontSize: fontSizes.FONT4HALF, marginHorizontal: windowWidth(5) }}>{translateData.selectOne}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    handleCloseModalPress();
                    handleDocumentUpload(documentType, 'gallery');
                  }}
                  style={{ paddingVertical: windowHeight(1.9) }}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', marginHorizontal: windowWidth(3) }}>
                    <View style={{ backgroundColor: isDark ? appColors.dotDark : appColors.cardicon, height: windowHeight(5), width: windowHeight(5), borderRadius: windowHeight(3), alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      <Icons.Gallery />
                    </View>
                    <Text style={{ fontSize: fontSizes.FONT3HALF, fontFamily: appFonts.medium, marginHorizontal: windowWidth(3), color: isDark ? appColors.white : appColors.black }}>
                      {translateData.chooseFromGallery}
                    </Text>
                  </View>
                  <View style={{ borderWidth: windowHeight(0.1), borderColor: isDark?appColors.darkborder: appColors.border, width: '92%', alignSelf: 'center', top: windowHeight(1.5) }} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCloseModalPress();
                    handleDocumentUpload(documentType, 'camera');
                  }}
                  style={{ paddingVertical: windowHeight(1) }}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', marginHorizontal: windowWidth(3) }}>
                    <View style={{ backgroundColor: isDark ? appColors.dotDark : appColors.cardicon, height: windowHeight(5), width: windowHeight(5), borderRadius: windowHeight(3), alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                      <Icons.Camera1 />

                    </View>
                    <Text style={{ fontSize: fontSizes.FONT3HALF, fontFamily: appFonts.medium, marginHorizontal: windowWidth(3), color: isDark ? appColors.white : appColors.black }}>
                      {translateData.openCamera}
                    </Text>
                  </View>
                </TouchableOpacity>

              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
    </GestureHandlerRootView>
  );

}