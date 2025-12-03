import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import { windowHeight, fontSizes, windowWidth } from '../../../theme/appConstant'
import appFonts from '../../../theme/appFonts'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(1),
    borderColor: appColors.border,
    height: windowHeight(5),
    width: windowWidth(25),
  },
  mediumTextBlack12: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT3HALF,
    color: appColors.primaryFont,
  },
  listContainer: {
    marginVertical: windowHeight(2.8),
    marginHorizontal: windowWidth(5),

    borderRadius: windowHeight(5),
  },
})
export { styles }
