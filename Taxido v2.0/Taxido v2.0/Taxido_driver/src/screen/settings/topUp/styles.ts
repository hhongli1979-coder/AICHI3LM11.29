import { StyleSheet } from 'react-native'
import {
  windowHeight,
  fontSizes,
  windowWidth,
} from '../../../theme/appConstant'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    width: '100%',
    paddingVertical: windowHeight(1),
    borderRadius: windowHeight(1),
    marginTop: windowHeight(4.9),
    marginBottom: windowHeight(5),
    bottom: windowHeight(11),
    height: windowHeight(59),
    borderWidth: windowHeight(0.1),
  },
  listView: {
    paddingVertical: windowHeight(2),
    marginHorizontal: windowWidth(4),
  },
  amount: {
    color: appColors.secondaryFont,
    marginVertical: windowHeight(1.5),
    fontFamily: appFonts.regular,
  },
  inputContainer: { justifyContent: 'space-between' },
  textinput: {
    height: windowHeight(6.5),
    width: '100%',
    fontFamily: appFonts.regular,
    paddingHorizontal: windowWidth(2),
  },
  modalPaymentView: {
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth(10),
    paddingVertical: windowHeight(10),
    backgroundColor: 'red',
  },
  imageBg: {
    borderWidth: windowHeight(0.1),
    borderColor: appColors.border,
    borderRadius: windowHeight(1),
    alignItems: 'center',
    justifyContent: 'center',

    width: windowHeight(10),
    height: windowHeight(6),
    backgroundColor: appColors.graybackground,
  },
  paymentImage: {
    width: windowWidth(15),
    height: windowHeight(40),
    resizeMode: 'contain',
  },
  title: {
    marginTop: windowHeight(1.9),
    marginBottom: windowHeight(1),
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT19,
  },
  button: { top: windowHeight(63.3) },
  inputView: {
    alignItems: 'center',
    borderRadius: windowWidth(1.5),
    borderWidth: windowHeight(0.1),
    paddingHorizontal: windowWidth(4),
  },
  mailInfo: {
    justifyContent: 'center',
    left: windowWidth(25),
  },
  mail: {
    fontFamily: appFonts.regular,
  },
  payBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth(9),
    borderRadius: windowHeight(7.6),
    marginHorizontal: windowWidth(6),
    height: windowHeight(35),
    right: windowHeight(17),
  },
})
export default styles
