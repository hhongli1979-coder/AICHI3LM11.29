import { StyleSheet } from 'react-native';
import { appColors } from '@src/themes';
import { appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    mainView: {
        alignItems: "center",
        justifyContent: 'center',
        marginTop: windowHeight(15),
    },
    info: {
        marginHorizontal: windowWidth(9),
        alignItems: "center",
        top: windowHeight(1),
    },
    image: {
        height: windowHeight(210),
        width: windowHeight(210),
        resizeMode: 'contain',
    },
    title: {
        fontFamily: appFonts.bold,
        fontSize: fontSizes.FONT23,
    },
    details: {
        fontFamily: appFonts.regular,
        color: appColors.regularText,
        textAlign: 'center',
        marginVertical: windowHeight(5),
        marginHorizontal: windowWidth(30),
    },
    refButton: {
        backgroundColor: appColors.primary,
        paddingHorizontal: windowHeight(20),
        paddingVertical: windowHeight(8),
        borderRadius: windowHeight(4),
    },
    refText: {
        color: appColors.whiteColor,
        fontFamily: appFonts.regular,
    },
});

export { styles };
