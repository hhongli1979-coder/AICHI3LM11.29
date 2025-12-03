import { StyleSheet } from "react-native";
import { commonStyles } from "../../../../styles/commonStyle";
import { appColors, fontSizes, windowHeight, windowWidth, appFonts } from "@src/themes";

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flexContainer,
  },
  headerContainer: {
    height: windowHeight(60),
    justifyContent: "center",
  },
  tagContainer: {
    marginHorizontal: windowWidth(18),
    marginTop: windowHeight(15),
  },
  label: {
    fontFamily: appFonts.bold,
  },
  subLabelContainer: {
    flexWrap: "wrap",
  },
  labelName: {
    color: appColors.primary,
    fontFamily: appFonts.regular,
    marginRight: windowWidth(12),
    paddingHorizontal: windowWidth(18),
    paddingVertical: windowHeight(5),
    backgroundColor: appColors.lightButton,
    borderRadius: windowHeight(4.5),
    marginTop: windowHeight(8),
  },
  detailsContainer: {
    margin: windowHeight(15),
  },
  detailsComonent: {
    height: "95%",
    width: "100%",
    borderRadius: windowHeight(5),
    overflow: "hidden",
  },
  titleContainer: {
    width: "70%",
    padding: windowWidth(18),
  },
  titleBg: {
    alignItems: "flex-start",
  },
  titleCode: {
    color: appColors.primary,
    backgroundColor: appColors.lightButton,
    paddingHorizontal: windowHeight(10),
    paddingVertical: windowHeight(4.5),
    borderRadius: windowHeight(4.2),
    fontFamily: appFonts.medium,
  },
  title: {
    color: appColors.primaryText,
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT24,
    marginTop: windowHeight(10),
  },
  imageContainer: {
    width: "30%",
  },
  discountImage: {
    height: windowHeight(70),
    width: windowHeight(70),
  },
  discription: {
    color: appColors.regularText,
    marginHorizontal: windowWidth(18),
    fontFamily: appFonts.medium,
    marginTop: windowHeight(5),
  },
  dateContainer: {
    marginHorizontal: windowWidth(18),
    textAlign: 'left',
    marginTop: windowHeight(16),
  },
  date: {
    color: appColors.regularText,
    marginTop: windowHeight(5),
  },
  copyBtn: {
    position: "absolute",
    bottom: windowHeight(10),
    left: windowWidth(18),
    right: windowWidth(18),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.lightButton,
    paddingVertical: windowHeight(10),
    borderRadius: windowWidth(8),
  },
  btnText: {
    color: appColors.primary,
    marginHorizontal: windowWidth(10),
    fontFamily: appFonts.bold,
  },
});

export { styles };
