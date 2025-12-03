import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'

const styles = StyleSheet.create({
  mapSection: {
    flex: 0.7,
    backgroundColor: appColors.primaryLight,
  },
  extraSection: {
    flex: 0.1,
  },
  greenSection: {
    position: 'absolute',
    bottom: windowHeight(0),
    width: '100%',
    height: windowHeight(51),
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: appColors.white,
    borderTopRightRadius: windowWidth(5),
    borderTopLeftRadius: windowWidth(5),
  },
  sheetDash: {
    height: windowHeight(0.4),
    width: windowWidth(14),
    backgroundColor: appColors.primary,
    alignSelf: 'center',
    borderRadius: windowWidth(1),
    marginTop: windowHeight(1)
  },
  text: {
    marginBottom: windowHeight(1.2),
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(2.3),
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4HALF,
  },
  boxContainer: {
    alignItems: 'center',
    width: '92%',
    height: windowHeight(6.3),
    paddingHorizontal: windowWidth(1.3),
    borderRadius: windowHeight(0.5),
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginBottom: windowHeight(2.5),
  },
  boxLeft: {
    height: windowHeight(5),
    width: windowWidth(10.5),
    borderRadius: windowHeight(0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxRight: {
    height: windowHeight(5),
    width: windowWidth(10.5),
    borderRadius: windowHeight(0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCenter: {
    flex: 1,
    textAlign: 'center',
    color: appColors.price,
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT4HALF,
  },
  value: {
    fontFamily: appFonts.medium,
  },
  bottomView: {
    height: windowHeight(24),
  },
  backButton: {
    position: 'absolute',
    marginHorizontal: windowWidth(3),
    top: windowHeight(0.5),
  },
  button: {
    top: windowHeight(0.8),
  },
  textInput: {
    textAlign: 'center',
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT5,
    color: appColors.primary,
  }
})

export default styles
