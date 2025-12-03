import { StyleSheet } from 'react-native'
import appColors from '../../../../../../theme/appColors'
import { fontSizes, windowHeight, windowWidth } from '../../../../../../theme/appConstant'
import appFonts from '../../../../../../theme/appFonts'

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    height: windowHeight(13),
    marginHorizontal: windowWidth(0.8),
    borderRadius: windowHeight(0.8),
    borderWidth: windowHeight(0.1),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: windowHeight(1),
  },
  vehicalImage: {
    height: windowHeight(6),
    width: windowWidth(16),
    resizeMode: 'contain',
  },
  iconAndTextContainer: {
    alignItems: 'center',
    marginBottom: windowHeight(1),
  },
  serviceTitle: {
    fontFamily: appFonts.medium,
    color: appColors.primaryFont,
  },
  container: {
    marginBottom: windowHeight(2.5),
  },
  placeholderStyles: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
  },
  text: {
    fontFamily: appFonts.regular,
  },
})

export default styles
