import { StyleSheet } from 'react-native';
import { external } from '../../../../styles/externalStyle';
import { appColors, appFonts, fontSizes, windowHeight } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    ...external.fx_1,
    backgroundColor: appColors.whiteColor,
  },
  signInView: { marginHorizontal: windowHeight(12) },
  signInMainView: {
    position: "absolute",
    bottom: windowHeight(22),
    width: "100%",
  },
  versionCode: {
    color: appColors.iconColor,
    textAlign: 'center',
    marginBottom: windowHeight(1),
    fontSize: fontSizes.FONT16,
    fontFamily: appFonts.regular,
  },
  main: {
    flex: 1,
  },
});

export { styles };
