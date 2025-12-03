import { StyleSheet } from 'react-native';
import { commonStyles } from '../../../../../styles/commonStyle';
import { appColors, windowHeight, windowWidth } from '@src/themes';
import { external } from '../../../../../styles/externalStyle';

export const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: windowHeight(420),
    marginVertical: windowHeight(9),
    marginTop: windowHeight(9),
  },
  billSummaryContainer: {
    paddingHorizontal: windowWidth(52),
    marginTop: windowHeight(9),
  },
  billSummaryText: {
    ...commonStyles.extraBold,
    color: appColors.primaryText,
    marginTop: windowHeight(9),
  },
  dashedLine: {
    height: 0.1,
    width: '80%',
    borderWidth: windowHeight(1),
    borderColor: appColors.primaryGray,
    borderStyle: 'dashed',
    marginVertical: windowHeight(5),
    alignSelf: 'center',
    marginTop: windowHeight(13),
    marginBottom: windowHeight(9),
  },
  paymentMethodContainer: {
    paddingHorizontal: windowWidth(52),
    marginBottom: windowHeight(18),
    paddingTop: windowHeight(9),
  },
  paymentMethodText: {
    ...commonStyles.extraBold,
    color: appColors.primaryText,
  },
  container: {
    paddingHorizontal: windowWidth(52),
    ...external.mt_10,
  },
});
