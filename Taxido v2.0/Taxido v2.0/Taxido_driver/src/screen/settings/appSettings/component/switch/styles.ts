import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../chat/context'

const styles = StyleSheet.create({
  containerStyles: {
    width: windowWidth(49),
    height: windowHeight(20),
    borderRadius: windowHeight(14),
    paddingRight: windowWidth(55),
    paddingLeft: windowWidth(6.8),
  },
  circleStyles: {
    width: windowHeight(12),
    height: windowWidth(18),
    borderRadius: windowHeight(6),
  },
})
export default styles
