import { StyleSheet } from 'react-native';
import { commonStyles } from '../../../../styles/commonStyle';
import { external } from '../../../../styles/externalStyle';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
  textContainer: {
    ...commonStyles.regularText,
    ...external.pt_5,
    color: appColors.categoryTitle,
  },
  img: {
    width: windowWidth(350),
    height: windowHeight(120),
  },
  itemSeparator: {
    width: windowWidth(25),
  },
  readyText: {
    ...commonStyles.mediumTextBlack12,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT19,
    color: appColors.whiteColor,
  },
  imgBg: {
    height: windowHeight(82),
    width: '100%',
    borderRadius: windowHeight(6),
  },
  roundedShadowContainer: {
    width: windowHeight(22),
    height: windowHeight(22),
    borderRadius: windowHeight(20),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  mainContainer: {
    backgroundColor: appColors.whiteColor,
    width: '47.3%',
    height: windowHeight(160),
    marginBottom: windowHeight(15),
    borderRadius: windowHeight(6),
  },
  imageView: {
    padding: windowHeight(5),
  },
  text: {
    marginHorizontal: windowWidth(5),
    fontFamily: appFonts.regular,
    color: appColors.regularText,
  },
  name: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
    width: windowWidth(120),
    height: windowHeight(30),
    marginTop: windowHeight(18),
  },
  mainView: {
    justifyContent: 'space-between',
    height: windowHeight(20),
    alignItems: 'center',
    marginVertical: windowHeight(8),
    marginHorizontal: windowWidth(5),
  },
});

export { styles };
