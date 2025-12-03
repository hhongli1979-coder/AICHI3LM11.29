import { StyleSheet } from "react-native";
import { appColors, fontSizes, windowHeight, windowWidth, appFonts } from '@src/themes';

const styles = StyleSheet.create({

    mapSection: {
        flex: 0.7,
    },
    mainView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: windowHeight(195),
        flexDirection: 'column',
    },
    card1: {
        height: windowHeight(125),
        marginHorizontal: windowWidth(12),
        borderRadius: windowHeight(5),
        marginVertical: windowHeight(8)
    },
    subCard1: {
        justifyContent: 'space-between',
        marginHorizontal: windowWidth(12),
        marginVertical: windowHeight(13)
    },
    driverImage: {
        height: windowHeight(42),
        width: windowWidth(62),
        resizeMode: 'contain',
    },
    details: {
        marginHorizontal: windowWidth(6),
        marginVertical: windowHeight(7)
    },
    name: {
        fontFamily: appFonts.medium
    },
    totalReview: {
        color: appColors.regularText,
        fontFamily: appFonts.medium
    },
    message: {
        height: windowHeight(40),
        width: windowHeight(40),
        backgroundColor: appColors.lightGray,
        borderRadius: windowHeight(28),
        alignItems: 'center',
        justifyContent: 'center'
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
        fontFamily: appFonts.medium
    },
    taxiDetail: {
        justifyContent: 'space-between',
        marginHorizontal: windowWidth(12),
        alignItems: "center",
    },
    taxiType: {
        marginVertical: windowHeight(7),
        fontFamily: appFonts.regular
    },
    share: {
        marginVertical: windowHeight(7),
        fontFamily: appFonts.medium
    },
    card2: {
        height: windowHeight(45),
        marginHorizontal: windowWidth(12),
        borderRadius: windowHeight(5),
        alignSelf: 'center',
        justifyContent: 'space-between',
        width: '95%',

    },
    topView: {
        justifyContent: 'space-between',
        marginHorizontal: windowWidth(12),
        marginTop: windowHeight(13),
        marginBottom: windowHeight(8)
    },
    fareView: {
        alignItems: 'center'
    },
    total: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT22,
    },
    amount: {
        color: appColors.primary,
        fontFamily: appFonts.bold,
        fontSize: fontSizes.FONT20,
        marginHorizontal: windowWidth(5)
    },
    btnRetry: {
        backgroundColor: appColors.primary,
        paddingVertical: windowHeight(10),
        paddingHorizontal: windowWidth(35),
        borderRadius: windowHeight(9.4),

    },
    retry: {
        color: appColors.whiteColor,
        fontFamily: appFonts.regular
    },
    bgmodal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: appColors.modelBg
    },
    background: {
        paddingVertical: windowHeight(17),
        paddingHorizontal: windowWidth(12),
        borderRadius: windowHeight(9.4),
    },
    title: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT22,
        textAlign: 'center'
    },
    userAlign: {
        alignItems: 'center',
        marginTop: windowHeight(18)
    },
    modalImage: {
        height: windowHeight(52),
        width: windowWidth(76),
        resizeMode: 'contain',
    },
    modalName: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT19
    },
    modalMail: {
        fontSize: fontSizes.FONT15
    },
    lineImage: {
        height: 5,
        width: windowHeight(284),
        marginVertical: windowHeight(8),
        resizeMode: 'stretch',
    },
    rate: {
        fontFamily: appFonts.medium
    },
    tips: {
        marginTop: windowHeight(18),
        fontFamily: appFonts.medium
    },
    border2: {
        borderBottomWidth: windowHeight(0.9),
        marginVertical: windowHeight(18),
        borderBottomColor: appColors.primaryGray
    },
    comment: {
        fontFamily: appFonts.medium,
        marginVertical: windowHeight(8)
    },
    textinput: {
        height: windowHeight(85),
        borderWidth: windowHeight(1),
        borderColor: appColors.primaryGray,
        borderRadius: windowHeight(5),
    },
    payment: {
        fontFamily: appFonts.medium,
        marginVertical: windowHeight(8)
    },
    modalPaymentView: {
        borderWidth: windowHeight(1),
        paddingVertical: windowHeight(8),
        marginBottom: windowHeight(16),
        borderRadius: windowHeight(5),
        borderColor: appColors.primaryGray,
        justifyContent: 'space-between',
        paddingHorizontal: windowWidth(10)
    },
    paynow: {
        color: appColors.whiteColor,
        fontFamily: appFonts.regular
    },
    paymentView: {
        marginHorizontal: windowWidth(12),
        marginVertical: windowHeight(6)
    },
    google: {
        height: windowHeight(25),
        width: windowWidth(35),
        resizeMode: 'contain',
        marginHorizontal: windowWidth(8),
        marginVertical: windowHeight(4)
    },
    mailInfo: {
        marginHorizontal: windowWidth(6),
        justifyContent: 'center'
    },
    mail: {
        fontFamily: appFonts.regular
    },
    payBtn: {
        backgroundColor: appColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth(95),
        borderRadius: windowHeight(8),
        marginHorizontal: windowWidth(6),
        height: windowHeight(35)
    },
    containerReview: {
        height: windowHeight(44),
        borderWidth: windowHeight(1),
        borderColor: appColors.primaryGray,
        borderRadius: windowHeight(5),
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
        marginHorizontal: windowWidth(18)
    },
    rating: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT16,
        marginHorizontal: windowWidth(4)
    },
    buttonContainer: {
        marginTop: windowHeight(8),
    },
    button: {
        paddingVertical: windowHeight(8),
        paddingHorizontal: windowWidth(10),
        borderRadius: windowHeight(5),
        marginHorizontal: windowWidth(6),
        flex: 1,
        alignItems: 'center',
        borderWidth: windowHeight(1),
        marginVertical: windowHeight(4)
    },
    buttonText: {
        fontFamily: appFonts.medium,
    },
    payImage: {
        height: windowHeight(35),
        width: windowWidth(50),
        resizeMode: 'contain',
    },
    notice: {
        color: appColors.regularText,
        fontFamily: appFonts.regular
    },
    buttonView: {
        alignSelf: 'center', alignItems: 'center', alignContent: 'center'
    },
    totalView: {
        alignItems: 'center', justifyContent: 'center'
    },
    image: {
        width: 100, height: 100
    },
    backIconView: { position: 'absolute', backgroundColor: appColors.lightGray, height: windowHeight(37), width: windowHeight(37), zIndex: 5, margin: windowHeight(10), borderRadius: windowHeight(8), justifyContent: 'center', alignItems: 'center' },
    totalMainView: {
        width: windowHeight(0.9),
        height: '50%',
        backgroundColor: appColors.categoryTitle,
        marginVertical: 13
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    usedView: { height: 50, width: '45%', marginHorizontal: 8, justifyContent: 'space-evenly', borderRadius: windowHeight(9) },
    viewMain: { height: 50, width: '100%', position: 'absolute', top: 60, justifyContent: 'space-evenly' },
    star: { marginVertical: windowHeight(3) },
    textName: {
        fontFamily: appFonts.medium,
    },
    shareTripView: {
        alignItems: "center",
        justifyContent: "center",
    },

})
export default styles