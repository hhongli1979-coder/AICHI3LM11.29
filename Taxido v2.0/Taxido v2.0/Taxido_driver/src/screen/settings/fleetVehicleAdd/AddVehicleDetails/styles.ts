import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import {
  windowHeight,
  windowWidth,
} from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'

const styles = StyleSheet.create({
  space: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(0.8),
  },
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
  accNumber: {
    marginHorizontal: windowWidth(4),
  },
  btnContainer: {
    marginVertical: windowHeight(2),
  },
  title: {
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(1)
  }
})
export default styles
