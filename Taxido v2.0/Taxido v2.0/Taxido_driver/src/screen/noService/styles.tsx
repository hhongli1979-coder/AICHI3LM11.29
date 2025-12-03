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
        height: windowHeight(35),
        width: windowWidth(150),
        alignSelf: 'center',
    },
    container: {
        alignSelf: 'center',
        justifyContent: 'space-between',
        gap: 8,
        alignItems: 'center',
        marginTop: windowHeight(2),
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
        top: windowHeight(5)
    }
})
export default styles;