import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  dateTime: {
    height: windowHeight(6.5),
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth(3),
    marginTop: windowHeight(1.2),
  },
  address: {
    height: windowHeight(12),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(3),
    marginVertical: windowHeight(1.2),
  },
  dashBorder: {
    borderBottomWidth: windowHeight(0.1),
    borderStyle: 'dashed',
    marginHorizontal: windowWidth(4),
  },
  alignment: {
    alignItems: 'center',
  },
  carImage: {
    height: windowHeight(6),
    width: windowWidth(12),
    resizeMode: 'contain',
  },
  spaceHorizantal: {
    marginHorizontal: windowWidth(3),
  },
  id: {
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.2),
  },
  amount: {
    color: appColors.primary,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.2),
  },
  date: {
    color: appColors.secondaryFont,
    marginTop: windowHeight(0.6),
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.regular,
    flex: 1,
    width: windowWidth(35),
  },
  mapImage: {
    height: windowHeight(12.8),
    width: '100%',
    borderRadius: 10,
  },
})

export default styles
