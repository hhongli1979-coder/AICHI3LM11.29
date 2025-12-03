import appColors from "../../../../theme/appColors";
import appFonts from "../../../../theme/appFonts";
import { fontSizes, windowHeight, windowWidth } from "../../../../theme/appConstant";

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainView: {
        marginVertical: windowHeight(1),
        marginBottom: 0,
    },
    image: {
        width: "100%",
        height: windowHeight(24),
        resizeMode: "stretch",
    },
    position: {
        position: "absolute",
        marginHorizontal: windowWidth(10),
        marginVertical: windowHeight(5),
        justifyContent: "space-around",
    },
    des: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT4HALF,
        width: windowWidth(60),
        color: "#BADFD6",
    },
    button: {
        height: windowHeight(5),
        width: windowWidth(35),
        backgroundColor: appColors.white,
        borderRadius: windowWidth(0.8),
        marginTop: windowHeight(3),
        alignItems: "center",
        paddingHorizontal: windowWidth(5),
        flexDirection: "row",
    },
    buttonText: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT4,
        color: appColors.primary,
        marginHorizontal: windowWidth(0.8),
    },
    box: {
        width: "90%",
        paddingVertical: windowHeight(2),
        borderWidth: 1,
        alignSelf: "center",
        borderRadius: windowWidth(0.8),
        paddingHorizontal: windowWidth(5),

    },
    que: {
        fontFamily: appFonts.bold,
        fontSize: fontSizes.FONT4,
        color: appColors.primary,
    },
    trems: {
        fontSize: fontSizes.FONT3HALF,
        fontFamily: appFonts.medium,
        textDecorationLine: "underline",
        color: appColors.iconColor,
    },
    note: {
        marginTop: windowHeight(2),
        width: "90%",
        alignSelf: "center",
        color: appColors.iconColor,
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT3HALF,
        marginBottom: windowHeight(1)
    },
    des1: {
        color: appColors.iconColor,
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT3SMALL,
        width: windowWidth(48),
        marginTop: windowHeight(0.8)
    },
    viewButton: {
        width: windowWidth(25),
        height: windowHeight(5),
        backgroundColor: appColors.primary,
        marginTop: windowHeight(2.5),
        borderRadius: windowWidth(0.8),
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: appColors.white,
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT3
    }
});

export default styles;
