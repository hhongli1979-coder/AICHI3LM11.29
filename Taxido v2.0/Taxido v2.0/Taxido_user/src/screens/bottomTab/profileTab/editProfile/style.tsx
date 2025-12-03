import { Platform, StyleSheet } from 'react-native';
import { appColors, fontSizes, windowHeight, windowWidth, appFonts } from '@src/themes';
import { external } from '../../../../styles/externalStyle';

export const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  codeText: {
    fontSize: fontSizes.FONT16,
    color: appColors.primaryText,
  },
  container: {
    flex: 1,
    marginBottom: windowHeight(13),
  },
  headerContainer: {
    backgroundColor: appColors.whiteColor,
    height: '15%',
  },
  warningText: {
    color: appColors.alertRed,
    marginTop: windowHeight(5),
    fontSize: fontSizes.FONT14,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginTop: windowHeight(31),
    backgroundColor: appColors.whiteColor,
    height: windowHeight(94),
    width: windowHeight(94),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: windowHeight(50),
  },
  profileImageWrapper: {
    borderRadius: windowHeight(74),
    backgroundColor: appColors.whiteColor,
  },
  profileImage: {
    width: windowHeight(73),
    height: windowHeight(73),
    borderRadius: windowHeight(50),
  },
  editIconContainer: {
    width: windowHeight(26.5),
    height: windowHeight(26.5),
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(24),
    position: 'absolute',
    alignSelf: 'flex-end',
    flexGrow: 1,
    top: '68%',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: appColors.blackColor,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  inputContainer: {
    marginHorizontal: windowHeight(14),
    height: windowHeight(100),
    bottom: windowHeight(7),
    flex: 1,
    marginTop: windowHeight(20),
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: windowHeight(17),
    marginBottom: windowHeight(28),
  },
  containerStyle: {
    ...external.mh_20,
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: windowHeight(0),
    width: '90%',
    paddingBottom: windowHeight(16),
  },
  char: {
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT30,
    backgroundColor: appColors.loaderPrimary,
    width: windowHeight(84),
    height: windowHeight(84),
    borderRadius: windowHeight(74),
    textAlign: 'center',
    paddingVertical: windowHeight(30),
  },
  countryCode: {
    justifyContent: "space-between",
    width: windowWidth(55),
  },
  dialCode: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
  },
  countryCodeContainer: {
    width: windowWidth(100),
    height: windowHeight(39),
    borderRadius: windowHeight(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
  },
  phoneNumberInput: {
    width: windowWidth(326),
    height: windowHeight(39),
    backgroundColor: appColors.lightGray,
    borderRadius: windowHeight(4),
    marginHorizontal: windowHeight(9),
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    flexDirection: 'row',
  },
  iconContainer: {
    height: windowHeight(39),
    width: windowWidth(10),
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: windowHeight(4),
    marginHorizontal: windowWidth(5),
  },
  touchbleView: {
    position: "absolute",
    top: windowHeight(0),
    left: windowHeight(0),
    right: windowHeight(0),
    bottom: windowHeight(0),
  },
  countryMainView: {
    marginTop: windowHeight(15),
  },
});
