import { StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "../../../theme/appConstant";


const styles = StyleSheet.create({
    subView: {
        height: '100%',
    },
    space: {
        marginHorizontal: windowWidth(4),
        marginTop: windowHeight(5),
    },
    margin: {
        marginVertical: windowHeight(2),
        marginBottom: windowHeight(1.8),
    },
})

export default styles;