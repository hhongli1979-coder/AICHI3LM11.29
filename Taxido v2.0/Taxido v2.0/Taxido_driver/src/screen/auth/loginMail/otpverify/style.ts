import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth, fontSizes, SCREEN_WIDTH } from '../../../../theme/appConstant'
import appColors from '../../../../theme/appColors'

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.graybackground,
  },
  backBtn: {
    borderColor: appColors.border,
    borderWidth: windowHeight(0.1),
    height: windowHeight(5),
    width: windowHeight(5),
    borderRadius: windowHeight(1),
    alignItems: 'center',
    justifyContent: 'center',
    margin: windowHeight(2),
    zIndex: 2,
  },
  img: {
    height: windowHeight(50),
    width: windowHeight(45),
    resizeMode: 'contain',
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
  },
  topContainer: {
    height: '55%',
  },
  bottomContainer: {
    height: '45%',
    borderTopLeftRadius: windowHeight(2),
    borderTopRightRadius: windowHeight(2),
    backgroundColor: appColors.white,
    paddingHorizontal: windowWidth(3),
  },
  sendBtn: {
    position: 'absolute',
    bottom: windowHeight(2),
    width: '100%',
    marginHorizontal: windowWidth(3),
  },
  otpTextInput: {
    backgroundColor: appColors.graybackground,
    borderColor: appColors.graybackground,
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(1.2),
    width: windowWidth(10),
    height: windowHeight(8),
    borderBottomWidth: windowHeight(0.1),
    color: appColors.primaryFont,
    textAlign: 'center',
    fontSize: fontSizes.FONT4HALF,
  },
  otpContainer: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  otpInput: {
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(1.2),
  },
})

export { style }
