import { StyleSheet } from "react-native";
import { appColors, windowHeight, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
  main: {
    alignItems: "center",
    marginVertical: windowHeight(5),
    justifyContent: "space-between",
  },
  subContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    height: windowHeight(35),
    width: windowHeight(35),
    backgroundColor: appColors.primaryGray,
    borderRadius: windowHeight(23),
    marginHorizontal: windowWidth(12),
    alignItems: "center",
    justifyContent: "center",
    marginVertical: windowHeight(2),
  },
  imageView: {
    height: windowHeight(20),
    width: windowHeight(20),
    resizeMode: "contain",
  },
});

export default styles;
