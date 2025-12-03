import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(1.5),
  },
  filledBar: {
    backgroundColor: appColors.primary,
    flex: 1,
    height: windowHeight(0.7),
    borderRadius: windowHeight(1),
    marginHorizontal: windowWidth(0.3),
  },
  emptyBar: {
    flex: 1,
    height: windowHeight(0.7),
    borderRadius: windowHeight(1),
    marginHorizontal: windowWidth(0.3),
  },
})

export default styles
