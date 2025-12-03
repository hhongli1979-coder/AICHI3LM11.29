import { StyleSheet } from 'react-native'
import appColors from '../../theme/appColors'
import { windowHeight, windowWidth } from '../../theme/appConstant'

const styles = StyleSheet.create({
  address1: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(2),
    marginTop: windowHeight(0.6),
  },
  alignment: {
    alignItems: 'center',
    paddingVertical: windowHeight(1),
  },
  spaceRight: {
    marginHorizontal: windowWidth(0.5),
  },
  verticalDot: {
    borderLeftWidth: windowHeight(0.1),
    borderColor: appColors.secondaryFont,
    height: windowHeight(3.5),
    marginHorizontal: windowWidth(1.2),
    borderStyle: 'dashed',
  },
  border: {
    borderStyle: 'dashed',
    borderBottomWidth: windowHeight(0.1),
    marginVertical: windowHeight(0.6),
  },
})
export default styles
