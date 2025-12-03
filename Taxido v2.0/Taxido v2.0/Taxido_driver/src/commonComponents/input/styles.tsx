import { StyleSheet } from 'react-native'
import appColors from '../../theme/appColors'
import appFonts from '../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../theme/appConstant'

const styles = StyleSheet.create({
  container: {
    marginVertical: windowHeight(1),
  },
  subContainer: {
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(0.8),
    overflow: 'hidden',
  },
  inputContainer: {
    alignItems: 'center',
    height: windowHeight(6),
  },
  iconContainer: {
    marginHorizontal: windowWidth(2.5),
  },
  title: {
    fontFamily: appFonts.medium,
    marginVertical: 10,
  },
  input: {
    color: appColors.secondaryFont,
    paddingHorizontal: windowWidth(0.7),
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
    width: '100%',
  },
  errorContainer: {
    marginTop: windowHeight(0.6),
  },
  warning: {
    color: appColors.red,
    marginBottom: windowHeight(0.5),
    fontSize: fontSizes.FONT3
  },
})
export default styles
