import { StyleSheet } from 'react-native';
import { commonStyles } from '../../../../styles/commonStyle';
import { external } from '../../../../styles/externalStyle';
import { windowHeight, windowWidth, appColors } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flexContainer,
    ...external.mb_15,
  },
  headerContainer: {
    backgroundColor: appColors.whiteColor,
    height: '15%',
  },
  listItemContainer: {
    backgroundColor: appColors.whiteColor,
    ...commonStyles.shadowContainer,
    borderRadius: windowHeight(6),
    marginTop: windowHeight(12),
    paddingHorizontal: windowWidth(12),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: windowHeight(9),
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    ...external.mh_8,
    width: '62%',
  },
  findingView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: windowHeight(4.5),
  },
  img: {
    width: windowWidth(70),
    height: windowHeight(16),
  },
  addressContainer: {
    ...commonStyles.shadowContainer,
    borderRadius: windowHeight(6),
    overflow: 'hidden',
    position: 'relative',
  },
});

export { styles };
