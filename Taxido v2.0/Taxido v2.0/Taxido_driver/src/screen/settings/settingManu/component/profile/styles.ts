import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import {
  windowHeight,
  windowWidth,
  fontSizes,
} from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    height: windowHeight(18.5),
    width: '100%',
    marginVertical: windowHeight(2.3),
    borderRadius: windowHeight(0.9),
    borderWidth: windowHeight(0.1),
  },
  detainContain: {
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(1.5),
  },
  profileImage: {
    height: windowHeight(7),
    width: windowHeight(7),
    resizeMode: 'cover',
    borderRadius: windowHeight(25),
  },
  details: {
    height: windowHeight(6.5),
    width: windowWidth(65),
    marginHorizontal: windowWidth(3.5),
    justifyContent: 'center',
  },
  name: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4HALF,
  },
  mail: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    top: windowHeight(0.5),
  },
  walletContain: {
    height: windowHeight(6),
    backgroundColor: appColors.primary,
    marginHorizontal: windowWidth(4),
    borderRadius: windowHeight(0.8),
    marginTop: windowHeight(0.6),
  },
  wallet: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(3),
  },
  walletTitle: {
    color: appColors.white,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT3HALF,
  },
  walletAmount: {
    color: appColors.white,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4,
  },
  char: {
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT7,
  },
  nameTag: {
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight(7),
    width: windowHeight(7),
    backgroundColor: appColors.primary,
    borderRadius: windowHeight(25),
  },
  ratingBox:{
    height:windowHeight(3.2),
    alignItems:'center',
    borderRadius:windowWidth(55),
    paddingHorizontal:windowWidth(3),
    justifyContent:'space-between'
  }
})
export default styles
