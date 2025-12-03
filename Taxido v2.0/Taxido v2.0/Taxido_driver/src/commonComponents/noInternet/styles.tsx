import { StyleSheet } from "react-native";
import { windowHeight, fontSizes, windowWidth } from "../../theme/appConstant";
import appColors from "../../theme/appColors";
import appFonts from "../../theme/appFonts";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: windowWidth(20),
    backgroundColor: appColors.white,
  },
  image: {
    width: windowHeight(38),
    height: windowHeight(38),
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  title: {
    textAlign: 'center',
    color: appColors.black,
    fontSize: fontSizes.FONT5,
    fontFamily: appFonts.medium,
    top: windowHeight(1)
  },
  details: {
    textAlign: 'center',
    color: appColors.darkBorderBlack,
    fontSize: fontSizes.FONT4,
    fontFamily: appFonts.regular,
    marginTop: windowHeight(2)
  }
})
export default styles;