import { StyleSheet } from "react-native";
import { windowHeight, appColors, appFonts, windowWidth } from "@src/themes";

const styless = StyleSheet.create({
    reviewSubmit: {
        alignContent: "center",
        alignSelf: "center",
        alignItems: "center",
    },
    textinput: {
        paddingHorizontal: windowWidth(0),
    },
    closeStyle: {
        position: "absolute",
        right: windowHeight(10),
        top: windowHeight(10),
    },
    ride_status: {
        marginHorizontal: windowWidth(15),
        marginTop: windowHeight(10),
        gap: 15,
    },
    needHelpText: {
        fontFamily: appFonts.regular,
        color: appColors.primary,
    },
    needHelpView: {
        marginHorizontal: windowWidth(20),
        width: windowWidth(435),
        marginVertical: windowHeight(8),
    },
    paymentMethodLine: {
        borderLeftWidth: windowHeight(1),
        borderRightWidth: windowHeight(1),
        borderTopWidth: windowHeight(1),
    },
    paymentMethodView: {
        position: "absolute",
        backgroundColor: appColors.border,
        height: 1,
        width: "100%",
        bottom: 0,
        justifyContent: "center",
    },
    ride_statusView: {
        backgroundColor: appColors.whiteColor,
        height: windowHeight(91.5),
        marginHorizontal: windowWidth(25),
        marginTop: windowHeight(4)
    },
    cancellation_reasonText: {
        color: appColors.textRed,
        fontFamily: appFonts.regular,
    },
    cancellation_reasonView: {
        backgroundColor: appColors.warnBg,
        width: "100%",
        padding: windowHeight(8),
        borderRadius: windowWidth(10),
        marginTop: windowHeight(4),
    },
    cancelledView: { marginHorizontal: windowWidth(20) },
    timeText: {
        color: appColors.regularText,
        fontFamily: appFonts.regular,
        paddingHorizontal: windowWidth(4),
    },
    clockSmall: {
        marginTop: windowHeight(5),
    },
    iconView: {
        alignItems: "flex-end",
        height: windowHeight(32),
        justifyContent: "space-between",
    },
    calenderSmallView: {
        alignItems: 'center',
    },
    pickLine: {
        width: "100%",
        borderBottomWidth: 1,
        borderColor: appColors.border,
        borderStyle: "dashed",
        marginVertical: windowHeight(10),
    },
    rentalMainView: {
        marginTop: windowHeight(15),
        alignSelf: 'center',
        marginHorizontal: windowWidth(20),
        borderRadius: windowHeight(5),
        overflow: "hidden",
        borderWidth: 1,
        borderColor: appColors.border,
    },
    rentalView: {
        justifyContent: "space-between",
        width: '100%',
    },
    viewRental: {
        flexDirection: "column",
        padding: windowHeight(8),
    },
    startDateText: {
        color: appColors.primaryText,
        fontFamily: appFonts.medium,
    },
    linee: {
        borderLeftWidth: 1,
        borderColor: appColors.border,
        height: windowHeight(42),
        borderStyle: "dashed",
    },
    vieww: {
        marginTop: windowHeight(5),
    },
    totalDaysView: {
        marginHorizontal: windowWidth(10),
        marginVertical: windowHeight(10),
    },
    rentalLine: {
        borderLeftWidth: 1,
        height: '100%',
        borderStyle: "dashed",
        borderColor: appColors.border,
    },
    scheduleView: {
        justifyContent: "space-between",
        marginVertical: windowHeight(10),
        marginHorizontal: windowWidth(20),
        borderWidth: windowHeight(1),
        borderRadius: windowHeight(5),
        borderColor: appColors.border,
    },
    contentContainer: {
        marginHorizontal: windowWidth(5),
    },
})

export default styless;