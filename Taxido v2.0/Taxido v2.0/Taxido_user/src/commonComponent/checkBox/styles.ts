import { StyleSheet } from "react-native";
import { windowHeight, windowWidth, appFonts, fontSizes, appColors } from "@src/themes";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  checkbox: {
    height: windowHeight(20),
    width: windowHeight(20),
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    borderRadius: windowHeight(5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: appColors.whiteColor,
  },
  checkedCheckbox: {
    backgroundColor: appColors.primary,
    borderColor: appColors.border,
  },
  tickContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    color: appColors.whiteColor,
    fontSize: fontSizes.FONT20,
    fontWeight: "bold",
  },
  label: {
    marginHorizontal: windowWidth(10),
    color: appColors.primaryText,
    fontSize: fontSizes.FONT20,
    fontFamily: appFonts.regular,
  },
})
export default styles;