import { windowHeight } from "@src/themes";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    markerImage: {
        height: windowHeight(30),
        width: windowHeight(25),
        resizeMode: 'contain',
    },
})
export default styles;