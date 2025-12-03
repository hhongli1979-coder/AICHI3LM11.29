import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight(2),
    width: windowWidth(6),
  },
  image: {
    width: windowWidth(30),
    height: windowHeight(12),
    resizeMode: 'contain',
    right: windowHeight(0.5),
  },
})

export default styles
