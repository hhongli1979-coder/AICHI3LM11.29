import { StyleSheet } from "react-native";
import { appColors, appFonts, fontSizes, windowHeight } from "@src/themes";

const MARKER_WIDTH = windowHeight(40);
const MARKER_HEIGHT = windowHeight(40);

const styles = StyleSheet.create({
  backView: {
    borderRadius: windowHeight(7),
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight(36),
    width: windowHeight(36),
    position: "absolute",
    zIndex: 10,
    left: windowHeight(15),
    top: windowHeight(15),
    elevation: 5,
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textInputContainer: {
    position: "absolute",
    top: windowHeight(60),
    right: windowHeight(15),
    left: windowHeight(15),
    alignItems: "center",
    borderRadius: windowHeight(8),
    elevation: 5,
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
  },
  textInput: {
    flex: 1,
    fontSize: fontSizes.FONT15,
    fontFamily: appFonts.medium,
  },
  pointerMarker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: MARKER_WIDTH,
    height: MARKER_HEIGHT,
    transform: [
      { translateX: -(MARKER_WIDTH / 2) },
      { translateY: -MARKER_HEIGHT },
    ],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  confirmButton: {
    backgroundColor: appColors.primary,
    position: "absolute",
    height: windowHeight(50),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(8),
    bottom: windowHeight(20),
    right: windowHeight(15),
    left: windowHeight(15),
    zIndex: 10,
    elevation: 5,
  },
  confirmText: {
    color: appColors.whiteColor,
    fontFamily: appFonts.semiBold,
  },
  pinImage: {
    width: windowHeight(27),
    height: windowHeight(27),
    resizeMode: "contain",
  },
  addressBtnView: {
    width: windowHeight(40),
    height: windowHeight(40),
    borderRadius: windowHeight(8),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: windowHeight(10),
    marginVertical: windowHeight(10),
  },
  mapView: {
    flex: 1,
    height: "100%",
  },
  loaderContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
