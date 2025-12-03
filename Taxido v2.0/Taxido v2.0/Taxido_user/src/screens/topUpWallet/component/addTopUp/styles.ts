import { StyleSheet } from "react-native";
import { appColors, windowHeight, windowWidth, appFonts } from "@src/themes";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    height: "58%",
    justifyContent: "space-between",
  },
  addBalance: {
    fontFamily: appFonts.medium,
  },
  amount: {
    color: appColors.regularText,
    marginVertical: windowHeight(1.5),
    fontFamily: appFonts.regular,
  },
  inputView: {
    alignItems: "center",
    borderRadius: windowWidth(1.5),
    borderWidth: windowHeight(1),
    paddingHorizontal: windowWidth(3),
  },
  textinput: {
    height: windowHeight(6.5),
    fontFamily: appFonts.regular,
    paddingHorizontal: windowWidth(1.5),
  },
});

export default styles;
