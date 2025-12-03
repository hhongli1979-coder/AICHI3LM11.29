import { StyleSheet } from "react-native";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
    mainView: {
        width: '100%',
        height: windowHeight(180),
        flexDirection: 'column',
    },
    pinView: {
        width: '40%',
        height: windowHeight(52),
        justifyContent: 'center',
    },
    pin: {
        backgroundColor: appColors.primary,
        paddingVertical: windowHeight(3),
        paddingHorizontal: windowWidth(11),
        borderRadius: windowHeight(3),
        marginHorizontal: windowWidth(2),
        color: appColors.whiteColor,
    },
    card1: {
        borderRadius: windowHeight(4.8),
        marginVertical: windowHeight(8),
    },
    subCard1: {
        justifyContent: 'space-between',
        marginVertical: windowHeight(10),
    },
    driverImage: {
        height: windowHeight(42),
        width: windowHeight(42),
        resizeMode: 'cover',
        borderRadius: windowHeight(30),
    },
    details: {
        marginHorizontal: windowWidth(6),
        marginVertical: windowHeight(7),
    },
    name: {
        fontFamily: appFonts.medium,
    },
    totalReview: {
        color: appColors.regularText,
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT15,
    },
    message: {
        height: windowHeight(40),
        width: windowHeight(40),
        borderRadius: windowHeight(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    call: {
        height: windowHeight(40),
        width: windowHeight(40),
        backgroundColor: appColors.lightGray,
        borderRadius: windowHeight(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    number: {
        marginHorizontal: windowWidth(12),
        fontSize: fontSizes.FONT22,
        fontFamily: appFonts.medium,
    },
    number1: {
        marginHorizontal: windowWidth(12),
        fontSize: fontSizes.FONT20,
        fontFamily: appFonts.medium,
    },
    taxiDetail: {
        justifyContent: 'space-between',
        marginHorizontal: windowWidth(12),
    },
    taxiType: {
        marginVertical: windowHeight(7),
        fontFamily: appFonts.regular,
    },
    share: {
        marginVertical: windowHeight(7),
        fontFamily: appFonts.regular,
    },
    card2: {
        height: windowHeight(50),
    },
    topView: {
        marginHorizontal: windowWidth(12),
        marginTop: windowHeight(10),
        justifyContent: 'space-between',
    },
    fareView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    total: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT22,
    },
    amount: {
        color: appColors.primary,
        fontFamily: appFonts.bold,
        fontSize: fontSizes.FONT20,
        marginHorizontal: windowWidth(5),
    },
    btnRetry: {
        backgroundColor: appColors.primary,
        paddingVertical: windowHeight(10),
        paddingHorizontal: windowWidth(35),
        borderRadius: windowHeight(9),
    },
    retry: {
        color: appColors.whiteColor,
        fontFamily: appFonts.regular,
    },
    bgmodal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColors.modelBg,
    },
    background: {
        paddingVertical: windowHeight(17),
        paddingHorizontal: windowWidth(12),
        borderRadius: windowHeight(9),
    },
    title: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT22,
        textAlign: 'center',
    },
    userAlign: {
        alignItems: 'center',
        marginTop: windowHeight(18),
    },
    modalImage: {
        height: windowHeight(52),
        width: windowWidth(76),
        resizeMode: 'contain',
    },
    modalName: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT19,
    },
    modalMail: {
        fontSize: fontSizes.FONT15,
    },
    lineImage: {
        height: windowHeight(4.3),
        width: windowHeight(284),
        marginVertical: windowHeight(8),
        resizeMode: 'stretch',
    },
    rate: {
        fontFamily: appFonts.medium,
    },
    tips: {
        marginTop: windowHeight(18),
        fontFamily: appFonts.medium,
    },
    border2: {
        borderBottomWidth: windowHeight(0.9),
        marginVertical: windowHeight(18),
        borderBottomColor: appColors.primaryGray,
    },
    comment: {
        fontFamily: appFonts.medium,
        marginVertical: windowHeight(8),
    },
    textinput: {
        height: windowHeight(85),
        borderWidth: windowHeight(1),
        borderColor: appColors.primaryGray,
        borderRadius: windowHeight(4.9),
    },
    payment: {
        fontFamily: appFonts.medium,
        marginVertical: windowHeight(8),
    },
    modalPaymentView: {
        borderWidth: windowHeight(1),
        paddingVertical: windowHeight(8),
        marginBottom: windowHeight(16),
        borderRadius: windowHeight(4.9),
        borderColor: appColors.primaryGray,
        justifyContent: 'space-between',
        paddingHorizontal: windowWidth(10),
    },
    paynow: {
        color: appColors.whiteColor,
        fontFamily: appFonts.regular,
    },
    paymentView: {
        marginHorizontal: windowWidth(12),
        marginVertical: windowHeight(6),
    },
    google: {
        height: windowHeight(25),
        width: windowWidth(35),
        resizeMode: 'contain',
        marginHorizontal: windowWidth(8),
        marginVertical: windowHeight(4),
    },
    mailInfo: {
        marginHorizontal: windowWidth(6),
        justifyContent: 'center',
    },
    mail: {
        fontFamily: appFonts.regular,
    },

    payBtn: {
        backgroundColor: appColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth(95),
        borderRadius: windowHeight(7),
        marginHorizontal: windowWidth(6),
        height: windowHeight(35),
    },
    containerReview: {
        height: windowHeight(44),
        borderWidth: windowHeight(1),
        borderColor: appColors.primaryGray,
        borderRadius: windowHeight(4.9),
        marginTop: windowHeight(8),
        justifyContent: 'space-between',
    },
    starIcon: {
        marginHorizontal: windowWidth(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingView: {
        alignItems: 'center',
        marginHorizontal: windowWidth(18),
        justifyContent: 'center',
    },
    borderVertical: {
        borderColor: appColors.primaryGray,
        borderRightWidth: windowHeight(0.9),
        height: windowHeight(16),
        marginHorizontal: windowWidth(18),
    },
    rating: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT16,
    },
    buttonContainer: {
        marginTop: windowHeight(8),
    },
    button: {
        paddingVertical: windowHeight(8),
        paddingHorizontal: windowWidth(10),
        borderRadius: windowHeight(4.9),
        marginHorizontal: windowWidth(6),
        flex: 1,
        alignItems: 'center',
        borderWidth: windowHeight(1),
        marginVertical: windowHeight(4),
    },
    buttonText: {
        fontFamily: appFonts.medium,
    },
    sosImage: {
        height: windowHeight(17),
        width: windowHeight(17),
        resizeMode: 'contain',
    },
    sideLine: {
        height: windowHeight(15),
        width: windowWidth(1.5),
        backgroundColor: appColors.whiteColor,
        marginHorizontal: windowWidth(12),
    },
});
export default styles