import { StyleSheet } from "react-native";
import {
  appColors,
  appFonts,
  fontSizes,
  windowHeight,
  windowWidth,
} from "@src/themes";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginTop: windowHeight(22),
  },
  backBtn: {
    height: windowHeight(32),
    width: windowWidth(48),
    position: "absolute",
    borderRadius: windowHeight(6),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.whiteColor,
    marginTop: windowHeight(16),
    marginHorizontal: windowWidth(19),
    borderColor: appColors.border,
    borderWidth: windowHeight(1),
  },
  headerTitle: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT28,
    color: appColors.primaryText,
  },
  banner: {
    width: "100%",
    height: windowHeight(50),
    backgroundColor: appColors.whiteColor,
    marginTop: windowHeight(21),
    paddingTop: windowHeight(7),
  },
  bannerTitle: {
    fontFamily: appFonts.medium,
    color: appColors.primaryText,
    textAlign: "center",
    fontSize: fontSizes.FONT22,
  },
  dropdownRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: windowHeight(10),
  },
  dropdownWrapper: {
    marginHorizontal: windowHeight(3.5),
  },
  dropdownContainer: {
    height: windowHeight(34),
    width: windowWidth(250),
  },
  dropdownContainer2: {
    height: windowHeight(34),
    width: windowWidth(190),
  },
  dropdown: {
    borderColor: appColors.border,
    height: windowHeight(34),
  },
  dropDownText: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
  },
  lineContainer: {
    justifyContent: "space-around",
    marginHorizontal: windowWidth(20),
  },
  subContainer: {
    borderWidth: windowHeight(1),
    borderRadius: windowHeight(5),
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth(300),
  },
  title: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    textAlign: "left",
    marginTop: windowHeight(20),
    marginHorizontal: windowHeight(4),
  },
  selectDate: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
    marginTop: windowHeight(8),
    marginBottom: windowHeight(8),
    marginHorizontal: windowWidth(20),
    fontSize: fontSizes.FONT23,
  },
  calander: {
    flex: 1,
    width: "90%",
  },
  dateView: {
    width: windowHeight(27),
    height: windowHeight(27),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(4.3),
    paddingHorizontal: windowHeight(2),
  },
  dateText: {
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: appFonts.medium,
  },
  timeContainer: {
    height: windowHeight(43),
    marginTop: windowHeight(15),
    justifyContent: "space-between",
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    borderRadius: windowHeight(5),
    backgroundColor: appColors.whiteColor,
    marginHorizontal: windowWidth(15),
  },
  arrowView1: {
    width: windowWidth(130),
    justifyContent: "space-between",
    paddingHorizontal: windowHeight(8),
    alignItems: "center",
  },
  arrowView2: {
    width: windowWidth(130),
    justifyContent: "space-between",
    paddingHorizontal: windowHeight(8),
    alignItems: "center",
    marginLeft: windowWidth(10),
  },
  arrowView3: {
    width: windowWidth(130),
    justifyContent: "space-between",
    paddingHorizontal: windowHeight(8),
    alignItems: "center",
    marginRight: windowWidth(10),
  },
  line: {
    height: windowHeight(42),
    borderRightWidth: windowHeight(0.9),
    borderRightColor: appColors.border,
  },
  time: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
  },
  day: {
    color: appColors.blackColor,
    fontFamily: appFonts.medium,
  },
  buttonView: {
    marginVertical: windowHeight(15),
  },
  closeBtn: {
    position: "absolute",
    right: windowWidth(0),
  },
  line2: {
    height: windowHeight(20),
    resizeMode: "contain",
  },
  dateView1: {
    alignItems: "center",
    justifyContent: "center",
  },
  calView: {
    marginTop: windowHeight(18),
    marginHorizontal: windowWidth(15),
  },
  btnView: {
    marginTop: windowHeight(10),
    marginHorizontal: windowWidth(15),
    paddingBottom: windowHeight(15),
  },
  calendar: {
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    borderRadius: windowHeight(5),
    bottom: windowHeight(11),
  },
  arrowView: { padding: windowWidth(10) },
  lineContainer1: { bottom: windowHeight(10) },
});
export default styles;
