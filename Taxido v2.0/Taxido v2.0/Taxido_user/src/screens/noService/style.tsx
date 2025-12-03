import { StyleSheet } from "react-native";
import { windowHeight, appFonts, fontSizes, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
    },
    image: {
        height: windowHeight(300),
        width: windowWidth(400),
        alignSelf: 'center',
    },
    container: {
        alignSelf: 'center',
        justifyContent: 'space-between',
        gap: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: fontSizes.FONT22,
        fontFamily: appFonts.medium,
        alignSelf: 'center',
    },
    text: {
        textAlign: 'center',
        color: '#797D83',
        fontSize: fontSizes.FONT17,
        fontFamily: appFonts.regular,
        marginTop: windowHeight(9),
        marginHorizontal: windowWidth(8),
        alignSelf: 'center',
        width: '91%',
        lineHeight: windowHeight(15),
    },
    btn: {
        width: '90%',
        alignSelf: 'center',
        top: windowHeight(50),
    },
})
export default styles;