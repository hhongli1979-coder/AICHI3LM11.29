import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
  profileImageView: {
    position: 'absolute',
    top: windowHeight(-7),
    left: '50%',
    marginLeft: windowWidth(-14),
    width: windowHeight(13),
    height: windowHeight(13),
    borderRadius: windowHeight(15),
    borderWidth: windowHeight(0.1),
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: windowHeight(11.8),
    height: windowHeight(12),
    borderRadius: windowHeight(6),
  },
  editIconContainer: {
    width: windowHeight(4),
    height: windowHeight(4),
    borderRadius: windowHeight(24),
    position: 'absolute',
    alignSelf: 'flex-end',
    flexGrow: 1,
    top: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: windowHeight(0.1),
  },
})
export default styles
