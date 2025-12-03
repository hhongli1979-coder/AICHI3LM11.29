import { StyleSheet } from 'react-native'
import { fontSizes, windowHeight, windowWidth } from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    height: windowHeight(9.5),
    paddingHorizontal: windowWidth(4),
  },
  title: {
    fontSize: fontSizes.FONT5,
    fontFamily: appFonts.medium,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  callIcon: {
    height: windowHeight(5),
    width: windowWidth(10),
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(0.7),
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default styles
