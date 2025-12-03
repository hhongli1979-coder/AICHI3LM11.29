import { StyleSheet } from 'react-native'
import { windowHeight, fontSizes, windowWidth } from '../../theme/appConstant'
import appFonts from '../../theme/appFonts'

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    height: windowHeight(9.5),
    paddingHorizontal: windowWidth(3),
  },
  activeRide: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.FONT5,
    fontFamily: appFonts.medium,
    position: 'absolute',
  },
  headerTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '76%',
  },
})
export default styles
