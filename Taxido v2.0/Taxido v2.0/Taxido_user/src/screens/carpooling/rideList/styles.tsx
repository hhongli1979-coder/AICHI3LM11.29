import { StyleSheet } from "react-native";
import { windowHeight, appFonts, appColors, fontSizes, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    headerMainView: { height: windowHeight(60), backgroundColor: appColors.whiteColor, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: windowWidth(20), alignItems: 'center' },
    back: { height: windowHeight(35), width: windowHeight(35), borderWidth: windowHeight(1), borderColor: appColors.border, borderRadius: windowHeight(5), alignItems: 'center', justifyContent: 'center' },
    hedaerText: { color: appColors.primaryText, fontFamily: appFonts.semiBold, fontSize: fontSizes.FONT22 },
    dashedLine: {
        height: 0.1,
        width: '100%',
        borderBottomWidth: windowHeight(0.9),
        borderColor: appColors.primaryGray,
        borderStyle: 'dashed',
        marginVertical: windowHeight(10),
    },
    MessageMainView: {
        width: windowWidth(100),
        justifyContent: "space-between",
    },
    MessageView: {
        alignItems: "center",
        justifyContent: "center", height: windowHeight(30),
        width: windowHeight(30),
        borderRadius: windowHeight(20),
        borderWidth: windowHeight(1),
        backgroundColor: appColors.whiteColor,
        elevation: 0.5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    safetyCallView: {
        alignItems: "center",
        justifyContent: "center", height: windowHeight(30),
        width: windowHeight(30),
        borderRadius: windowHeight(20),
        borderWidth: windowHeight(1),
        elevation: 0.5,
        backgroundColor: appColors.whiteColor,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    starContainer: { alignItems: "flex-end", justifyContent: "center" },
    dataView: {
        backgroundColor: appColors.whiteColor,
        padding: windowHeight(10),
        borderRadius: windowHeight(5),
        borderWidth: windowHeight(1),
        borderColor: appColors.border,
        marginBottom: windowHeight(0),
        marginTop: windowHeight(14),
        width: '91%',
        alignSelf: 'center'
    },
    viewData: {
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        height: windowHeight(35),
        width: windowHeight(35),
        resizeMode: "contain",
        marginHorizontal: windowHeight(1),
    },
    name: {
        color: appColors.primaryText,
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT18,
    },
    starView: { flexDirection: "row", marginTop: windowHeight(2), alignItems: "center" },
    starNumber: {
        color: appColors.primaryText,
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT17,
        marginLeft: windowHeight(2),
    },
    digit: {
        color: appColors.gray,
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT17,
        marginLeft: windowHeight(3),
    },
    view: {
        flexDirection: "row", alignItems: "center", width: windowWidth(105),
        justifyContent: "space-between",
    },
    time: {
        color: appColors.gray,
        fontSize: fontSizes.FONT15,
        fontFamily: appFonts.regular,
        marginHorizontal: windowHeight(5)
    },
    clockSmall: { flexDirection: "row", alignItems: "center", left: windowHeight(5.5) },
    carView: { marginHorizontal: windowHeight(2), flexDirection: 'row', justifyContent: "space-between" },
    toyotaText: {
        color: appColors.primaryText, fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT19,
        top: windowHeight(7),
        flex: 1
    },
    seatText: {
        color: appColors.primary, fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT17,
        top: windowHeight(2)
    },
    bottomView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: windowHeight(6.8)
    },
    calgaryText: {
        color: appColors.primaryText,
        fontSize: fontSizes.FONT19,
        fontFamily: appFonts.semiBold,
        flex: 1,
    },
    calenderSmall: { left: windowHeight(5) },
    rightArrow: { marginHorizontal: windowHeight(8) },
    seatMainView: { flexDirection: 'row', backgroundColor: "#E8F5F2", borderRadius: windowHeight(5), justifyContent: 'space-between', padding: windowHeight(6), width: '29%' },
    seatView: { flexDirection: 'row', paddingHorizontal: windowHeight(5), justifyContent: 'space-between', gap: 5 },
    torontoText: {
        color: appColors.primaryText,
        fontSize: fontSizes.FONT19,
        fontFamily: appFonts.semiBold,
    },
    dateAndYear: {
        color: appColors.gray, fontSize: fontSizes.FONT15,
        fontFamily: appFonts.regular,
        paddingHorizontal: windowHeight(4),
        left: windowHeight(5.5)
    },
    dataView1: { flex: 1, marginHorizontal: windowHeight(6) },
    dataView2: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
})
export default styles;