import { StyleSheet } from "react-native";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  codeText: {
    fontSize: fontSizes.FONT16,
    color: appColors.primaryText,
    top: windowHeight(0),
    textAlign: "center",
    width: windowWidth(100),
  },
  countryCodeContainer: {
    marginTop: windowHeight(17),
  },
  referral: {
    bottom: windowHeight(6.9)
  },
  btn: {
    marginVertical: windowHeight(15),
  },
  confirmPasswordView: {
    bottom: windowHeight(6.9),
  },
  passwordView: {
    bottom: windowHeight(5.3),
  },
  emailView: {
    bottom: windowHeight(1),
  },
  numberTitle: {
    top: windowHeight(14.3),
    fontFamily: appFonts.medium,
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
  countryCodeContainer1: {
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
    width: "100%",
  },
  countryCode: {
    justifyContent: "space-between",
    width: windowWidth(55),
  },
  warningText: {
    color: appColors.alertRed,
    marginTop: windowHeight(5),
    fontSize: fontSizes.FONT14SMALL,
  },
  placeholderStyles: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
  },
  text: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT14,
  },
  container: {
    marginBottom: windowHeight(0),
  },
  errorText: {
    color: appColors.alertRed,
    fontSize: fontSizes.FONT15,
    marginTop: 4,
  },
});

export default styles;
