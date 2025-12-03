import { StyleSheet } from 'react-native'
import { windowHeight } from '../../theme/appConstant'

const styles = StyleSheet.create({
  direction: {
    width: '100%',
    justifyContent: 'space-between',
  },
  lineImage: {
    height: 20,
    resizeMode: 'contain',
    marginHorizontal: 20,
  },
  addressbox: {
    borderWidth: windowHeight(0.1),
    borderRadius: 5,
  },
})
export default styles
