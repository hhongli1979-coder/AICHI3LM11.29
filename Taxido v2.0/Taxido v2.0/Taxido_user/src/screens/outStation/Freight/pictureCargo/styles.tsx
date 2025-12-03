import { StyleSheet } from 'react-native';
import { fontSizes, windowHeight, windowWidth } from '@src/themes';
import { external } from '../../../../styles/externalStyle';
import { commonStyles } from '../../../../styles/commonStyle';
import { appColors } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    marginTop: windowHeight(7),
  },
  cargoText: {
    ...commonStyles.mediumTextBlack12,
    ...external.mt_10,
    fontSize: fontSizes.FONT19,
  },
  cargoView: {
    height: windowHeight(80),
    width: '100%',
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(5.8),
    marginTop: windowHeight(5),
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
  },
  dashedBorder: {
    borderStyle: 'dashed',
    borderWidth: windowHeight(1),
    borderRadius: windowHeight(3),
    borderColor: appColors.regularText,
    height: windowHeight(69),
    marginTop: windowHeight(5),
    marginHorizontal: windowHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    ...commonStyles.regularText,
    ...external.mt_3,
  },
  selectedImage: {
    width: windowWidth(440),
    height: windowHeight(80),
    borderRadius: windowHeight(4.9),
    resizeMode: 'cover',
  },
});

export { styles };
