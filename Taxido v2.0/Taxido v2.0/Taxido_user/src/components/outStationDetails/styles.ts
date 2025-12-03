import { StyleSheet } from "react-native";
import { appColors, appFonts, fontSizes, windowHeight } from "@src/themes";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    dropdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownWrapper: {
        marginHorizontal: windowHeight(5),
    },
    dropdownContainer: {
        height: windowHeight(35),
        width: 150,
    },
    dropdown: {
        borderColor: appColors.primaryGray,
        height: windowHeight(45),
    },
    dropDownText: {
        color: appColors.primaryText,
        fontFamily: appFonts.medium,
    },
    subContainer: {
        alignSelf: 'flex-start',
    },
    title: {
        color: appColors.primaryText,
        fontFamily: appFonts.medium,
        textAlign: 'left',
        marginTop: windowHeight(18),
        marginHorizontal: windowHeight(4),
    },
    selectDate: {
        color: appColors.primary,
        fontFamily: appFonts.medium,
        textAlign: 'left',
        marginTop: windowHeight(10),
        marginBottom: windowHeight(9),
        marginHorizontal: windowHeight(4),
        fontSize: fontSizes.FONT18,
    },
    calander: {
        flex: 1,
        width: '90%',
    },
    dateView: {
        width: windowHeight(35),
        height: windowHeight(35),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: windowHeight(9.3),
    },
    dateText: {
        textAlign: 'center',
        fontWeight: "bold"
    },
    timeContainer: {
        flexDirection: 'row',
        height: windowHeight(45),
        marginTop: windowHeight(12),
        justifyContent: 'space-between',
        borderWidth: windowHeight(1),
        borderColor: appColors.primaryGray,
        borderRadius: windowHeight(7),
    },
    arrowView: {
        width: windowHeight(75),
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: windowHeight(9),
        alignItems: 'center',
    },
    line: {
        height: windowHeight(48),
        borderRightWidth: windowHeight(0.9),
        borderRightColor: appColors.primaryGray,
    },
    time: {
        color: appColors.primary,
        fontFamily: appFonts.medium,
    },
    day: {
        color: appColors.blackColor,
        fontFamily: appFonts.medium,
    },
    buttonView: {
        marginVertical: windowHeight(19),
    },
    mv: {
        marginVertical: windowHeight(19),
    },
});

export default styles;