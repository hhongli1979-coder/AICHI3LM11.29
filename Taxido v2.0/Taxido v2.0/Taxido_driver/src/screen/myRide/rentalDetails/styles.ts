import { StyleSheet } from 'react-native'
import {
  windowHeight,
  windowWidth,
  fontSizes,
} from '../../../theme/appConstant'
import appFonts from '../../../theme/appFonts'
import appColors from '../../../theme/appColors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailContainer: {
    marginHorizontal: windowWidth(5),
  },
  profileContainer: {
    backgroundColor: appColors.white,
    borderWidth: windowHeight(0.1),
    paddingHorizontal: windowWidth(3),
    borderColor: appColors.border,
    borderRadius: windowHeight(1),
    marginVertical: windowHeight(2),
    paddingBottom: windowHeight(2),
  },
  profileView: {
    marginVertical: windowWidth(3),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImg: {
    height: windowHeight(5),
    width: windowHeight(5),
  },
  name: {
    color: appColors.primaryFont,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.2),
    fontSize:fontSizes.FONT4
  },
  rideNoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: windowWidth(2),
  },
  verticalLine: {
    height: windowHeight(2),
    borderLeftWidth: windowHeight(0.1),
    borderColor: appColors.border,
    marginHorizontal: windowWidth(1.5),
  },
  rating: {
    color: appColors.primaryFont,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(0.5),
  },
  tag: {
    backgroundColor: appColors.tagColor,
    paddingHorizontal: windowWidth(4),
    paddingVertical: windowHeight(0.5),
    borderRadius: windowHeight(2),
    height: windowHeight(3.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagTitle: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
  },
  priceContainer: {
    justifyContent: 'space-between',
  },
  carLogo: {
    height: windowHeight(6),
    width: windowHeight(6),
    resizeMode: 'contain',
  },
    carLogo1: {
    height: windowHeight(5),
    width: windowHeight(5),
    resizeMode: 'contain',
  },
  price: {
    color: appColors.price,
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(0.4),
  },
  rideNO: {
    color: appColors.primaryFont,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.4),
  },
  createDate: {
    fontFamily: appFonts.regular,
    color: appColors.secondaryFont,
    marginTop: windowHeight(1),
  },
  location: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
  },
  locationName: {
    fontFamily: appFonts.regular,
  },
  timeTitle: {
    fontFamily: appFonts.medium,
    color: appColors.primaryFont,
  },
  timeTitle1: {
    fontFamily: appFonts.medium,
    color: appColors.primaryFont,
    marginTop: windowHeight(1.5),
  },
  textNormal: {
    fontFamily: appFonts.regular,
    color: appColors.primaryFont,
  },
  timeContainer: {
    marginHorizontal: windowWidth(5),
    borderColor: appColors.border,
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(1),
    backgroundColor: appColors.white,
    paddingVertical: windowHeight(1.5),
    paddingHorizontal: windowWidth(3),
  },
  listContainer: {
    borderWidth: windowHeight(0.1),
    backgroundColor: appColors.white,
    borderColor: appColors.border,
    marginHorizontal: windowWidth(3),
    borderRadius: windowHeight(1),
    marginTop: windowHeight(3),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: windowWidth(4),
    backgroundColor: appColors.white,
  },
  carBrand: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT5,
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
  },
  iconTitle: {
    color: appColors.secondaryFont,
    marginLeft: windowWidth(2),
    fontFamily: appFonts.regular,
  },
  title: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
  subTitle: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
  },
  interiorData: {
    color: appColors.secondaryFont,
  },
  normalLine: {
    borderBottomColor: appColors.border,
    borderBottomWidth: windowHeight(0.1),
    marginVertical: windowHeight(1),
  },
  paymentTitle: {
    color: appColors.primaryFont,
    fontFamily: appFonts.regular,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.modelBg,
  },
  modalContent: {
    width: '90%',
    padding: windowHeight(8),
    backgroundColor: appColors.white,
    borderRadius: windowHeight(1.5),
    alignItems: 'center',
  },
  modalText: {
    fontSize: fontSizes.FONT4HALF,
    marginBottom: 20,
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
    textAlign: 'center',
  },
  closeButton: {
    width: '100%',
    marginTop: windowHeight(3),
  },
  buttonText: {
    color: appColors.white,
    fontSize: 16,
  },
  otpTitle: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
    width: '100%',
    marginBottom: windowHeight(1),
  },
  otpContainer: {
    justifyContent: 'space-between',
    width: windowWidth(400),
    backgroundColor: 'red',
  },
  otpInput: {
    width: windowWidth(13.5),
    height: windowHeight(6.5),
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(1.3),
  },
  closeBtn: {
    justifyContent: 'flex-end',
    width: '100%',
  },
  acceptText: { fontFamily: appFonts.medium },
  acceptContainer: {
    backgroundColor: appColors.primary,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: windowHeight(2),
    borderRadius: windowHeight(1),
  },
  declineText: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.medium,
  },
  declineContainer: {
    backgroundColor: appColors.graybackground,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: windowHeight(2),
    borderRadius: windowHeight(1),
  },
  requestedContainer: {
    marginHorizontal: windowWidth(3),
    justifyContent: 'space-between',
    marginVertical: windowHeight(3),
  },
  pickupCustomerBtn: {
    marginVertical: windowHeight(3),
  },
  rideFareContainer: {
    marginTop: windowHeight(1),
    justifyContent: 'space-between',
  },
  billSummaryView: {
    marginHorizontal: windowWidth(3),
  },
  interiorMainView: {
    marginHorizontal: windowWidth(3),
  },
  interiorView: {
    marginVertical: windowHeight(1),
  },
  smallCardView: {
    justifyContent: 'flex-start',
    marginHorizontal: windowWidth(3),
    alignItems: 'center',
    marginVertical: windowHeight(1),
  },
  CLMV069: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(2),
    fontSize: fontSizes.FONT4,
  },
  numberText: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(1),
  },
  starView: {
    alignItems: 'center',
  },
  starMainView: {
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(3),
  },
  carImgContainer: {
    marginHorizontal: windowWidth(3),
    marginTop: windowHeight(1.5),
  },
  completedView: {
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(3),
    marginTop: windowHeight(1),
  },
  listView: {
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(3),
    marginTop: windowHeight(1.5),
  },
  calanderBigContainer: {
    paddingVertical: windowHeight(1.5),
    borderRadius: windowHeight(0.6),
    marginTop: windowHeight(1),
    backgroundColor: appColors.graybackground,
    width: '100%',
  },
  calanderBig: {
    marginHorizontal: windowWidth(2),
  },
  riderContainer: {
    flexDirection: 'column',
    marginHorizontal: windowWidth(3),
  },
  containerPrice: {
    borderStyle: 'dashed',
    marginVertical: windowHeight(0.5),
    borderBottomWidth: windowHeight(0.1),
  },
  pickUpBorder: {
    borderStyle: 'dashed',
    marginVertical: windowHeight(1),
    borderBottomWidth: windowHeight(0.1),
  },
  dropOffBorder: {
    borderStyle: 'dashed',
    marginVertical: windowHeight(1),
    borderBottomWidth: windowHeight(0.1),
  },
  containerClock: {
    backgroundColor: appColors.graybackground,
    width: windowWidth(40),
    paddingVertical: windowHeight(1.5),
    borderRadius: windowHeight(0.6),
  },
  profileImg1: {
    height: windowHeight(6),
    width: windowHeight(6),
    backgroundColor: appColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(6),
  },
})

export { styles }
