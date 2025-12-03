import { StyleSheet } from 'react-native';
import { commonStyles } from '../../../../styles/commonStyle';
import { fontSizes, windowHeight, windowWidth } from '@src/themes';
import { appColors } from '@src/themes'; 

const styles = StyleSheet.create({
  texify: {
    ...commonStyles.mediumText23,
    fontWeight: '700',
    fontSize: fontSizes.FONT25,
    color: appColors.whiteColor,
  },
  logo: {
    width: windowWidth(120),
    height: windowHeight(20),
    resizeMode: 'contain',
    tintColor: appColors.whiteColor
  }
});
export { styles };
