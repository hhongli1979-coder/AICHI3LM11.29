import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'
import appFonts from '../../../theme/appFonts'

const styles = StyleSheet.create({
  activeRide: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.FONT5,
    fontFamily: appFonts.medium,
    position: 'absolute',
  },
  contain: {
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(2),
  },
  box: {
    height: windowHeight(37),
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(1.5),
  },
  button: { top: windowHeight(1) },
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
    bottom: windowHeight(8),
  },
  refreshContainer: {
    backgroundColor: appColors.primary,
    width: '100%',
    height: windowHeight(6),
    marginTop: windowHeight(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(1),
  },
  refreshText: {
    color: appColors.white,
    fontFamily: appFonts.medium,
  },
  walletContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: windowHeight(8),
  },
  header: {
    alignItems: 'center',
    height: windowHeight(9.5),
    paddingHorizontal: windowWidth(3),
  }
})

export default styles
