import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  bottomView: {
    height: windowHeight(14.5),
    marginHorizontal: windowWidth(4),
    marginBottom: windowHeight(2),
    borderRadius: 6,
    borderWidth: windowHeight(0.1),
  },
  payment: {
    height: windowHeight(7),
  },
  cash: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT5,
    textTransform: "capitalize"
  },
  dollerIcon: {
    justifyContent: 'center',
    marginHorizontal: windowWidth(4),
  },
  paymentType: {
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.regular,
    color: appColors.secondaryFont,
  },
  total: {
    marginHorizontal: windowWidth(4),
    color: appColors.primary,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT5HALF,
  },
  fareView: {
    justifyContent: 'space-between',
    borderBottomWidth: windowHeight(0.1),
    height: windowHeight(7),
    alignItems: 'center',
  },
  text: {
    marginHorizontal: windowWidth(4),
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4HALF,
  },
  paymentMethod: {
    justifyContent: 'center',
  },
})

export default styles
