import { StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: windowWidth(15),
        paddingBottom: windowHeight(10),
        borderRadius: windowHeight(5),
        marginHorizontal: windowWidth(20),
        marginTop: windowHeight(15),
    },
});
export default styles;