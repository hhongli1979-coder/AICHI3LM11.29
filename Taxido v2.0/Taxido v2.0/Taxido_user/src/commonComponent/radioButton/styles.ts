import { StyleSheet } from 'react-native';
import { fontSizes, windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButtonOuter: {
        height: windowHeight(2.8),
        width: windowWidth(5.6),
        borderRadius: windowHeight(11),
        borderWidth: windowHeight(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonInner: {
        height: windowHeight(1.5),
        width: windowWidth(3),
        borderRadius: windowHeight(7),
    },
    label: {
        marginHorizontal: windowHeight(6),
        fontSize: fontSizes.FONT13,
    },
});

export default styles;