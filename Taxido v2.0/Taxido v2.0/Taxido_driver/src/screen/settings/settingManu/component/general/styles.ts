import { StyleSheet } from 'react-native'
import appFonts from '../../../../../theme/appFonts'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  title: {
    fontFamily: appFonts.medium,
    marginTop: windowHeight(0.5),
  },

  listView: {
    width: '100%',
    marginVertical: windowHeight(1.2),
    borderRadius: windowHeight(1),
    borderWidth: windowHeight(0.1),
  },
  border: {
    borderBottomWidth: windowHeight(0.1),
    marginHorizontal: windowWidth(4),
  },
  loaderStyle: {
    marginBottom: windowHeight(1.3),
    top: windowHeight(1.1),
  },
  loaderBorder: { top: windowHeight(0.5) },
})
export default styles
