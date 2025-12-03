import { StyleSheet } from 'react-native'
import { fontSizes, windowHeight, windowWidth } from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  subView: {
    height: '100%',
  },
  backButtonMain: {
    height: windowHeight(4.7),
    width: windowWidth(10),
    marginVertical: windowHeight(1.5),
    marginHorizontal: windowHeight(-0.5),
    borderRadius: windowHeight(0.9),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: windowHeight(0.1),
  },
  inputfildView: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(0.8),
  },
  buttonView1: {
    bottom: windowHeight(1.3),
  },
  accNumber: {
    bottom: windowHeight(0.8)
  },
  code: {
    bottom: windowHeight(1.5)
  },
  bank: {
    bottom: windowHeight(2.3)
  },
  swiftCode: {
    bottom: windowHeight(3.2)
  },
  payPal: {
    bottom: windowHeight(3.9)
  },
  header: {
    alignItems: 'center',
    height: windowHeight(9.5),
    paddingHorizontal: windowWidth(3),
  },
  activeRide: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.FONT5,
    fontFamily: appFonts.medium,
    position: 'absolute',
  },
  headerTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '78%',
  },
})

export default styles
