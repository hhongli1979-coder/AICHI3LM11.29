import { StyleSheet } from 'react-native';
import { commonStyles } from '../../styles/commonStyle';
import { windowHeight, windowWidth } from '@src/themes';
import { external } from '../../styles/externalStyle';
import { appColors } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    width: windowWidth(125),
    height: windowHeight(80),
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(5),
    ...external.mv_10,
    ...external.ai_center,
    ...external.js_center,
    borderWidth: windowHeight(1),
    borderColor: appColors.primaryGray,
    ...commonStyles.shadowContainer,
  },
  img: {
    width: windowWidth(70),
    height: windowHeight(42),
    ...external.rm_contain,
  },
  viewContainer: {
    backgroundColor: appColors.alertBg,
    borderRadius: windowHeight(4),
    ...external.ai_center,
    ...external.js_center,
    ...external.fd_row,
    paddingVertical: windowHeight(10),
    ...external.mt_20,
    ...external.mh_20,
  },
  fareStyle: {
    ...commonStyles.mediumTextBlack12,
    color: appColors.alertRed,
    paddingHorizontal: windowHeight(5),
  },
  textContainer: {
    ...commonStyles.regularText,
    ...external.mt_10,
    ...external.ph_20,
    color: appColors.primaryText,
  },
  infoIcon: {
    position: 'absolute',
    top: windowHeight(7),
    left: windowHeight(7)
  },
  layer: {
    position: 'absolute',
    width: windowWidth(124),
    height: windowHeight(79),
    backgroundColor: appColors.modelBg,
    borderRadius: windowHeight(4),
  },
});

export { styles };
