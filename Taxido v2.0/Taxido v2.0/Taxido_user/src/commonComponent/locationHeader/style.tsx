import { StyleSheet } from 'react-native';
import { windowHeight } from '@src/themes';
import { commonStyles } from '../../styles/commonStyle';
import { external } from '../../styles/externalStyle';
import { appColors } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    width: windowHeight(30),
    height: windowHeight(30),
    borderColor: appColors.primaryGray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(20),
    ...commonStyles.shadowContainer,
  },
  textContainer: {
    ...external.as_center,
    ...commonStyles.mediumText23,
    textAlign: 'justify',
  },
  viewContainer: {
    ...external.fd_row,
    ...external.ai_center,
    ...external.pt_15,
    ...external.mh_20,
  },
});

export { styles };
