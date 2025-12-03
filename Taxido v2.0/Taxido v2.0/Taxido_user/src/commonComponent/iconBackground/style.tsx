import { StyleSheet } from 'react-native';
import { windowHeight, windowWidth } from '@src/themes';
import { external } from '../../styles/externalStyle';
import { appColors } from '@src/themes';
import { commonStyles } from '../../styles/commonStyle';

const styles = StyleSheet.create({
  container: {
    width: windowWidth(52),
    height: windowHeight(35),
    ...external.ai_center,
    ...external.js_center,
    borderRadius: windowHeight(5.9),
    backgroundColor: appColors.iconBg,
    borderColor: appColors.whiteColor,
    ...commonStyles.shadowContainer,
    elevation: 0.9,
    borderWidth: windowHeight(0.45),
  },
});

export default styles;
