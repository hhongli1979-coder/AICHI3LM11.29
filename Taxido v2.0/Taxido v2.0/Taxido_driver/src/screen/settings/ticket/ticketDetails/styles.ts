import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import appFonts from '../../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../chat/context'

const styles = StyleSheet.create({
  textView: {
    paddingVertical: windowHeight(10),
    paddingHorizontal: windowHeight(10),
    borderRadius: windowHeight(5.5),
  },
  inputView: {
    color: appColors.primaryFont,
    fontFamily: appFonts.regular,
    textAlignVertical: 'top',
    backgroundColor: 'white',
    borderRadius: windowHeight(1),
    padding: windowHeight(1),
    height: windowHeight(150),
  },
  border: {
    borderBottomColor: appColors.border,
    borderBottomWidth: windowHeight(0.8),
    paddingTop: windowHeight(10),
    top: windowHeight(8),
  },
  cardContainer: {
    borderWidth: windowHeight(0.1),
    borderColor: appColors.border,
    marginVertical: windowHeight(15),
    margin: windowHeight(15),
    borderRadius: windowHeight(5),
    backgroundColor: appColors.white,
  },
  row: {},
  userInfoContainer: {
    width: '75%',
    padding: windowHeight(8),
  },
  userImage: {
    height: windowHeight(40),
    width: windowHeight(40),
    borderRadius: windowHeight(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.primary
  },
  userTextContainer: {
    marginHorizontal: windowWidth(10),
    justifyContent: 'space-evenly',
  },
  userName: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT19,
  },
  date: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
  ticketContainer: {
    width: '25%',
    paddingVertical: windowHeight(8),
    paddingHorizontal: windowWidth(10),
    alignItems: 'flex-end',
  },
  ticketId: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT21,
  },
  title: {
    color: 'black',
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT20,
    marginHorizontal: windowWidth(15),
  },
  message: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT19,
    marginHorizontal: windowWidth(15),
    marginTop: windowHeight(5),
  },
  description: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT16,
    marginHorizontal: windowWidth(15),
    marginTop: windowHeight(6),
  },
  time: {
    fontFamily: appFonts.regular,
    color: appColors.secondaryFont,
    fontSize: fontSizes.FONT18,
    marginTop: windowHeight(10),
    marginHorizontal: windowWidth(15),
    marginBottom: windowHeight(5.5),
  },
  btnContainer: {
    width: '95%',
    padding: windowHeight(8),
  },
  sendBtn: {
    backgroundColor: appColors.primary,
    width: windowWidth(100),
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: windowHeight(4),
    alignSelf: 'flex-end',
    paddingVertical: windowHeight(6),
    height: windowHeight(28),
    top: windowHeight(2),
  },
  line: {
    width: '91%',
    borderTopWidth: windowHeight(0.9),
    bottom: windowHeight(4),
    right: windowHeight(0.8),
  },
  btnTitle: {
    color: appColors.white,
    fontFamily: appFonts.regular,
  },
  attachment: {
    width: '5%',
    justifyContent: 'center',
    right: windowHeight(5),
  },
  bottomSearchBar: {
    width: '100%',
    justifyContent: 'space-between',
    height: windowHeight(48),
    borderBottomLeftRadius: windowHeight(8),
    borderBottomRightRadius: windowHeight(8),
  },
  fileContainer: {
    marginTop: windowHeight(1.5),
    flexWrap: 'wrap',
    gap: windowWidth(2),
    marginHorizontal: windowWidth(3),
  },
  mainContainer: {
    width: windowHeight(130),
    alignItems: 'center',
    borderRadius: windowHeight(4),
    paddingHorizontal: windowWidth(8),
    paddingVertical: windowHeight(5),
    borderWidth: windowHeight(0.1),
    marginTop: windowHeight(10),
    marginHorizontal: windowHeight(5.9),
  },
  imageStyle: {
    height: windowHeight(30),
    width: windowHeight(30),
    borderRadius: windowHeight(1),
  },
  textContainer: {
    marginHorizontal: windowHeight(7),
    flex: 1,
  },
  sizeFormatted: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
  file_Name: { fontFamily: appFonts.regular },
  downloadIcon: { right: windowHeight(2) },
  list: { flex: 1, marginBottom: windowHeight(85) },
  screenMainContainer: { flex: 1 },
  textViewShow: {
    position: 'absolute',
    bottom: windowHeight(10),
    marginVertical: windowHeight(3),
    borderRadius: windowHeight(8),
    borderWidth: windowHeight(0.1),
    width: '91%',
    alignSelf: 'center',
  },
  fileFormat: {
    marginTop: windowHeight(1),
    flexWrap: 'wrap',
    gap: windowWidth(2),
  },
  viewContainer: {
    width: windowWidth(190),
    alignItems: 'center',
    borderRadius: windowHeight(10),
    paddingHorizontal: windowWidth(10),
    paddingVertical: windowHeight(4),
    borderWidth: windowHeight(1),
  },
  img: {
    height: windowHeight(35),
    width: windowHeight(35),
    borderRadius: windowHeight(1),
  },
  removeFile: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.modelBg,
    height: windowHeight(15),
    width: windowHeight(15),
    position: 'absolute',
    top: windowHeight(4),
    left: windowWidth(10),
    borderTopLeftRadius: windowHeight(1),
    borderBottomRightRadius: windowHeight(1),
  },
  fileTextContainer: {
    marginHorizontal: windowWidth(1),
    flex: 1,
  },
  fileName: {
    color: appColors.primaryFont,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(5)

  },
  sizeFormattedText: {
    color: appColors.primaryFont,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(5)
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  user: {
    color: appColors.white,
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT25
  }
})

export default styles
