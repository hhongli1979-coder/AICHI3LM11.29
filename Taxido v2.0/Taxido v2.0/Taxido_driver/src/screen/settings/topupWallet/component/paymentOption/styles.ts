import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import { useValues } from '../../../../../utils/context'

const { viewRtlStyle } = useValues()
const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    marginTop: windowHeight(1.2),
    justifyContent: 'space-between',
  },
  imgMaincontainer: {
    flexDirection: viewRtlStyle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: windowHeight(5.8),
    width: windowWidth(11.6),
    backgroundColor: appColors.graybackground,
    borderRadius: 25,
    marginHorizontal: windowWidth(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageView: {
    height: windowHeight(3),
    width: windowWidth(6),
    resizeMode: 'contain',
  },
})

export default styles
