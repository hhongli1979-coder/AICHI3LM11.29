import { StyleSheet } from "react-native";
import appColors from "../../theme/appColors";
import { fontSizes } from "../../theme/appConstant";
import appFonts from "../../theme/appFonts";

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    swipeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: appColors.primary,
    },
    swipeText: {
        color: appColors.white,
        fontSize: fontSizes.FONT4,
        position: 'absolute',
        textAlign: 'center',
        width: '100%',
        fontFamily: appFonts.medium,
    },
    slider: {
        backgroundColor: appColors.white,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: appColors.black,
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
});

export default styles;
