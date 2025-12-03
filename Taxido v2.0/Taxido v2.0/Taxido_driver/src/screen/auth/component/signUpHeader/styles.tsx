import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    height: windowHeight(7),
    alignItems: 'center',
  },
  iconView: {
    borderWidth: windowHeight(0.1),
    width: windowHeight(5.5),
    height: windowWidth(11),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(0.7),
    position: 'absolute',
    marginHorizontal: windowWidth(4.5),
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLogo: {
    height: windowHeight(4),
    width: windowWidth(26),
    resizeMode: 'contain',
  },
})

export default styles
