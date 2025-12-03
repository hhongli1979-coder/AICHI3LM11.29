import { StyleSheet } from 'react-native'
import appColors from '../../theme/appColors'
import { windowHeight, windowWidth } from '../../theme/appConstant'

const styles = StyleSheet.create({
  radioButton: {
    alignItems: 'center',
  },
  radioButtonOuter: {
    height: windowHeight(2.8),
    width: windowWidth(6),
    borderRadius: windowHeight(2),
    borderWidth: windowHeight(0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    height: windowHeight(1.5),
    width: windowWidth(3),
    borderRadius: windowHeight(1),
    backgroundColor: appColors.primary,
  },
  label: {
    marginHorizontal: windowHeight(0.7),
    fontSize: 14,
  },
})

export default styles
