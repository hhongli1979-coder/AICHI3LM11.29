import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import appFonts from '../../../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: windowWidth(3.5),
    marginVertical: windowHeight(1.5),
  },
  alignment: {
    alignItems: 'center',
  },
  iconContain: {
    height: windowHeight(5.1),
    width: windowWidth(10.5),
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginHorizontal: windowWidth(3),
    fontFamily: appFonts.regular,
  },
})
export default styles
