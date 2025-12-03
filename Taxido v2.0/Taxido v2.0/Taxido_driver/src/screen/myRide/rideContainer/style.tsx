import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth, fontSizes } from '../../../theme/appConstant'
import appFonts from '../../../theme/appFonts'
import appColors from '../../../theme/appColors'

const styles = StyleSheet.create({
  addressContainer: {
    backgroundColor: appColors.white,
    shadowColor: appColors.black,
    shadowOffset: {
      width: windowHeight(0),
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    borderRadius: 6,
    paddingHorizontal: windowWidth(12),
    paddingVertical: windowHeight(6),
  },
  dashedLine: {
    height: 0.2,
    width: '100%',
    borderBottomWidth: windowHeight(0.2),
    borderColor: appColors.border,
    borderStyle: 'dashed',
    marginVertical: windowHeight(2),
  },
  iconStar: {
    marginHorizontal: windowWidth(3),
    marginVertical: windowHeight(3),
  },
  pickUpLocationStyles: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
    color: appColors.secondaryFont,
  },
  itemStyle: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
    color: appColors.secondaryFont,
  },
  container: {
    marginHorizontal: windowHeight(2),
    marginTop: windowHeight(2.3),
  },
  rideInfoContainer: {
    width: '100%',
    borderRadius: 6,
    paddingHorizontal: windowHeight(1.5),
    paddingTop: windowHeight(1.8),
    paddingVertical: windowHeight(1),
    borderWidth: windowHeight(0.1),
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
    justifyContent: 'space-evenly',
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
  carInfoText: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
    color: appColors.secondaryFont,
  },
  ratingText: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT17,
    color: appColors.primaryFont,
  },
  tripImage: {
    width: windowWidth(12),
    height: windowHeight(4),
    resizeMode: 'contain',
  },
  tripTextContainer: {
    paddingHorizontal: windowHeight(1.4),
    flexGrow: 1,
  },
  tripIDText: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT17,
    color: appColors.primaryFont,
  },
  tripCostText: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT5,
    color: appColors.price,
  },
  tripDateText: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT17,
    color: appColors.secondaryFont,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: windowHeight(14),
  },
  userImage: {
    width: windowWidth(11.6),
    height: windowWidth(12),
    resizeMode: 'stretch',
  },
  listContainer: {
    flex: 1,
    bottom: windowHeight(1.8),
  },
  iconContainer1: {
    height: windowHeight(5.5),
    alignItems: "flex-end",
    justifyContent: 'space-between',
  },
  clock: {
    marginHorizontal: windowWidth(1),
  },
  calanderSmall: {
    marginHorizontal: windowWidth(1),
  },
  containerIcon: {
    alignItems: 'center',
  },
  service_category_Container: {
    backgroundColor: appColors.lightPurpal,
    paddingHorizontal: windowWidth(3),
    paddingVertical: windowHeight(0.3),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(2),
    marginHorizontal: windowWidth(3),
    alignSelf: 'center',
    alignContent: "center",
  },
  serviceName: {
    color: appColors.primary,
    fontFamily: appFonts.regular,
  },
  serviceContainer: {
    backgroundColor: appColors.primaryBg,
    paddingHorizontal: windowWidth(3),
    paddingVertical: windowHeight(0.3),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(2),
  },
  containerService: {
    marginTop: windowHeight(2),
    paddingHorizontal: windowHeight(0.5),
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
  reviews_count: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
  rating_count: {
    fontFamily: appFonts.regular,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight(65),
  },
  noDataImage: {
    width: windowHeight(33),
    height: windowWidth(55),
    resizeMode: 'contain',
  },
  noDataText: {
    fontSize: fontSizes.FONT4HALF,
    fontFamily: appFonts.bold,
    color: appColors.primaryFont,
  },
  noDataDesc: {
    fontFamily: appFonts.regular,
    color: appColors.darkBorderBlack,
    marginTop: windowHeight(1),
  },
  bottomView: {
    marginBottom: windowHeight(50),
  },
})

export { styles }
