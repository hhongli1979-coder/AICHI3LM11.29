import { Platform, StyleSheet } from 'react-native'
import { windowHeight } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
  backgroundView: {
    height: windowHeight(25),
    width: '100%',
  },
  backgroundImage: {
    height: Platform.OS === 'ios' ? windowHeight(22) : windowHeight(30),
    width: '100%',
  },
})

export default styles
