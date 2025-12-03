import { StyleSheet } from "react-native";
import { appColors, windowHeight } from "@src/themes";

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center' },
    view: { backgroundColor: appColors.whiteColor },
    profileUser: { height: windowHeight(42), width: windowHeight(42) },

})
export default styles;