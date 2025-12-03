import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  dateTime: {
    height: windowHeight(6.5),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(3),
  },
  timing: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT3HALF,
  },
  distance: {
    color: appColors.price,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4HALF,
  },
})

export default styles
