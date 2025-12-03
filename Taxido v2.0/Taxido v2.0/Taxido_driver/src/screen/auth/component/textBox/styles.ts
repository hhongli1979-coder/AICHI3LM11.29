import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import {fontSizes,windowHeight,windowWidth} from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'

const styles = StyleSheet.create({
  container: {
    borderWidth: windowHeight(0.1),
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: windowWidth(3.5),
    overflow: 'hidden',
    borderRadius: windowWidth(1.5),
  },
  input: {
    flex: 1,
    paddingVertical: windowHeight(1.5),
    paddingHorizontal: windowWidth(0),
    color: appColors.secondaryFont,
    marginHorizontal: windowWidth(2),
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
    height: windowHeight(5.8),
  },
})
export default styles
