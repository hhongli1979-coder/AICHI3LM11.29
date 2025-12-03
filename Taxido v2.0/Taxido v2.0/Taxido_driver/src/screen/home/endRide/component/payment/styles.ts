import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { windowHeight, windowWidth, fontSizes } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    height: windowHeight(21),
    marginTop: windowHeight(2),
  },
  title: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
    marginHorizontal: windowWidth(3),
    marginVertical: windowHeight(1.5),
    marginTop: windowHeight(2),
  },
  border: {
    borderWidth: windowHeight(0.1),
    marginHorizontal: windowWidth(3),
    marginBottom: windowHeight(0.6),
  },
  contain: {
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(3),
    marginVertical: windowHeight(1),
  },
  type: {
    fontFamily: appFonts.regular,
  },
  leftRadius: {
    height: windowHeight(2.5),
    width: windowWidth(5),
    bottom: windowHeight(0),
    position: 'absolute',
    borderTopRightRadius: windowHeight(23),
    borderRightWidth: windowHeight(0.1),
    borderTopWidth: windowHeight(0.1),
    borderTopColor: appColors.border,
    borderRightColor: appColors.border,
  },
  rightRadius: {
    height: windowHeight(2.5),
    width: windowWidth(5),
    bottom: windowHeight(0),
    right: windowHeight(0),
    backgroundColor: appColors.graybackground,
    position: 'absolute',
    borderTopLeftRadius: windowHeight(45),
    borderLeftWidth: windowHeight(0.1),
    borderTopWidth: windowHeight(0.1),
    borderLeftColor: appColors.border,
    borderTopColor: appColors.border,
  },
  mainContainer: {
    height: 1,
    width: '100%',
    bottom: windowHeight(0),
    justifyContent: 'center',
    position: 'absolute',
  },
  mainView: {
    borderLeftWidth: windowHeight(0.1),
    borderRightWidth: windowHeight(0.1),
    borderTopWidth: windowHeight(0.1),
  },
})

export default styles
