import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'
import appFonts from '../../../theme/appFonts'

const styles = StyleSheet.create({
  contain: {
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(2),
  },
  spaceTop: {
    marginTop: windowHeight(1.5),
  },
  review: {
    color: appColors.primaryFont,
    textAlign: 'center',
    fontFamily: appFonts.regular,
    marginTop: windowHeight(1.5),
    marginBottom: windowHeight(3),
  },
  activeRide: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.FONT5,
    fontFamily: appFonts.medium,
    position: 'absolute',
    left: 0,
    right: 0,
    marginTop: windowHeight(3.5),
    height: windowHeight(9.5),
  },
})

export default styles
