import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: windowHeight(9),
    width: windowWidth(100),
    top: windowHeight(1.8),
    left: windowHeight(0.9),
  },
})

export default styles
