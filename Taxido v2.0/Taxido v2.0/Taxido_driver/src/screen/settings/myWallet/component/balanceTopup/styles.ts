import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import {
  fontSizes,
  windowHeight,
  windowWidth,
} from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  mainBalance: {
    marginTop: windowHeight(2),
    borderRadius: windowHeight(1.2),
    overflow: 'hidden',
    marginHorizontal: windowWidth(4),
    height: windowHeight(23.5),
    backgroundColor: appColors.darkPrimary,
  },
  walletImage: {
    height: windowHeight(19),
    width: '100%',
    borderRadius: windowHeight(1),
    resizeMode: 'stretch',
  },
  subBalance: {
    position: 'absolute',
    height: windowHeight(6),
    width: '100%',
    justifyContent: 'space-between',
  },
  balanceView: {
    borderRadius: windowHeight(1),
    justifyContent: 'center',
    marginVertical: windowHeight(1.4),
  },
  balanceTitle: {
    color: appColors.value,
    fontSize: fontSizes.FONT4,
    marginBottom: windowHeight(0.1),
    fontFamily: appFonts.regular,
  },
  totalBalance: {
    fontSize: fontSizes.FONT6,
    color: appColors.white,
    fontFamily: appFonts.bold,
  },
  topupBtn: {
    height: windowHeight(5),
    width: windowWidth(20),
    backgroundColor: appColors.white,
    borderRadius: windowHeight(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: windowHeight(3),
    marginHorizontal: windowWidth(4),
  },
  topupTitle: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
  },
  dashLine: {
    borderBottomWidth: windowHeight(0.1),
    borderStyle: 'dashed',
    borderColor: appColors.secondaryFont,
    marginHorizontal: windowWidth(4),
    bottom: windowHeight(1),
    width: '88%',
    alignSelf: 'center',
  },
})
export default styles
