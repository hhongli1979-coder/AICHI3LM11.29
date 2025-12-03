import { StyleSheet } from 'react-native';
import { appColors } from '@src/themes';
import { windowHeight, windowWidth, fontSizes } from '@src/themes';
import appFonts from '@theme/appFonts';

const styles = StyleSheet.create({
  addressView: {
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(6),
    marginVertical: windowHeight(9),
  },
  city: {
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT22,
  },
  addressDetail: {
    marginHorizontal: windowWidth(6),
    justifyContent: 'center',
  },
  changeView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  change: {
    color: appColors.primary,
  },
  paymentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: windowWidth(10),
    width: '100%',
  },
  topView: {
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(12),
    marginTop: windowHeight(13),
    marginBottom: windowHeight(8),
  },
  fareView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  total: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
  },
  amount: {
    color: appColors.primary,
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT20,
  },
  btnRetry: {
    backgroundColor: appColors.primary,
    paddingVertical: windowHeight(10),
    paddingHorizontal: windowWidth(35),
    borderRadius: windowHeight(9.8),
  },
  retry: {
    color: appColors.whiteColor,
    fontFamily: appFonts.regular,
  },
  locationFill: {
    marginVertical: windowHeight(7.5),
  },
  dropOffText: {
    marginHorizontal: windowWidth(10),
  },
});

export default styles;
