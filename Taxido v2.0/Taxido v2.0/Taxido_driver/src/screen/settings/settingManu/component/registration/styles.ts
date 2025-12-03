import { StyleSheet } from 'react-native'
import appFonts from '../../../../../theme/appFonts'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  title: {
    fontFamily: appFonts.medium,
    marginTop: windowHeight(1.5),
  },
  loaderTitle: {
    marginTop: windowHeight(0.5),
    height: windowHeight(2.5),
    width: windowWidth(40),
  },
  listView: {
    height: windowHeight(24.5),
    width: '100%',
    marginVertical: windowHeight(1.5),
    borderRadius: windowHeight(1),
    borderWidth: windowHeight(0.1),
  },
  border: {
    borderBottomWidth: windowHeight(0.1),
    marginHorizontal: windowWidth(4),
  },
  loaderBorder: {
     top: windowHeight(1)
     },
})
export default styles
