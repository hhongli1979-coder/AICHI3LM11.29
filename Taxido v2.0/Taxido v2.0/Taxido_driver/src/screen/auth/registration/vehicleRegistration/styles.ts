import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import { fontSizes, windowHeight, windowWidth } from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  subView: {
    height: '100%',
  },
  text: {
    height: windowHeight(15),
    color: appColors.secondaryFont,
    paddingHorizontal: windowWidth(3),
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
    width: '100%',
  },
  warning1: {
    color: appColors.red,
    marginBottom: windowHeight(0.5),
    marginTop: windowHeight(1),
    fontSize: fontSizes.FONT3
  },
  subContainer: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(0.8),
  },
  ruleTitle: {
    fontSize: fontSizes.FONT4HALF,
    fontFamily: appFonts.medium,
    marginTop: windowHeight(2),
  },
  spaceTop: {
    marginBottom: windowHeight(5),
    top: windowHeight(3),
  },
  dateInput: {
    alignItems: 'center',
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(0.8),
    paddingHorizontal: 10,
    marginBottom: windowHeight(1.2),
    height: windowHeight(6.2),
  },
  title: {
    fontFamily: appFonts.medium,
    color: appColors.primaryFont,
    marginVertical: windowHeight(1.5),
  },
  warning: {
    color: appColors.red,
    marginBottom: windowHeight(1.5),
  },
  dateInputFild: {
    flex: 1,
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
  },
  selectTitle: {
    fontFamily: appFonts.medium,
    marginTop: windowHeight(1.2),
    marginBottom: windowHeight(0.5),
  },
  selectTitle1: {
    fontFamily: appFonts.medium,
    marginBottom: windowHeight(0.8),
  },
  vehicleTitle: {
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(1),
  },
  rentalBg: {
    backgroundColor: appColors.subPrimary,
    padding: windowHeight(2),
    borderRadius: windowHeight(1),
  },
  rentalDesc: {
    textAlign: 'center',
    fontFamily: appFonts.regular,
    color: appColors.primary,
  },
  vehicle: {
    bottom: windowHeight(0.9)
  },
  vehicleName: {
    bottom: windowHeight(2.6)
  },
  vehicleNo: {
    bottom: windowHeight(3.5)
  },
  vehicleColor: {
    bottom: windowHeight(4.3)
  },
  maximumSeats: {
    bottom: windowHeight(5)
  },
  boldText: {
    fontFamily: appFonts.bold
  }
})
export default styles
