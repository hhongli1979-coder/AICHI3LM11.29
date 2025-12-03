import { StyleSheet } from 'react-native'
import appFonts from '../../../../../theme/appFonts'
import appColors from '../../../../../theme/appColors'
import { fontSizes, windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  initialCircle: {
    backgroundColor: appColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  additionalSection: {
    marginTop: windowHeight(1.5),
    alignItems: 'center',
    height: windowHeight(23),
    marginHorizontal: windowWidth(4),
    borderRadius: windowHeight(1),
    borderWidth: windowHeight(0.1),
  },
  profile: {
    height: windowHeight(7),
    width: '100%',
    justifyContent: 'space-between',
  },
  subProfile: {
    marginHorizontal: windowWidth(3),
    alignItems: 'center',
  },
  userImage: {
    height: windowHeight(4.5),
    width: windowHeight(4.5),
    borderRadius: windowHeight(10),
  },
  userName: {
    fontFamily: appFonts.regular,
    color: appColors.primaryFont,
  },
  price: {
    color: appColors.price,
    marginHorizontal: windowWidth(3),
    marginVertical: windowHeight(2.2),
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT4HALF,
  },
  timing: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT3HALF,
  },
  distance: {
    color: appColors.primary,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT3HALF,
  },
  spaceTop: {
    marginTop: windowHeight(0.2),
  },
  spaceRight: {
    marginRight: windowWidth(1.5),
  },
  verticalDot: {
    borderLeftWidth: 1,
    borderColor: 'gray',
    height: windowHeight(2),
    marginHorizontal: windowWidth(1.5),
    borderStyle: 'dashed',
  },
  pickup: {
    color: appColors.primaryFont,
    fontSize: fontSizes.FONT3SMALL,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.8),
  },
  drop: {
    color: appColors.primaryFont,
    fontSize: fontSizes.FONT3SMALL,
    width: windowWidth(75),
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.8),
  },
  date: {
    height: windowHeight(6),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(3),
  },
  address: {
    height: windowHeight(8.5),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(3),
  },
  riderDataView: {
    height: windowHeight(4.5),
    justifyContent: 'space-between',
    marginHorizontal: windowHeight(1),
  },
  rating_count: {
    fontFamily: appFonts.regular,
    marginHorizontal: windowHeight(0.5),
  },
  reviews_count: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
  formattedDate: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(1),
  },
  iconView: { alignItems: 'center' },
  clockBorder: {
    marginHorizontal: windowWidth(1.5),
    height: windowHeight(2),
    borderLeftWidth: windowHeight(0.1),
  },
  formattedTime: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(1),
  },
})

export default styles
