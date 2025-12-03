import { StyleSheet } from 'react-native'
import appFonts from '../../../../../theme/appFonts'
import {
  windowHeight,
  windowWidth,
  fontSizes,
} from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    height: windowHeight(9.5),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(4),
  },
  title: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT5,
    marginHorizontal: windowWidth(4),
  },
  iconView: {
    height: windowHeight(5),
    width: windowWidth(10.3),
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(0.8),
    alignItems: 'center',
    justifyContent: 'center',
  },
})
export default styles
