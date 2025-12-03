import { StyleSheet } from "react-native";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { commonStyles } from "../../styles/commonStyle";
import { external } from "../../styles/externalStyle";

const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: windowHeight(15),
    borderTopRightRadius: windowHeight(15),
    marginTop: windowHeight(-15),
    borderWidth: windowHeight(1),
  },
  container: {
    backgroundColor: appColors.lightGray,
    width: '100%',
    borderRadius: windowHeight(6),
    marginRight: windowWidth(12),
  },
  paymentView: {
    flex: 1,
  },
  img: {
    width: windowWidth(75),
    height: windowHeight(25),
    resizeMode: "contain",
  },
  modalTitle: {
    marginTop: windowHeight(5),
  },
  verticalLine: {
    height: windowHeight(12),
    borderRightColor: appColors.border,
    borderRightWidth: windowHeight(0.9),
    marginHorizontal: windowWidth(6),
    marginVertical: windowHeight(2),
  },
  price: {
    color: appColors.primary,
    marginHorizontal: windowWidth(5),
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT24,
  },
  priceCut: {
    color: appColors.regularText,
    textDecorationLine: "line-through",
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(2),
  },
  solidLineView: {
    width: "80%",
    paddingVertical: windowHeight(4.5),
  },
  termsText: {
    ...commonStyles.extraBold,
    ...external.pv_10,
  },
  fourPmText: {
    ...commonStyles.extraBold,
  },
  fiveMinAway: {
    ...commonStyles.extraBold,
    alignSelf: "center",
  },
  viewContainer: {
    ...external.ai_center,
    ...external.js_space,
  },
  clock: {
    marginVertical: windowHeight(6),
    marginHorizontal: windowWidth(2),
  },
  carTwo: {
    width: windowHeight(53),
    height: windowWidth(53),
    alignSelf: "center",

    resizeMode: "contain",
  },
  fiftySeven: {
    ...commonStyles.regularText,
    color: appColors.regularText,
    textDecorationLine: "line-through",
    paddingHorizontal: windowWidth(5),
  },
  carType: {
    ...commonStyles.extraBold,
    ...external.pt_5,
  },
  backBtn: {
    height: windowHeight(32),
    width: windowWidth(48),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(6),
    marginTop: windowHeight(10),
    marginHorizontal: windowWidth(18),
    position: "absolute",
    zIndex: 1,
    borderWidth: windowHeight(1),
  },
  ridekm: {
    position: "absolute",
    height: windowHeight(32),
    backgroundColor: appColors.primary,
    top: windowHeight(10),
    right: windowWidth(18),
    zIndex: 1,
    borderWidth: 1,
    borderColor: appColors.primary,
    borderRadius: windowHeight(6),
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  kmText: {
    color: appColors.whiteColor,
    fontSize: fontSizes.FONT14,
  },
  rideMin: {
    backgroundColor: appColors.whiteColor,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: appFonts.regular,
    color: appColors.primary,
  },
  textInput: {
    top: 0,
    right: 0,
    bottom: 0,
    width: "65%",
    height: "100%",
    padding: 0,
    borderWidth: windowHeight(0),
    textAlign: "center",
  },
  plusBtn: {
    height: windowHeight(35),
    width: windowHeight(35),
    borderRadius: windowHeight(4),
    alignItems: "center",
    justifyContent: "center",
    margin: windowHeight(4),
    backgroundColor: appColors.whiteColor,
  },
  inputcontainer: {
    width: "100%",
    height: windowHeight(43),
    marginTop: windowHeight(4),
    overflow: "hidden",
    backgroundColor: appColors.lightGray,
    justifyContent: "space-between",
    borderRadius: windowHeight(4),
  },
  title: {
    marginTop: windowHeight(14),
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT20,
  },
  containerCoupon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: appColors.whiteColor,
    justifyContent: "space-between",
    marginBottom: windowHeight(15),
    marginHorizontal: windowWidth(15),
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    borderRadius: windowWidth(8),
  },
  containerCouponMain: {
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginTop: windowHeight(15),
    marginBottom: windowHeight(5),
    borderWidth: windowHeight(1),
    borderRadius: windowWidth(8),
  },
  invalidPromoText: {
    color: appColors.alertRed,
    marginTop: windowHeight(4.5),
    position: "absolute",
    fontFamily: appFonts.regular,
  },
  successMessage: {
    color: appColors.greenColor,
    marginTop: windowHeight(1),
    position: "absolute",
    fontFamily: appFonts.regular,
  },
  viewCoupon: {
    textAlign: "right",
    color: appColors.primary,
    fontFamily: appFonts.medium,
    marginBottom: windowHeight(10),
    marginHorizontal: windowWidth(4),
  },
  buttonAdd: {
    backgroundColor: appColors.primary,
    height: windowHeight(30),
    width: windowWidth(90),
    borderRadius: windowHeight(6.5),
    alignItems: "center",
    justifyContent: "center",
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
    width: "70%",
    marginHorizontal: windowWidth(12),
  },
  payment: {
    fontFamily: appFonts.medium,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: fontSizes.FONT19,
  },
  paymentContainer: {
    backgroundColor: appColors.whiteColor,
    bottom: windowHeight(10.5),
    marginHorizontal: windowWidth(2.3),
    maxHeight: windowHeight(250),
  },
  modalPaymentView: {
    justifyContent: "space-between",
    paddingHorizontal: windowWidth(18),
    paddingVertical: windowHeight(10),
  },
  imageBg: {
    borderWidth: windowHeight(1),
    borderRadius: windowHeight(8),
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth(55),
    height: windowHeight(36),
  },
  paymentImage: {
    width: windowWidth(35),
    height: windowHeight(30),
    resizeMode: "contain",
  },
  mailInfo: {
    marginHorizontal: windowWidth(15),
    justifyContent: "center",
  },
  mail: {
    fontFamily: appFonts.regular,
  },
  payBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth(9),
    borderRadius: windowHeight(8),
    marginHorizontal: windowWidth(6),
    height: windowHeight(35),
  },
  borderPayment: {
    borderBottomWidth: windowHeight(0.7),
    borderStyle: "dashed",
    marginHorizontal: windowWidth(15),
    marginVertical: windowHeight(4),
  },
  chooseAnotherAccount: {
    ...commonStyles.mediumTextBlack12,
    fontSize: fontSizes.FONT19,
    color: appColors.primary,
  },
  selectText: {
    fontFamily: appFonts.medium,
  },
  selectedText: {
    color: appColors.primary,
  },
  switchContainer: {
    marginHorizontal: windowWidth(15),
    paddingVertical: windowHeight(10),
  },
  subtitle: {
    fontSize: fontSizes.FONT22,
    lineHeight: windowHeight(14),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: appColors.modelBg,
  },
  modalContent: {
    width: "80%",
    padding: windowHeight(18.5),
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(9.8),
    alignItems: "center",
  },
  modalText: {
    fontSize: fontSizes.FONT16,
    marginBottom: windowHeight(18),
    fontFamily: appFonts.medium,
    textAlign: "center",
  },
  modalDetail: {
    fontFamily: appFonts.medium,
    textAlign: "center",
  },
  buttonContainer: {
    justifyContent: "space-between",
    width: "100%",
    marginTop: windowHeight(15),
  },
  button: {
    padding: windowHeight(8.5),
    borderRadius: windowHeight(5),
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "gray",
  },
  confirmButton: {
    backgroundColor: appColors.textRed,
  },
  buttonText: {
    color: appColors.whiteColor,
    fontSize: fontSizes.FONT19,
  },
  warningText: {
    color: appColors.textRed,
    fontFamily: appFonts.medium,
  },
  vehicleName: {
    fontSize: fontSizes.FONT19,
    color: appColors.primaryText,
  },
  recommended: {
    height: windowHeight(40),
    ...external.mh_10,
    marginBottom: windowHeight(10),
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    borderRadius: windowHeight(8),
    backgroundColor: appColors.lightGray,
    justifyContent: "center",
    ...external.mt_10,
  },
  RideRecommendPrice: {
    color: appColors.primaryText,
    fontFamily: appFonts.bold,
    marginHorizontal: windowHeight(12),
  },
  priceTitle: {
    color: appColors.primaryText,
    fontFamily: appFonts.regular,
  },
  switchUser: {
    paddingHorizontal: windowWidth(15),
    paddingVertical: windowHeight(9),
    borderRadius: windowHeight(25),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: windowHeight(8),
  },
  userIcon: {
    marginRight: windowWidth(10),
  },
  cardView: {
    justifyContent: "space-between",
    marginHorizontal: windowWidth(10),
    marginTop: windowHeight(12),
    paddingHorizontal: windowWidth(8),
  },
  pressable: {
    backgroundColor: appColors.selectPrimary,
    borderRadius: windowHeight(10),
  },
  switchRiderView: {
    justifyContent: "space-between",
    marginTop: windowHeight(0),
  },
  scrollViewStyle: {
    marginBottom: windowHeight(0),
  },
  selectPaymentView: {
    marginVertical: windowHeight(11),
  },

  selectedOptionView: {
    justifyContent: "space-between",
    marginHorizontal: windowHeight(15),
    marginTop: windowHeight(6),
  },
  serviceImg: {
    height: windowHeight(60),
    width: windowHeight(60),
    resizeMode: "contain",
  },
  iconView: { marginRight: windowWidth(10) },
  renderItemView: {
    paddingHorizontal: windowWidth(15),
    paddingVertical: windowHeight(8),
    borderRadius: windowHeight(25),
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  solidLine: {
    marginTop: windowHeight(8),
  },
  boldText: {
    fontFamily: appFonts.bold,
    marginHorizontal: windowWidth(10),
    fontSize: fontSizes.FONT19,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: windowWidth(20),
    paddingVertical: windowHeight(15),
  },
  modalContainer1: {
    backgroundColor: appColors.whiteColor,
    borderRadius: 10,
    maxHeight: "85%",
    overflow: "hidden",
    padding: windowHeight(10),
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    height: windowHeight(80),
  },
  image: {
    marginTop: windowHeight(1),
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    height: windowHeight(20),
  },
  images: {
    height: windowHeight(20),
    width: windowHeight(20),
    marginRight: 8,
  },
  lineView: {
    height: windowHeight(18),
    alignItems: "center",
    width: "88%",

    marginTop: windowHeight(3),
  },
  mainSheet: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: {
    backgroundColor: appColors.lightGreen,
    paddingVertical: windowHeight(6),
    paddingHorizontal: windowWidth(16),
    borderRadius: windowHeight(25),
  },
  timerText: {
    fontSize: fontSizes.FONT20,
    fontFamily: appFonts.regular,
    color: appColors.primary,
  },
  mainBottomSheet: {
    backgroundColor: appColors.primary,
    width: windowWidth(40),
  },
  ridekmView: {
    height: "100%",
    backgroundColor: appColors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: windowWidth(5),
  },
  ridekmText: {
    color: appColors.whiteColor,
    fontFamily: appFonts.regular,
  },
  ridekmMainView: {
    height: "100%",
    backgroundColor: appColors.whiteColor,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: windowWidth(5),
  },
  rideMinText: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
  },
  bidContainer: {
    position: "absolute",
    top: 40,
  },
  loaderContainer: {
    backgroundColor: appColors.lightGreen,
    paddingVertical: windowHeight(6),
    paddingHorizontal: windowWidth(16),
    borderRadius: windowHeight(25),
  },
  vehicleContainer: {
    marginHorizontal: windowWidth(18),
    marginBottom: windowHeight(5),
    marginTop: windowHeight(5),
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  prefName: {
    fontFamily: appFonts.regular,
    color: appColors.primaryText,
    fontSize: fontSizes.FONT19,
    marginBottom: windowHeight(2)
  },
  prefPrice: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
  },
  imagebox: {
    height: windowHeight(55),
    width: windowHeight(60),
    backgroundColor: "red",
    borderRadius: windowHeight(7),
    alignItems: "center",
    justifyContent: "center",
  },
  radioBox: {
    borderWidth: windowWidth(1),
    backgroundColor: appColors.whiteColor,
    borderColor: appColors.border,
  },
  radioBox1: {
    borderWidth: windowWidth(1),
    backgroundColor: appColors.darkHeader,
    borderColor: appColors.darkBorder,
  },
  check: {
    backgroundColor: appColors.primary,
    borderWidth: 0
  },
  round: {
    height: windowHeight(35),
    width: windowHeight(35),
    borderRadius: windowHeight(35),
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export { styles };
