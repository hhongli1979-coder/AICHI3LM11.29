import { StyleSheet } from 'react-native'
import { windowHeight } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  profile: {
    height: windowHeight(9.5),
    width: '100%',
    justifyContent: 'space-between',
  },
  box: {
    height: windowHeight(33.5),
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(1.3),
  },
})
export default styles
