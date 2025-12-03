import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import appFonts from '../../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(2.8),
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(0.7),
  },
  border: {
    borderBottomWidth: windowHeight(0.1),
    borderStyle: 'dashed',
    marginHorizontal: windowWidth(3),
    marginTop: windowHeight(1)
  },
  rideData: {
    marginHorizontal: windowWidth(3),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: windowHeight(1.2),
  },
  carIdView: {
    alignItems: 'center',
  },
  idNo: {
    fontFamily: appFonts.medium,
  },
  carImage: {
    height: windowHeight(5.5),
    width: windowWidth(11),
    resizeMode: 'contain',
  },
  date: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
  paymentView: {
    marginHorizontal: windowWidth(3),
    justifyContent: 'space-between',
    marginVertical: windowHeight(1.2),
  },
  paymentType: {
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(0.8),
  },
  gst: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(0.8),
    fontSize: fontSizes.FONT3HALF,
    marginVertical: windowHeight(0.5),
  },
  amount: {
    color: appColors.primary,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4HALF,
  },
  mapView: {
    height: windowHeight(12),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(3),
    marginVertical: windowHeight(1.2),
  },
  mapImage: {
    height: windowHeight(12.8),
    width: '100%',
    borderRadius: windowHeight(0.9),
  },
  addressView: {
    marginHorizontal: windowWidth(4),
  },
  iconView: {
    justifyContent: 'space-between',
    height: windowHeight(5.5),
    alignItems: "flex-end"
  },
  viewIcon: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tripCostText: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT5,
    color: appColors.price,
    top: windowHeight(0.5),
  },
  tripTextContainer: {
    paddingHorizontal: windowHeight(1.4),
  },
  profileImage: {
    width: windowWidth(13),
    height: windowWidth(13),
    resizeMode: 'cover',
    borderRadius: windowHeight(0.8),
    overflow: 'hidden',
  },
  profileTextContainer: {
    marginHorizontal: windowWidth(1.5),
    alignSelf: 'center',
    height: windowWidth(13),
    justifyContent: 'space-evenly'
  },
  profileName: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4,
    color: appColors.primaryFont,
  },
  carInfoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rating_count: {
    fontFamily: appFonts.regular,
  },
  reviews_count: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
  callContainer: {
    borderRadius: windowWidth(2),
    height: windowHeight(5),
    width: windowHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptedContainer: {
    width: windowWidth(23),
    justifyContent: 'space-between',
  },
})

export default styles
