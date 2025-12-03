import { StyleSheet } from "react-native";
import { windowHeight, windowWidth, appColors, appFonts, fontSizes } from "@src/themes";

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: windowWidth(4),
    justifyContent: 'space-between',
    marginRight: windowWidth(5),
  },
  codeText: {
    fontSize: fontSizes.FONT16,
    color: appColors.primaryText,
    top: windowHeight(0),
    left: windowWidth(0)
  },
  countryCodeContainer: {
    width: windowWidth(100),
    height: windowHeight(42),
    backgroundColor: appColors.lightGray,
    borderRadius: windowHeight(4),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
  },
  inputText: {
    marginHorizontal: windowWidth(5),
    width: '100%',
  },
  phoneNumberInput: {
    width: windowWidth(330),
    backgroundColor: appColors.lightGray,
    borderRadius: windowHeight(4),
    marginHorizontal: windowHeight(9),
    paddingHorizontal: windowHeight(9),
    borderWidth: windowHeight(1),
    height: windowHeight(42),
  },
  iconContainer: {
    height: windowHeight(39),
    width: windowWidth(10),
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: windowHeight(3),
    marginHorizontal: windowWidth(5),
  },
  dialCode: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    left: windowHeight(2),
  },
  emptySpace: {
    height: windowHeight(80),
  },
  sociallogin: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(8),
  },
  socialContainer: {
    justifyContent: "space-between",
    marginTop: windowHeight(10),
  },
  socialView: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: windowHeight(12),
    paddingHorizontal: windowHeight(12),
    borderRadius: windowHeight(5),
    width: "47%",
  },
  faceBook: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: windowHeight(13.2),
    borderRadius: windowHeight(5),
    marginTop: windowHeight(15),
    backgroundColor: appColors.lightGray,
  },
  orImg: {
    width: "100%",
    resizeMode: "contain",
  },
  imgContainer: {
    width: "100%",
    alignItems: "center",
    top: windowHeight(8.3),
    height: windowHeight(40),
  },
  countryCode: {
    justifyContent: "space-between",
    width: windowWidth(55),
  },
  guestImage: {
    height: windowHeight(15),
    width: windowHeight(20),
    resizeMode: "contain",
  },
  warningText: {
    color: appColors.alertRed,
    marginTop: windowHeight(5),
    fontSize: fontSizes.FONT14,
  },
  errorText: {
    color: appColors.alertRed,
    fontSize: fontSizes.FONT4,
  },
  overlay: {
    flex: 1,
    backgroundColor: appColors.modelBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
