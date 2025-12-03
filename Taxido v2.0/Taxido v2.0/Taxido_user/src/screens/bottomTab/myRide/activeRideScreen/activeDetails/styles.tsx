import { StyleSheet } from 'react-native';
import { appColors, windowHeight, windowWidth } from '@src/themes'; 
import { external } from '../../../../../styles/externalStyle';

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
    pendingViewContainer: {
        ...external.ph_13,
        ...external.pv_10,
        ...external.ai_center,
        ...external.mb_5,
    },
});
export { styles };
