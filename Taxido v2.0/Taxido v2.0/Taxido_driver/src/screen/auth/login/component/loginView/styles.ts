import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { windowHeight, windowWidth, fontSizes } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: windowWidth(4),
    justifyContent: 'space-between',
  },
  codeText: {
    fontSize: fontSizes.FONT3SMALL,
    color: appColors.black,
    width: '90%',
  },
  container: {
    marginVertical: windowHeight(2),
  },
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
  },
  countryCodeContainer: {
    marginTop: windowHeight(2.5),
  },
  countryCode: {
    height: windowHeight(7),
    width: windowWidth(21),
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
  errorText: {
    color: appColors.red,
    fontSize: fontSizes.FONT3,
    marginTop: windowHeight(0.5),
  },
  demoBtn: {
    marginTop: windowHeight(2),
  },
})

export default styles
