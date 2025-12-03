import { Platform, StyleSheet } from 'react-native';
import { commonStyles } from '../../../../styles/commonStyle';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { external } from '../../../../styles/externalStyle';

const styles = StyleSheet.create({
  main: { flex: 1 },
  addressContainer: {
    backgroundColor: appColors.whiteColor,
    shadowColor: appColors.blackColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    borderRadius: windowHeight(5.9),
    paddingHorizontal: windowWidth(24),
    paddingVertical: windowHeight(12),
  },
  message: {
    height: windowHeight(40),
    width: windowHeight(40),
    borderRadius: windowHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  call: {
    height: windowHeight(40),
    width: windowHeight(40),
    backgroundColor: appColors.lightGray,
    borderRadius: windowHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedLine: {
    height: 0.1,
    width: '100%',
    borderBottomWidth: windowHeight(0.9),
    borderColor: appColors.primaryGray,
    borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed',
    marginVertical: windowHeight(10),
  },
  pickUpLocationStyles: {
    ...commonStyles.regularText,
    fontWeight: '300',
    fontSize: fontSizes.FONT16,
    color: appColors.primaryText,
  },
  itemStyle: {
    ...commonStyles.regularText,
    fontSize: fontSizes.FONT16,
    color: appColors.primaryText,
  },
  icon: {
    borderStyle: 'dotted',
    height: windowHeight(20),
    borderLeftWidth: windowHeight(0.9),
    marginHorizontal: windowHeight(5),
    borderLeftColor: appColors.regularText,
  },
  container: {
    ...external.mh_20,
    ...external.mt_20,
    borderRadius: windowHeight(5.9),
    overflow: 'hidden',
  },
  rideInfoContainer: {
    width: '100%',
    backgroundColor: appColors.whiteColor,
    paddingHorizontal: windowHeight(12),
    paddingTop: windowHeight(12),
    paddingBottom: windowHeight(1),
  },
  profileImage: {
    width: windowWidth(50),
    height: windowWidth(50),
    resizeMode: 'contain',
  },
  profileTextContainer: {
    ...external.mh_20,
    ...external.fg_1,
    justifyContent: 'space-evenly',
  },
  profileName: {
    ...commonStyles.mediumTextBlack12,
    fontSize: fontSizes.FONT19,
  },
  carInfoContainer: {
    alignItems: 'center',
    marginTop: windowHeight(3),
  },
  carInfoText: {
    ...commonStyles.regularText,
  },
  tripImage: {
    width: windowWidth(50),
    height: windowHeight(25),
    resizeMode: 'contain',
  },
  tripTextContainer: {
    ...external.ph_13,
    ...external.fg_1,
  },
  tripIDText: {
    ...commonStyles.mediumTextBlack12,
  },
  tripCostText: {
    ...commonStyles.mediumTextBlack12,
    color: appColors.price,
    marginVertical: windowHeight(2.9),
  },
  tripDateText: {
    ...commonStyles.regularText,
    paddingLeft: windowWidth(6),
  },
  iconContainer: {
    ...external.fd_row,
    ...external.js_space,
    ...external.mh_20,
  },
  serviceMainView: {
    justifyContent: "space-between",
  },
  serviceView: {
    marginTop: windowHeight(12),
  },
  service_name: {
    color: appColors.primary,
    fontFamily: appFonts.regular,
  },
  service_name_view: {
    backgroundColor: appColors.lightButton,
    paddingHorizontal: windowWidth(18),
    borderRadius: windowHeight(10),
    height: windowHeight(18),
    alignItems: "center",
    justifyContent: "center",
  },
  service_category: {
    color: appColors.darkPurpal,
    fontFamily: appFonts.regular,
  },
  service_category_view: {
    backgroundColor: appColors.lightPurpal,
    paddingHorizontal: windowWidth(18),
    marginHorizontal: windowHeight(10),
    borderRadius: windowHeight(10),
    height: windowHeight(18),
    alignItems: "center",
    justifyContent: "center",
  },
  MessageMainView: {
    width: windowWidth(100),
    justifyContent: "space-between",
  },
  MessageView: {
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight(30),
    width: windowHeight(30),
    borderRadius: windowHeight(20),
    borderWidth: windowHeight(1),
  },
  safetyCallView: {
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight(30),
    width: windowHeight(30),
    borderRadius: windowHeight(20),
    borderWidth: windowHeight(1),
  },
  starContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    alignSelf: 'center',
    bottom: windowHeight(11),
  },
  iconMainView: {
    alignItems: "flex-end",
    height: windowHeight(32),
    justifyContent: "space-between",
  },
  iconView: {
    alignItems: "center",
  },
  bgmodal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    paddingVertical: windowHeight(17),
    paddingHorizontal: windowWidth(10),
    borderRadius: windowHeight(10),
  },
  title: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT20,
    textAlign: 'center',
    marginHorizontal: windowWidth(17),
    paddingTop: windowHeight(10),
    paddingBottom: windowHeight(5),
  },
  userAlign: {
    alignItems: 'center',
    marginTop: windowHeight(18),
  },
  modalImage: {
    height: windowHeight(52),
    width: windowHeight(52),
    resizeMode: 'cover',
    borderRadius: windowHeight(20),
  },
  modalName: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT19,
    top: windowHeight(6),
  },
  modalMail: {
    fontSize: fontSizes.FONT15,
    marginTop: windowHeight(5),
  },
  lineImage: {
    height: windowHeight(4.8),
    width: windowHeight(270),
    marginVertical: windowHeight(8),
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  rate: {
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(8),
  },
  tips: {
    marginTop: windowHeight(18),
    fontFamily: appFonts.medium,
  },
  border2: {
    borderBottomWidth: windowHeight(0.1),
    marginVertical: windowHeight(18),
    borderBottomColor: appColors.primaryGray,
  },
  comment: {
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(12),
    marginHorizontal: windowWidth(8),
    top: windowHeight(4.5),
  },
  textinput: {
    height: windowHeight(85),
    borderWidth: windowHeight(1),
    borderColor: appColors.primaryGray,
    borderRadius: windowHeight(5),
    paddingHorizontal: windowWidth(15),
  },
  payment: {
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(8),
  },
  modalPaymentView: {
    borderWidth: windowHeight(1),
    paddingVertical: windowHeight(8),
    marginBottom: windowHeight(16),
    borderRadius: windowHeight(5),
    borderColor: appColors.primaryGray,
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth(10),
  },
  paymentView: {
    marginHorizontal: windowWidth(12),
    marginVertical: windowHeight(6),
  },
  mailInfo: {
    marginHorizontal: windowWidth(6),
    justifyContent: 'center',
  },
  mail: {
    fontFamily: appFonts.regular,
  },
  payBtn: {
    backgroundColor: appColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth(95),
    borderRadius: windowHeight(7.9),
    marginHorizontal: windowWidth(6),
    height: windowHeight(35),
  },
  containerReview: {
    height: windowHeight(44),
    borderWidth: windowHeight(1),
    borderColor: appColors.primaryGray,
    borderRadius: windowHeight(5),
    marginTop: windowHeight(8),
    justifyContent: 'space-between',
    width: '92%',
    alignSelf: 'center',
  },
  starIcon: {
    marginHorizontal: windowWidth(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingView: {
    alignItems: 'center',
    marginHorizontal: windowWidth(18),
    justifyContent: 'center',
  },
  borderVertical: {
    borderColor: appColors.primaryGray,
    borderRightWidth: windowHeight(0.1),
    height: windowHeight(16),
    marginHorizontal: windowWidth(18),
  },
  rating: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT16,
  },
  buttonContainer: {
    marginTop: windowHeight(8),
  },
  button: {
    paddingVertical: windowHeight(8),
    paddingHorizontal: windowWidth(10),
    borderRadius: windowHeight(5),
    marginHorizontal: windowWidth(6),
    flex: 1,
    alignItems: 'center',
    borderWidth: windowHeight(1),
    marginVertical: windowHeight(4),
  },
  buttonText: {
    fontFamily: appFonts.medium,
  },
  contain: {
    justifyContent: "space-between",
    marginHorizontal: windowWidth(14),
    marginBottom: windowHeight(2),
    marginTop: windowHeight(6),
  },
  type: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT18,
    textTransform: 'capitalize',
  },
  leftRadius: {
    height: windowHeight(17),
    width: windowWidth(25),
    bottom: 0,
    position: "absolute",
    borderTopRightRadius: windowHeight(24),
    borderRightWidth: windowHeight(0.9),
    borderTopWidth: windowHeight(0.9),
    borderTopColor: appColors.border,
    borderRightColor: appColors.border,
  },
  rightRadius: {
    height: windowHeight(17),
    width: windowWidth(25),
    bottom: 0,
    right: 0,
    position: "absolute",
    borderTopLeftRadius: windowHeight(49),
    borderLeftWidth: windowHeight(0.9),
    borderTopWidth: windowHeight(0.9),
    borderLeftColor: appColors.border,
    borderTopColor: appColors.border,
  },
  border: {
    borderTopWidth: windowHeight(1),
    marginHorizontal: windowWidth(18.1),
    marginVertical: windowHeight(1.3),
    borderStyle: 'dashed',
  },
  PendingRideContainer: {
    height: windowHeight(15),
    alignItems: "flex-end",
    justifyContent: "center",
    borderRadius: windowHeight(10),
  },
  containerStyle: {
    paddingBottom: windowHeight(50),
  },
  addressContainer1: {
    ...commonStyles.shadowContainer,
    borderRadius: windowHeight(6),
    overflow: 'hidden',
    position: 'relative',
    ...external.fd_row,
    paddingVertical: windowHeight(4),
  },
  itemStyle1: {
    fontSize: fontSizes.FONT18,
    color: appColors.primaryText,
    width: windowWidth(370),
    fontFamily: appFonts.medium,
  },
  flatlistView: {
    bottom: windowHeight(20),
  },
  noRideDes: {
    left: windowWidth(10),
    textAlign: 'center',
    marginVertical: windowHeight(5),
    marginHorizontal: windowWidth(30),
  },
  Info: {
    top: windowHeight(3.5),
    left: windowWidth(16),
  },
  noRIde: {
    fontSize: fontSizes.FONT23,
    textAlign: 'center',
    left: windowWidth(8),
  },
  profileInfoContainer: {
    justifyContent: 'space-between',
  },
  noRIdeView: {
    top: windowHeight(5),
  },
  noDataView: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  noRideImage: {
    height: windowHeight(220),
    width: windowHeight(220),
    top: windowHeight(25),
  },
  container2: {
    paddingVertical: windowHeight(12.5),
    paddingHorizontal: windowWidth(20),
    borderRadius: windowHeight(7.9),
    marginBottom: windowHeight(8),
    width: '100%',
    marginTop: windowHeight(3),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontFamily: appFonts.regular,
  },
  contentContainer: {
    marginHorizontal: windowWidth(15),
  },
  cancelText: {
    color: appColors.whiteColor,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT20,
  },
});

export { styles };
