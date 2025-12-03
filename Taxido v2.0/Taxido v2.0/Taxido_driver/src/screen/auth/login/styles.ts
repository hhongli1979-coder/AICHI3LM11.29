import { StyleSheet } from 'react-native'
import { windowHeight } from '../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  loginView: {
    position: 'absolute',
    top: windowHeight(30),
    borderTopRightRadius: windowHeight(12),
    borderTopLeftRadius: windowHeight(12),
    width: '100%',
    paddingBottom: windowHeight(2),
    height: '100%',
  },
})

export default styles
