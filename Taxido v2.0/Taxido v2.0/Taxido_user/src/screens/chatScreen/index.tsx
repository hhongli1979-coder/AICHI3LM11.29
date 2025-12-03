import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, BackHandler, ScrollView, ActivityIndicator } from 'react-native';
import { commonStyles } from '../../styles/commonStyle';
import { external } from '../../styles/externalStyle';
import { Back, Send, ImagePick } from '@utils/icons';
import { appColors, windowHeight } from '@src/themes';
import { useValues } from '@src/utils/context/index';
import { styles } from './styles';
import Images from '@utils/images';
import { useAppNavigation } from '@src/utils/navigation';
import '@react-native-firebase/app';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, addDoc, setDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";
import { firebaseConfig } from "../../../firebase";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export function ChatScreen() {
  const { goBack } = useAppNavigation();
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { driverId, riderId, rideId, driverName, driverImage, from }: any = route.params || {};
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { bgFullStyle, bgFullLayout, textColorStyle, viewRTLStyle, textRTLStyle, bgContainer, isDark, isRTL } = useValues();
  const { translateData } = useSelector((state: any) => state.setting);
  const { self } = useSelector((state: any) => state.account);
  const inputRef = useRef<TextInput>(null);
  const currentUserId = `${riderId}`;
  const adminId = "1";
  const chatWithUserId = from === "help" ? adminId : `${driverId}`;
  const ride_Id = `${rideId}`;
  const chatId =
    from === "help"
      ? [adminId, currentUserId].sort().join('_')
      : [ride_Id, currentUserId, chatWithUserId].sort().join('_');

  const messagesRef = collection(db, "chats", chatId, "messages");

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const q = query(messagesRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(fetchedMessages);
    });
    return () => unsubscribe();
  }, [chatId]);

  const pickImages = async () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, response => {
      if (response.didCancel) return;
      if (response.errorMessage) return;
      if (response.assets && response.assets.length > 0) {
        const uris = response.assets.map(asset => asset.uri!).filter(Boolean);
        setSelectedImages(prev => [...prev, ...uris]);
      }
    });
  };

  const uriToBlob = (uri: string) => new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error("uriToBlob failed"));
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const uploadImagesToStorage = async (uris: string[]) => {
    const urls: string[] = [];
    setUploading(true);
    try {
      for (const uri of uris) {
        const filename = `${chatId}/${Date.now()}_${Math.random()}.jpg`;
        const storageRef = ref(storage, `chatImages/${filename}`);
        const blob = await uriToBlob(uri);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        urls.push(downloadURL);
      }
    } catch (err) {
    }
    setUploading(false);
    return urls;
  };

  const sendMessage = async () => {
    if (!input.trim() && selectedImages.length === 0) return;

    try {
      const imageUrls = selectedImages.length > 0 ? await uploadImagesToStorage(selectedImages) : [];

      const receiverId = from === "help" ? adminId : driverId;
      const receiverName = from === "help" ? "Administrator" : driverName || "Driver";

      const messageData: any = {
        message: input.trim() || '',
        images: imageUrls || [],
        senderId: currentUserId,
        senderName: self?.name || "Rider",
        receiverId,
        receiverName,
        timestamp: serverTimestamp(),
      };

      await addDoc(messagesRef, messageData);

      await setDoc(doc(db, "chats", chatId), {
        lastMessage: messageData,
        participants: from === "help" ? [adminId, currentUserId] : [currentUserId, driverId],
        unreadCount: { [receiverId]: 1, [currentUserId]: 0 },
      }, { merge: true });

      setInput('');
      setSelectedImages([]);
    } catch (err) {
    }
  };

  return (
    <View style={[commonStyles.flexContainer]}>
      <View style={[styles.view_Main, { backgroundColor: bgFullStyle, flexDirection: viewRTLStyle }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.backButton, { borderColor: isDark ? appColors.darkBorder : appColors.border }, { backgroundColor: isDark ? bgContainer : appColors.lightGray }]}
          onPress={goBack}>
          <Back />
        </TouchableOpacity>
        <View style={[external.mh_10, external.fg_1]}>
          <Text style={[styles.templetionStyle, { color: textColorStyle, textAlign: textRTLStyle }]}>
            {from == "help" ? "Administrator" : driverName}
          </Text>
          <Text style={[commonStyles.mediumTextBlack12, external.mt_2, { color: appColors.primary, textAlign: textRTLStyle }]}>
            {translateData.online}
          </Text>
        </View>
      </View>

      <View style={{ backgroundColor: isDark ? appColors.primaryText : appColors.lightGray, flex: 1 }}>
        <FlatList
          inverted
          data={messages}
          keyExtractor={item => item.id}
          style={styles.listStyle}
          renderItem={({ item }) => {
            const timestamp = item.timestamp
              ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
              : translateData.sending;

            return (
              <View style={[styles.mainView, { flexDirection: item.senderId === currentUserId ? 'row-reverse' : 'row' }]}>
                {item.senderId !== currentUserId && (
                  <Image source={driverImage ? { uri: driverImage } : Images.defultImage} style={[styles.imageStyle, { borderColor: colors.border }]} />
                )}
                <View style={[styles.messageContainer, item.senderId === currentUserId ? styles.senderMessage : styles.receiverMessage]}>
                  {item.message !== '' && (
                    <Text style={[styles.messageText, item.senderId !== currentUserId ? styles.senderMessageText : styles.receiverMessageText, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {item.message}
                    </Text>
                  )}
                  {item.images && Array.isArray(item.images) && item.images.length > 0 && (
                    <ScrollView horizontal style={{ marginVertical: 5 }}>
                      {item.images.map((img: string, idx: number) => (
                        <Image key={idx} source={{ uri: img }} style={{ width: 120, height: 120, borderRadius: 8, marginRight: 5 }} />
                      ))}
                    </ScrollView>
                  )}
                  <Text style={[styles.messageText, item.senderId !== currentUserId ? styles.senderMessageTime : styles.receiverMessageTime, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {timestamp}
                  </Text>
                </View>
              </View>
            );
          }}
          removeClippedSubviews={true}
        />

        {selectedImages.length > 0 && (
          <ScrollView horizontal style={{ padding: windowHeight(10) }}>
            {selectedImages.map((uri, idx) => (
              <Image key={idx} source={{ uri }} style={{ width: windowHeight(50), height: windowHeight(50), borderRadius: windowHeight(5), margin: windowHeight(5) }} />
            ))}
          </ScrollView>
        )}

        <View style={[styles.inputContainer, { backgroundColor: isDark ? appColors.primaryText : appColors.lightGray }, { flexDirection: viewRTLStyle }]}>
          <View style={[styles.textInputView, { backgroundColor: bgFullStyle, flexDirection: viewRTLStyle }]}>
            <View style={styles.inputView}>
              <TouchableOpacity style={styles.emojiView} activeOpacity={0.7} onPress={pickImages}>
                <ImagePick />
              </TouchableOpacity>
              <TextInput
                ref={inputRef}
                style={[styles.input, { textAlign: textRTLStyle, color: textColorStyle }]}
                value={input}
                onChangeText={setInput}
                placeholder={translateData.typeHere}
                multiline
                placeholderTextColor={appColors.subtitle}
              />
            </View>
            <View style={styles.sendBtnView}>
              {uploading ? (
                <ActivityIndicator size="small" color={appColors.primary} />
              ) : (
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage} activeOpacity={0.7}>
                  <Send />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}