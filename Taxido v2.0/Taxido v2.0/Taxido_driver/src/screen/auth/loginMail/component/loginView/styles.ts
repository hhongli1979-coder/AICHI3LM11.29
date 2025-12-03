import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { windowHeight, windowWidth, fontSizes } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    flex: 1,
    borderTopRightRadius: windowWidth(5),
    borderTopLeftRadius: windowWidth(5),
  },
  subView: {
    marginHorizontal: windowWidth(4),
  },
  mainTitle: {
    fontSize: fontSizes.FONT6,
    fontFamily: appFonts.medium,
  },
  subTitle: {
    color: appColors.secondaryFont,
    marginTop: windowHeight(0.5),
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.medium,
  },
  contactTitle: {
    marginTop: windowHeight(2.5),
    marginBottom: windowHeight(1.5),
    fontFamily: appFonts.medium,
  },
  codeComponent: {
    marginRight: windowWidth(2.5),
  },

  countryCode: {
    height: windowHeight(7),
    width: windowWidth(16),
    backgroundColor: appColors.graybackground,
    paddingHorizontal: windowWidth(1.5),
    paddingVertical: windowHeight(1),
    borderRadius: windowWidth(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: windowHeight(0.1),
  },
  dialCode: {
    color: appColors.secondaryFont,
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.medium,
  },
  or: {
    height: windowHeight(7),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: windowHeight(1),
  },
  errorText: {
    color: 'red',
    fontSize: fontSizes.FONT3HALF,
    marginTop: windowHeight(0.5),
  },
  demoBtn: {
    borderColor: appColors.primary,
    borderWidth: windowHeight(0.1),
    borderRadius: windowWidth(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: windowHeight(2),
    marginHorizontal: windowWidth(4),
    height: windowHeight(6),
  },
  demoTitle: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
  },
})

export default styles
