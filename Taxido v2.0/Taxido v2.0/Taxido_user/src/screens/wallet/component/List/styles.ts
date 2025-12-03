import { Platform, StyleSheet } from "react-native";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
  dataView: {
    maxHeight: windowHeight(379),
    marginHorizontal: windowWidth(20),
    borderRadius: windowHeight(7),
    marginTop: windowHeight(10),
    overflow: "hidden",
    borderWidth: windowHeight(1),
    marginBottom: windowHeight(85),
  },
  list: {
    justifyContent: "space-between",
    marginHorizontal: windowWidth(20),
    marginVertical: windowHeight(10),
  },
  receiptView: {
    height: windowHeight(35),
    width: windowWidth(50),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(9),
  },
  detailView: {
    marginHorizontal: windowWidth(10),
    justifyContent: "space-around",
  },
  description: {
    fontSize: fontSizes.FONT16,
    fontFamily: appFonts.medium,
    width: windowWidth(200),
  },
  amountView: {
    height: windowHeight(35),
    width: windowWidth(100),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(9),
  },
  amount: {
    fontSize: fontSizes.FONT20,
    fontFamily: appFonts.medium,
  },
  icons: {
    marginTop: windowHeight(4),
    height: windowHeight(16),
    width: windowHeight(16),
  },
  dash: {
    marginHorizontal: windowWidth(20),
    borderBottomWidth: 0.9,
    borderStyle: Platform.OS === 'ios' ? "solid" : "dashed",
    marginTop: windowHeight(2),
  },
  bgStyle: {
    backgroundColor: appColors.border,
    alignItems: "center",
  },
});

export default styles;
