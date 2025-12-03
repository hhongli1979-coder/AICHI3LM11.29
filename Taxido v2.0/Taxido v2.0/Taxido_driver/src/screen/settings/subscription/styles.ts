import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth, fontSizes } from '../../../theme/appConstant'
import appFonts from '../../../theme/appFonts'
import appColors from '../../../theme/appColors'

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  planTitle: {
    marginHorizontal: windowWidth(3.5),
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4HALF,
    top: windowHeight(1.5),
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight(-5),
  },
  centerAlign: {
    height: windowHeight(14),
    width: '100%',
    borderTopRightRadius: windowWidth(5),
    borderTopLeftRadius: windowWidth(5),
    justifyContent: 'space-evenly',
    paddingHorizontal: windowHeight(3),
  },
  item: {
    borderRadius: windowWidth(5),
    marginHorizontal: windowWidth(1.5),
    shadowColor: appColors.black,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: windowHeight(0), height: 4 },
    elevation: 5,
    height: windowHeight(70),
  },
  itemText: {
    fontSize: fontSizes.FONT6HALF,
    textAlign: 'left',
    justifyContent: 'flex-start',
    fontFamily: appFonts.bold,
  },
  featureRow: {
    marginTop: windowHeight(3),
  },
  noteContainer: {
    height: windowHeight(10),
    backgroundColor: appColors.graybackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    textAlign: 'center',
    width: '90%',
    fontFamily: appFonts.medium,
    color: appColors.primaryFont,
  },
  planTitleContainer: {
    backgroundColor: appColors.graybackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainRound: {
    height: windowHeight(14),
    width: windowHeight(14),
    borderRadius: windowHeight(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  subRound: {
    height: windowHeight(11.6),
    width: windowHeight(11.6),
    borderRadius: windowHeight(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {
    fontSize: fontSizes.FONT8,
    fontFamily: appFonts.bold,
  },
  type: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4,
  },
  features: {
    marginHorizontal: windowWidth(5),
    fontSize: fontSizes.FONT4HALF,
    fontFamily: appFonts.medium,
  },
  msgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: windowHeight(3),
  },
  direction: {},
  dot: {
    height: windowHeight(1.5),
    width: windowHeight(1.5),
    borderRadius: windowWidth(10),
    marginTop: windowHeight(3),
  },
  dashLine: {
    borderBottomWidth: windowHeight(0.1),
    width: '90%',
    marginBottom: windowHeight(0.6),
    borderStyle: 'dashed',
  },
  msg: {
    width: '80%',
    textAlign: 'center',
    marginVertical: windowHeight(3),
    fontSize: fontSizes.FONT4HALF,
    fontFamily: appFonts.regular,
  },
  selectBtn: {
    height: windowHeight(6.5),
    width: windowWidth(44),
    position: 'absolute',
    bottom: windowHeight(-2.8),
    borderRadius: windowWidth(3),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 5,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomNote: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4HALF,
  },
  planHeading: {
    color: appColors.secondaryFont,
    marginVertical: windowHeight(2.3),
    marginHorizontal: windowWidth(3.5),
    textAlign: 'center',
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.medium,
    lineHeight: windowHeight(2.2),
  },
})

export default styles
