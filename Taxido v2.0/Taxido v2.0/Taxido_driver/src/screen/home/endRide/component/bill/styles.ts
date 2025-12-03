import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  billbox: {
    height: windowHeight(23.5),
    borderBottomWidth: windowHeight(0.1),
    borderRadius: windowHeight(1.6),
    paddingVertical: windowHeight(1.2),
    paddingHorizontal: windowWidth(3),
  },
  billTitle: {
    marginVertical: windowHeight(0.6),
    fontFamily: appFonts.regular,
  },
  dashBorder: {
    borderStyle: 'dashed',
    borderBottomWidth: windowHeight(0.1),
    borderColor: appColors.primaryFont,
    marginVertical: windowHeight(0.6),
  },
  border: {
    borderBottomWidth: windowHeight(0.1),
    borderColor: appColors.border,
    marginVertical: windowHeight(0.6),
  },
  dataView: {
    justifyContent: 'space-between',
    marginVertical: windowHeight(0.8),
  },
  type: {
    fontFamily: appFonts.regular,
  },
  save: {
    color: appColors.red,
    fontFamily: appFonts.regular,
  },
  total: {
    color: appColors.primary,
    fontFamily: appFonts.regular,
  },
  refreshView: {
    backgroundColor: appColors.primary,
    paddingHorizontal: windowWidth(6),
    paddingVertical: windowHeight(1),
    borderRadius: windowHeight(0.6),
  },
  completedPayment: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    textAlign: 'center',
    marginBottom: windowHeight(1.5),
  },
  completedPaymentView: {
    height: windowHeight(23.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
})
export default styles
