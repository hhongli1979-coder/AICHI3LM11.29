import { StyleSheet } from 'react-native';
import { windowHeight, windowWidth, appColors, appFonts, fontSizes } from '@src/themes';

const styles = StyleSheet.create({
  mainView: { flex: 1 },
  textInput: {
    width: windowWidth(370),
    marginHorizontal: windowWidth(7),
    height: windowHeight(120),
    textAlignVertical: 'top',
  },
  container: {
    marginHorizontal: windowWidth(20),
    borderRadius: windowHeight(5),
    padding: windowHeight(10),
    marginBottom: windowHeight(10),
    borderWidth: windowHeight(1),
    flexDirection: 'row',
  },
  btn: {
    position: 'absolute',
    bottom: windowHeight(13),
    marginHorizontal: windowWidth(20),
    right: 0,
    left: 0,
  },
  itemText: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT20,
  },
  bottomView: {
    height: windowHeight(40),
    width: windowHeight(40),
    backgroundColor: appColors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(5),
  },
  textView: {
    width: windowWidth(320),
    marginHorizontal: windowWidth(12),
  },
  text: {
    color: appColors.gray,
    fontFamily: appFonts.regular,
    marginTop: windowHeight(4),
    fontSize: fontSizes.FONT16,
  },
  mainContainer: {
    borderWidth: windowHeight(1),
    marginHorizontal: windowWidth(20),
    borderRadius: windowHeight(5),
    padding: windowHeight(10),
    flexDirection: 'row',
    marginVertical: windowHeight(15),
  },
  pickUp: {
    color: appColors.primaryText,
    fontFamily: appFonts.semiBold,
  },
  locationText: {
    color: appColors.gray,
    fontFamily: appFonts.regular,
    marginTop: windowHeight(5),
  },
  idCard: { marginVertical: windowHeight(8) },
  ambulanceText: {
    marginHorizontal: windowWidth(20),
    fontFamily: appFonts.semiBold,
    marginVertical: windowHeight(5),
    marginBottom: windowHeight(10),
  },
  ambulanceView: {
    borderWidth: windowHeight(1),
    marginHorizontal: windowWidth(20),
    flexDirection: 'row',
    paddingHorizontal: windowHeight(12),
    borderRadius: windowHeight(5),
    marginVertical: windowHeight(10),
  },
  description: {
    marginHorizontal: windowWidth(20),
    fontFamily: appFonts.semiBold,
  },
  pickUpView: {
    marginHorizontal: windowWidth(5),
  },

  ambulanceApprovalText: {
    color: appColors.regularText,
    fontFamily: appFonts.medium,
    textAlign: 'center',
    marginVertical: windowHeight(10),
  },
  modelView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: fontSizes.FONT30,
    fontFamily: appFonts.medium,
    color: appColors.primary,
  },
});

export default styles;
