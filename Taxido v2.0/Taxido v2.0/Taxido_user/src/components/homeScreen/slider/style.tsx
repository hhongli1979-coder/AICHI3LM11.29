import { StyleSheet } from 'react-native';
import { commonStyles } from '../../../styles/commonStyle';
import { external } from '../../../styles/externalStyle';
import { windowHeight, windowWidth } from '@src/themes';
import { appColors } from '@src/themes';

const styles = StyleSheet.create({
  textContainer: {
    ...commonStyles.regularText,
    ...external.pt_5,
    color: appColors.regularText,
  },
  img: {
    width: windowWidth(350),
    height: windowHeight(120),
  },
});

export { styles };
