import { StyleSheet } from 'react-native'
import appColors from '../theme/appColors'
import appFonts from '../theme/appFonts'
import { windowHeight, windowWidth, fontSizes } from '../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  directionRow: {
    flexDirection: 'row',
  },
  iconView: {
    marginVertical: 8,
    marginHorizontal: windowHeight(0.5),
  },
  rating: {
    marginVertical: windowHeight(0.5),
    fontFamily: appFonts.regular,
  },
  totalReview: {
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.5),
    marginHorizontal: windowWidth(1),
    color: appColors.primaryFont,
  },
  containerBtn: {
    marginHorizontal: windowWidth(2.5),
    alignItems: 'center',
  },
  iconButton: {
    height: windowHeight(5.5),
    width: windowHeight(5.5),
    borderRadius: windowHeight(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  iconSpace: {
    marginTop: windowHeight(0.5),
  },
  pickup: {
    fontSize: fontSizes.FONT3SMALL,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.9),
  },
  drop: {
    fontSize: fontSizes.FONT3SMALL,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.8),
  },
  backButton: {
    height: windowHeight(5),
    width: windowWidth(10),
    position: 'absolute',
    marginVertical: windowHeight(1.5),
    marginHorizontal: windowHeight(3),
    borderRadius: windowHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: windowHeight(0.1),
  },
  backButtonMain: {
    height: windowHeight(4.7),
    width: windowWidth(10),
    marginVertical: windowHeight(1.5),
    marginHorizontal: windowHeight(0.5),
    borderRadius: windowHeight(0.9),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: windowHeight(0.1),
  },
  mapBtnView: {
    justifyContent: 'space-between',
    height: windowHeight(13),
  },
  mapButton: {
    height: windowHeight(5.5),
    width: windowWidth(11),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: windowHeight(0.1),
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginHorizontal: windowWidth(4),
  },
  popupText: {
    color: appColors.white,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
    padding: windowHeight(1),
  },
  popupContainer: {
    backgroundColor: appColors.black,
    borderRadius: 8,
  },
})

export default styles
