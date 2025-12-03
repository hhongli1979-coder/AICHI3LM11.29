import { StyleSheet } from 'react-native';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { external } from '../../../styles/externalStyle';
import { commonStyles } from '../../../styles/commonStyle';

const styles = StyleSheet.create({
    container: {
        borderWidth: windowHeight(1),
        ...external.mb_15,
        borderRadius: windowHeight(5.5),
        backgroundColor: appColors.whiteColor,
        paddingVertical: windowHeight(10),
        ...external.fd_row,
        ...external.ph_10,
        ...commonStyles.shadowContainer,
        width: '96.3%',
        alignSelf: 'center',
    },
    viewText: {
        width: windowHeight(31),
        height: windowHeight(31),
        paddingHorizontal: windowWidth(20),
        paddingVertical: windowHeight(14),
        borderRadius: windowHeight(25),
        backgroundColor: appColors.lightGreen,
        ...external.ai_center,
        ...external.js_center,
    },
    titleText: {
        ...commonStyles.regularText,
        color: appColors.primaryText,
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT18,
    },
    subTitleText: {
        ...commonStyles.regularText,
        color: appColors.primaryText,
        fontFamily: appFonts.medium,
        fontSize: fontSizes.FONT18,
        paddingTop: windowHeight(2),
        width: '100%',
    },
    viewWidth: {
        width: windowWidth(20),
    },
    centerContainer: {
        ...external.ai_center,
        ...external.js_center,
        top: windowHeight(85),
    },
    image: {
        width: windowWidth(250),
        height: windowHeight(190),
    },
    title: {
        ...commonStyles.mediumTextBlack12,
        fontWeight: '700',
        fontSize: fontSizes.FONT22,
        marginTop: '14%',
    },
    text: {
        ...commonStyles.regularText,
        ...external.ti_center,
        ...external.ph_20,
        fontSize: fontSizes.FONT17,
        marginTop: windowHeight(12),
    },
    refreshButtonContainer: {
        width: '90%',
        marginTop: windowHeight(50),
    },
});

export { styles };