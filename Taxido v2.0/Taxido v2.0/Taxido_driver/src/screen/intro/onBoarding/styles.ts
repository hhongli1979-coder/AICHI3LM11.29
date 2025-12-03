import {StyleSheet,DimensionValue,Dimensions,PixelRatio,Platform} from 'react-native'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'

export const SCREEN_HEIGHT = Dimensions.get('window').height
export const SCREEN_WIDTH = Dimensions.get('window').width

export const IsIOS = Platform.OS === 'ios'
export const IsIPAD = IsIOS && SCREEN_HEIGHT / SCREEN_WIDTH < 1.6

export const IsHaveNotch = SCREEN_HEIGHT > 750

export const Isiphone12promax = IsIOS && SCREEN_HEIGHT > 2778

export const windowHeight = (height: DimensionValue): number => {
  if (!height) {
    return 0
  }
  let tempHeight = SCREEN_HEIGHT * (parseFloat(height.toString()) / 667)
  return PixelRatio.roundToNearestPixel(tempHeight)
}

export const windowWidth = (width: DimensionValue): number => {
  if (!width) {
    return 0
  }
  let tempWidth = SCREEN_WIDTH * (parseFloat(width.toString()) / 480)
  return PixelRatio.roundToNearestPixel(tempWidth)
}

export const fontSizes = {
  FONT6: windowWidth(6),
  FONT7: windowWidth(7),
  FONT8: windowWidth(8),
  FONT9: windowWidth(9),
  FONT10: windowWidth(10),
  FONT11: windowWidth(11),
  FONT12: windowWidth(12),
  FONT13: windowWidth(13),
  FONT14: windowWidth(14),
  FONT15: windowWidth(15),
  FONT16: windowWidth(16),
  FONT17: windowWidth(17),
  FONT18: windowWidth(18),
  FONT19: windowWidth(19),
  FONT20: windowWidth(20),
  FONT21: windowWidth(21),
  FONT22: windowWidth(22),
  FONT23: windowWidth(23),
  FONT24: windowWidth(24),
  FONT25: windowWidth(25),
  FONT26: windowWidth(26),
  FONT27: windowWidth(27),
  FONT28: windowWidth(28),
  FONT30: windowWidth(30),
}

const styles = StyleSheet.create({
  slideContainer: {
    flex: 1,
    
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
    height: Platform.OS === "ios" ? windowHeight(390) : windowHeight(423),
    resizeMode: 'contain',
    bottom:windowHeight(20),
    marginBottom:windowHeight(45)
  },
  title: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT24,
    fontWeight: '500',
    marginTop: windowHeight(25),
    textAlign: 'center',
  },
  description: {
    fontFamily: appFonts.regular,
    color: appColors.secondaryFont,
    alignSelf: 'center',
    fontWeight: '400',
    paddingTop: windowHeight(12),
    width: '75%',
    fontSize: fontSizes.FONT19,
    lineHeight: windowHeight(17),
    textAlign: 'center',
  },
  backArrow: {
    width: windowHeight(34),
    height: windowHeight(34),
    borderRadius: windowHeight(34),
    backgroundColor: appColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: windowHeight(0),
    position: 'absolute',
  },
  img: {
    width: '100%',
    height: windowHeight(213),
    marginBottom: windowHeight(30),
  },
  activeStyle: {
    width: '6%',
    backgroundColor: appColors.primary,
    height: windowHeight(4.6),
  },
  paginationStyle: {
    height: '25%',
  },
  imageBgView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  flagImage: {
    height: windowHeight(20),
    width: windowHeight(20),
    borderRadius: windowHeight(10),
  },
  downArrow: {
    paddingVertical: windowHeight(4),
    paddingHorizontal: windowWidth(5),
  },
  dropdownManu: {
    borderRadius: windowHeight(4),
    borderWidth: windowHeight(0),
  },
  dropdownContainer: {
    width: windowWidth(180),
    borderWidth: windowHeight(0),
    color: appColors.alertBg,
  },
  labelStyle: {
    fontFamily: appFonts.medium,
  },
  dropdown: {
    borderWidth: windowHeight(0),
    backgroundColor: 'transparent',
  },
  skipText: {
    color: appColors.secondaryFont,
    marginTop: windowHeight(2),
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT19,
    marginHorizontal: windowHeight(9),
    borderWidth: windowHeight(1),
    padding: windowHeight(8),
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(4),
  },
})
export { styles }
