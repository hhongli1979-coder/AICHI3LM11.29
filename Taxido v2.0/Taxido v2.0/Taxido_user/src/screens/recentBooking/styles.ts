import { Platform, StyleSheet } from "react-native";
import { appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { commonStyles } from "../../styles/commonStyle";
import { appColors } from "@src/themes";

const styles = StyleSheet.create({
  icon: {
    borderStyle: "dotted",
    height: windowHeight(20),
    borderLeftWidth: windowHeight(0.9),
    marginHorizontal: windowHeight(5),
    borderLeftColor: appColors.regularText,
  },
  itemStyle: {
    ...commonStyles.regularText,
    fontWeight: "100",
    fontSize: fontSizes.FONT16,
    color: appColors.primaryText,
    width: "44%",
  },
  dashedLine: {
    height: 1,
    width: "100%",
    borderBottomWidth: windowHeight(1),
    borderColor: appColors.primaryGray,
    borderStyle: Platform.OS === 'ios' ? "solid" : "dashed",
    marginVertical: windowHeight(8),
  },
  pickUpLocationStyles: {
    ...commonStyles.regularText,
    fontWeight: "300",
    fontSize: fontSizes.FONT16,
    color: appColors.primaryText,
    width: windowWidth(350),
  },
  mainContainer: { bottom: windowHeight(6) },
  recentRides: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT22,
    marginHorizontal: windowWidth(24),
    marginTop: windowHeight(6),
  },
  container: { paddingHorizontal: windowHeight(2.5) },
  buttonContainer: {
    marginTop: windowHeight(6),
    paddingBottom: windowHeight(3),
    backgroundColor: appColors.primary,
    height: windowHeight(40),
    borderRadius: windowHeight(5),
    justifyContent: "center"
  },
  border: {
    borderBottomWidth: windowHeight(1),
    borderColor: appColors.border,
    borderStyle: Platform.OS === 'ios' ? "solid" : "dashed",
    marginTop: windowHeight(10),
  },
  clockSmall: {
    marginHorizontal: windowWidth(5)
  },
  date: {
    fontFamily: appFonts.regular,
    color: appColors.gray
  },
  textId: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17
  },
  price: {
    fontFamily: appFonts.medium,
    color: appColors.price
  },
  view: {
    padding: windowHeight(10),
    borderWidth: windowHeight(1),
    margin: windowHeight(12),
    borderRadius: windowHeight(5),
    marginBottom: windowHeight(0),
  },
  viewWidth: { width: "65%" },
  viewWidth1: { width: "35%" },
  textView: {
    marginHorizontal: windowWidth(10),
    justifyContent: "space-evenly",
  },
  imageView: {
    height: windowHeight(50),
    width: windowHeight(50),
    borderRadius: windowHeight(5),
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    height: windowHeight(45),
    width: windowWidth(45),
    resizeMode: "contain",
  },
  clockSmallView: {
    justifyContent: "flex-end",
    marginTop: windowHeight(3)
  },
  clockSmallView1: {
    justifyContent: "flex-end"
  },
});

export { styles };
