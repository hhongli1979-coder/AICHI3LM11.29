import { StyleSheet } from 'react-native'
import appColors from '../../theme/appColors'
import appFonts from '../../theme/appFonts'
import { fontSizes, windowHeight } from '../../theme/appConstant'

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: windowHeight(0),
    left: windowHeight(0),
    right: windowHeight(0),
    height: windowHeight(8.9),
    backgroundColor: appColors.primary,
    borderTopRightRadius: windowHeight(2.6),
    borderTopLeftRadius: windowHeight(2.6),
    overflow: 'hidden',
    paddingBottom: windowHeight(1.3),
    paddingTop: windowHeight(1.3),
  },
  tabBarLabelStyle: {
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.Lexend,
  },
})
export default styles
