import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import appFonts from '../../../../theme/appFonts'
import {
  windowHeight,
  windowWidth,
  fontSizes,
} from '../../../../theme/appConstant'

const styles = StyleSheet.create({
  headerMain: {
    height: windowHeight(20),
    backgroundColor: appColors.primary,
    width: '100%',
  },
  logoTitle: {
    fontSize: fontSizes.FONT6HALF,
    fontFamily: appFonts.bold,
    color: appColors.white,
  },
  headerMargin: {
    marginHorizontal: windowWidth(4),
    marginBottom: windowHeight(3),
    marginTop: windowHeight(1.2),
  },
  headerAlign: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    alignItems: 'center',
  },
  logo: {
    height: windowHeight(8),
    width: windowWidth(24),
    resizeMode: 'contain',
    tintColor: appColors.white,
    marginHorizontal: windowWidth(1),
  },
  notificationIcon: {
    height: windowHeight(5.2),
    width: windowWidth(10.5),
    borderWidth: windowHeight(0.1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(0.6),
    backgroundColor: appColors.primaryLight,
    borderColor: appColors.greenborder,
  },
  switchContainer: {
    height: windowHeight(6),
    width: '100%',
    marginVertical: windowHeight(2),
    borderRadius: windowHeight(4),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(6),
  },
  valueTitle: {
    fontFamily: appFonts.medium,
  },
  containerStyle: {
    width: windowWidth(12),
    height: windowHeight(3.3),
    borderRadius: windowHeight(14),
    paddingRight: windowWidth(13.5),
    paddingLeft: windowWidth(1.5),
  },
  switchCircle: {
    width: windowHeight(2.3),
    height: windowHeight(2.3),
    borderRadius: windowHeight(3),
  },
})
export default styles
