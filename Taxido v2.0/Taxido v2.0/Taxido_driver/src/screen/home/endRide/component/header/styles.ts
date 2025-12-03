import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    height: windowHeight(11.5),
    backgroundColor: appColors.white,
    paddingHorizontal: windowHeight(1.5),
  },
  backView: {
    marginHorizontal: windowWidth(1.5),
    borderWidth: windowHeight(0.1),
    borderColor: appColors.border,
    height: windowHeight(5.5),
    width: windowWidth(11),
    borderRadius: windowHeight(1.3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeRide: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.FONT5,
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
  },
  downloadView: {
    marginHorizontal: windowWidth(3),
    height: windowHeight(5.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default styles
