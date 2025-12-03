import { StyleSheet } from 'react-native';
import { appColors, windowHeight } from '@src/themes';


const styles = StyleSheet.create({
    driverMarker: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    marker: {
        width: windowHeight(25),
        height: windowHeight(25),
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
        backgroundColor: appColors.blackColor,
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    loadingIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: appColors.modelBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export { styles };
