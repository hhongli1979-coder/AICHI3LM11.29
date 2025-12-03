import { StyleSheet } from 'react-native'
import appFonts from '../../../../theme/appFonts'
import appColors from '../../../../theme/appColors'
import { fontSizes, windowHeight } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    fontSize: fontSizes.FONT5,
    fontFamily: appFonts.bold,
    marginTop: windowHeight(2),
  },
  sub: {
    color: appColors.secondaryFont,
    marginTop: windowHeight(0.9),
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.medium,
    marginBottom: windowHeight(2),
  },
  view: {
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default styles
