import { StyleSheet } from 'react-native';
import { external } from '../../../styles/externalStyle';
import { commonStyles } from '../../../styles/commonStyle';
import { appColors, appFonts, fontSizes, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
  newUserContainer: {
    ...external.fd_row,
    ...external.ai_center,
    ...external.mt_12,
    ...external.as_center,
  },
  newUser: {
    fontSize: fontSizes.FONT19,
    fontFamily: appFonts.regular,
    color: appColors.regularText,
  },
  signUpText: {
    ...commonStyles.mediumTextBlack12,
    fontFamily: appFonts.bold,
    paddingHorizontal: windowWidth(5),
    fontSize: fontSizes.FONT19,
  },
});

export default styles;