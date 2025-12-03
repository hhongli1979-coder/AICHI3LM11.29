import { StyleSheet } from 'react-native';
import { commonStyles } from '../../../../../../styles/commonStyle';
import { external } from '../../../../../../styles/externalStyle';
import { windowHeight } from '@src/themes';

const styles = StyleSheet.create({
  reviewItemContainer: {
    width: '100%',
    marginVertical: windowHeight(8),
    paddingHorizontal: windowHeight(10),
    paddingVertical: windowHeight(10),
    borderRadius: windowHeight(6),
  },
  userInfoContainer: {
    ...external.ai_center,
  },
  userName: {
    ...commonStyles.mediumTextBlack12,
    ...external.mh_5,
    ...external.fg_1,
  },
  userRating: {
    ...commonStyles.regularText,
  },
  userImage: {
    width: windowHeight(18),
    height: windowHeight(18),
  },
  subTitle: {
    ...commonStyles.mediumTextBlack12,
    ...external.mt_10,
  },
  starView:{ marginVertical: windowHeight(2), marginHorizontal: windowHeight(2.9) },
});
export { styles };
