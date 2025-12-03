import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    marginVertical: windowHeight(1.5),
  },
  title: {
    color: appColors.primaryFont,
    fontSize: fontSizes.FONT4HALF,
    fontFamily: appFonts.medium,
    marginBottom: windowHeight(0.6),
  },
  container: {
    height: windowHeight(11.2),
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(1.5),
    marginVertical: windowHeight(0.6),
  },
  alignment: {
    justifyContent: 'space-between',
  },
  imageCustomer: {
    height: windowHeight(5),
    width: windowWidth(10),
    resizeMode: 'contain',
    marginVertical: windowHeight(1.2),
    marginHorizontal: windowWidth(3),
  },
  name: {
    marginVertical: windowHeight(2),
    fontFamily: appFonts.regular,
  },
  ratingView: {
    marginHorizontal: windowWidth(3),
  },
  starIcon: {
    marginVertical: windowHeight(2.2),
    marginHorizontal: windowWidth(1.5),
  },
  rating: {
    marginVertical: windowHeight(1.8),
    fontFamily: appFonts.regular,
  },
  review: {
    marginHorizontal: windowWidth(3),
    fontFamily: appFonts.regular,
  },
})

export default styles
