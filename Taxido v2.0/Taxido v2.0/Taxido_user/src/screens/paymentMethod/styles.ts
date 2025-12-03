import { StyleSheet } from 'react-native';
import {
  appColors,
  fontSizes,
  windowHeight,
  windowWidth,
  appFonts,
} from '@src/themes';

const styles = StyleSheet.create({
  background: {
    paddingVertical: windowHeight(17),
    paddingHorizontal: windowWidth(12),
    borderRadius: windowHeight(9),
  },
  closeIconView: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: appColors.lightGray,
    height: windowHeight(18),
    width: windowHeight(18),
    borderRadius: windowHeight(18),
    marginHorizontal: windowWidth(15)
  },
  sideSpace: {
    marginHorizontal: windowWidth(20),
  },
  title: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
    textAlign: 'center',
  },
  userAlign: {
    alignItems: 'center',
    marginTop: windowHeight(18),
  },
  modalImage: {
    height: windowHeight(52),
    width: windowWidth(76),
    resizeMode: 'contain',
  },
  modalName: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT19,
  },
  modalMail: {
    fontSize: fontSizes.FONT15,
  },
  lineImage: {
    height: 5,
    width: windowHeight(284),
    marginVertical: windowHeight(8),
    resizeMode: 'stretch',
  },
  rate: {
    fontFamily: appFonts.medium,
  },
  tips: {
    marginTop: windowHeight(18),
    fontFamily: appFonts.medium,
  },
  border2: {
    borderBottomWidth: windowHeight(0.9),
    marginVertical: windowHeight(18),
    borderBottomColor: appColors.primaryGray,
  },
  comment: {
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(8),
  },
  textinput: {
    height: windowHeight(85),
    borderWidth: windowHeight(1),
    borderColor: appColors.primaryGray,
    borderRadius: windowHeight(5),
    backgroundColor: appColors.whiteColor,
  },
  bill: {
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(8),
  },
  billContainer: {
    marginBottom: windowHeight(8),
    backgroundColor: appColors.whiteColor,
    maxHeight: windowHeight(300),
    justifyContent: 'space-evenly',
    paddingHorizontal: windowWidth(10),
    borderRadius: windowWidth(8),
    borderWidth: windowHeight(1),
  },
  borderPayment: {
    borderBottomWidth: windowHeight(0.9),
    borderColor: appColors.primaryGray,
    borderStyle: 'dashed',
    marginHorizontal: windowWidth(15),
  },
  saving: {
    color: appColors.textRed,
    fontFamily: appFonts.medium,
  },
  billTitle: {
    fontFamily: appFonts.medium,
  },
  totalAmount: {
    color: appColors.primary,
    fontFamily: appFonts.bold,
  },
  payment: {
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(8),
  },
  paymentContainer: {
    backgroundColor: appColors.whiteColor,
    marginBottom: windowHeight(50),
    borderWidth: windowHeight(1),
    borderRadius: windowWidth(8),
    overflow: 'hidden',
  },
  modalPaymentView: {
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth(10),
    paddingVertical: windowHeight(10),
  },
  paynow: {
    color: appColors.whiteColor,
    fontFamily: appFonts.regular,
  },
  viewCoupon: {
    textAlign: 'right',
    color: appColors.primary,
    fontFamily: appFonts.medium,
    marginTop: windowHeight(6),
    marginHorizontal: windowWidth(4),
  },
  paymentView: {
    marginHorizontal: windowWidth(12),
    marginVertical: windowHeight(6),
  },
  google: {
    height: windowHeight(25),
    width: windowWidth(35),
    resizeMode: 'contain',
    marginHorizontal: windowWidth(8),
    marginVertical: windowHeight(4),
  },
  mailInfo: {
    marginHorizontal: windowWidth(6),
    justifyContent: 'center',
  },
  mail: {
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(6),
  },
  imageBg: {
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    borderRadius: windowHeight(7.3),
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth(55),
    height: windowHeight(36),
  },
  paymentImage: {
    width: windowWidth(35),
    height: windowHeight(30),
    resizeMode: 'contain',
  },
  payBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth(9),
    borderRadius: windowHeight(7.3),
    marginHorizontal: windowWidth(8),
    height: windowHeight(35),
  },
  buttonContainer: {
    marginTop: windowHeight(8),
  },
  button: {
    paddingVertical: windowHeight(8),
    paddingHorizontal: windowWidth(5),
    borderRadius: windowHeight(5),
    marginHorizontal: windowWidth(6),
    flex: 1,
    alignItems: 'center',
    borderWidth: windowHeight(1),
    marginVertical: windowHeight(4),
    backgroundColor: appColors.whiteColor,
  },
  buttonText: {
    fontFamily: appFonts.medium,
  },
  billBorder: {
    borderTopWidth: windowHeight(0.9),
    borderStyle: 'dashed',
    marginVertical: windowHeight(5),
  },
  buttonContainer2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: windowHeight(10),
    alignItems: 'center',
  },
  containerCoupon: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: windowHeight(15),
    borderWidth: windowHeight(1),
    borderRadius: windowWidth(8),
  },
  buttonAdd: {
    backgroundColor: appColors.primary,
    height: windowHeight(30),
    width: windowWidth(90),
    borderRadius: windowHeight(6.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: windowWidth(7),
    marginVertical: windowHeight(5),
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
  },
  inputTip: {
    fontFamily: appFonts.medium,
    width: windowWidth(70)

  },
  rideContainer: {
    justifyContent: 'space-between',
    width: '100%',
    marginTop: windowHeight(9.5),
  },
  headerView: { height: windowHeight(50) },
  invalidPromoText: {
    color: appColors.alertRed,
    marginTop: windowHeight(4.5),
    position: 'absolute',
    fontFamily: appFonts.regular,
  },
  successMessage: {
    color: appColors.greenColor,
    marginTop: windowHeight(4.5),
    position: 'absolute',
    fontFamily: appFonts.regular,
  },
  totalBillView: {
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: windowHeight(9.5),
  },
  listContent: {
    paddingBottom: 80,
  },
});
export default styles;
