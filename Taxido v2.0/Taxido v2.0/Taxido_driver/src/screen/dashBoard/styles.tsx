import { StyleSheet } from "react-native";
import { windowHeight, fontSizes, windowWidth } from "../../theme/appConstant";
import appColors from "../../theme/appColors";
import appFonts from "../../theme/appFonts";

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: 'center',
        marginTop: windowHeight(2.6),
        marginHorizontal: windowHeight(2.5),
        borderRadius: windowHeight(0.8),
        paddingBottom: windowHeight(2.3),
        borderWidth: windowHeight(0.1)
    },
    centerText: {
        position: 'absolute',
        top: '34%',
        alignItems: 'center',
    },
    title: {
        fontSize: fontSizes.FONT3HALF,
        color: appColors.black,
        fontFamily: appFonts.medium,
    },
    count: {
        fontSize: fontSizes.FONT4HALF,
        fontFamily: appFonts.bold,
        color: appColors.primary,
        top: '15%',
    },
    legendValue: {
        fontWeight: 'bold',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: windowHeight(4),
        width: '100%',
        backgroundColor: appColors.white,
    },
    statusBox: {
        alignItems: 'center',
    },
    statusTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusDot: {
        width: windowHeight(1.6),
        height: windowHeight(0.6),
        borderRadius: 4,
        marginRight: 6,
    },
    statusLabel: {
        fontSize: fontSizes.FONT3HALF,
        color: appColors.iconColor,
        fontFamily: appFonts.regular,
    },
    statusValue: {
        fontSize: fontSizes.FONT3HALF,
        fontFamily: appFonts.regular,
        color: appColors.black,
        left: windowWidth(2.8),
    },
    dashBoardHeader: {
        justifyContent: 'space-between',
        paddingHorizontal: windowHeight(3),
        marginTop: windowHeight(2),
        alignItems: 'center',
    }
})

export default styles;