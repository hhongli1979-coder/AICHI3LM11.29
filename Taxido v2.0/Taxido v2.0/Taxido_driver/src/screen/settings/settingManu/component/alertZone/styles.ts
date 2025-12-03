import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    height: windowHeight(8),
    width: '100%',
    marginVertical: windowHeight(1.5),
    borderRadius: windowHeight(0.9),
    borderWidth: 1,
    borderColor: appColors.border,
    justifyContent: 'center',
  },
  loaderTitle: {
    marginVertical: windowHeight(1.5),
    height: windowHeight(2.5),
    width: windowWidth(20),
    left: windowHeight(2),
  },
  title: {
    color: appColors.red,
    marginHorizontal: windowWidth(1),
    marginTop: windowHeight(1),
    fontFamily: appFonts.medium,
  },
  border: {
    borderBottomWidth: windowHeight(0.1),
    marginHorizontal: windowWidth(4),
  },
  loaderStyle: {
    bottom: windowHeight(2.5),
  },
  modelButton: {
    justifyContent: 'space-between',
    marginTop: windowHeight(2),
  },
  modelTitle: {
    fontFamily: appFonts.regular,
    width: windowWidth(300),
    textAlign: 'center',
    marginBottom: windowHeight(20),
  },
  modalContent: {
    borderRadius: windowHeight(1),
  },
  alertBorder: {
    borderBottomWidth: windowHeight(0.9),
    marginHorizontal: windowHeight(13),
    marginVertical: windowHeight(10),
  },
  cancelButton: {
    height: windowHeight(5.7),
    width: '47.5%',
    borderRadius: windowHeight(0.7),
  },
})
export default styles
