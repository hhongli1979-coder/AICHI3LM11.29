import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainView: {
        marginVertical: windowHeight(5),
        marginBottom: 0,
    },
    image: {
        width: "100%",
        height: windowHeight(160),
        resizeMode: "stretch",
    },
    position: {
        position: "absolute",
        marginHorizontal: windowWidth(50),
        marginVertical: windowHeight(30),
        justifyContent: "space-around",
    },
    des: {
        fontFamily: appFonts.semiBold,
        fontSize: fontSizes.FONT21,
        width: windowWidth(250),
        color: "#BADFD6",
    },
    button: {
        height: windowHeight(30),
        backgroundColor: appColors.whiteColor,
        borderRadius: windowWidth(7),
        marginTop: windowHeight(10),
        alignItems: "center",
        paddingHorizontal: windowWidth(10),
        flexDirection: "row",
        justifyContent:'center',
        maxWidth:windowWidth(200)
    },
    buttonText: {
        fontFamily: appFonts.semiBold,
        fontSize: fontSizes.FONT18,
        color: appColors.primary,
        marginHorizontal: windowWidth(5),
    },
    box: {
        width: "90%",
        paddingVertical: windowHeight(13),
        borderWidth: 1,
        alignSelf: "center",
        borderRadius: windowWidth(4),
        paddingHorizontal: windowWidth(15),

    },
    que: {
        fontFamily: appFonts.bold,
        fontSize: fontSizes.FONT20,
        color: appColors.primary,
    },
    trems: {
        fontSize: fontSizes.FONT17,
        fontFamily: appFonts.medium,
        textDecorationLine: "underline",
        color: appColors.gray,
    },
    note: {
        marginTop: windowHeight(22),
        width: "90%",
        alignSelf: "center",
        color: appColors.gray,
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT18,
        marginBottom: windowHeight(10),
    },
    des1: {
        color: appColors.gray,
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT15,
        width: windowWidth(230),
        marginTop: windowHeight(5),
    },
    viewButton: {
        width: windowWidth(95),
        height: windowHeight(25),
        backgroundColor: appColors.primary,
        marginTop: windowHeight(22),
        borderRadius: windowWidth(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: appColors.whiteColor,
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT16,
    },
});

export default styles;
