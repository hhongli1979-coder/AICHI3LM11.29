import { StyleSheet } from "react-native";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    dropdownRow: {
        alignItems: 'center',
    },
    dropdownWrapper: {
        marginHorizontal: windowHeight(3),
    },
    dropdownContainer: {
        height: windowHeight(34),
        width: windowWidth(190),
    },
    dropdown: {
        borderColor: appColors.border,
        height: windowHeight(34),
    },
    dropDownText: {
        color: appColors.primaryText,
        fontFamily: appFonts.medium
    },
    subContainer: {
        alignSelf: 'flex-start'
    },
    title: {
        color: appColors.primaryText,
        fontFamily: appFonts.medium,
        textAlign: 'left',
        marginTop: windowHeight(20),
        marginHorizontal: windowHeight(4)
    },
    selectDate: {
        color: appColors.primary,
        fontFamily: appFonts.medium,
        textAlign: 'left',
        marginTop: windowHeight(8),
        marginBottom: windowHeight(8),
        marginHorizontal: windowWidth(6),
        fontSize: fontSizes.FONT18,
    },
    calander: {
        flex: 1,
        width: '90%',
    },
    dateView: {
        width: windowHeight(32),
        height: windowHeight(32),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: windowHeight(5),
    },
    dateText: {
        textAlign: 'center',
        fontWeight: "bold",
        fontFamily: appFonts.medium
    },
    timeContainer: {
        height: windowHeight(43),
        marginTop: windowHeight(15),
        justifyContent: 'space-between',
        borderWidth: windowHeight(1),
        borderColor: appColors.border,
        borderRadius: windowHeight(7.9)
    },
    arrowView: {
        width: windowWidth(110),
        justifyContent: 'space-between',
        paddingHorizontal: windowHeight(9),
        alignItems: 'center',
    },
    arrowView1: {
        width: windowWidth(110),
        justifyContent: 'space-between',
        paddingHorizontal: windowHeight(9),
        alignItems: 'center',
        marginLeft: windowWidth(10),
    },
    arrowView2: {
        width: windowWidth(110),
        justifyContent: 'space-between',
        paddingHorizontal: windowHeight(9),
        alignItems: 'center',
        marginRight: windowWidth(10),
    },
    line: {
        height: windowHeight(42),
        borderRightWidth: windowHeight(0.9),
        borderRightColor: appColors.border
    },
    time: {
        color: appColors.primary,
        fontFamily: appFonts.medium
    },
    day: {
        color: appColors.blackColor,
        fontFamily: appFonts.medium
    },
    buttonView: {
        marginVertical: windowHeight(15),
    },
    closeBtn: {
        position: 'absolute',
        right: windowWidth(0),
    },
    img: {
        height: windowHeight(19),
        width: windowHeight(9),
    },
    imageView: {
        justifyContent: 'space-between',
        marginTop: windowHeight(9),
        width: '90%',
        marginHorizontal: windowHeight(12.8)
    },
    calanderStyle: {
        borderWidth: windowHeight(1),
        borderColor: appColors.border,
        paddingBottom: windowHeight(8.9),
        borderRadius: windowHeight(5),
    }
});
export default styles