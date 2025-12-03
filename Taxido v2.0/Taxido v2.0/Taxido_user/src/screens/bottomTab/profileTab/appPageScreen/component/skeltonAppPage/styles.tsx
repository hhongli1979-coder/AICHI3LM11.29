import { commonStyles } from "@src/styles/commonStyle";
import { external } from "@src/styles/externalStyle";
import { windowHeight, windowWidth } from "@src/themes";
import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  listItemContainer: {
    ...external.fd_row,
    ...external.ai_center,
    marginVertical: windowHeight(9),
  },
  iconContainer: {
    width: windowHeight(33),
    height: windowHeight(33),
    borderRadius: windowHeight(33),
    ...external.ai_center,
    ...external.js_center,
  },
  listItemText: {
    marginHorizontal: windowHeight(8),
    flexGrow: 0.95,
    width: windowHeight(15),
    height: windowHeight(5.5)
  },
  listItemText1: {
    width: windowHeight(5),
    height: windowHeight(5),
    marginHorizontal: windowHeight(15),

  },
})
export default styles;
