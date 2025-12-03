import { StyleSheet } from 'react-native';
import { commonStyles } from '../../../styles/commonStyle';
import { external } from '../../../styles/externalStyle';
import { appColors, fontSizes, windowHeight, windowWidth, appFonts } from '@src/themes';

const styles = StyleSheet.create({
  slideContainer: {
    ...commonStyles.flexContainer,
  },
  languageContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: windowHeight(8),
    width: '100%',
    paddingHorizontal: windowWidth(5),
    zIndex: 1,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    marginBottom: windowHeight(40),
    resizeMode: 'contain',
    bottom: windowHeight(23),
  },
  title: {
    ...commonStyles.mediumText23,
    marginTop: windowHeight(32),
    ...external.ti_center,
  },
  description: {
    ...commonStyles.regularText,
    paddingTop: windowHeight(12),
    width: '75%',
    ...external.as_center,
    fontSize: fontSizes.FONT19,
    lineHeight: windowHeight(18),
    ...external.ti_center,
  },
  backArrow: {
    width: windowHeight(34),
    height: windowHeight(34),
    borderRadius: windowHeight(34),
    backgroundColor: appColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: 0,
    position: 'absolute',
  },
  img: {
    width: '100%',
    height: windowHeight(220),
    marginBottom: windowHeight(25),
  },
  activeStyle: {
    width: '6%',
    backgroundColor: appColors.primary,
    marginTop: windowHeight(13),
    height: windowHeight(5),
  },
  paginationStyle: {
    height: '25%',
    marginTop: windowHeight(13),
  },
  imageBgView: {
    ...commonStyles.flexContainer,
    ...external.js_end,
  },
  flagImage: {
    height: windowHeight(20),
    width: windowWidth(30),
    borderRadius: windowHeight(10),
  },
  downArrow: {
    paddingVertical: windowHeight(4),
    paddingHorizontal: windowWidth(5),
  },
  dropdownManu: {
    borderRadius: windowHeight(4.5),
    borderWidth: 0,
  },
  dropdownContainer: {
    width: windowWidth(180),
    borderWidth: 0,
    color: appColors.alertRed,
  },
  labelStyle: {
    fontFamily: appFonts.medium,
  },
  dropdown: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  skipText: {
    color: appColors.primaryText,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT18,
  },
  dotStyles: {
    marginTop: windowHeight(13),
  },
});

export { styles };
