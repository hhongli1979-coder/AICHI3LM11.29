import { StyleSheet } from 'react-native';
import { appColors } from '@src/themes';
import { external } from '../../../../../styles/externalStyle';
import { windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
    container: {
        backgroundColor: appColors.whiteColor,
        marginHorizontal: windowWidth(24),
        marginVertical: windowHeight(9),
        borderRadius: windowHeight(5.8),
        borderColor: appColors.border,
        borderWidth: windowHeight(1),
        overflow: 'hidden',
    },
    viewData: {
        backgroundColor: appColors.primary,
        marginHorizontal: windowWidth(3),
        borderRadius: windowHeight(1.8),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: windowWidth(8),
        paddingVertical: windowHeight(3),
    },
    pendingViewContainer: {
        ...external.ph_13,
        ...external.pv_10,
        ...external.ai_center,
        ...external.mb_5,
    },
});

export { styles };
