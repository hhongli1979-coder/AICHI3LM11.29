import { StyleSheet } from 'react-native'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    marginBottom: windowHeight(10),
  },
  container: {
    paddingHorizontal: windowWidth(4),
  },
  version: {
    color: appColors.iconColor,
    textAlign: 'center',
    marginTop: windowHeight(0.5),
    marginBottom: windowHeight(1.5),
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.regular,
  },
  cancelButton: {
    height: windowHeight(5.7),
    width: '47.5%',
    borderRadius: windowHeight(0.7),
  },
})
export default styles
