import { StyleSheet } from 'react-native';
import { commonStyles } from '../../../../../../styles/commonStyle';
import { external } from '../../../../../../styles/externalStyle';
import { windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.shadowContainer,
    paddingVertical: windowHeight(9),
    borderRadius: windowHeight(6),
    ...external.fd_row,
    ...external.ai_center,
    paddingHorizontal: windowWidth(6),
    borderWidth: windowHeight(1),
  },
  textContainer: {
    ...commonStyles.mediumTextBlack12,
    ...external.ph_5,
    paddingRight: windowWidth(4.5),
  },
  locationContainer: {
    ...commonStyles.shadowContainer,
    paddingVertical: windowHeight(10),
    borderRadius: windowHeight(6),
    ...external.fd_row,
    ...external.ai_center,
    paddingHorizontal: windowHeight(9),
    borderWidth: windowHeight(1),
  },
  line: {
    marginHorizontal: windowHeight(4),
    left: windowHeight(1.8),
    height: windowHeight(18),
    borderLeftWidth: windowHeight(1.3),
  },
});
export { styles };
