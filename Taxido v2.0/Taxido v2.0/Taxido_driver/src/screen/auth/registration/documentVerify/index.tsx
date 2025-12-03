import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Platform, BackHandler } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import appColors from '../../../../theme/appColors';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Header, TitleView } from '../../component';
import renderDocumentUpload from './component';
import { useValues } from '../../../../utils/context';
import { Button } from '../../../../commonComponents';
import { useDispatch, useSelector } from 'react-redux';
import { documentGet } from '../../../../api/store/action/documentAction';
import { windowHeight } from '../../../../theme/appConstant';
import { AppDispatch } from '../../../../api/store';
import styles from './styles';


export function DocumentVerify() {

  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useTheme();
  const { textRtlStyle, setDocumentDetail, isDark } = useValues();
  const { selfDriver } = useSelector((state: any) => state.account)
  const { documentData } = useSelector((state: any) => state.documents);
  const { translateData } = useSelector((state: any) => state.setting);
  const [uploadedDocuments, setUploadedDocuments] = useState<any>({});
  const [expiryDates, setExpiryDates] = useState<Record<string, Date | null> | any>({});
  const [showWarning, setShowWarning] = useState<Record<string, boolean>>({});
  const [showDatePicker, setShowDatePicker] = useState<{ visible: boolean; slug: string | null; }>({ visible: false, slug: null });

  useEffect(() => {
    getDocument();
  }, []);

  const getDocument = () => {
    if (selfDriver?.role == 'fleet_manager') {
      dispatch(documentGet({ type: 'fleet_manager' }));
    } else {
      dispatch(documentGet({ type: 'vehicle' }));
    }
  };

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

  const navigation = useNavigation();
  const gotoDocument = () => {
    let warnings: Record<string, boolean> = {};
    let hasEmptyDocument = false;
    let hasMissingExpiryDate = false;

    documentData?.data?.forEach((doc: any) => {
      const isDocUploaded = uploadedDocuments[doc.slug];
      const requiresExpiryDate = doc.need_expired_date === 1;
      const expiryDateValue = expiryDates[doc.slug];

      if (!isDocUploaded) {
        warnings[doc.slug] = true;
        hasEmptyDocument = true;
      }

      if (isDocUploaded && requiresExpiryDate && !expiryDateValue) {
        warnings[doc.slug] = true;
        hasMissingExpiryDate = true;
      }
    });

    setShowWarning(warnings);

    if (hasEmptyDocument || hasMissingExpiryDate) {
      return;
    }

    const result = Object.keys(uploadedDocuments).reduce((acc, key) => {
      acc[key] = {
        file: uploadedDocuments[key],
        expiryDate: documentData?.data?.find((d: any) => d.slug === key)?.need_expired_date === 1
          ? expiryDates[key] || null
          : null,
      };
      return acc;
    }, {} as Record<string, { file: DocumentPickerResponse | null; expiryDate: Date | null }>);

    setDocumentDetail(result);
    navigation.goBack();

  };


  const handleDocumentUpload = async (documentType: string) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      setUploadedDocuments((prevDocs: any) => ({
        ...prevDocs,
        [documentType]: res,
      }));

      setShowWarning((prevWarnings) => ({
        ...prevWarnings,
        [documentType]: false,
      }));
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
      }
    }
  };

  const onDateChange = (event: any, selectedDate: number) => {
    const currentSlug = showDatePicker.slug;

    if (event.type === 'set' && selectedDate && currentSlug) {
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

      const updatedDates: any = {
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

  const getValidDate = (value: string) => {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: windowHeight(8.3), backgroundColor: isDark ? colors.card : appColors.white }}>
        <Header backgroundColor={isDark ? colors.card : appColors.white} />

      </View>
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        <View style={[styles.sub, { backgroundColor: colors.background }]}>
          <View style={styles.spaceHorizantal}>
            <TitleView
              title={translateData.uploadDocuments}
              subTitle={translateData.docApproval}
            />
            {documentData?.data?.map((doc) => (
              <View key={doc.id} style={styles.dateContainer}>
                {renderDocumentUpload({
                  uploadedDocuments,
                  handleDocumentUpload,
                  documentType: doc.slug,
                  label: `Upload ${doc.name}`,
                  expiryDate: expiryDates[doc.slug],
                  needExpiryDate: doc.need_expired_date === 1,
                  onPressDate: (slug) => setShowDatePicker({ visible: true, slug }),
                })}

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
                    {uploadedDocuments[doc.slug] && doc.need_expired_date === 1 && !expiryDates[doc.slug]
                      ? translateData.expiryDateRequired
                      : `${doc.name} ${translateData.isRequired}`}
                  </Text>
                )}
              </View>
            ))}

          </View>


        </View>
      </ScrollView>
      <View
        style={[styles.buttonView]}
      >
        <Button
          onPress={gotoDocument}
          title={translateData.next}
          backgroundColor={appColors.primary}
          color={appColors.white}
        />
      </View>
      {showDatePicker.visible && showDatePicker.slug && (
        <DateTimePicker
          value={getValidDate(expiryDates[showDatePicker.slug])}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}
