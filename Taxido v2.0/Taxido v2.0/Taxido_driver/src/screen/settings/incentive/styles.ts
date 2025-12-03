import { StyleSheet } from "react-native";
import { windowHeight, fontSizes, windowWidth } from "../../../theme/appConstant";
import appColors from "../../../theme/appColors";
import appFonts from "../../../theme/appFonts";

const styles = StyleSheet.create({
    container: {
        padding: windowWidth(5),
    },
    card: {
        backgroundColor: appColors.primary,
        borderRadius: windowHeight(0.8),
        padding: windowHeight(2),
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        paddingRight: windowWidth(2),
    },
    title: {
        color: appColors.white,
        fontSize: fontSizes.FONT5HALF,
        fontFamily: appFonts.bold,
        marginBottom: windowHeight(0.5),
    },
    subtitle: {
        color: appColors.white,
        fontSize: fontSizes.FONT4,
        opacity: 0.9,
    },
    progressContainer: {
        position: 'relative',
        width: windowHeight(8),
        height: windowHeight(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        position: 'absolute',
    },
    progressText: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressLabel: {
        color: appColors.white,
        fontSize: fontSizes.FONT4HALF,
        fontFamily: appFonts.medium,
    },
    incentiveTitle: {
        color: appColors.primaryFont,
        fontSize: fontSizes.FONT4HALF,
        fontFamily: appFonts.medium,
        marginHorizontal: windowWidth(5),
        marginTop: windowHeight(2)
    },
    incentiveSubTitle: {
        color: appColors.secondaryFont,
        marginHorizontal: windowWidth(5),
        marginTop: windowHeight(0.5)
    },
    bottomtext: {
        marginHorizontal: windowWidth(5),
        marginTop: windowHeight(3),
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT4,
        color: appColors.secondaryFont
    },
    titleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: windowHeight(2),
        marginTop: windowHeight(2.5)
    },
    titleTask: {
        fontSize: fontSizes.FONT4HALF,
        fontFamily: appFonts.medium,
        color: appColors.primaryFont

    },
    titleViewAll: {
        color: appColors.secondaryFont,
        fontSize: fontSizes.FONT3HALF,
        fontFamily: appFonts.medium,
    },
    successGif: {
        height: windowHeight(25),
        width: windowWidth(25),
    }
})
export default styles;