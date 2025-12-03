import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import {
  windowHeight,
  windowWidth,
  fontSizes,
} from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'

const styles = StyleSheet.create({
  space: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(0.8),
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(1.5),
  },
  filledBar: {
    backgroundColor: appColors.primary,
    flex: 1,
    height: windowHeight(0.7),
    borderRadius: windowHeight(1),
    marginHorizontal: windowWidth(0.3),
  },
  emptyBar: {
    flex: 1,
    height: windowHeight(0.7),
    borderRadius: windowHeight(1),
    marginHorizontal: windowWidth(0.3),
  },
  accNumber: {
    marginHorizontal: windowWidth(4),
  },
  btnContainer: {
    marginVertical: windowHeight(2),
  },
  input: {

    width: '70%'
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: windowWidth(4),
    justifyContent: 'space-between',

  },
  codeText: { fontSize: fontSizes.FONT3SMALL, color: appColors.black, },
  main: {
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
    fontFamily: appFonts.regular,
  },
  contactTitle: {
    marginTop: windowHeight(2.5),
    marginBottom: windowHeight(1.5),
    fontFamily: appFonts.medium,
  },
  codeComponent: {
    marginRight: windowWidth(2.5),
  },
  button: {
    marginTop: windowHeight(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  countryCodeContainer: {
    marginTop: windowHeight(0.5),
    marginHorizontal: windowWidth(5)
  },
  countryCode: {
    height: windowHeight(6.3),
    width: windowWidth(20),
    paddingHorizontal: windowWidth(1.5),
    paddingVertical: windowHeight(1),
    borderRadius: windowWidth(1.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: windowHeight(0.1),

    marginRight: windowWidth(1)
  },
  dialCode: {
    color: appColors.secondaryFont,
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.medium,
  },

  errorText: {
    color: appColors.red,
    fontSize: fontSizes.FONT3,
    marginTop: windowHeight(0.5),
  },
  demoBtn: { marginTop: windowHeight(2) },
  text: {
    fontFamily: appFonts.regular,
  },
  password: { bottom: windowHeight(0.6) },
  view: {
    marginRight: windowWidth(10)
  }
})
export default styles
