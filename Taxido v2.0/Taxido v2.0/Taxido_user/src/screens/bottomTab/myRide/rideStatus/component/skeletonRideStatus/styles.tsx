import { windowHeight } from "@src/themes";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    padding: windowHeight(10),
    top: windowHeight(3),
  },
  container: {
    marginBottom: windowHeight(10),
    gap: 8,
  },
})
export default styles;