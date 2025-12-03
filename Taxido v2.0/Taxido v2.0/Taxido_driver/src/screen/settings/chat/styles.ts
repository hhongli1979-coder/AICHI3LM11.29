import { StyleSheet } from 'react-native'
import { fontSizes, windowHeight, windowWidth } from './context'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'

const styles = StyleSheet.create({
  containerMain: { flex: 1 },
  container: {
    flex: 1,
    paddingVertical: windowHeight(9),
    paddingHorizontal: windowWidth(12),
  },
  messageContainer: {
    padding: windowHeight(8),
    marginBottom: windowHeight(9),
    maxWidth: '80%',
  },
  senderMessage: {
    alignSelf: 'flex-end',
    backgroundColor: appColors.primary,
    borderTopLeftRadius: windowHeight(12),
    borderBottomLeftRadius: windowHeight(12),
    borderTopRightRadius: windowHeight(12),
  },
  senderMessageText: {},
  senderMessageTime: {
    color: appColors.secondaryFont,
  },
  receiverMessage: {
    alignSelf: 'flex-start',
    backgroundColor: appColors.white,
    borderTopLeftRadius: windowHeight(12),
    borderBottomRightRadius: windowHeight(12),
    borderTopRightRadius: windowHeight(12),
    marginHorizontal: windowWidth(10),
  },
  receiverMessageText: {
    color: appColors.graybackground,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
  },
  receiverMessageTime: {
    marginTop: windowHeight(5),
    color: appColors.graybackground,
  },
  messageText: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
    color: appColors.primaryFont,
    fontWeight: '400',
  },
  messageTextReceive: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
    color: appColors.white,
    fontWeight: '400',
  },
  inputContainer: {
    alignItems: 'center',
    paddingBottom: windowHeight(20),
    paddingHorizontal: windowHeight(14),
  },
  input: {
    fontWeight: '400',
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT17,
    width: '70%',
  },
  sendButton: {
    width: windowWidth(42),
    height: windowHeight(28),
    backgroundColor: appColors.primary,
    borderRadius: windowHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mic: {
    marginHorizontal: windowWidth(6),
  },
  backButton: {
    width: windowHeight(30),
    height: windowHeight(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(6),
    borderWidth: windowHeight(0.3),
  },
  view_Main: {
    alignItems: 'center',
    paddingHorizontal: 20,
    height: windowHeight(63),
    justifyContent: 'space-between',
  },
  textInputView: {
    height: windowHeight(40),
    elevation: 1,
    width: '100%',
    borderRadius: windowHeight(6),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  templetionStyle: {
    fontWeight: '400',
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT19,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: windowHeight(65),
    marginHorizontal: windowWidth(20),
  },
  modalSub: {
    width: windowWidth(150),
    backgroundColor: appColors.white,
    borderRadius: windowHeight(8.8),
    shadowColor: appColors.primaryFont,
    shadowOffset: { width: windowHeight(0), height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    paddingVertical: windowHeight(5),
    paddingHorizontal: windowWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextView: {
    paddingVertical: windowHeight(12),
    paddingHorizontal: windowWidth(10),
  },
  modalText: {
    color: appColors.primaryFont,
  },
  modalBorder: {
    borderBottomWidth: windowHeight(0.1),
    borderColor: appColors.border,
    width: '100%',
  },
  receiverImage: {
    height: windowHeight(22),
    width: windowWidth(34),
    position: 'absolute',
    bottom: windowHeight(8),
  },
  image: {
    width: windowWidth(30),
    height: windowWidth(30),
    alignSelf: 'flex-start',
    borderWidth: windowHeight(0.1),
    borderRadius: windowWidth(20),
    resizeMode: 'contain',
  },
  mainContainer: {
    marginVertical: windowHeight(0.2),
    marginHorizontal: windowWidth(18),
  },
  listContainer: {
    marginTop: windowHeight(20),
  },
  onlineText: {
    color: appColors.primary,
  },
  riderContainer: {
    marginHorizontal: windowWidth(15),
  },
})
export { styles }
