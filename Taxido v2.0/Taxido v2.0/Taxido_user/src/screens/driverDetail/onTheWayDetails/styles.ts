import { StyleSheet } from "react-native";
import { windowHeight,  appColors } from "@src/themes";

const styles = StyleSheet.create({
    renderView: {
        backgroundColor: appColors.lightGray,
        marginTop: windowHeight(8.5),
        height: windowHeight(43.8),
        alignItems: 'center',
        paddingHorizontal: windowHeight(9),
    },
    textView: {
        width: '90%',
        height: windowHeight(45),
        backgroundColor: appColors.primary,
        alignSelf: 'center',
        borderRadius: windowHeight(6),
        marginTop: windowHeight(14),
        paddingVertical: windowHeight(8.9),
        paddingHorizontal: windowHeight(13.8),
    },
    viewText: { justifyContent: 'space-between' },
    listStyle: { marginTop: windowHeight(18.5) },
})
export default styles;