import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../theme/appConstant'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectContainer: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(2),
  },
  selectText: { color: appColors.primaryFont, fontFamily: appFonts.medium },
  payNowContainer: {
    marginHorizontal: windowWidth(3),
    alignSelf: 'center',
    width: '99.5%',
    marginTop: windowHeight(5),
    bottom: windowHeight(2),
  },
  payContainer: {
    backgroundColor: appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight(6),
    borderRadius: windowHeight(0.7),
  },
  payText: {
    color: appColors.white,
    fontSize: windowHeight(2),
    fontFamily: appFonts.medium,
  },
  modalPaymentView: {
    justifyContent: 'space-between',
  },
  imageBg: {
    borderWidth: windowHeight(0.1),
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
  },
  borderPayment: {
    borderBottomWidth: windowHeight(0.1),
    borderStyle: 'dashed',
    marginHorizontal: windowWidth(5),
  },
})

export default styles
