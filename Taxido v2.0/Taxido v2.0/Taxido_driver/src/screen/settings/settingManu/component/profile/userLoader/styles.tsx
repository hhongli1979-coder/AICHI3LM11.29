import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../../../theme/appConstant'

const styles = StyleSheet.create({
  detainContain: {
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(1.5),
  },
  profileImage: {
    height: windowHeight(7),
    width: windowHeight(7),
    borderRadius: windowHeight(10),
  },
  details: {
    justifyContent: 'center',
    top: windowHeight(1.3),
  },
  name: {
    height: windowHeight(4),
    width: windowWidth(46),
    marginHorizontal: windowHeight(2),
  },
  walletContain: {
    height: windowHeight(6),
    width: windowWidth(83),

    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(0.6),
  },
})
export default styles
