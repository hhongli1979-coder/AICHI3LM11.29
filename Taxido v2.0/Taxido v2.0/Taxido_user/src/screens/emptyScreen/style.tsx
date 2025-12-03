import { StyleSheet } from 'react-native';
import { external } from '../../styles/externalStyle';
import { commonStyles } from '../../styles/commonStyle';
import { fontSizes, windowHeight, windowWidth } from '@src/themes';
import { appColors } from '@src/themes'; 

export const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.whiteColor,
    flex: 1,
  },
  centerContainer: {
    ...external.fx_1,
    ...external.ai_center,
    ...external.js_center,
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
    marginTop: windowHeight(28),
  },
});
