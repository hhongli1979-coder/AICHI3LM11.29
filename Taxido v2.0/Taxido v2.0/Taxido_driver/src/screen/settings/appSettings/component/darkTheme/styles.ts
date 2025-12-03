import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import appFonts from '../../../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: windowWidth(3.8),
    marginVertical: windowHeight(1.6),
  },
  container: {
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: windowHeight(0.15),
    marginHorizontal: windowWidth(3.8),
    borderStyle: 'dashed',
  },
  iconView: {
    height: windowHeight(5.2),
    width: windowWidth(11),
    borderRadius: windowHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginHorizontal: windowWidth(3),
    fontFamily: appFonts.regular,
  },
})
export default styles
