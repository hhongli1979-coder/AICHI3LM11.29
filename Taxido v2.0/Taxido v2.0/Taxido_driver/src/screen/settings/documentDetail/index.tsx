import React, { useEffect, useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  BackHandler,
} from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import appColors from '../../../theme/appColors'
import { useNavigation, useTheme } from '@react-navigation/native'
import { TitleView } from '../../auth/component'
import styles from '../../auth/registration/documentVerify/styles'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/main/types'
import { Header, Button, notificationHelper } from '../../../commonComponents'
import { useDispatch, useSelector } from 'react-redux'
import { selfDriverData, documentGet } from '../../../api/store/action'
import documentstyles from './styles'
import Icons from '../../../utils/icons/icons'
import { getValue } from '../../../utils/localstorage'
import { windowHeight } from '../chat/context'
import { fontSizes, windowWidth } from '../../../theme/appConstant'
import { URL } from '../../../api/config'
import appFonts from '../../../theme/appFonts'
import { useValues } from '../../../utils/context'
import DateTimePicker from '@react-native-community/datetimepicker'
import { AppDispatch } from '../../../api/store'

type ProfileScreenProps = NativeStackNavigationProp<RootStackParamList>

interface UploadedDocument {
  uri: string
  name: string
  type: string
  status: 'pending' | 'approved' | 'rejected' | null
  expired_at: string | null
}

export function DocumentDetail() {
  const { colors } = useTheme()
  const { goBack } = useNavigation<ProfileScreenProps>()
  const dispatch = useDispatch<AppDispatch>()
  const { selfDriver } = useSelector((state: any) => state.account)
  const { documentData } = useSelector((state: any) => state.documents)
  const { translateData } = useSelector((state: any) => state.setting)
  const [uploadedDocuments, setUploadedDocuments] = useState<{
    [slug: string]: UploadedDocument | null
  }>({})
  const [showWarning, setShowWarning] = useState<{ [slug: string]: boolean }>(
    {},
  )
  const [documentLoad, setDocumentLoad] = useState<boolean>(false)
  const [expandedDocuments, setExpandedDocuments] = useState<{
    [slug: string]: boolean
  }>({})
  const { isDark } = useValues()

  useEffect(() => {
    dispatch(selfDriverData())
    if (selfDriver?.role == 'fleet_manager') {
      dispatch(documentGet({ type: 'fleet_manager' }))
    } else {
      dispatch(documentGet({ type: 'vehicle' }))
    }
  }, [])

  useEffect(() => {
    if (selfDriver?.documents && documentData?.data?.length) {
      const newUploadedDocuments: { [slug: string]: UploadedDocument | null } =
        {}
      documentData.data.forEach((doc: any) => {
        const matched = selfDriver.documents.find(
          (d: any) => d.document?.id === doc.id || d.document_id === doc.id,
        )
        newUploadedDocuments[doc.slug] = matched
          ? {
            uri: matched.document_image_url || '',
            name: matched.document_no || '',
            type: 'image/jpeg',
            status: matched?.status,
            expired_at: matched?.expired_at,
          }
          : null
      })
      setUploadedDocuments(newUploadedDocuments)
    }
  }, [selfDriver, documentData])

  const [showDatePicker, setShowDatePicker] = useState<any>(false)
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false)
    if (selectedDate && activeSlug) {
      setUploadedDocuments(prev => ({
        ...prev,
        [activeSlug]: {
          ...prev[activeSlug],
          expired_at: selectedDate.toISOString(),
        } as UploadedDocument,
      }))
    }
  }

  const [isPicking, setIsPicking] = useState(false)

  const handleDocumentPick = async (slug: string) => {
    if (isPicking) return // prevent multiple opens
    setIsPicking(true)

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      })
      const selectedFile = Array.isArray(res) ? res[0] : res

      setUploadedDocuments(prev => ({
        ...prev,
        [slug]: {
          uri: selectedFile.uri,
          name: selectedFile.name || '',
          type: selectedFile.type || 'image/jpeg',
          status: prev[slug]?.status || null,
          expired_at: prev[slug]?.expired_at || null,
        },
      }))

      setShowWarning(prev => ({
        ...prev,
        [slug]: false,
      }))
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
      }
    } finally {
      setIsPicking(false)
    }
  }

  const toggleDocumentPreview = (slug: string) => {
    setExpandedDocuments(prev => ({
      ...prev,
      [slug]: !prev[slug],
    }))
  }

  const gotoDocument = async () => {
    setDocumentLoad(true)
    const newWarnings: { [slug: string]: boolean } = {}
    const token = await getValue('token')

    documentData?.data?.forEach((doc: any) => {
      if (!uploadedDocuments[doc.slug] || !uploadedDocuments[doc.slug]?.uri) {
        newWarnings[doc.slug] = true
      }
    })

    if (Object.keys(newWarnings).length > 0) {
      setShowWarning(newWarnings)
      setDocumentLoad(false)
      notificationHelper(
        '',
        `${translateData.pleaseUpload} ${Object.keys(newWarnings).length > 1
          ? translateData?.allDoc
          : translateData?.thedoc
        }`,
        'error',
      )
      return
    }

    setShowWarning({})
    const formData = new FormData()

    Object.entries(uploadedDocuments).forEach(([slug, file], index) => {
      if (file && file.uri) {
        const original = selfDriver?.documents?.find(
          (d: any) => d.document?.slug === slug || d.document_id === slug,
        )

        const expiryChanged =
          original?.expired_at &&
          file.expired_at &&
          new Date(original.expired_at).toISOString() !==
          new Date(file.expired_at).toISOString()

        if (file.status !== 'approved' || expiryChanged) {
          formData.append(`documents[${index}][slug]`, slug)
          formData.append(`documents[${index}][file]`, {
            uri: file.uri,
            type: file.type,
            name: file.name,
          })
          if (file.expired_at) {
            formData.append(`documents[${index}][expired_at]`, file.expired_at)
          }
        }
      }
    })

    try {
      const response = await fetch(`${URL}/api/update/document`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const rawText = await response.text()
      const responseData = JSON.parse(rawText)

      if (!response.ok) {
        notificationHelper(
          '',
          responseData.message || 'Failed to update documents',
          'error',
        )
        setDocumentLoad(false)
        return
      }

      setDocumentLoad(false)
      goBack()
      notificationHelper('', translateData.detailsUpdateSuccessfully, 'success')
      dispatch(selfDriverData())
    } catch (error) {
      notificationHelper('', 'An unexpected error occurred.', 'error')
      setDocumentLoad(false)
    }
  }

  const driverDocs = documentData?.data?.filter(
    (doc: any) => doc.type === 'driver',
  )
  const fleet_managerDocs = documentData?.data?.filter(
    (doc: any) => doc.type === 'fleet_manager',
  )

  const vehicleDocs = documentData?.data?.filter(
    (doc: any) => doc.type === 'vehicle',
  )


  const renderDocumentSection = (
    docs: any,
    title: string,
    subTitle: string,
  ) => (
    <>
      {docs?.length > 0 && (
        <>
          <TitleView title={title} subTitle={subTitle} />
          <View>
            {docs?.map((doc: any) => {
              const picked = uploadedDocuments[doc.slug]
              const isExpanded = expandedDocuments[doc.slug]

              let statusText = ''
              let statusColor = appColors.primaryFont
              let showEditIcon = true

              if (picked?.status === 'approved') {
                statusText = translateData.verified
                statusColor = appColors.price
                showEditIcon = false
              } else if (picked?.status === 'pending') {
                statusText = translateData.pending
                statusColor = appColors.completeColor
              } else if (picked?.status === 'rejected') {
                statusText = translateData.rejected
                statusColor = appColors.red
              } else {
                statusText = translateData.notUploaded
                statusColor = isDark
                  ? appColors.darkText
                  : appColors.primaryFont
              }

              return (
                <View
                  key={doc.slug}
                  style={{
                    backgroundColor: isDark
                      ? appColors.darkThemeSub
                      : appColors.white,
                    padding: windowHeight(5),
                    borderRadius: windowHeight(5),
                    borderWidth: 1,
                    borderColor: isDark
                      ? appColors.darkBorderBlack
                      : appColors.border,
                    marginBottom: windowHeight(15),
                  }}
                >
                  <View>
                    <TouchableOpacity
                      onPress={() => toggleDocumentPreview(doc.slug)}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: windowHeight(8),
                        paddingHorizontal: windowWidth(2.5),
                        top: windowHeight(3),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizes.FONT3HALF,
                          color: isDark
                            ? appColors.darkText
                            : appColors.primaryFont,
                          fontFamily: appFonts.medium,
                        }}
                      >
                        {doc.name}
                      </Text>
                      <View
                        style={{
                          transform: [
                            { rotate: isExpanded ? '-90deg' : '1800deg' },
                          ],
                          bottom: windowHeight(-7),
                        }}
                      >
                        <Icons.LeftArrow
                          color={
                            isDark ? appColors.darkText : appColors.primaryFont
                          }
                        />
                      </View>
                    </TouchableOpacity>

                    {!isExpanded && (
                      <View
                        style={{
                          bottom: windowHeight(5),
                          marginHorizontal: windowWidth(2.7),
                        }}
                      >
                        <Text
                          style={{
                            color: statusColor,
                            fontSize: fontSizes.FONT3,
                          }}
                        >
                          {statusText}
                        </Text>
                      </View>
                    )}
                  </View>

                  {isExpanded && (
                    <View>
                      <TouchableOpacity
                        disabled={isPicking || allVerified}
                        onPress={() => handleDocumentPick(doc.slug)}
                        style={{
                          borderWidth: windowHeight(1.3),
                          width: '93.9%',
                          height: 100,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: windowHeight(3),
                          borderStyle: 'dotted',
                          borderColor: appColors.grayRound,
                          marginTop: windowHeight(5),
                          alignSelf: 'center',
                        }}
                      >
                        {picked?.uri ? (
                          <Image
                            source={{ uri: picked.uri }}
                            style={documentstyles.uri}
                          />
                        ) : (
                          <Text
                            style={{
                              color: isDark
                                ? appColors.darkText
                                : appColors.grayRound,
                            }}
                          >
                            {translateData.uploadDocument}
                          </Text>
                        )}
                      </TouchableOpacity>

                      {picked?.status && (
                        <View
                          style={{
                            backgroundColor:
                              picked?.status === 'approved'
                                ? appColors.value
                                : picked?.status === 'pending'
                                  ? appColors.lightYellow
                                  : appColors.lightRed,
                            marginTop: windowHeight(15),
                            paddingVertical: windowHeight(8),
                            paddingHorizontal: windowWidth(4),
                            borderRadius: windowHeight(4),
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '93.9%',
                            alignSelf: 'center',
                            marginBottom: windowHeight(2),
                          }}
                        >
                          <Text
                            style={{
                              color: statusColor,
                              fontSize: fontSizes.FONT3HALF,
                              fontFamily: appFonts.medium,
                            }}
                          >
                            {statusText}
                          </Text>
                          {showEditIcon && (
                            <TouchableOpacity
                              onPress={() => handleDocumentPick(doc.slug)}
                            >
                              <Icons.edit color="#60A5FA" />
                            </TouchableOpacity>
                          )}
                          {picked?.status === 'approved' && <Icons.Verified />}
                        </View>
                      )}

                      {(picked?.status !== 'approved' ||
                        (picked?.status === 'approved' &&
                          picked?.expired_at)) && (
                          <TouchableOpacity
                            disabled={allVerified}
                            onPress={() => {
                              setActiveSlug(doc.slug)
                              setShowDatePicker(true)
                            }}
                          >
                            <View
                              style={{
                                marginTop: windowHeight(10),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingHorizontal: windowWidth(3),
                                marginBottom: windowHeight(5),
                              }}
                            >
                              <Text
                                style={{
                                  color: isDark
                                    ? appColors.white
                                    : appColors.primaryFont,
                                  fontFamily: appFonts.regular,
                                }}
                              >
                                {translateData.expireon}
                              </Text>

                              <Text
                                style={{
                                  color: isDark
                                    ? appColors.white
                                    : appColors.primaryFont,
                                  fontFamily: appFonts.regular,
                                }}
                              >
                                {picked?.expired_at
                                  ? new Date(picked.expired_at)
                                    .toISOString()
                                    .split('T')[0]
                                  : translateData.selectDate}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                    </View>
                  )}
                  {showWarning[doc.slug] && (
                    <Text style={documentstyles.fieldrequired}>
                      {`${doc.name} ${translateData.fieldrequired}`}
                    </Text>
                  )}
                  {showDatePicker && activeSlug === doc.slug && (
                    <DateTimePicker
                      value={
                        picked?.expired_at
                          ? new Date(picked.expired_at)
                          : new Date()
                      }
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                    />
                  )}
                </View>
              )
            })}
          </View>
        </>
      )}
    </>
  )

  const allVerified =
    documentData?.data?.length > 0 &&
    documentData.data.every(
      (doc: any) => uploadedDocuments[doc.slug]?.status === 'approved',
    )

  const navigation = useNavigation()

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack()
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [navigation])

  return (
    <View style={documentstyles.container}>
      <Header title={translateData.documentRegistration} />
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        <View style={[styles.sub, { backgroundColor: colors.background }]}>
          <View style={styles.spaceHorizantal}>
            {selfDriver?.role === 'fleet_manager' ? (
              <>
                {renderDocumentSection(
                  fleet_managerDocs,
                  translateData.documentVerify,
                  translateData.registerContent,
                )}

              </>
            ) : (
              <>
                {renderDocumentSection(
                  driverDocs,
                  translateData.documentVerify,
                  translateData.registerContent,
                )}
                <View
                  style={{
                    borderColor: isDark
                      ? appColors.darkThemeSub
                      : appColors.border,
                    borderWidth: windowHeight(0.5),
                    width: '99%',
                    alignSelf: 'center',
                    marginTop: windowHeight(8),
                  }}
                />
                {renderDocumentSection(vehicleDocs, translateData.documentVerify, translateData.registerContent)}

              </>
            )}
          </View>
          {allVerified ? (
            <Button
              title={translateData.update}
              backgroundColor={
                isDark ? appColors.darkThemeSub : appColors.grayRound
              }
              color={isDark ? appColors.white : appColors.black}
              activeOpacity={1}
            />
          ) : (
            <View style={{ flex: 0.1, marginBottom: windowHeight(10) }}>
              <Button
                onPress={gotoDocument}
                title={translateData.update}
                backgroundColor={appColors.primary}
                color={appColors.white}
                loading={documentLoad}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
