import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'
import { windowWidth, windowHeight, fontSizes } from '../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelbackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.modelBg,
  },
  model: {
    borderRadius: windowHeight(0.9),
    height: windowHeight(48),
    width: windowWidth(91),
  },
  space: {
    paddingHorizontal: windowWidth(5),
    paddingVertical: windowHeight(2.5),
  },
  closeIcon: {
    height: windowHeight(3.2),
    width: windowWidth(6.4),
    position: 'absolute',
    right: windowHeight(0),
    marginVertical: windowHeight(1.5),
    marginHorizontal: windowWidth(3),
  },
  title: {
    textAlign: 'center',
    fontSize: fontSizes.FONT5,
    fontFamily: appFonts.medium,
  },
  container: {
    height: windowHeight(6.5),
    borderWidth: windowHeight(0.1),
    borderColor: appColors.border,
    borderRadius: windowHeight(1.4),
    justifyContent: 'space-between',
    top: windowHeight(3),
  },
  starIcon: {
    marginHorizontal: windowWidth(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingView: {
    alignItems: 'center',
    marginHorizontal: windowWidth(2),
    justifyContent: 'center',
  },
  borderVertical: {
    borderColor: appColors.border,
    borderRightWidth: windowHeight(0.1),
    height: windowHeight(2.5),
    marginHorizontal: windowWidth(1.3),
  },
  rating: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4HALF,
  },
  border: {
    borderBottomWidth: windowHeight(0.1),
    borderStyle: 'dashed',
    width: '100%',
  },
  message: {
    fontSize: fontSizes.FONT4HALF,
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(4.4),
    top: windowHeight(0.5),
  },
  input: {
    borderRadius: windowHeight(1.3),
    height: windowHeight(9.8),
    textAlignVertical: 'top',
    borderWidth: windowHeight(0.1),
    paddingHorizontal: windowHeight(2),
    bottom: windowHeight(2),
  },
})

export default styles
