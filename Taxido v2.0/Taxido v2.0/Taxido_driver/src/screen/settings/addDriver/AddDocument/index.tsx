import { View, Text, ScrollView, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Header, notificationHelper } from '../../../../commonComponents'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation, useRoute, useTheme } from '@react-navigation/native'
import { useValues } from '../../../../utils/context'
import appColors from '../../../../theme/appColors'
import { TitleView } from '../../../auth/component'
import styles from './styles'
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker'
import renderDocumentUpload from './component'
import { documentGet, fleetDriverList } from '../../../../api/store/action'
import DateTimePicker from '@react-native-community/datetimepicker'
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet'
import appFonts from '../../../../theme/appFonts'
import Icons from '../../../../utils/icons/icons'
import { fontSizes, windowHeight, windowWidth } from '../../../../theme/appConstant'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { getValue } from '../../../../utils/localstorage'
import { useAppNavigation } from '../../../../utils/navigation'
import { URL } from '../../../../api/config'
import firestore from '@react-native-firebase/firestore'

export function AddDriverDocument() {
    const dispatch = useDispatch()
    const route = useRoute();
    const { formDatas, selectedService, selectedCategory, selectedVehicle, driverData, type } = route.params;
    const { colors } = useTheme()
    const { translateData } = useSelector((state: any) => state.setting)
    const { textRtlStyle, setDocumentDetail, isDark, viewRtlStyle, rtl } = useValues()
    const { documentData } = useSelector((state: any) => state.documents)
    const [uploadedDocuments, setUploadedDocuments] = useState<any>({})
    const [expiryDates, setExpiryDates] = useState<Record<string, Date | null>>({})
    const [showWarning, setShowWarning] = useState<Record<string, boolean>>({})
    const [showDatePicker, setShowDatePicker] = useState<{ visible: boolean; slug: string | null }>({ visible: false, slug: null })
    const [loading, setLoading] = useState<boolean>(false);
    const bars = Array(2).fill(0)
    const navigation = useAppNavigation();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const [selectedDocSlug, setSelectedDocSlug] = useState<string | null>(null)
    const snapPoints = ['30%']


    useEffect(() => {
        getDocument()
    }, [])

    const getDocument = () => {
        dispatch(documentGet({ type: 'driver' }))
    }


    useEffect(() => {
        const prefillDocs: Record<string, any> = {}
        const prefillDates: Record<string, any> = {}
        documentData?.data?.forEach((doc) => {
            const existing = driverData?.documents?.find(
                (v) => v.document?.slug === doc.slug
            )

            if (existing) {
                // prefill image
                prefillDocs[doc?.slug] = [
                    {
                        uri: existing?.document_image_url,
                        name: `${doc?.slug}.jpg`,
                        type: 'image/jpeg',
                    },
                ]

                // prefill expiry date if required
                if (existing?.expired_at) {
                    prefillDates[doc?.slug] = new Date(existing?.expired_at)
                        .toISOString()
                        .split('T')[0]
                }
            }
        })

        setUploadedDocuments(prefillDocs)
        setExpiryDates(prefillDates)
    }, [driverData, documentData])



    const gotoDocument = () => {
        let warnings: Record<string, boolean> = {}
        let hasEmptyDocument = false
        let hasMissingExpiryDate = false

        documentData?.data?.forEach((doc) => {
            const isDocUploaded = uploadedDocuments[doc.slug]
            const requiresExpiryDate = doc.need_expired_date === 1
            const expiryDateValue = expiryDates[doc.slug]

            if (!isDocUploaded) {
                warnings[doc.slug] = true
                hasEmptyDocument = true
            }

            if (isDocUploaded && requiresExpiryDate && !expiryDateValue) {
                warnings[doc.slug] = true
                hasMissingExpiryDate = true
            }
        })

        setShowWarning(warnings)

        if (hasEmptyDocument || hasMissingExpiryDate) {
            return
        }

        const result = Object.keys(uploadedDocuments).reduce((acc, key) => {
            acc[key] = {
                file: uploadedDocuments[key],
                expiryDate: documentData?.data?.find((d) => d.slug === key)?.need_expired_date === 1
                    ? expiryDates[key] || null
                    : null,
            }
            return acc
        }, {} as Record<string, { file: DocumentPickerResponse | null; expiryDate: Date | null }>)

        setDocumentDetail(result)
        addDriver()
    }

    const openBottomSheet = (documentType: string) => {
        setSelectedDocSlug(documentType)
        bottomSheetModalRef.current?.present()
    }
    const handleImageSelection = async (type: 'gallery' | 'camera') => {
        try {
            let res
            if (type === 'gallery') {
                res = await launchImageLibrary({
                    mediaType: 'photo',
                    quality: 1,
                })
            } else {
                res = await launchCamera({
                    mediaType: 'photo',
                    quality: 1,
                })
            }
            if (res?.assets && selectedDocSlug) {
                const file = res.assets[0]
                setUploadedDocuments((prevDocs) => ({
                    ...prevDocs,
                    [selectedDocSlug]: [file],
                }))

                setShowWarning((prevWarnings) => ({
                    ...prevWarnings,
                    [selectedDocSlug]: false,
                }))
            }

        } catch (err) {
        } finally {
            bottomSheetModalRef.current?.dismiss()
        }
    }

    const onDateChange = (event, selectedDate) => {
        const currentSlug = showDatePicker.slug
        if (event.type === 'set' && selectedDate && currentSlug) {
            const formattedDate = new Date(selectedDate).toISOString().split('T')[0]
            const updatedDates = { ...expiryDates, [currentSlug]: formattedDate }
            setExpiryDates(updatedDates)
        }
        setShowDatePicker({ visible: false, slug: null })
    }

    const getValidDate = (value) => {
        const date = new Date(value)
        return isNaN(date.getTime()) ? new Date() : date
    }

    const addDriver = async () => {
        setLoading(true);
        const token = await getValue('token');

        try {
            const formData = new FormData();
            formData.append('name', formDatas.driverName);
            formData.append('email', formDatas.driverEmail);
            formData.append('country_code', formDatas.countryCode);
            formData.append('phone', formDatas.phoneNumber);
            formData.append('password', formDatas.password);
            formData.append('password_confirmation', formDatas.confirmPassword);
            formData.append('service_id', formDatas.selectedServiceId);
            formData.append('service_category_id', formDatas.selectedCategoryId);
            formData.append('vehicle_info_id', formDatas.selectedVehicleId);

            Object.keys(uploadedDocuments).forEach((key, index) => {
                const docsArray = uploadedDocuments[key]; // this is an array
                const expiryDate = expiryDates[key];      // expiry date

                if (docsArray && docsArray.length > 0) {
                    docsArray.forEach((doc, docIndex) => {
                        formData.append(`documents[${index}][file]`, {
                            uri: doc.uri,
                            type: doc.type,
                            name: doc.fileName || doc.name,
                        });
                        formData.append(`documents[${index}][slug]`, key);
                        if (expiryDate) {
                            formData.append(`documents[${index}][expired_at]`, expiryDate);
                        }
                    });
                }
            });

            const response = await fetch(`${URL}/api/fleet/driver`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data?.id) {
                notificationHelper('', 'Driver Add Successfully', 'success');
                await dispatch(fleetDriverList()); // add vehicle get data api hear
                await firestore()
                    .collection('driverTrack')
                    .doc(data?.id.toString())
                    .set({
                        is_verified: data?.is_verified ?? '',
                        driver_name: data?.name ?? '',
                        vehicle_model: data?.model ?? '',
                        plate_number: data?.plate_number ?? '',
                        rating_count: data?.rating_count ?? '',
                        review_count: data?.review_count ?? '',
                        wallet_balance: data?.wallet_balance ?? '',
                        is_on_ride: "0"
                    })
                    .then(() => {
                    })
                    .catch(error => {
                        notificationHelper("", error, "error")
                    });


                navigation.replace('DriverList');

            } else {
                notificationHelper('', data?.message ?? 'Something went wrong', 'error');
                setLoading(false);

            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }




    const updateDriver = async () => {
        setLoading(true);
        const token = await getValue('token');

        try {
            const formData = new FormData();
            formData.append('name', formDatas.driverName);
            formData.append('email', formDatas.driverEmail);
            formData.append('country_code', formDatas.countryCode);
            formData.append('phone', formDatas.phoneNumber);
            formData.append('password', formDatas.password);
            formData.append('password_confirmation', formDatas.confirmPassword);
            formData.append('service_id', formDatas.selectedServiceId);
            formData.append('service_category_id', formDatas.selectedCategoryId);
            formData.append('vehicle_info_id', formDatas.selectedVehicleId);
            formData.append('_method', 'PUT');

            Object.keys(uploadedDocuments).forEach((key, index) => {
                const doc = uploadedDocuments[key]?.file;
                const expiryDate = uploadedDocuments[key]?.expiryDate;
                if (doc) {
                    formData.append(`documents[${index}][file]`, {
                        uri: doc.uri,
                        type: doc.type,
                        name: doc.name,
                    });
                    formData.append(`documents[${index}][slug]`, key);
                    if (expiryDate) {
                        formData.append(`documents[${index}][expired_at]`, expiryDate);
                    }
                }
            });

            const response = await fetch(`${URL}/api/fleet/driver/${driverData?.id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (data?.id) {
                notificationHelper('', 'Driver Add Successfully', 'success');
                await dispatch(fleetDriverList());
                navigation.replace('DriverList');

            } else {
                notificationHelper('', data?.message ?? 'Something went wrong', 'error');
                setLoading(false);

            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }

    return (
        <BottomSheetModalProvider>
            <View>
                <Header title={translateData?.AddDriver} backgroundColor={isDark ? colors.card : appColors.white} />
                <View style={{ backgroundColor: isDark ? colors.card : appColors.white }}>
                    <View style={[styles.container, { flexDirection: viewRtlStyle }]}>
                        {bars?.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    index < 2
                                        ? styles.filledBar
                                        : [
                                            styles.emptyBar,
                                            {
                                                backgroundColor: isDark
                                                    ? appColors.darkFillBar
                                                    : appColors.subPrimary,
                                            },
                                        ],
                                ]}
                            />
                        ))}
                    </View>
                </View>
                <ScrollView>
                    <View style={styles.space}>
                        <TitleView title={translateData?.AddDriverDetails} subTitle={translateData?.AddDriverregistration} />
                        {documentData?.data?.map((doc) => (
                            <View key={doc.id} style={styles.dateContainer}>
                                {renderDocumentUpload({
                                    uploadedDocuments,
                                    handleDocumentUpload: (slug) => {
                                        openBottomSheet(slug)
                                    },
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
                </ScrollView>
                {type === 'edit' ?
                    <Button onPress={updateDriver} title={translateData?.update} backgroundColor={appColors.primary} color={appColors.white} loading={loading} />
                    :
                    <Button onPress={gotoDocument} title={translateData?.submit} backgroundColor={appColors.primary} color={appColors.white} loading={loading} />
                }
                {showDatePicker.visible && showDatePicker.slug && (
                    <DateTimePicker
                        value={getValidDate(expiryDates[showDatePicker.slug])}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                        minimumDate={new Date()}
                    />
                )}

                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
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
                            <Text style={{ fontSize: fontSizes.FONT3HALF, fontFamily: appFonts.medium, marginLeft: windowWidth(3), color: isDark ? appColors.darkText : appColors.black }}>
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
                            <Text style={{ fontSize: fontSizes.FONT3HALF, fontFamily: appFonts.medium, marginLeft: windowWidth(3), color: isDark ? appColors.darkText : appColors.black }}>
                                {translateData.openCamera}
                            </Text>
                        </TouchableOpacity>
                    </BottomSheetView>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    )
}
