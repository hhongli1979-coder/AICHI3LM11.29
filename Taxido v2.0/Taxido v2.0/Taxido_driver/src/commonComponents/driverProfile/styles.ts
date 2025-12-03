import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../theme/appConstant'
import appFonts from '../../theme/appFonts'

const styles = StyleSheet.create({
  profile: {
    height: windowHeight(12.5),
    width: '100%',
    justifyContent: 'space-between',
    borderRadius: windowHeight(1.5),
  },
  subProfile: {
    marginHorizontal: windowWidth(2.5),
    marginVertical: windowHeight(1.2),
  },
  userImage: {
    height: windowHeight(6.5),
    width: windowHeight(6.5),
    resizeMode: 'cover',
  },
  userName: {
    marginTop: windowWidth(1),
    fontFamily: appFonts.medium,
  },
  starContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: windowWidth(3.3),
  },
})
export default styles
