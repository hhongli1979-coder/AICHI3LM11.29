import { windowHeight } from '../../theme/appConstant'
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerImage: {
    height: windowHeight(8),
    width: windowHeight(6),
    resizeMode: 'contain',
  },
})
export default styles
