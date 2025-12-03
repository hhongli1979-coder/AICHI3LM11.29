import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import { fontSizes } from '../../../chat/context'

const styles = StyleSheet.create({
  border: {
    borderBottomColor: appColors.secondaryFont,
    borderBottomWidth: windowHeight(0.1),
    marginVertical: windowHeight(3),
    borderStyle: 'dashed',
  },
  modalPaymentView: {
    justifyContent: 'space-between',
  },
  imageBg: {
    borderWidth: windowHeight(0.1),
    borderColor: appColors.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth(15),
    height: windowHeight(7),
  },
  paymentImage: {
    width: windowWidth(10),
    height: windowHeight(5),
    resizeMode: 'contain',
  },
  mailInfo: {
    marginHorizontal: windowWidth(4),
    justifyContent: 'center',
  },
  mail: {
    fontFamily: appFonts.regular,
  },
  payBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth(3),
    borderRadius: 8,
    marginHorizontal: windowWidth(3),
    height: windowHeight(5),
  },
  borderPayment: {
    borderBottomWidth: windowHeight(0.1),
    borderColor: appColors.graybackground,
    borderStyle: 'dashed',
    marginHorizontal: windowWidth(5),
  },
  addBalance: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT19,
  },
  amount: {
    color: appColors.secondaryFont,
    marginVertical: windowHeight(1.5),
    fontFamily: appFonts.regular,
  },
  inputView: {
    alignItems: 'center',
    borderRadius: windowWidth(1.5),
    borderWidth: windowHeight(0.1),
    paddingHorizontal: windowWidth(4),
  },
  textinput: {
    height: windowHeight(6.5),
    width: '100%',
    fontFamily: appFonts.regular,
    paddingHorizontal: windowWidth(2),
  },
  textInputDetail: {
    height: windowHeight(15),
    width: '100%',
    marginBottom: windowHeight(1),
    paddingHorizontal: windowWidth(4.5),
    paddingVertical: windowHeight(1.5),
    borderWidth: windowHeight(0.1),
    borderRadius: windowWidth(1.5),
    borderColor: appColors.border,
    marginTop: windowHeight(0.1),
  },
  title: {
    marginTop: windowHeight(1.9),
    marginBottom: windowHeight(1),
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT19,
  },

  inputContainer: {
    height: '58%',
    justifyContent: 'space-between'
  },
  modalMessage: {
    fontSize: fontSizes.FONT19,
    textAlign: 'center',
    marginVertical: windowHeight(1),
    lineHeight: fontSizes.FONT19 * 1.3,
    bottom: windowHeight(1),
    fontFamily: appFonts.medium,
  },
  view: {
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})
export default styles
