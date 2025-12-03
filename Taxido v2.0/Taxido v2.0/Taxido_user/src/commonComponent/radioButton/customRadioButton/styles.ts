import { StyleSheet } from 'react-native';
import { appColors, fontSizes } from '@src/themes';
import { windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
    radioButton: {
        alignItems: 'center',
    },
    radioButtonOuter: {
        height: windowHeight(17),
        width: windowHeight(17),
        borderRadius: windowHeight(11),
        borderWidth: windowHeight(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonInner: {
        height: windowHeight(8),
        width: windowWidth(12),
        borderRadius: windowHeight(7),
        backgroundColor: appColors.primary,
    },
    label: {
        marginHorizontal: windowHeight(6),
        fontSize: fontSizes.FONT13,
    },
});

export default styles;