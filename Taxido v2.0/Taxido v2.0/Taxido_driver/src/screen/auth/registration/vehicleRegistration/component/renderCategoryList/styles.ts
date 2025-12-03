import { StyleSheet } from 'react-native'
import { fontSizes, windowHeight } from '../../../../../../theme/appConstant'
import appFonts from '../../../../../../theme/appFonts'

const styles = StyleSheet.create({
  container: { marginBottom: windowHeight(2) },
  placeholderStyles: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
  },
  text: {
    fontFamily: appFonts.regular,
  },
})
export default styles
