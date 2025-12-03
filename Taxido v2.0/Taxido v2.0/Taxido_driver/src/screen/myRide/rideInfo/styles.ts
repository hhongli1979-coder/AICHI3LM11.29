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
    height: windowHeight(6),
    width: windowHeight(6),
    borderRadius:windowHeight(6),
    alignItems:'center',
    justifyContent:'center'
  },
  starView: {
    alignItems: 'center',
  },
  riderContainer: {
    flexDirection: 'column',
    marginHorizontal: windowWidth(2),
  },
  name: {
    color: appColors.primaryFont,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.2),
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
  containerPrice: {
    borderStyle: 'dashed',
    marginVertical: windowHeight(0.5),
    borderBottomWidth: 1,
  },
  priceContainer: {
    justifyContent: 'space-between',
  },
  carLogo: {
    height: windowHeight(7),
    width: windowHeight(7),
    resizeMode: 'contain',
  },
  rideNoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: windowWidth(2),
  },
  rideNO: {
    color: appColors.primaryFont,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.4),
  },
  price: {
    color: appColors.price,
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(0.4),
    fontSize:fontSizes.FONT4HALF
  },
  createDate: {
    fontFamily: appFonts.regular,
    color: appColors.secondaryFont,
    marginLeft: windowWidth(1),
  },
  pickUpBorder: {
    borderStyle: 'dashed',
    marginVertical: windowHeight(1),
    borderBottomWidth: 1,
  },
  dropOffBorder: {
    borderStyle: 'dashed',
    marginVertical: windowHeight(1),
    borderBottomWidth: 1,
  },
  location: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
  },
  locationName: {
    fontFamily: appFonts.regular,
  },
  rentalContainer: {
    justifyContent: 'space-between',
    marginBottom: windowHeight(0.5),
    backgroundColor: appColors.white,
    borderRadius: windowHeight(0.6),
  },
  containerSchedule: {
    padding: windowHeight(1),
  },
  startTime: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
  },
  scheduleClock: {
    marginTop: windowHeight(0.5),
  },
  smallCalander: {
    marginBottom: windowHeight(0.8),
  },
  formattedDateText: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
  rentalBorder: {
    borderLeftWidth: windowHeight(0.1),
    marginVertical: windowHeight(1),
  },
  packageContainer: {
    padding: windowHeight(1.5),
    backgroundColor: appColors.white,
    borderWidth: windowHeight(0.1),
    borderColor: appColors.border,
    borderRadius: windowHeight(1),
    marginTop: windowHeight(1.5),
  },
  vehicleLogo: {
    height: windowHeight(18),
    borderRadius: windowHeight(1),

    width: '100%',
    resizeMode: 'stretch',
  },
  packageDescription: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    marginTop: windowHeight(1),
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptBtn: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: windowHeight(2),
  },
  timeView:{
    flexDirection: 'row', 
    alignItems: 'center',
    marginVertical:windowHeight(0.5)
  },
  box:{
    height:windowHeight(7),
    width:windowHeight(9),
    borderRadius:windowWidth(2),
    alignItems:'center',
    justifyContent:'center'
  }
})
export { styles }
