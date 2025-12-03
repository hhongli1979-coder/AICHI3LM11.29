import { StyleSheet } from 'react-native';
import { external } from '../../../../../../styles/externalStyle';
import { commonStyles } from '../../../../../../styles/commonStyle';
import { fontSizes, windowHeight } from '@src/themes';
import { appColors } from '@src/themes'; 

export const styles = StyleSheet.create({
  container: {
    ...external.mh_20,
    ...external.mt_15,
    borderRadius: windowHeight(20),
  },
  alertBox: {
    ...external.pt_10,
    backgroundColor: appColors.alertBg,
    borderRadius: windowHeight(8),
  },
  alertText: {
    ...commonStyles.regularText,
    ...external.ph_13,
    color: appColors.alertRed,
    fontSize: fontSizes.FONT19,
  },
  alertItem: {
    ...external.fd_row,
    ...external.ai_center,
    ...external.ph_20,
    ...external.pt_10,
    ...external.pv_10,
  },
  alertIcon: {
    width: windowHeight(32),
    height: windowHeight(32),
    backgroundColor: appColors.alertBg,
    borderRadius: windowHeight(16),
  },
  alertItemText: {
    ...commonStyles.regularText,
    paddingLeft: windowHeight(8),
    color: appColors.alertRed,
    fontSize: fontSizes.FONT19,
  },
});
