import { Platform, StyleSheet } from 'react-native';
import { appColors, windowHeight, windowWidth } from '@src/themes';
import { commonStyles } from '../../../../../../styles/commonStyle';

const styles = StyleSheet.create({
  container: {
    height: 0.1,
    width: '90%',
    borderBottomWidth: windowHeight(1),
    borderColor: appColors.primaryGray,
    borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed',
    marginVertical: windowHeight(5),
    alignSelf: 'center',
    marginTop: windowHeight(13),
    marginBottom: windowHeight(9),
  },
  viewHeder: {
    paddingHorizontal: windowWidth(18),
  },
  billSummary: {
    ...commonStyles.extraBold,
    color: appColors.primaryText,
    marginTop: windowHeight(10),
  },
  detailContainerText: {
    paddingHorizontal: windowWidth(18),
    marginBottom: windowHeight(16),
  },
});

export { styles };
