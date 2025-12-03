import { StyleSheet } from "react-native";
import { windowHeight } from "@src/themes";

const styles = StyleSheet.create({
  circle: {
    width: windowHeight(14.5),
    height: windowHeight(14.5),
    borderRadius: windowHeight(17),
  },
});
export { styles };
