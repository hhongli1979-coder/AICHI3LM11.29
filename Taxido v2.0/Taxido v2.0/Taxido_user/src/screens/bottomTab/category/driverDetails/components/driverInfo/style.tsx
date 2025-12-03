import { StyleSheet } from 'react-native';
import { external } from '../../../../../../styles/externalStyle';
import { appColors, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { commonStyles } from '../../../../../../styles/commonStyle';

const styles = StyleSheet.create({
  container: {
    marginTop: windowHeight(55),
  },
  profileContainer: {
    width: '100%',
    ...commonStyles.shadowContainer,
    borderRadius: windowHeight(9),
    ...external.pv_10,
  },
  profileImage: {
    ...external.as_center,
    height: windowHeight(77),
    width: windowHeight(77),
    position: 'absolute',
    top: -windowHeight(38),
    borderWidth: windowHeight(1),
    borderRadius: windowHeight(77),
    borderColor: appColors.lightGray,
  },
  profileName: {
    ...external.as_center,
    ...commonStyles.extraBold,
    fontWeight: '500',
    color: appColors.primaryText,
    fontSize: fontSizes.FONT23,
    paddingTop: windowHeight(34),
  },
  driverDetailItem: {
    ...external.fd_row,
    ...external.js_space,
    ...external.ph_20,
  },
  detailTextContainer: {
    ...external.fd_row,
    ...external.mt_12,
    ...external.mh_20,
    ...external.mt_25,
  },
  detailNumber: {
    ...commonStyles.mediumTextBlack12,
    ...external.ti_center,
    color: appColors.primary,
    fontSize: fontSizes.FONT24,
  },
  vehicleContainer: {
    width: '90%',
    height: windowHeight(75),
    alignSelf: 'center',
    marginHorizontal: windowHeight(16),
    marginTop: windowHeight(16),
    borderRadius: windowHeight(5.9),
    paddingVertical: windowHeight(16),
    paddingHorizontal: windowHeight(16),
    ...external.js_space,
    ...external.ai_center,
  },
  vehicleText: {
    ...commonStyles.regularText,
    fontSize: fontSizes.FONT19,
  },
  vehicleNumber: {
    ...commonStyles.extraBold,
    ...external.pt_5,
    fontSize: fontSizes.FONT23,
  },
  imgStyle: {
    width: windowWidth(150),
    height: windowHeight(36),
    resizeMode: 'contain'
  },
  carView: {
    marginVertical: windowHeight(2),
    marginHorizontal: windowHeight(2.8),
  },
});
export { styles };
