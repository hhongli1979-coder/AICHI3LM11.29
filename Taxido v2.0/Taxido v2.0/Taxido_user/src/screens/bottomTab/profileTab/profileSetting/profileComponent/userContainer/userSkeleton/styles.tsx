import { windowHeight, windowWidth } from "@src/themes";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    detainContain: {
        marginHorizontal: windowWidth(18),
        marginVertical: windowHeight(2),
    },
    profileImage: {
        height: windowHeight(45),
        width: windowHeight(45),
        borderRadius: windowHeight(12),
        marginHorizontal: windowWidth(5),
    },
    details: {
        justifyContent: 'center',
        top: windowHeight(8),
    },
    name: {
        height: windowHeight(20),
        width: '50%',
        marginHorizontal: windowHeight(3),
        top: windowHeight(20),
    },
    walletContain: {
        height: windowHeight(45),
        width: '92%',
        marginHorizontal: windowWidth(18),
        marginTop: windowHeight(8),
    },
})
export default styles;
