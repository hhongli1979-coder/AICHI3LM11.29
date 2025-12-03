import { StyleSheet } from 'react-native';
import { appColors, windowHeight, windowWidth } from '@src/themes';
import { commonStyles } from '../../../../../styles/commonStyle';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.whiteColor,
    marginHorizontal: windowHeight(16),
    marginTop: windowHeight(16),
    borderRadius: windowHeight(5.8),
    paddingHorizontal: windowWidth(12),
    paddingVertical: windowHeight(7),
  },
  billText: {
    ...commonStyles.extraBold,
    color: appColors.primaryText,
  },
  paragraph: {
    ...commonStyles.regularText,
    color: appColors.primaryText,
  },
});

export { styles };
