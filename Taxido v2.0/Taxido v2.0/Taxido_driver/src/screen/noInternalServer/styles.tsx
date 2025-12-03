import { StyleSheet } from 'react-native';
import { windowHeight, windowWidth } from '../../theme/appConstant';
import appFonts from '../../theme/appFonts';
import { fontSizes } from '../intro/onBoarding/styles';
import appColors from '../../theme/appColors';


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    mainView: { alignItems: "center", justifyContent: 'center', marginTop: windowHeight(3) },
    info: { marginHorizontal: windowWidth(9), alignItems: "center", top: windowHeight(1) },
    image: {
        height: windowHeight(38),
        width: windowHeight(38),
        resizeMode: 'contain',
    },
    title: {
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT23,
    },
    details: {
        fontFamily: appFonts.regular,
        color: appColors.darkText,
        textAlign: 'center',
        marginVertical: windowHeight(2),
        marginHorizontal: windowWidth(5)
    },
    refButton: {
        backgroundColor: appColors.primary,
        paddingHorizontal: windowHeight(20),
        paddingVertical: windowHeight(8),
        borderRadius: windowHeight(4)
    },
    refText: {
        color: appColors.white,
        fontFamily: appFonts.regular
    }
});
export { styles };
