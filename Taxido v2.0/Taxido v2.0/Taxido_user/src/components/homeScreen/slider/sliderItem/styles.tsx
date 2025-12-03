import { StyleSheet } from "react-native";
import { commonStyles } from "../../../../styles/commonStyle";
import { external } from "../../../../styles/externalStyle";
import { fontSizes, windowHeight, windowWidth } from "@src/themes";
import { appColors, appFonts } from "@src/themes";

const styles = StyleSheet.create({
  textContainer: {
    ...commonStyles.regularText,
    paddingTop: windowHeight(2),
    ...external.ph_5,
    color: appColors.sliderColor,
    fontSize: fontSizes.FONT17,
  },
  img: {
    width: windowWidth(435),
    height: windowHeight(140),
    marginTop: windowHeight(15),
  },
  itemSeparator: {
    width: windowWidth(25),
  },
  readyText: {
    ...commonStyles.mediumText23,
    ...external.ph_5,
    ...external.mt_5,
    color: appColors.readyText,
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT21,
  },
  bannerContainer: {
    justifyContent: "space-evenly",
    marginHorizontal: windowWidth(8),
  },
});
export { styles };
