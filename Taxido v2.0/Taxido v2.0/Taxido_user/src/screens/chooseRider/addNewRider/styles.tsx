import { StyleSheet } from 'react-native';
import { appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { appColors } from '@src/themes';
import { commonStyles } from '../../../styles/commonStyle';
import { external } from '../../../styles/externalStyle';

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: windowWidth(4),
    justifyContent: 'space-between',
  },
  codeText: {
    fontSize: fontSizes.FONT16,
    color: appColors.primaryText,
    top: windowHeight(0),
    right: windowWidth(9),
  },
  mainContainer: {
    flex: 1,
    height: '100%',
  },
  viewContainer: {
    position: 'absolute',
    bottom: windowHeight(0),
    width: '90%',
    alignSelf: 'center',
    marginBottom: windowHeight(13),
  },
  textContainer: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT16,
    ...external.ph_20,
    color: appColors.primaryText,
    marginTop: windowHeight(18),
  },
  inputContainer: {
    ...commonStyles.shadowContainer,
    ...external.mh_20,
    ...external.ph_20,
    ...external.pv_15,
    borderRadius: windowHeight(5.8),
    marginTop: windowHeight(15),
  },
  codeContainer: {
    marginTop: windowHeight(2),
  },
  lastName: {
    bottom: windowHeight(16),
  },
  firstName: {
    bottom: windowHeight(13),
  },
  countryCodeContainer: {
    width: windowWidth(100),
    height: windowHeight(42),
    backgroundColor: appColors.lightGray,
    borderRadius: windowHeight(4),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
  },
  inputText: {
    marginHorizontal: windowWidth(5),
    width: '100%',
  },
  phoneNumberInput: {
    width: windowWidth(330),
    borderRadius: windowHeight(4),
    marginHorizontal: windowHeight(9),
    paddingHorizontal: windowHeight(9),
    borderWidth: windowHeight(1),
    height: windowHeight(42),
  },
  iconContainer: {
    height: windowHeight(39),
    width: windowWidth(10),
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: windowHeight(3),
    marginHorizontal: windowWidth(5),
  },
  dialCode: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    left: windowHeight(2),
  },
  countryCode: {
    justifyContent: "space-between",
    width: windowWidth(55),
  },
});

export { styles };
