import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import {
  fontSizes,
  windowHeight,
  windowWidth,
} from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(1.5),
  },
  fieldTitle: {
    fontFamily: appFonts.medium,
    marginTop: windowHeight(0.5),
    marginBottom: windowHeight(1),
  },
  fieldTitle1: {
    fontFamily: appFonts.medium,
    marginTop: windowHeight(1.8),
    marginBottom: windowHeight(1),
  },
  fieldTitle2: {
    fontFamily: appFonts.medium,
    marginTop: windowHeight(1.9),
    marginBottom: windowHeight(1),
  },
  fieldTitle3: {
    fontFamily: appFonts.medium,
    marginTop: windowHeight(2),
    marginBottom: windowHeight(1),
  },
  descriptionField: {
    textAlignVertical: 'top',
    borderWidth: windowHeight(0.1),
    padding: windowHeight(1.5),
    borderRadius: windowHeight(1),
    height: windowHeight(15),
  },
  dropDownContainer: {
    borderColor: appColors.border,
    color: appColors.secondaryFont,
  },
  text: {
    fontFamily: appFonts.regular,
  },
  placeholderStyle: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
  },
  imgContainer: {
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: windowHeight(2),
  },
  imgView: {
    width: windowHeight(12),
    height: windowHeight(12),
    right: windowHeight(2),
  },
  closeIcon: {
    position: 'absolute',
    zIndex: 2,
    right: windowHeight(0),
    backgroundColor: appColors.modelBg,
    borderTopRightRadius: windowHeight(1),
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: windowHeight(1),
    resizeMode: 'cover',
  },
  docSelection: {
    borderWidth: windowHeight(0.1),
    height: windowHeight(20),
    padding: windowHeight(2),
    borderRadius: windowHeight(1),
  },
  docContainer: {
    borderWidth: windowHeight(0.1),
    borderColor: appColors.secondaryFont,
    borderStyle: 'dashed',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
  submitBtn: {
    backgroundColor: appColors.primary,
    borderRadius: windowWidth(2),
    marginTop: windowHeight(7.4),
    marginBottom: windowHeight(10),
  },
  placeHolder: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.5),
    textAlign: 'center',
  },
  errorText: {
    color: appColors.red,
    bottom: windowHeight(0.8),
    fontSize: fontSizes.FONT3,

  },
  filesError: { top: windowHeight(2) },

})

export default styles
