import { StyleSheet } from "react-native";
import { windowHeight, fontSizes, appColors, appFonts, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
    flexView: {
        flex: 1,
    },
    scrollView: { backgroundColor: appColors.whiteColor, padding: windowHeight(10), borderRadius: windowHeight(5), borderWidth: windowHeight(1), borderColor: appColors.border, marginTop: windowHeight(16), width: '91%', alignSelf: 'center' },
    stepContainer: {
        flexDirection: "row",
        alignItems: "center",
        top: windowHeight(8)
    },
    citiesView: { paddingHorizontal: windowWidth(0), marginBottom: windowHeight(0) },
    iconView: { marginBottom: windowHeight(28) },
    iconColumn: {
        alignItems: "center",
        position: "relative",
    },
    line: {
        position: "absolute",
        width: windowHeight(0.1),
        height: windowHeight(37),
        borderStyle: "dashed",
        borderLeftWidth: windowHeight(0.7),
        borderLeftColor: appColors.gray,
        top: windowHeight(16),
    },
    labelColumn: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        paddingVertical: windowHeight(2.6),
        paddingHorizontal: windowHeight(4),
        marginHorizontal: windowHeight(0)
    },
    label: {
        fontWeight: "500",
        color: appColors.blackColor,
        paddingVertical: windowHeight(10),
        width: "85%",
        bottom: windowHeight(9),
        flex: 1,
        marginHorizontal: windowHeight(4)
    },
    mapLink: {
        color: appColors.primary,
        fontSize: fontSizes.FONT19,
        marginTop: windowHeight(3),
        textDecorationLine: "underline",
        marginHorizontal: windowWidth(15),
        fontFamily: appFonts.medium,
    },
    dashedLine: {
        height: 0.1,
        width: '100%',
        borderBottomWidth: windowHeight(0.9),
        borderColor: appColors.primaryGray,
        borderStyle: 'dashed',
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
    dashedLine1: {
        height: 0.1,
        width: '100%',
        borderBottomWidth: windowHeight(0.9),
        borderColor: appColors.primaryGray,
        borderStyle: 'dashed',
        marginVertical: windowHeight(10),
        marginTop: windowHeight(10)
    },
    dashedLine2: {
        height: 0.1,
        width: '100%',
        borderBottomWidth: windowHeight(0.9),
        borderColor: appColors.primaryGray,
        borderStyle: 'solid',
        marginVertical: windowHeight(10),
        marginTop: windowHeight(10)
    },
    reportText: {
        color: appColors.whiteColor, textAlign: 'center', fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT19,
    },
    reportTextView: { height: windowHeight(37), width: '47.5%', borderRadius: windowHeight(5), backgroundColor: appColors.primary, justifyContent: 'center' },
    cancelText: {
        color: appColors.gray, textAlign: 'center', fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT19,
    },
    cancelTextView: { height: windowHeight(37), width: '47.5%', borderRadius: windowHeight(5), backgroundColor: appColors.lightGray, justifyContent: 'center' },
    textView: { flexDirection: "row", marginHorizontal: windowHeight(1), marginTop: windowHeight(8), justifyContent: 'space-between' },
    textInput: {
        width: '98%',
        marginHorizontal: windowWidth(9),
        height: windowHeight(80),
        textAlignVertical: "top",
    },
    idCardView: { marginVertical: windowHeight(8) },
    cardMainView: {
        backgroundColor: appColors.whiteColor,
        borderWidth: windowHeight(1),
        borderColor: appColors.border,
        flexDirection: "row",
        paddingHorizontal: windowHeight(12),
        borderRadius: windowHeight(5),
        marginVertical: windowHeight(10),
        elevation: 0.5
    },
    aboutText: { color: appColors.primaryText, fontFamily: appFonts.medium, marginTop: windowHeight(10) },
    reportRideText: {
        color: appColors.primaryText,
        fontFamily: appFonts.semiBold,
        fontSize: fontSizes.FONT22,
        textAlign: "center",
        marginBottom: windowHeight(10)
    },
    image: {
        height: windowHeight(35),
        width: windowHeight(35),
        resizeMode: "contain",
        marginHorizontal: windowHeight(1),
    },
    starView: { flexDirection: "row", marginTop: windowHeight(2), alignItems: "center" },
    starPoint: {
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
    toyotaView: { flexDirection: 'row' },
    toyota: { marginHorizontal: windowHeight(8), color: appColors.primaryText, fontFamily: appFonts.regular, fontSize: fontSizes.FONT19, top: windowHeight(1) },
    travel: {
        color: appColors.gray, fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT19,
        marginTop: windowHeight(2),
        flex: 1,
        marginHorizontal: windowHeight(3)
    },
    dot: { color: appColors.gray, fontSize: fontSizes.FONT25, bottom: windowHeight(5) },
    button: { paddingHorizontal: windowHeight(13), marginTop: windowHeight(28), marginBottom: windowHeight(12) },
    messageView: {
        flexDirection: "row", alignItems: "center", width: windowWidth(45),
        justifyContent: "space-between",
    },
    date: { color: appColors.primary, fontFamily: appFonts.medium, fontSize: fontSizes.FONT22 },
    totalAmountView: { flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight(8) },
    bookSeatsView: { flexDirection: 'row', justifyContent: 'space-between' },
    totalAmountText: { color: appColors.primaryText, fontFamily: appFonts.medium, fontSize: fontSizes.FONT19 },
    price: { color: appColors.primaryText, fontFamily: appFonts.regular, fontSize: fontSizes.FONT18 },
    bottomView: { backgroundColor: appColors.whiteColor, padding: windowHeight(10), borderRadius: windowHeight(5), borderWidth: windowHeight(1), borderColor: appColors.border, marginTop: windowHeight(16), width: '91%', alignSelf: 'center' },
    Jonathan: {
        color: appColors.primaryText,
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT18,
    },
    nameView: { flex: 1, marginHorizontal: windowHeight(6) },
    reportRideOptionsView: {
        paddingVertical: windowHeight(5),
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    reportRideOptionsViewMain: { paddingHorizontal: windowHeight(1) },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    viewModal: {
        backgroundColor: appColors.whiteColor,
        padding: windowHeight(15),
        borderRadius: 10,
        width: "85%"
    },
    rideView: { flexDirection: 'row' },
    imageView: {
        flexDirection: "row",
        alignItems: "center",
    },
    userData: {
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
    travelText: { color: appColors.gray, fontSize: fontSizes.FONT18, fontFamily: appFonts.regular, paddingHorizontal: windowHeight(5) },
    talkView: { flexDirection: "row", alignItems: "center", paddingHorizontal: windowHeight(7), marginTop: windowHeight(5), top: windowHeight(2) },
    dependingView: { flexDirection: "row", alignItems: "center", paddingHorizontal: windowHeight(7), marginTop: windowHeight(0) },
    noPetsTextView: { flexDirection: "row", alignItems: "center", paddingHorizontal: windowHeight(7) },
    vieww: { backgroundColor: appColors.whiteColor, padding: windowHeight(10), borderRadius: windowHeight(5), borderWidth: windowHeight(1), borderColor: appColors.border, marginTop: windowHeight(16), width: '91%', alignSelf: 'center' },
    report: { color: appColors.primary, fontFamily: appFonts.medium, fontSize: fontSizes.FONT19, marginHorizontal: windowHeight(8), top: windowHeight(1) }

})

export default styles;