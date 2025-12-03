import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, TextInput, FlatList, Alert, Platform } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Header, notificationHelper } from "@src/commonComponent";
import { appColors, appFonts } from "@src/themes";
import { Clip, CloseIcon, Download } from "@src/utils/icons";
import styles from "./styles";
import DocumentPicker from "react-native-document-picker";
import { clearValue, getValue } from "@src/utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { messageDataGet, ticketDataGet, } from "../../../api/store/actions/ticketAction";
import { URL } from "@src/api/config";
import { useValues } from "@src/utils/context/index";;
import { external } from "@src/styles/externalStyle";
import { useNavigation } from "@react-navigation/native";
import { AppDispatch } from "@src/api/store";
import RNBlobUtil from 'react-native-blob-util';

export function TicketDetails({ route }) {
  const { ticketData } = route.params;
  const { translateData } = useSelector((state) => state.setting);
  const [textViewShow, setTextViewShow] = useState(false);
  const [inputText, setInputText] = useState("");
  const [files, setFiles] = useState([]);
  const { messageData } = useSelector((state: any) => state.tickets);
  const dispatch = useDispatch<AppDispatch>();
  const { textRTLStyle, viewRTLStyle } = useValues();
  const navigation = useNavigation()
  const { isDark } = useValues()

  useEffect(() => {
    const ticket_id = ticketData.id;
    dispatch(messageDataGet({ ticket_id }))
      .unwrap()
      .then((res: any) => {

        if (res.status == 403) {
          notificationHelper('', translateData.loginAgain, 'error');
          clearValue('token').then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          });
        }
      })
      .catch((error) => {
        console.error('Error in messageDataGet:', error);
      });
  }, []);


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDocumentUpload = useCallback(async () => {
    setTextViewShow(true);
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      setFiles([...files, ...response]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert("Error", translateData.uploadFail);
      }
    }
  }, [files]);

  const TicketReplay = async () => {
    const forme = {
      message: inputText,
      attachments: files,
      ticket_id: messageData?.id,
    };

    setFiles();
    setInputText();
    setTextViewShow(false);
    const token = await getValue("token");
    try {
      const formData = new FormData();

      formData.append("message", forme.message);

      if (forme.attachments && forme.attachments.length > 0) {
        forme.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, {
            uri: file.uri,
            name: file.name || `file-${index}`,
            type: file.type || "application/octet-stream",
          });
        });
      }
      formData.append("ticket_id", forme.ticket_id);

      const response = await fetch(`${URL}/api/ticket/reply`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(ticketDataGet());
      dispatch(messageDataGet({ ticket_id: forme.ticket_id }));

      const responseData = await response.json();
      if (response.ok) {
        dispatch(ticketDataGet());
        dispatch(messageDataGet({ ticket_id: forme.ticket_id }));
      } else {
        notificationHelper('', responseData?.message, 'error');
      }

    } catch (error) {
      notificationHelper('', translateData.tryAgainOtp, 'error');
      console.error("TicketReplay error:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
    return formattedTime;
  };


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
      notificationHelper("", translateData.imageDownloads, "success");

      if (Platform.OS === 'ios') {
        try {
          await RNBlobUtil.fs.unlink(response.path());
        } catch (cleanupError) {
          console.warn("Cleanup error:", cleanupError);
        }
      }

    } catch (error) {
      notificationHelper("", translateData.ImageDownloadFail, "error");
    }
  };



  const renderItem = ({ item }: { item: any }) => (
    (
      <View style={[styles.cardContainer, { backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
        <View style={[{ flexDirection: viewRTLStyle }]}>
          <View style={[styles.userInfoContainer, { flexDirection: viewRTLStyle }]}>
            <View style={styles.userRound}>
              <Text style={styles.user}>
                {item?.created_by?.name?.charAt(0) ?? ''}
              </Text>
            </View>
            <View style={styles.userTextContainer}>
              <Text style={[styles.userName, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{item?.created_by?.name}</Text>
              <Text style={styles.date}>{formatDate(item?.created_at)}</Text>
            </View>
          </View>
          <View style={styles.ticketContainer}>
            <Text style={styles.ticketId}>#{ticketData?.ticket_number}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.description}>{item?.message}</Text>
          <View>
            <View
              style={[styles.downloadFileView, {
                flexDirection: viewRTLStyle
              }]}
            >
              {item?.media?.map((fileUrl, index) => (
                <View
                  key={index}
                  style={[styles.imageContainer, { flexDirection: viewRTLStyle }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}
                >
                  <Image
                    style={styles.image}
                    source={{ uri: fileUrl }}
                    resizeMode="cover"
                  />
                  <View style={styles.filenameView}>
                    <Text
                      style={{
                        color: isDark ? appColors.darkText : appColors.primaryText,
                        fontFamily: appFonts.regular,
                      }}
                    >
                      {fileUrl.split('/').pop()?.substring(0, 10) ?? 'File'}...
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => downloadImageWithBlobUtil(fileUrl)}
                    activeOpacity={0.7}
                  >
                    <Download />
                  </TouchableOpacity>
                </View>
              ))}

            </View>
          </View>
          <Text style={styles.time}>{formatTime(item?.created_at)}</Text>
        </View>
      </View>
    )
  );



  return (
    <View style={external.main}>
      <Header value={translateData.ticketDetails} />
      <View style={[styles.listView, { backgroundColor: isDark ? appColors.bgDark : appColors.lightGray, flex: 1 }]}>
        <FlatList
          data={messageData?.messages}
          keyExtractor={(item) => item?.id}
          renderItem={renderItem}
        />
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          setTextViewShow(true);
        }}
      >
        <View style={[styles.bottomView, { backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
          {textViewShow && (
            <View style={styles.textView}>
              <TextInput
                style={[styles.inputView, { backgroundColor: isDark ? appColors.darkHeader : appColors.whiteColor }, { color: isDark ? appColors.darkText : appColors.primaryText }]}
                placeholder={translateData.type}
                placeholderTextColor={appColors.regularText}
                value={inputText}
                onChangeText={(text) => setInputText(text)}
                autoFocus={true}
                multiline={true}
              />

              <View style={[styles.rowStyles, { flexDirection: textRTLStyle }]}>
                {files?.map((file, index) => {
                  const fileSize = file.size;
                  const sizeFormatted =
                    fileSize < 1024
                      ? `${fileSize} B`
                      : fileSize < 1024 * 1024
                        ? `${(fileSize / 1024).toFixed(2)} KB`
                        : fileSize < 1024 * 1024 * 1024
                          ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB`
                          : `${(fileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`;

                  const handleRemoveFile = (fileIndex: number) => {
                    const updatedFiles = files.filter(
                      (_, i) => i !== fileIndex
                    );
                    setFiles(updatedFiles);
                  };

                  return (
                    <View
                      key={index}
                      style={[
                        styles.imageContainer,
                        { flexDirection: viewRTLStyle },
                      ]}
                    >
                      <Image
                        style={styles.imageUri}
                        source={{ uri: file.uri }}
                      />
                      <TouchableOpacity
                        onPress={() => handleRemoveFile(index)}
                        style={styles.closeIconView}
                        activeOpacity={0.7}
                      >
                        <CloseIcon />
                      </TouchableOpacity>
                      <View
                        style={styles.fileTextView}
                      >
                        <Text style={styles.fileText}>
                          {file?.name.length > 5
                            ? `${file.name.substring(0, 5)}...`
                            : file.name}
                        </Text>
                        <Text style={styles.formatedText}>{sizeFormatted}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={[styles.border, { borderBottomColor: isDark ? appColors.darkBorder : appColors.border }]} />
            </View>
          )}
          <View
            style={[styles.bottomSearchBar, { flexDirection: viewRTLStyle }]}
          >
            <TouchableOpacity
              style={styles.attachment}
              onPress={handleDocumentUpload}
              activeOpacity={0.7}

            >
              <Clip />
            </TouchableOpacity>
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.sendBtn} onPress={TicketReplay} activeOpacity={0.7}
              >
                <Text style={styles.btnTitle}>{translateData.send}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
