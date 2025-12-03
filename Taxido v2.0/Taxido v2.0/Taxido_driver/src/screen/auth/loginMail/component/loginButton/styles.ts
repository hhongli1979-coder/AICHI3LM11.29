import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import appFonts from '../../../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    height: windowHeight(7),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: windowHeight(1.5),
  },
  image: {
    height: windowHeight(3.5),
    width: windowWidth(7),
    marginHorizontal: windowWidth(1.5),
  },
  name: {
    fontFamily: appFonts.medium,
  },
})

export default styles
