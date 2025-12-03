import { StyleSheet } from "react-native";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { SCREEN_WIDTH } from "@src/themes/appConstant";

const style = StyleSheet.create({
  otpTextInput: {
    backgroundColor: appColors.lightGray,
    borderColor: appColors.lightGray,
    borderWidth: windowHeight(1),
    borderRadius: windowHeight(6),
    width: windowWidth(60),
    height: windowHeight(40),
    borderBottomWidth: windowHeight(0.3),
    color: appColors.primaryText,
    textAlign: "center",
    fontSize: fontSizes.FONT22,
    marginTop: windowHeight(10),
    fontFamily: appFonts.bold,
  },
  inputContainer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  otpContainer: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  otpInput: {
    borderRadius: windowHeight(5),
    textAlign: "center",
    textAlignVertical: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontSize: windowWidth(23),
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
    borderBottomWidth: windowWidth(2),
    borderWidth: windowWidth(2)
  },
  otpTitle: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT19,
    paddingTop: windowHeight(25),
  },
});
export { style };
