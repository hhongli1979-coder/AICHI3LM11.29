import { StyleSheet } from 'react-native';
import { external } from '../../../styles/externalStyle';
import { appColors } from '@src/themes';
import { commonStyles } from '../../../styles/commonStyle';
import { fontSizes, windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    ...external.fx_1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  popupContainer: {
    backgroundColor: appColors.whiteColor,
    shadowColor: appColors.blackColor,
    borderRadius: windowHeight(4),
    ...commonStyles.shadowContainer,
    ...external.pv_5,
  },
  popupHeader: {
    ...external.js_space,
    ...external.ph_10,
    ...external.pt_10,
    ...external.Pb_10,
  },
  popupHeaderText: {
    ...commonStyles.regularText,
    fontSize: fontSizes.FONT19,
    color: appColors.primaryText,
  },
  changeText: {
    ...commonStyles.mediumTextBlack12,
    color: appColors.primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  solidLine: {
    marginVertical: windowHeight(0.8),
  },
  locationContainer: {
    ...external.ph_20,
    ...external.pt_5,
    ...external.mt_10,
    ...external.mb_10,
  },
  locationIconContainer: {
    width: windowHeight(24),
    height: windowHeight(24),
    borderRadius: windowHeight(24),
    ...external.ai_center,
    ...external.js_center,
  },
  locationTextContainer: {
    ...external.mh_5,
  },
  locationTitle: {
    ...commonStyles.mediumTextBlack12,
    ...external.mt_2,
    fontSize: fontSizes.FONT19,
  },
  locationAddress: {
    ...commonStyles.regularText,
    ...external.mt_3,
    width: windowWidth(300),
    lineHeight: windowHeight(18),
  },
  confirmButtonContainer: {
    ...external.mv_15,
  },
  backButton: {
    backgroundColor: appColors.whiteColor,
    height: windowHeight(34),
    width: windowHeight(34),
    borderRadius: windowHeight(17),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight(15)
  },
  SolidLineView: {
    alignSelf: 'center',
  },
});

export { styles };
