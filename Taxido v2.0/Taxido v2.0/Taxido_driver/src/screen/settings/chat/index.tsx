import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  BackHandler,
  ActivityIndicator,
  ScrollView,
  Modal,
  Pressable
} from 'react-native'
import appColors from '../../../theme/appColors'
import { useValues } from '../../../utils/context'
import { styles } from './styles'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icons from '../../../utils/icons/icons'
import { useTheme } from '@react-navigation/native'
import Images from '../../../utils/images/images'
import { useSelector } from 'react-redux'
import { useAppNavigation } from '../../../utils/navigation'
import { initializeApp } from "firebase/app"
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { launchImageLibrary } from "react-native-image-picker"
import { firebaseConfig } from '../../../../firebase'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export function Chat() {
  const route = useRoute()
  const { driverId, riderId, rideId, riderName, riderImage, from }: any = route.params || {}
  const { goBack } = useAppNavigation()
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null) // ✅ Fullscreen image state
  const { colors } = useTheme()
  const { viewRtlStyle, textRtlStyle, rtl, isDark } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)
  const navigation = useNavigation()

  // 🔹 Back handler
  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack()
        return true
      }
      return false
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
    return () => backHandler.remove()
  }, [navigation])

  const ride_Id = `${rideId}`
  const currentUserId = `${driverId}`
  const chatWithUserId = `${riderId}`
  const adminId = 1
  const chatId =
    from && from === "help"
      ? [adminId, currentUserId].sort().join('_')
      : [ride_Id, currentUserId, chatWithUserId].sort().join('_')

  const messagesRef = collection(db, "chats", chatId, "messages")

  // 🔹 Listen for messages
  useEffect(() => {
    const q = query(messagesRef, orderBy("timestamp", "desc"))
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        console.log("🔥 Snapshot messages:", JSON.stringify(fetchedMessages, null, 2))
        setMessages(fetchedMessages)
        setLoading(false)
      },
      (err) => {
        console.log("❌ Firestore snapshot error:", err)
        setError("Error fetching messages: " + err.message)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [chatId])

  // 🔹 Pick multiple images
  const pickImages = async () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, (response) => {
      console.log("📸 Image Picker Response:", response);

      if (response.didCancel) {
        console.log("❌ User cancelled image picker");
        return;
      }
      if (response.errorMessage) {
        console.log("⚠️ Image Picker Error:", response.errorMessage);
        setError(response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const uris = response.assets.map(asset => asset.uri!).filter(Boolean);
        console.log("✅ Selected URIs:", uris);
        setSelectedImages(prev => [...prev, ...uris]);
      }
    });
  };

  // 🔹 Convert URI → Blob
  const uriToBlob = (uri: string) => {
    return new Promise<Blob>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"))
      }
      xhr.responseType = "blob"
      xhr.open("GET", uri, true)
      xhr.send(null)
    })
  }

  // 🔹 Upload images to Firebase
  const uploadImagesToStorage = async (uris: string[]) => {
    const urls: string[] = []
    setUploading(true)
    try {
      for (const uri of uris) {
        const filename = `${chatId}/${Date.now()}_${Math.random()}.jpg`
        const storageRef = ref(storage, `chatImages/${filename}`)
        const blob = await uriToBlob(uri)
        await uploadBytes(storageRef, blob)
        const downloadURL = await getDownloadURL(storageRef)
        urls.push(downloadURL)
      }
    } catch (err) {
      setError("Image upload failed: " + (err as any).message)
    }
    setUploading(false)
    return urls
  }

  // 🔹 Send message (text + images)
  const sendMessage = async () => {
    if (!input.trim() && selectedImages.length === 0) return
    try {
      let imageUrls: string[] = []
      if (selectedImages.length > 0) imageUrls = await uploadImagesToStorage(selectedImages)

      const messageData: any = { senderId: currentUserId, timestamp: serverTimestamp() }
      if (input.trim()) messageData.message = input.trim()
      if (imageUrls && imageUrls.length > 0) messageData.images = [...imageUrls]

      await addDoc(messagesRef, messageData)

      if (from === "help") {
        await setDoc(
          doc(db, "chats", chatId),
          {
            lastMessage: { ...messageData, senderName: riderName, receiverName: "administrator" },
            participants: [String(adminId), currentUserId],
            unreadCount: { 1: 1, [currentUserId]: 0 },
          },
          { merge: true }
        )
      }

      setInput("")
      setSelectedImages([])
    } catch (err: any) {
      setError("Failed to send message: " + err.message)
    }
  }

  // 🔹 Reset unread count
  useEffect(() => {
    if (!chatId || !currentUserId) return
    updateDoc(doc(db, "chats", chatId), { [`unreadCount.${currentUserId}`]: 0 })
      .catch(err => console.log("Error resetting unread count:", err))
  }, [chatId, currentUserId])

  return (
    <View style={styles.containerMain}>
      {/* Header */}
      <View style={[styles.view_Main, { backgroundColor: colors.card, flexDirection: viewRtlStyle }]}>
        <View style={{ flexDirection: viewRtlStyle }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={goBack}
          >
            <Icons.Back color={colors.text} />
          </TouchableOpacity>
          <View style={styles.riderContainer}>
            <Text style={[styles.templetionStyle, { textAlign: textRtlStyle, color: colors.text }]}>
              {from && from === "help" ? "Administrator" : riderName}
            </Text>
            <Text style={[styles.onlineText, { textAlign: textRtlStyle }]}>
              {translateData.online}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        inverted
        data={messages}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        style={styles.listContainer}
        renderItem={({ item }) => {
          const timestamp = item.timestamp?.seconds
            ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
            : `${translateData.sending}`

          return (
            <View style={[styles.mainContainer, { flexDirection: item.senderId === currentUserId ? 'row-reverse' : 'row' }]}>
              {item.senderId !== currentUserId && (
                <Image
                  source={riderImage ? { uri: riderImage } : Images.ProfileDefault}
                  style={[styles.image, { borderColor: colors.border }]}
                />
              )}

              <View style={[
                styles.messageContainer,
                item.senderId === currentUserId
                  ? styles.senderMessage
                  : [styles.receiverMessage, { backgroundColor: isDark ? appColors.darkThemeSub : appColors.white }]
              ]}>
                {item.message && (
                  <Text style={[
                    styles.messageText,
                    item.senderId !== currentUserId
                      ? [styles.senderMessageText, { color: isDark ? appColors.darkText : appColors.primaryFont }, { textAlign: rtl ? 'right' : 'left' }]
                      : [styles.receiverMessageText, { color: isDark ? appColors.white : appColors.graybackground }],
                  ]}>
                    {item.message}
                  </Text>
                )}

                {/* multiple images with tap for full screen */}
                {item.images && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                    {(Array.isArray(item.images) ? item.images : [item.images]).map((img: string, idx: number) => (
                      <TouchableOpacity key={idx} onPress={() => setFullScreenImage(img)}>
                        <Image source={{ uri: img }} style={{ width: 120, height: 120, borderRadius: 8, margin: 3 }} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={[
                  styles.messageText,
                  item.senderId !== currentUserId
                    ? [styles.senderMessageTime, { textAlign: rtl ? 'right' : 'left' }]
                    : [styles.receiverMessageTime, { textAlign: rtl ? 'left' : 'right' }],
                ]}>
                  {timestamp}
                </Text>
              </View>
            </View>
          )
        }}
      />

      {/* Selected image previews before sending */}
      {selectedImages.length > 0 && (
        <ScrollView horizontal style={{ padding: 5 }}>
          {selectedImages.map((uri, idx) => (
            <Image key={idx} source={{ uri }} style={{ width: 70, height: 70, borderRadius: 8, marginRight: 5 }} />
          ))}
        </ScrollView>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.background, flexDirection: viewRtlStyle }]}>
        <View style={[styles.textInputView, { backgroundColor: colors.card, flexDirection: viewRtlStyle }]}>
          <TouchableOpacity activeOpacity={0.7} onPress={pickImages}>
            <Icons.Apple />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { textAlign: textRtlStyle, color: colors.text }]}
            value={input}
            onChangeText={setInput}
            placeholder={`${translateData.typeHere}`}
            multiline
            placeholderTextColor={appColors.secondaryFont}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} activeOpacity={0.7}>
            <Icons.SendChat />
          </TouchableOpacity>
        </View>
      </View>

      {uploading && <ActivityIndicator size="small" color={appColors.primary} style={{ marginVertical: 10 }} />}

      {/* Fullscreen modal */}
      <Modal
        visible={!!fullScreenImage}
        transparent
        animationType="fade"
        onRequestClose={() => setFullScreenImage(null)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setFullScreenImage(null)}
        >
          {fullScreenImage && (
            <Image
              source={{ uri: fullScreenImage }}
              style={{ width: '95%', height: '80%', resizeMode: 'contain', borderRadius: 10 }}
            />
          )}
        </Pressable>
      </Modal>
    </View>
  )
}