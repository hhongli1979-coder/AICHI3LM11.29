import { StyleSheet } from 'react-native';
import { external } from '../../../styles/externalStyle';
import { commonStyles } from '../../../styles/commonStyle';
import { appColors } from '@src/themes';
import { windowHeight } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    width: windowHeight(30),
    height: windowHeight(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(30),
    marginVertical: windowHeight(4.5),
  },
  titleStyle: {
    ...commonStyles.regularText,
    ...external.ph_10,
    color: appColors.primaryText,
    width: windowHeight(220),
  },
  viewContainer: {
    backgroundColor: appColors.whiteColor,
    height: windowHeight(60),
  },
});

export { styles };
