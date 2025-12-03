import {StyleSheet} from "react-native";
import {
  appColors,
  appFonts,
  fontSizes,
  windowHeight,
  windowWidth,
} from "@src/themes";

const styles = StyleSheet.create({
  dropView: {
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: windowHeight(12),
  },
  datetimeView: {
    backgroundColor: appColors.whiteColor,
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    marginTop: windowHeight(13),
    paddingHorizontal: windowHeight(10),
    paddingBottom: windowHeight(19),
    borderRadius: windowHeight(5),
  },
  datetimeText: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    marginTop: windowHeight(12),
  },
  row: {
    justifyContent: "space-between",
  },
  clockBtn: {
    borderColor: appColors.border,
    borderRadius: windowHeight(5),
    width: "47.5%",
    alignItems: "center",
    backgroundColor: appColors.lightGray,
    marginTop: windowHeight(10),
    height: "95%",
  },
  paddingHr: {
    marginHorizontal: windowHeight(13),
  },
  timeText: {
    color: appColors.primaryText,
    fontFamily: appFonts.regular,
    right: windowHeight(8),
    top: windowHeight(1),
  },
  tripMainView: {
    backgroundColor: appColors.whiteColor,
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    marginVertical: windowHeight(13.9),
    paddingHorizontal: windowHeight(10),
    alignItems: "center",
    width: "100%",
    borderRadius: windowHeight(5),
  },
  tripSubView: {
    width: "85%",
    height: windowHeight(48),
    justifyContent: "space-evenly",
    paddingVertical: windowHeight(2),
  },
  tripText: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
  },
  noDriverText: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
  },
  switchView: {
    justifyContent: "center",
    width: "15%",
  },
  FindView: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: windowHeight(10),
  },
  findBtn: {
    height: windowHeight(40),
    backgroundColor: appColors.primary,
    marginHorizontal: windowWidth(15),
    borderRadius: windowHeight(5),
    alignItems: "center",
    justifyContent: "center",
  },
  findText: {
    color: appColors.whiteColor,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT20,
  },
  calenderView: {
    paddingHorizontal: windowWidth(18),
  },
  inputMainView: {
    marginHorizontal: windowWidth(18),
  },
});

export default styles;
