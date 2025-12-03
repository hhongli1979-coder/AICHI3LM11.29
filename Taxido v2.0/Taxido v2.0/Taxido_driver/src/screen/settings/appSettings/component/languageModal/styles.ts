import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import {
  fontSizes,
  windowHeight,
  windowWidth,
} from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: windowHeight(0.15),
    borderBottomColor: appColors.graybackground,
    marginHorizontal: windowWidth(4),
    borderStyle: 'dashed',
  },
  main: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: windowWidth(3),
    marginVertical: windowHeight(1.7),
  },
  container: {
    alignItems: 'center',
  },
  iconView: {
    height: windowHeight(5.3),
    width: windowWidth(11),
    borderRadius: windowHeight(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginHorizontal: windowWidth(3),
    fontFamily: appFonts.regular,
  },

  modalTitle: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT3HALF,
    marginTop: windowHeight(0.5),
    marginHorizontal: windowWidth(3),
  },
  modalAlign: {
    alignItems: 'center',
    marginTop: windowHeight(1.5),
    justifyContent: 'space-between',
    paddingHorizontal: windowHeight(0),
  },
  selection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCountry: {
    height: windowHeight(5.8),
    width: windowWidth(11.6),
    resizeMode: 'contain',
  },
  name: {
    marginHorizontal: windowWidth(3),
  },
  borderBottom: {
    borderBottomWidth: windowHeight(0.1),
    marginVertical: windowHeight(1.3),
    width: '98%',
    top: windowHeight(0.8),
  },
  buttonView: {
    marginVertical: windowHeight(2),
    backgroundColor: appColors.primary,
    paddingVertical: windowHeight(2),
    paddingHorizontal: windowWidth(4),
    borderRadius: windowHeight(0.8),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: windowHeight(0.9)
  },
  buttonTitle: {
    color: appColors.white,
    fontSize: fontSizes.FONT4HALF,
    fontFamily: appFonts.medium,
  },
  symbolView: {
    borderWidth: windowHeight(0.1),
    height: windowHeight(5),
    width: windowHeight(5),
    borderColor: appColors.border,
    borderRadius: windowHeight(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
})
export default styles
