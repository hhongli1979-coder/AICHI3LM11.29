import { StyleSheet } from 'react-native';
import { windowHeight, windowWidth, appFonts, fontSizes, appColors } from '@src/themes';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: appColors.lightGray,
  },
  container: {
    marginHorizontal: windowWidth(20),
    borderRadius: windowHeight(5),
    padding: windowHeight(10),
    marginBottom: windowHeight(10),
    borderWidth: windowHeight(1),
    flexDirection: 'row',
    marginTop: windowHeight(10),
  },
  btn: {
    position: 'absolute',
    bottom: windowHeight(20),
    marginHorizontal: windowWidth(20),
    right: 0,
    left: 0,
  },
  itemText: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT20,
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
  pickUpView: {
    marginHorizontal: windowWidth(5),
  },
  idCard: {
    marginVertical: windowHeight(8),
  },
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
  textInput: {
    width: windowWidth(370),
    marginHorizontal: windowWidth(7),
    height: windowHeight(120),
    textAlignVertical: 'top',
  },
  bottomView: {
    height: windowHeight(40),
    width: windowHeight(40),
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
    fontSize: fontSizes.FONT17,
  },
  containerCoupon: {
    alignItems: 'center',
    width: '91.5%',
    justifyContent: 'space-between',
    marginTop: windowHeight(11),
    borderWidth: windowHeight(1),
    borderRadius: windowWidth(8),
    alignSelf: 'center',
  },
  buttonAdd: {
    backgroundColor: appColors.primary,
    height: windowHeight(30),
    width: windowWidth(90),
    borderRadius: windowHeight(6.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: windowWidth(7),
  },
  buttonAddText: {
    color: appColors.whiteColor,
    fontSize: fontSizes.FONT16,
    fontFamily: appFonts.medium,
  },
  input: {
    fontFamily: appFonts.medium,
    width: '70%',
    marginHorizontal: windowWidth(12),
    marginVertical: windowHeight(5),
  },
  labelText: {
    marginHorizontal: windowWidth(15),
    fontFamily: appFonts.medium,
  },
  proceedToPayBtn: {
    backgroundColor: appColors.primary,
    width: '91%',
    alignSelf: 'center',
    borderRadius: windowHeight(7),
    marginTop: windowHeight(36),
    marginBottom: windowHeight(25),
  },
  paymentMethodView: {
    width: '91%',
    borderWidth: windowHeight(1),
    alignSelf: 'center',
    borderRadius: windowHeight(6),
    marginTop: windowHeight(10),
  },
  paymentMethodText: {
    marginHorizontal: windowWidth(20),
    fontFamily: appFonts.semiBold,
    marginTop: windowHeight(19),
  },
  billSummaryText: {
    marginHorizontal: windowWidth(20),
    fontFamily: appFonts.semiBold,
    marginTop: windowHeight(19),
  },
  billView: {
    width: '91%',
    borderWidth: windowHeight(1),
    alignSelf: 'center',
    height: '10.5%',
    borderRadius: windowHeight(6),
    marginTop: windowHeight(10),
  },
  ambulancePriceView: {
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth(15),
    marginTop: windowHeight(9),
  },
  bottomPrice: {
    fontFamily: appFonts.semiBold,
    color: appColors.primary,
  },
  ambulanceBottomView: {
    height: windowHeight(0.5),
    width: '93%',
    alignSelf: 'center',
    marginHorizontal: windowWidth(10),
    marginTop: windowHeight(10),
  },
  totalBillText: {
    fontFamily: appFonts.medium,
  },
  savingPrice: {
    fontFamily: appFonts.medium,
    color: appColors.textRed,
    marginTop: windowHeight(5),
  },
  emergencySupportView: {
    justifyContent: 'space-between',
    marginTop: windowHeight(8),
  },
  minText: {
    color: appColors.gray,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT18,
  },
  dollarPrice: {
    color: appColors.price,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT18,
  },
  minView: {
    height: windowHeight(0.5),
    width: '100%',
    alignSelf: 'center',
    marginHorizontal: windowWidth(10),
    marginTop: windowHeight(10),
  },
  btnn: {
    marginBottom: windowHeight(5),
  },
  cash: {
    marginBottom: windowHeight(15),
  },
  lineMethod: {
    width: '92%',
    height: windowHeight(1),
    borderStyle: 'dotted',
    alignSelf: 'center',
    marginTop: windowHeight(12),
  },
});
export default styles;
