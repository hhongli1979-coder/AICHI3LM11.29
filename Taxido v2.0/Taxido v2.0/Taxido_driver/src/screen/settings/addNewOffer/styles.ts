import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'
import { windowHeight, windowWidth } from '../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    flex: 1,
    height: '100%',
  },
  container: {
    height: windowHeight(72),
    marginHorizontal: windowWidth(4),
    borderRadius: windowHeight(0.9),
    marginVertical: windowHeight(2),
    paddingVertical: windowHeight(1),
  },
  inputFild: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(1),
  },
  title: {
    marginHorizontal: windowWidth(4),
    paddingTop: windowHeight(2),
    fontFamily: appFonts.medium,
  },
  dropdownView: {
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(4),
    bottom: windowHeight(0.7),
  },
  inputView: {
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(0.9),
    marginVertical: windowHeight(0.7),
  },
  input: {
    width: windowWidth(52.5),
    color: appColors.black,
  },
  dashLine: {
    borderBottomWidth: windowHeight(0.1),
    borderColor: appColors.border,
    borderStyle: 'dashed',
    marginVertical: windowHeight(1),
  },
  statusView: {
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(3),
    marginTop: windowHeight(0.7),
  },
  titleStatus: {
    fontFamily: appFonts.medium,
  },
  discription: {
    color: appColors.secondaryFont,
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(1),
    fontFamily: appFonts.regular,
  },
  datePickerStyle: {
    marginHorizontal: windowWidth(4),
    bottom: windowHeight(1.5),
  },
  datePickerStyle1: { bottom: windowHeight(1.5) },
  dropDownStyle: { width: windowWidth(27.3) },
  selectDropDownStyle: { marginTop: windowHeight(2) },
  selectVehicleStyle: { bottom: windowHeight(6) },
})
export default styles
