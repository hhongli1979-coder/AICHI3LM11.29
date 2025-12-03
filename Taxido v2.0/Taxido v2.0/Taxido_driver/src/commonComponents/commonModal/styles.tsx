import { StyleSheet } from "react-native";
import { windowHeight } from "../../theme/appConstant";
import appColors from "../../theme/appColors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColors.modelBg,
    },
    valueBar: {
        width: '92%',
        paddingVertical: windowHeight(2),
        borderRadius: windowHeight(1.5),
        paddingHorizontal: windowHeight(2),
    },
})
export default styles;