import { StyleSheet } from "react-native";
import { commonStyles } from "../../../../styles/commonStyle";
import { appColors } from "@src/themes";
import { windowHeight, windowWidth } from "@src/themes";
import { external } from "../../../../styles/externalStyle";

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flexContainer,
  },
  headerContainer: {
    backgroundColor: appColors.whiteColor,
    height: windowHeight(60),
    justifyContent: "center",
  },
  appPagesContainer: {
    width: "90%",
    backgroundColor: appColors.whiteColor,
    marginTop: windowHeight(16),
    borderRadius: windowHeight(6),
    marginHorizontal: windowHeight(16),
    paddingHorizontal: windowWidth(16),
    paddingVertical: windowHeight(9),
  },
  listItemContainer: {
    ...external.fd_row,
    ...external.ai_center,
    marginVertical: windowHeight(9),
  },
  iconContainer: {
    width: windowHeight(33),
    height: windowHeight(33),
    backgroundColor: appColors.lightGray,
    borderRadius: windowHeight(33),
    ...external.ai_center,
    ...external.js_center,
  },
  listItemText: {
    ...commonStyles.regularText,
    color: appColors.primaryText,
    marginHorizontal: windowHeight(8),
    flexGrow: 0.95,
  },
  symbolView: {
    width: windowHeight(32),
    height: windowHeight(32),
    alignItems: "center",
    justifyContent: "center",
    borderColor: appColors.blackColor,
    borderWidth: windowHeight(1),
    borderRadius: windowWidth(25),
  },
  flagImage: {
    width: windowHeight(30),
    height: windowHeight(30),
    borderRadius: windowHeight(5),
  },
  updateButton: {
    marginBottom: windowHeight(3),
    marginTop: windowHeight(12),
  },
  updateButton1: {
    marginTop: windowHeight(9.5),
    marginBottom: windowHeight(2),
  },
  lineView: {
    marginTop: windowHeight(1.5),
  },
  updateButton2: {
    marginBottom: windowHeight(10),
    top: windowHeight(10),
  },
  symbol: {
    color: appColors.blackColor,
  },
  languageContainer: {
    marginTop: windowHeight(3),
  },
});

export { styles };
