import { StyleSheet } from "react-native";
import { windowHeight } from "../../../theme/appConstant";
import appColors from "../../../theme/appColors";

const styles = StyleSheet.create({
    loaderContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -25,
        marginLeft: -25,
        zIndex: 10,
    },
    container: {
        width: windowHeight(32),
        height: windowHeight(32),
        backgroundColor: appColors.white,
        borderWidth: windowHeight(1),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: windowHeight(5),
    },
    headerView: {
        height: windowHeight(8),
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: windowHeight(2),
        alignItems: 'center',
    },
});

export default styles