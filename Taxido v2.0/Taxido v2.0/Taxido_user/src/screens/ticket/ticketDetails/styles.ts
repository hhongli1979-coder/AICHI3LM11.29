import { StyleSheet } from "react-native";
import {
  appColors,
  fontSizes,
  windowHeight,
  windowWidth,
  appFonts,
} from "@src/themes";

const styles = StyleSheet.create({
  textView: {
    paddingVertical: windowHeight(10),
    paddingHorizontal: windowHeight(10),
  },
  inputView: {
    color: appColors.primaryText,
    fontFamily: appFonts.regular,
    textAlignVertical: "top",
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(1),
    padding: windowHeight(1),
    height: windowHeight(150),
  },
  border: {
    borderBottomWidth: windowHeight(0.9),
    paddingTop: windowHeight(10),
    marginBottom: windowHeight(-10),
  },
  cardContainer: {
    borderWidth: windowHeight(1),
    marginVertical: windowHeight(15),
    margin: windowHeight(13),
    borderRadius: windowHeight(5.8),
  },
  userInfoContainer: {
    width: "75%",
    padding: windowHeight(10),
  },
  userImage: {
    height: windowHeight(40),
    width: windowHeight(40),
    borderRadius: windowHeight(25),
  },
  userTextContainer: {
    marginHorizontal: windowWidth(15),
    justifyContent: "space-evenly",
  },
  userName: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT19,
  },
  date: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
  },
  ticketContainer: {
    width: "24%",
    paddingHorizontal: windowHeight(6),
    paddingVertical: windowHeight(8),
    alignItems: "flex-end",
  },
  ticketId: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT21,
  },
  title: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT20,
    marginHorizontal: windowWidth(15),
  },
  description: {
    color: appColors.regularText,
    fontSize: fontSizes.FONT18,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(15),
    marginTop: windowHeight(5),
  },
  fileTextView: { marginHorizontal: windowWidth(5), flex: 1 },
  closeIconView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.modelBg,
    height: windowHeight(12),
    width: windowHeight(12),
    position: "absolute",
    top: windowHeight(3),
    left: windowWidth(5),
    borderTopLeftRadius: windowHeight(5),
    borderBottomRightRadius: windowHeight(5),
  },
  imageUri: {
    height: windowHeight(30),
    width: windowHeight(30),
    borderRadius: windowHeight(5),
  },
  listView: { paddingBottom: windowHeight(70) },
  time: {
    fontFamily: appFonts.regular,
    color: appColors.regularText,
    fontSize: fontSizes.FONT18,
    textAlign: "right",
    marginTop: windowHeight(2),
    marginHorizontal: windowWidth(15),
    marginBottom: windowHeight(10),
  },
  btnContainer: {
    width: "95%",
    padding: windowHeight(8),
  },
  sendBtn: {
    backgroundColor: appColors.primary,
    width: windowWidth(100),
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: windowHeight(5),
    alignSelf: "flex-end",
    paddingVertical: windowHeight(6),
    height: windowHeight(28),
  },
  btnTitle: {
    color: appColors.whiteColor,
    fontFamily: appFonts.medium,
  },
  attachment: {
    width: "5%",
    padding: windowHeight(5),
    justifyContent: "center",
  },
  bottomSearchBar: {
    width: "100%",
    justifyContent: "space-between",
    height: windowHeight(45),
  },
  imageContainer: {
    borderColor: appColors.border,
    borderWidth: windowHeight(1),
    width: windowWidth(170),
    alignItems: "center",
    borderRadius: windowHeight(5),
    paddingHorizontal: windowWidth(5),
    paddingVertical: windowHeight(3),
  },
  image: {
    height: windowHeight(30),
    width: windowHeight(30),
    borderRadius: windowHeight(5),
  },
  filenameView: {
    marginHorizontal: windowWidth(5),
    flex: 1,
  },
  textStyle: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT14,
  },
  bottomView: {
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    marginVertical: windowHeight(15),
    margin: windowHeight(15),
    borderRadius: windowHeight(5),
    position: "absolute",
    bottom: windowHeight(5),
  },
  rowStyles: {
    marginTop: windowHeight(5),
    flexWrap: "wrap",
    gap: windowWidth(10),
  },
  formatedText: {
    color: appColors.primaryText,
    fontFamily: appFonts.regular,
  },
  fileText: {
    color: appColors.primaryText,
    fontFamily: appFonts.regular,
  },
  downloadFileView: {
    marginTop: windowHeight(10),
    flexWrap: "wrap",
    gap: windowWidth(10),
    marginHorizontal: windowWidth(15),
  },
  userRound: {
    height: windowHeight(40),
    width: windowHeight(40),
    borderRadius: windowHeight(25),
    backgroundColor: appColors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  user: {
    color: appColors.whiteColor,
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT22
  }
});

export default styles;
