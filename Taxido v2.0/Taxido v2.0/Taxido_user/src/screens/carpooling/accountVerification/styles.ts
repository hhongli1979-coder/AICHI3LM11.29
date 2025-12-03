import { StyleSheet } from "react-native";
import { appColors, appFonts, windowHeight, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
  fieldTitle: {
    color: appColors.primaryText,
    fontFamily: appFonts.semiBold,
    marginTop: windowHeight(4),
    marginBottom: windowHeight(5),
  },
  imgContainer: {
    flexWrap: "wrap",
    gap: 10,
  },
  imgView: {
    width: windowHeight(70),
    height: windowHeight(70),
    right: windowHeight(2),
    borderWidth: windowHeight(0.2),
    borderRadius: windowHeight(5),
  },
  closeIcon: {
    position: "absolute",
    zIndex: 2,
    right: windowHeight(1),
    backgroundColor: appColors.modelBg,
    borderTopRightRadius: windowHeight(4),
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: windowHeight(8),
    resizeMode: "cover",
  },
  docSelection: {
    backgroundColor: appColors.whiteColor,
    borderWidth: windowHeight(0.9),
    borderColor: appColors.border,
    height: windowHeight(100),
    padding: windowHeight(8),
    top: windowHeight(3),
    borderRadius: windowHeight(5.5),
  },
  docContainer: {
    borderWidth: windowHeight(0.9),
    borderColor: appColors.regularText,
    borderStyle: "dashed",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(4),
  },
  dropDownContainer: {
    backgroundColor: appColors.whiteColor,
    borderColor: appColors.border,
    marginBottom: windowHeight(5),
    borderRadius: windowHeight(5),
    color: appColors.subtitle,
    marginTop: windowHeight(2),
  },
  input: {
    borderWidth: windowHeight(1),
    borderRadius: windowHeight(5),
    borderColor: appColors.border,
    backgroundColor: appColors.whiteColor,
    paddingHorizontal: windowWidth(15),
    color: appColors.gray,
    height: windowHeight(40),
    marginBottom: windowHeight(5),
  },
  btn: {
    position: 'absolute',
    bottom: windowHeight(20),
    right: 0,
    left: 0,
    marginHorizontal: windowWidth(20),
  },
});

export default styles;
