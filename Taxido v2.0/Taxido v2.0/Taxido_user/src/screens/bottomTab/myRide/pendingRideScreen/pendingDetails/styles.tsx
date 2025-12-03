import { StyleSheet } from 'react-native';
import { appColors, appFonts, windowHeight, windowWidth } from '@src/themes';
import { external } from '../../../../../styles/externalStyle';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.whiteColor,
    marginHorizontal: windowWidth(24),
    marginVertical: windowHeight(5),
    borderRadius: windowHeight(5),
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    overflow: 'hidden',
  },
  pendingViewContainer: {
    ...external.ph_13,
    ...external.pv_10,
    ...external.ai_center,
    ...external.mb_5,
    paddingVertical: windowHeight(12),
    borderRadius: windowHeight(5),
    marginHorizontal: windowHeight(15),
    backgroundColor: appColors.whiteColor,

  },
  pin: {
    backgroundColor: appColors.primary,
    paddingVertical: windowHeight(3),
    paddingHorizontal: windowWidth(11),
    borderRadius: windowHeight(3),
    marginHorizontal: windowWidth(2),
    color: appColors.whiteColor,
  },
  cargoImg: {
    width: "100%",
    height: windowHeight(100),
  },
  textStyle: {
    color: appColors.primaryText,
    fontFamily: appFonts.regular,
  },
  dataContainer: {
    justifyContent: "space-between",
    marginBottom: windowHeight(4),
  },
  parcelView: {
    justifyContent: "space-between",
    marginBottom: windowHeight(4),
  },
  paragraphText: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(10),
  },
  rideDetailsView: { marginHorizontal: windowWidth(15) },
  rideOTPText: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
  },
});

export { styles };
