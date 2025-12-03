import { StyleSheet } from 'react-native'
import { windowHeight } from '../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  buttonView: {
    position: 'absolute',
    bottom: windowHeight(3),
    left: windowHeight(0),
    right: windowHeight(0),
  },
})

export default styles
