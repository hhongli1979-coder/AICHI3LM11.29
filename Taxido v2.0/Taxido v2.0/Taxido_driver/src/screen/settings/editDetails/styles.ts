import { Platform, StyleSheet } from 'react-native';
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant';
import appColors from '../../../theme/appColors';
import appFonts from '../../../theme/appFonts';

export const styles = StyleSheet.create({
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth(25),
    },
    codeText: {
        fontSize: fontSizes.FONT3HALF,
        color: appColors.primaryFont,
        fontFamily: appFonts.regular,
    },
    container: {
        flex: 1,
        marginBottom: windowHeight(5),
    },
    headerContainer: {
        backgroundColor: appColors.white,
        height: windowHeight(5),
    },
    warningText: {
        color: appColors.alertRed,
        marginTop: windowHeight(2),
        fontSize: fontSizes.FONT3
    },
    profileImageContainer: {
        alignSelf: 'center',
        marginTop: windowHeight(10),
        backgroundColor: appColors.white,
        height: windowHeight(30),
        width: windowHeight(30),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: windowHeight(15),
    },
    profileImageWrapper: {
        borderRadius: windowHeight(25),
        backgroundColor: appColors.white,
    },
    profileImage: {
        width: windowHeight(25),
        height: windowHeight(25),
        borderRadius: windowHeight(12.5),
    },
    editIconContainer: {
        width: windowHeight(8),
        height: windowHeight(8),
        backgroundColor: appColors.white,
        borderRadius: windowHeight(4),
        position: 'absolute',
        alignSelf: 'flex-end',
        flexGrow: 1,
        top: '68%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        ...Platform.select({
            android: {
                elevation: 2,
            },
        }),
    },
    inputContainer: {
        marginHorizontal: windowWidth(5),
        height: windowHeight(30),
        bottom: windowHeight(2),
        flex: 1,
        marginTop: windowHeight(5),
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: windowWidth(5),
        marginBottom: windowHeight(8),
    },
    containerStyle: {
        marginHorizontal: windowWidth(2),
        flex: 1,
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: windowHeight(0),
        width: windowWidth(25),
        paddingBottom: windowHeight(5),
    },
    char: {
        fontFamily: appFonts.bold,
        fontSize: fontSizes.FONT6,
        backgroundColor: appColors.primary,
        width: windowHeight(25),
        height: windowHeight(25),
        borderRadius: windowHeight(12.5),
        textAlign: 'center',
        paddingVertical: windowHeight(8),
    },
    countryCode: {
        justifyContent: "space-between",
        width: windowWidth(25),
    },
    dialCode: {
        color: appColors.secondaryFont,
        fontFamily: appFonts.regular
    },
    countryCodeContainer: {
        width: windowWidth(15),
        height: windowHeight(6),
        borderRadius: windowHeight(1),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: appColors.border,
    },
    phoneNumberInput: {
        width: windowWidth(40),
        height: windowHeight(6),
        backgroundColor: appColors.lightGray,
        borderRadius: windowHeight(1),
        // marginHorizontal: windowWidth(1),
        // borderWidth: windowHeight(0.2),
        borderColor: appColors.border,
        flexDirection: 'row',
    },
    iconContainer: {
        height: windowHeight(6),
        width: windowWidth(5),
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: windowHeight(0.5),
        marginHorizontal: windowWidth(1)
    },
    touchbleView: {
        position: "absolute",
        top: windowHeight(0),
        left: windowWidth(0),
        right: windowWidth(0),
        bottom: windowHeight(0),
    },
    countryMainView: {
        marginTop: windowHeight(5)
    },
    // Dark theme specific styles
    darkCountryCodeContainer: {
        backgroundColor: appColors.darkThemeSub,
        borderColor: appColors.darkborder,
    },
    darkPhoneNumberInput: {
        backgroundColor: appColors.darkThemeSub,
        borderColor: appColors.darkborder,
    },
    input:{
        backgroundColor:'red',
        width:'90%'
    }
});