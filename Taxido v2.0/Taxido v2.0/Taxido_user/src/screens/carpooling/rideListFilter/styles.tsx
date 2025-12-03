import { StyleSheet } from "react-native";
import { windowHeight, appColors, fontSizes, appFonts } from "@src/themes";

const styles = StyleSheet.create({
    view: { flex: 1, backgroundColor: appColors.lightGray },
    mainView: {
        backgroundColor: appColors.whiteColor,
        padding: windowHeight(10),
        borderRadius: windowHeight(5),
        borderWidth: windowHeight(1),
        borderColor: appColors.border,
        marginTop: windowHeight(14),
        width: "91%",
        alignSelf: "center",
    },
    sortBy: { color: appColors.primaryText, fontSize: fontSizes.FONT21, fontFamily: appFonts.semiBold },
    filterOptions: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: windowHeight(8) },
    itemText: {
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT18,
        color: appColors.primaryText,
    },
    passengerText: { color: appColors.primaryText, fontSize: fontSizes.FONT21, fontFamily: appFonts.semiBold },
    viewMain: { flexDirection: "row", marginHorizontal: windowHeight(15), marginTop: windowHeight(28), justifyContent: 'space-between', marginBottom: windowHeight(15) },
    textView: { height: windowHeight(37), width: '47.5%', borderRadius: windowHeight(5), backgroundColor: appColors.whiteColor, justifyContent: 'center' },
    text: {
        color: appColors.whiteColor, textAlign: 'center', fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT19,
    },
    clear: {
        color: appColors.gray, textAlign: 'center', fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT19,
    },

})
export default styles;