import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
  },
  ticContainer: {
    height: windowHeight(3),
    width: windowWidth(6),
    borderWidth: windowHeight(0.1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(0.8),
  },
})

export default styles
