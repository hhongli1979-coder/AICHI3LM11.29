import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import { windowHeight, windowWidth, fontSizes } from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  codeText: {
    fontSize: fontSizes.FONT3SMALL,
    color: appColors.black,
    top: windowHeight(0),
  },
  main: {
    flex: 1,
  },
  subView: {
    height: '100%',
  },
  space: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(0.8),
  },
  margin: {
    marginVertical: windowHeight(2),
    marginBottom: windowHeight(1.8),
  },
  codeComponent: {
    marginRight: windowWidth(3),
  },
  countryCode: {
    height: windowHeight(6.5),
    width: windowWidth(19),
    backgroundColor: appColors.white,
    borderRadius: windowHeight(0.8),
    justifyContent: 'center',
    borderWidth: windowHeight(0.1),
    borderColor: appColors.border,
  },
  dialCode: {
    color: appColors.secondaryFont,
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.medium,
  },
  errorText: {
    color: appColors.red,
    fontSize: fontSizes.FONT3,
    marginTop: 4,
  },
  number: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
    paddingHorizontal: windowHeight(2.3),
    width: '100%',
  },
  password: {
    bottom: windowHeight(0.6),
  },
  email: {
    top: windowHeight(0.8),
  },
  phone: {
    width: '78%',
    height: windowHeight(6.3),
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(0.6),
    overflow: 'hidden',
  },
  country: {
    marginBottom: windowHeight(0),
    marginTop: windowHeight(0.3),
  },
  mobileNumber: {
    fontFamily: appFonts.medium,
    bottom: windowHeight(0.5),
  },
  name: {
    bottom: windowHeight(0.9),
  },
  view: {
    marginRight: windowWidth(10),
  },
  placeholderStyles: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
  },
  text: {
    fontFamily: appFonts.regular,
  },
  container: {
    marginBottom: windowHeight(0),
  },
})
export default styles
