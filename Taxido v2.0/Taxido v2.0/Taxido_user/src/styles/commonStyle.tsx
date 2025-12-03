import { StyleSheet } from 'react-native';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { external } from './externalStyle';

const commonStyles = StyleSheet.create({
  regularText: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
    color: appColors.regularText,

  },
  regularTextBigBlack: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT27,
    color: appColors.primaryText,

  },
  mediumTextBlack: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT20,
    color: appColors.primaryText,

  },
  extraBold: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT19,
    color: appColors.whiteColor,

  },
  mediumTextBlack12: {

    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT17,
    color: appColors.primaryText,
  },
  mediumText23: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT23,
    color: appColors.primaryText,

  },
  flexContainer: {
    ...external.fx_1,
  },
  flexEndContainer: {
    backgroundColor: appColors.whiteColor,
  },
  shadowContainer: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  heightHeader: {
    height: windowHeight(47),
  },
  popupText: {
    color: appColors.whiteColor,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT20,
    padding: windowHeight(1.5),
  },
  popupContainer: {
    backgroundColor: appColors.blackColor,
    borderRadius: windowHeight(7),
    paddingTop: windowHeight(5)
  },
  iconView: {
    marginVertical: windowHeight(7.8),
    marginHorizontal: windowHeight(4.8)
  },
  directionRow: {
    flexDirection: 'row'
  },
  iconSpace: {
    marginTop: windowHeight(2.8),
  },
  rating: {
    marginVertical: windowHeight(4.8),
    fontFamily: appFonts.regular
  },
  totalReview: {
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(4.8),
    marginHorizontal: windowWidth(1),
    color: appColors.primaryText
  },
  containerBtn: {
    marginHorizontal: windowHeight(14),
    alignItems: 'center'
  },
  iconButton: {
    height: windowHeight(5),
    width: windowWidth(10),
    borderRadius: windowHeight(19),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: windowHeight(1.8),
    borderWidth: windowHeight(1),
  },
  placeHolder: {
    color: appColors.iconColor,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.5),
    textAlign: 'center'
  },
});
export { commonStyles };
