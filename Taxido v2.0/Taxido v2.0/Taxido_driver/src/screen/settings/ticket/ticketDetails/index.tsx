import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, TextInput, FlatList, Alert, PermissionsAndroid, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Header, notificationHelper } from '../../../../commonComponents'
import appColors from '../../../../theme/appColors'
import { windowHeight, fontSizes } from '../../../../theme/appConstant'
import Icons from '../../../../utils/icons/icons'
import styles from './styles'
import DocumentPicker from 'react-native-document-picker'
import { getValue } from '../../../../utils/localstorage'
import { useDispatch, useSelector } from 'react-redux'
import { messageDataGet, ticketDataGet } from '../../../../api/store/action'
import { URL } from '../../../../api/config'
import { useValues } from '../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native-paper'
import { AppDispatch } from '../../../../api/store'
import RNBlobUtil from 'react-native-blob-util';


export function TicketDetails({ route }: any) {
  const { ticketData } = route.params
  const [textViewShow, setTextViewShow] = useState<boolean>(false)
  const [inputText, setInputText] = useState<string>('')
  const [files, setFiles] = useState<any>([])
  const { messageData } = useSelector((state: any) => state.tickets)
  const { viewRtlStyle, rtl, isDark, textRtlStyle } = useValues()
  const dispatch = useDispatch<AppDispatch>()
  const { colors } = useTheme()
  const { translateData } = useSelector((state: any) => state.setting)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const ticket_id = ticketData.id
    setLoading(true)
    dispatch(messageDataGet({ ticket_id })).finally(() => setLoading(false))
  }, [])


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleDocumentUpload = useCallback(async () => {
    setTextViewShow(true)
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      })
      setFiles([...files, ...response])
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', translateData.failedUpload)
      }
    }
  }, [files])

  const TicketReplay = async () => {
    setLoading(true); //  Show loader
    const forme = {
      message: inputText,
      attachments: files,
      ticket_id: messageData.id,
    }

    const token = await getValue('token')

    try {
      const formData = new FormData()
      formData.append('message', forme.message)

      if (forme.attachments && forme.attachments.length > 0) {
        forme.attachments.forEach((file: any, index: number) => {
          formData.append(`attachments[${index}]`, {
            uri: file.uri,
            name: file.name || `file-${index}`,
            type: file.type || 'application/octet-stream',
          })
        })
      }

      formData.append('ticket_id', forme.ticket_id)

      const response = await fetch(`${URL}/api/ticket/reply`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const ticket_id = ticketData.id
      const responseData = await response.json()

      if (response.ok) {
        dispatch(ticketDataGet())
        dispatch(messageDataGet({ ticket_id }))
      } else {
        notificationHelper('', responseData?.message, 'error')
      }
    } catch (error) {
      notificationHelper('', translateData.wroungTryAgain, 'error')
    } finally {
      setLoading(false)
      setFiles([])
      setInputText('')
      setTextViewShow(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm}`
    return formattedTime
  }

  const downloadImageWithBlobUtil = async (fileUrl: any) => {

    try {
      const timestamp = new Date().getTime();
      const fileName = `downloaded_image_${timestamp}.jpg`;

      let downloadPath;

      if (Platform.OS === 'android') {
        downloadPath = `${RNBlobUtil.fs.dirs.PictureDir}/${fileName}`;
      } else {
        downloadPath = `${RNBlobUtil.fs.dirs.CacheDir}/${fileName}`;
      }

      const response = await RNBlobUtil.config({
        fileCache: true,
        path: downloadPath,
        addAndroidDownloads: Platform.OS === 'android' ? {
          useDownloadManager: true,
          notification: true,
          mime: 'image/jpeg',
          description: 'Downloading image...',
          path: downloadPath,
        } : undefined,
      }).fetch('GET', fileUrl);

      const fileExists = await RNBlobUtil.fs.exists(response.path());

      if (!fileExists) {
        throw new Error("Downloaded file does not exist");
      }

      notificationHelper("", translateData?.imagesucess, "success");
      if (Platform.OS === 'ios') {
        try {
          await RNBlobUtil.fs.unlink(response.path());
        } catch (cleanupError) {
        }
      }

    } catch (error) {
      notificationHelper("", translateData?.downloadfaield, "error");
    }
  };



  const renderItem = ({ item }: any) => {
    return (
      <View
        style={[
          styles.cardContainer,
          { backgroundColor: isDark ? colors.card : appColors.white },
          { borderColor: colors.border },
        ]}
      >
        <View style={[styles.row, { flexDirection: viewRtlStyle }]}>
          <View
            style={[styles.userInfoContainer, { flexDirection: viewRtlStyle }]}
          >
            <View style={styles.userImage}>
              <Text style={styles.user}>
                {item?.created_by?.name?.charAt(0) ?? ''}
              </Text>
            </View>
            <View style={styles.userTextContainer}>
              <Text
                style={[
                  styles.userName,
                  { color: isDark ? appColors.white : appColors.primaryFont },
                ]}
              >
                {item?.created_by?.name}
              </Text>
              <Text style={styles.date}>{formatDate(item.created_at)}</Text>
            </View>
          </View>
          <View style={styles.ticketContainer}>
            <Text style={styles.ticketId}>{ticketData.ticket_number}</Text>
          </View>
        </View>
        <View>
          <Text style={[styles.description, { textAlign: textRtlStyle }]}>
            {item.message}
          </Text>
          <View>
            <View
              style={[
                styles.fileContainer,
                {
                  flexDirection: viewRtlStyle,
                },
              ]}
            >
              {item?.media?.map((fileUrl: string, index: number) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.mainContainer,
                      { borderColor: colors.border, flexDirection: viewRtlStyle },
                    ]}
                  >
                    <Image
                      style={styles.imageStyle}
                      source={{ uri: fileUrl }}
                    />
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.file_Name,
                          { color: isDark ? appColors.white : appColors.primaryFont, fontSize: fontSizes.FONT3 },
                        ]}
                      >
                        {fileUrl.split('/').pop()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        downloadImageWithBlobUtil(fileUrl);
                      }}
                      style={styles.downloadIcon}
                    >
                      <Icons.Download color={appColors.secondaryFont} />
                    </TouchableOpacity>
                  </View>
                );
              })}

            </View>
          </View>
          <Text style={[styles.time, { textAlign: rtl ? 'left' : 'right' }]}>
            {formatTime(item.created_at)}
          </Text>
        </View>
      </View>
    )
  }


  return (
    <View style={styles.screenMainContainer}>
      <Header title={translateData.ticketDetails} />
      <View style={styles.list}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size='small' color={appColors.primary} />
          </View>
        ) : (
          <FlatList
            data={messageData?.messages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            removeClippedSubviews={true}
          />
        )}

      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          setTextViewShow(true)
        }}
      >
        <View
          style={[
            styles.textViewShow,
            {
              borderColor: colors.border,
              backgroundColor: isDark ? colors.card : appColors.white,
            },
          ]}
        >
          {textViewShow && (
            <View
              style={[
                styles.textView,
                { backgroundColor: isDark ? colors.card : appColors.white },
              ]}
            >
              <TextInput
                style={[
                  styles.inputView,
                  {
                    backgroundColor: isDark ? colors.card : appColors.white,
                    color: isDark ? appColors.white : appColors.primaryFont
                  },
                ]}
                placeholder={translateData.typeSomethinghere}
                placeholderTextColor={appColors.secondaryFont}
                value={inputText}
                onChangeText={text => setInputText(text)}
                autoFocus={true}
                multiline={true}
              />

              <View
                style={[
                  styles.fileFormat,
                  {
                    flexDirection: viewRtlStyle,
                  },
                ]}
              >
                {files?.map((file: any, index: number) => {
                  const fileSize = file.size
                  const sizeFormatted =
                    fileSize < 1024
                      ? `${fileSize} B`
                      : fileSize < 1024 * 1024
                        ? `${(fileSize / 1024).toFixed(2)} KB`
                        : fileSize < 1024 * 1024 * 1024
                          ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB`
                          : `${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`

                  const handleRemoveFile = (fileIndex: number) => {
                    const updatedFiles = files.filter((_: any, i: number) => i !== fileIndex)
                    setFiles(updatedFiles)
                  }

                  return (
                    <View
                      key={index}
                      style={[
                        styles.viewContainer,
                        {
                          borderColor: colors.border,
                          flexDirection: viewRtlStyle,
                        },
                      ]}
                    >
                      <Image style={styles.img} source={{ uri: file.uri }} />
                      <TouchableOpacity
                        activeOpacity={0.7}

                        onPress={() => handleRemoveFile(index)}
                        style={styles.removeFile}
                      >
                        <Icons.CloseSimple />
                      </TouchableOpacity>
                      <View style={styles.fileTextContainer}>
                        <Text style={[styles.fileName, { color: isDark ? appColors.white : appColors.black }]}>
                          {file.name.length > 5
                            ? `${file.name.substring(0, 5)}...`
                            : file.name}
                        </Text>
                        <Text style={[styles.sizeFormattedText, { color: isDark ? appColors.white : appColors.black }]}>
                          {sizeFormatted}
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </View>
              <View style={[styles.border, { borderColor: colors.border }]} />
            </View>
          )}
          <View
            style={[
              styles.bottomSearchBar,
              { flexDirection: viewRtlStyle },
              { backgroundColor: isDark ? colors.card : appColors.white },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}

              style={[
                styles.attachment,
                { left: rtl ? '9%' : windowHeight(1) },
              ]}
              onPress={handleDocumentUpload}
            >
              <Icons.clip />
            </TouchableOpacity>
            <View
              style={[
                styles.btnContainer,
                { left: rtl ? '65%' : windowHeight(0) },
              ]}
            >
              <TouchableOpacity style={styles.sendBtn} onPress={TicketReplay} activeOpacity={0.7}
              >
                <Text style={styles.btnTitle}>{translateData.ticketMsgSend}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}
