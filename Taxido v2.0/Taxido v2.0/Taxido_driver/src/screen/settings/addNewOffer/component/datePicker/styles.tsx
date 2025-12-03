import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import appFonts from '../../../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    justifyContent: 'space-between',
    paddingTop: windowHeight(2),
  },
  label: {
    fontFamily: appFonts.medium,
    marginBottom: windowHeight(1),
  },
  input: {
    height: windowHeight(6.5),
    width: windowWidth(40),
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(0.8),
    paddingHorizontal: windowWidth(3),
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
})
export default styles
