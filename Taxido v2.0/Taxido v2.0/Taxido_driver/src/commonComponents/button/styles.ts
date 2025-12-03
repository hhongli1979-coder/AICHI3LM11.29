import { StyleSheet } from 'react-native'
import { windowHeight } from '../../theme/appConstant'
import appFonts from '../../theme/appFonts'

const styles = StyleSheet.create({
  button: {
    height: windowHeight(6.5),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(1),
  },
  buttonText: {
    fontFamily: appFonts.medium,
  },
})

export default styles
