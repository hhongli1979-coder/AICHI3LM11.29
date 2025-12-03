import { StyleSheet } from 'react-native';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { external } from '../../../../styles/externalStyle';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.whiteColor,
  },
  safeAreaContainer: {
    ...external.fx_1,
    backgroundColor: appColors.whiteColor,
  },
  loadingView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imag: {
    height: windowHeight(240),
    width: windowHeight(240),
  },
  signInText: {
    fontFamily: appFonts.medium,
    color: appColors.primaryText,
    fontSize: fontSizes.FONT24,
  },
  accountText: {
    fontFamily: appFonts.regular,
    color: appColors.regularText,
    textAlign: "center",
    marginHorizontal: windowWidth(25),
    marginTop: windowHeight(10),
  },
  buttonMainView: {
    width: "100%",
    marginTop: windowHeight(10),
  },
  buttonView: {
    marginHorizontal: windowWidth(18),
  },
});

export { styles };
