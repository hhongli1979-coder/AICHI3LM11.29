import { StyleSheet, Dimensions } from 'react-native'
import appColors from '../../../theme/appColors'
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  img: {
    width: width,
    height: height,
    resizeMode: 'contain',
  },
})
export default styles
