

import { StyleSheet } from "react-native";
import { windowHeight, fontSizes, windowWidth } from "../../theme/appConstant";
import appColors from "../../theme/appColors";
import appFonts from "../../theme/appFonts";

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
    },
    image: {
        height: windowHeight(32),
        width: windowWidth(150),
        alignSelf: 'center',
    },
    container: {
        alignSelf: 'center',
        justifyContent: 'space-between',
        gap: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: fontSizes.FONT4,
        fontFamily: appFonts.medium,
        alignSelf: 'center',

    },
    text: {
        textAlign: 'center',
        color: appColors.darkBorderBlack,
        fontSize: fontSizes.FONT3SMALL,
        fontFamily: appFonts.regular,
        marginHorizontal: windowWidth(8),
        alignSelf: 'center',
        width: '90%',
        lineHeight: windowHeight(2.1),
        top: windowHeight(1.5)
    },
    btn: {
        width: '97%',
        alignSelf: 'center',
        top: windowHeight(8),
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'space-between',
        marginTop: windowHeight(5),
    },
    button: {
        backgroundColor: appColors.primary,
        width: windowWidth(42),
        height: windowHeight(5.6),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: windowHeight(0.7),
    },
    buttonText: {
        fontFamily: appFonts.medium,
        color: appColors.white,
    },
    modalContainer: {
        paddingHorizontal: windowWidth(1.7),
        alignItems: 'center',
    },
    modalTitle: {
        color: appColors.primaryFont,
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT4,
        width: '72%',
        textAlign: 'center',
        top: windowHeight(2)
    },
})
export default styles;