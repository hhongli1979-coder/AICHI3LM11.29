import { StyleSheet } from "react-native";
import { appColors, appFonts, windowHeight, windowWidth } from "@src/themes";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: {
    backgroundColor: appColors.whiteColor,
  },
  inputBox: {
    backgroundColor: appColors.lightGray,
    height: windowHeight(45),
    borderRadius: windowHeight(5),
    flexDirection: "row",
    alignItems: "center",
    marginVertical: windowHeight(5),
  },
  input: {
    flex: 1,
    fontFamily: appFonts.regular,
    color: appColors.primaryText,
  },
  suggestionText: {
    color: appColors.gray,
    fontFamily: appFonts.regular,
    alignItems: "center",
    marginHorizontal: windowWidth(5),
  },
  suggestionItem: {
    padding: windowHeight(10),
    flexDirection: "row",
  },
  swapButton: {
    position: "absolute",
    right: windowWidth(25),
    top: windowHeight(38),
    backgroundColor: appColors.whiteColor,
    height: windowHeight(35),
    width: windowHeight(35),
    borderRadius: windowHeight(20),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  iconContainer: {
    height: windowHeight(35),
    width: windowHeight(35),
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(30),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: windowWidth(10),
  },
  listView: {
    marginTop: windowHeight(5),
  },
  buttonView: {
    position: "absolute",
    bottom: windowHeight(20),
    width: "100%",
  },
  buttonHz_Space: {
    marginHorizontal: windowWidth(15),
  },
   webview: { flex: 1 },
});
