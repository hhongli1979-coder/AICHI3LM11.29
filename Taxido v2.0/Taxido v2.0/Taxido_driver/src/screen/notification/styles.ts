import { StyleSheet } from 'react-native'
import { fontSizes, windowHeight, windowWidth } from '../../theme/appConstant'
import appColors from '../../theme/appColors'
import appFonts from '../../theme/appFonts'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    paddingVertical: windowHeight(1.5),
    paddingHorizontal: windowHeight(1.6),
    borderRadius: windowHeight(0.9),
    borderWidth: windowHeight(0.1),
    overflow: 'hidden',
    paddingTop: windowHeight(1.9),
    width: '91.3%',
    alignSelf: 'center',
    bottom: windowHeight(1),
    marginTop: windowHeight(2),
  },
  iconContainer: {
    height: windowHeight(5),
    width: windowHeight(5),
    borderRadius: windowHeight(5),
    backgroundColor: appColors.cardicon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginHorizontal: windowWidth(2.9),
    width: windowWidth(73),
  },
  title: {
    fontFamily: appFonts.medium,
  },
  message: { fontFamily: appFonts.medium, width: '95%' },
  timeText: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT3,
    top: windowHeight(0.9),
    marginBottom: windowHeight(0.5),
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
  walletContainer: {
    alignSelf: 'center',

    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshContainer: {
    backgroundColor: appColors.primary,
    width: '100%',
    height: windowHeight(6),
    marginTop: windowHeight(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(0.8),
  },
  refreshText: {
    color: appColors.white,
    fontFamily: appFonts.medium,
  },
})
export default styles
