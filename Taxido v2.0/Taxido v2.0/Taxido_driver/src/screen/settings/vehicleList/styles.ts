import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'
import {
  windowHeight,
  windowWidth,
  fontSizes,
} from '../../../theme/appConstant'

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  contentContaine: { paddingBottom: 20 },
  main: {
    height: windowHeight(9.5),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(4),
    backgroundColor: appColors.white,
  },
  detail: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(3),
    marginTop: windowHeight(2),
  },
  tipContainer: {
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(0.7),
    marginHorizontal: windowWidth(4.5),
    marginTop: windowHeight(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: windowHeight(2),
  },
  tip: {
    color: appColors.red,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(3),
    marginTop: windowHeight(2),
    lineHeight: windowHeight(2.5),
    width: '90%',
  },
  backIcon: {
    height: windowHeight(4.5),
    width: windowWidth(9),
    borderWidth: windowHeight(0.1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(0.7),
    borderColor: appColors.border,
  },
  title: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT5,
    marginHorizontal: windowWidth(4),
  },
  add: {
    color: appColors.primary,
    fontSize: fontSizes.FONT3HALF,
  },
  listContainer: {
    borderWidth: windowHeight(0.1),
    backgroundColor: appColors.white,
    borderColor: appColors.border,
    marginHorizontal: windowWidth(4.5),
    borderRadius: windowHeight(0.7),
    marginTop: windowHeight(2.5),
    overflow: 'hidden',
  },
  titleContainer: {
    justifyContent: 'space-between',
    padding: windowWidth(4),
    backgroundColor: appColors.white,
  },
  carBrand: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4HALF,
  },
  carImg: {
    height: windowHeight(15),
    width: '100%',
    borderRadius: windowHeight(1),
    marginBottom: windowHeight(1.5),
  },
  descContainer: {
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(3),
  },
  engineInfo: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    width: windowWidth(60),
  },
  rentPrice: {
    color: appColors.price,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT5,
  },
  perDay: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT3HALF,
  },
  dashLine: {
    borderBottomColor: appColors.border,
    borderBottomWidth: windowHeight(0.1),
    borderStyle: 'dashed',
    marginVertical: windowHeight(1.5),
    marginHorizontal: windowWidth(3),
  },
  driverTitle: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4,
    marginBottom: windowHeight(1.3),
  },
  tagContainer: {
    flexWrap: 'wrap',
    marginHorizontal: windowWidth(3),
  },
  iconBox: {
    backgroundColor: appColors.graybackground,
    padding: windowWidth(2),
    borderRadius: windowWidth(2),
    alignItems: 'center',
    marginRight: windowWidth(3),
    marginBottom: windowHeight(1.5),
    justifyContent: 'space-between',
    gap: windowHeight(1),
  },
  iconBox1: {
    backgroundColor: appColors.graybackground,
    padding: windowWidth(2),
    borderRadius: windowWidth(2),
    alignItems: 'center',
    marginRight: windowWidth(3),
    marginBottom: windowHeight(1.5),
    justifyContent: 'space-between',
    gap: windowHeight(1),
  },
  iconTitle: {
    fontFamily: appFonts.regular,
  },
  imageView: { marginHorizontal: windowWidth(3) },
})
export default styles
