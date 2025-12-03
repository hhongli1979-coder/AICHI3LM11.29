import { StyleSheet } from 'react-native';
import { appColors,appFonts, windowHeight, windowWidth, fontSizes } from '@src/themes'; 

export const styles = StyleSheet.create({
    row: {
        paddingHorizontal: windowHeight(2),
        alignItems: 'center',
        paddingBottom: windowHeight(2),
    },
    rowContainer: {
        borderColor: appColors.border,
        borderWidth: windowHeight(1),
        alignItems: 'center',
        paddingVertical: windowWidth(8),
        borderRadius: windowWidth(5),
        justifyContent: 'space-between',
        width: windowWidth(80),
        paddingHorizontal: windowWidth(14.5),
        backgroundColor: appColors.whiteColor,
    },
    textStyle: {
        color: appColors.primaryText,
        fontFamily: appFonts.regular,
        fontSize: fontSizes.FONT15,
        right: windowWidth(2),
    },
    dropdown: {
        padding: windowHeight(1.9),
        left: windowHeight(4),
    },
});
