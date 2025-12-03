import { StyleSheet } from 'react-native'
import {
  windowHeight,
  windowWidth,
  fontSizes,
} from '../../../theme/appConstant'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
  },
  noDataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: windowWidth(5),
  },
  noDataImg: {
    height: windowHeight(40),
    width: windowWidth(70),
    resizeMode: 'contain',
  },
  msg: {
    fontFamily: appFonts.bold,
    marginVertical: windowHeight(1),
    fontSize: fontSizes.FONT5,
  },
  detail: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    textAlign: 'center',
    fontSize: fontSizes.FONT4,
  },
  container: {
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(2),
  },
  listItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: windowHeight(2),
    marginBottom: windowHeight(2),
    borderRadius: windowHeight(0.8),
    borderWidth: windowHeight(0.1),
  },
  leftSection: {
    flex: 1,
  },
  dateText: {
    fontSize: fontSizes.FONT4,
    color: appColors.secondaryFont,
    marginBottom: windowHeight(1),
    fontFamily: appFonts.regular,
  },
  paymentTypeText: {
    fontSize: fontSizes.FONT4HALF,
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: fontSizes.FONT4HALF,
    fontFamily: appFonts.bold,
  },
  statusText: {
    fontSize: fontSizes.FONT4,
    marginTop: windowHeight(1),
    fontFamily: appFonts.regular,
    color: appColors.primaryFont,
  },
  refreshContainer: {
    backgroundColor: appColors.primary,
    width: '100%',
    height: windowHeight(6),
    marginTop: windowHeight(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(1),
    bottom:'8%'
  },
  refreshText: {
    color: appColors.white,
    fontFamily: appFonts.medium,
  },
  menuTrigger: {
    marginHorizontal: windowWidth(2),
    paddingTop: windowHeight(0.2),
  },
  walletContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
export default styles
