import { StyleSheet } from 'react-native';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
  mainInput: { marginHorizontal: windowWidth(19) },
  fieldTitle: {
    color: appColors.primaryText,
    fontFamily: appFonts.regular,
    marginTop: windowHeight(12.5),
    marginBottom: windowHeight(5),
  },
  descriptionField: {
    backgroundColor: appColors.whiteColor,
    textAlignVertical: 'top',
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    padding: windowHeight(9),
    borderRadius: windowHeight(5),
    height: windowHeight(100),
    paddingHorizontal: windowHeight(13),
    marginTop: windowHeight(1.5),
  },
  dropDownContainer: {
    backgroundColor: appColors.whiteColor,
    borderColor: appColors.border,
    marginBottom: windowHeight(5),
    borderRadius: windowHeight(5),
    color: appColors.subtitle,
  },
  imgContainer: {
    flexWrap: 'wrap',
    gap: 10,
  },
  imgView: {
    width: windowHeight(70),
    height: windowHeight(70),
    right: windowHeight(2),
    borderWidth: windowHeight(1),
    borderRadius: windowHeight(5),
  },
  closeIcon: {
    position: 'absolute',
    zIndex: 2,
    right: windowHeight(1),
    backgroundColor: appColors.modelBg,
    borderTopRightRadius: windowHeight(4),
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: windowHeight(8),
    resizeMode: 'cover',
  },
  docSelection: {
    backgroundColor: appColors.whiteColor,
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    height: windowHeight(100),
    padding: windowHeight(8),
    top: windowHeight(3),
    borderRadius: windowHeight(5.5),
  },
  docContainer: {
    borderWidth: windowHeight(1),
    borderColor: appColors.regularText,
    borderStyle: 'dashed',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(4),
  },
  submitBtn: {
    backgroundColor: appColors.primary,
    height: windowHeight(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: windowHeight(5),
    marginTop: windowHeight(50),
    marginBottom: windowHeight(10),
  },
  submitText: {
    color: appColors.whiteColor,
    fontFamily: appFonts.regular,
  },
  errorText: {
    color: appColors.alertRed,
    bottom: windowHeight(0.8),
    fontSize: fontSizes.FONT14SMALL,
  },
});

export default styles;
