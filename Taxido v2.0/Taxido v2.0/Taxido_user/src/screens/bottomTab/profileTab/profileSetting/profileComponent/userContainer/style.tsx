import { StyleSheet } from 'react-native';
import { commonStyles } from '../../../../../../styles/commonStyle';
import { appFonts, fontSizes, appColors, windowHeight, windowWidth } from '@src/themes';

export const styles = StyleSheet.create({
  container: {
    borderRadius: windowHeight(5.5),
    marginHorizontal: windowWidth(24),
    paddingVertical: windowHeight(9),
    shadowColor: appColors.blackColor,
    shadowOffset: {
      width: windowHeight(0),
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 0.9,
    marginTop: windowHeight(2),
  },
  userImage: {
    width: windowHeight(53),
    height: windowHeight(53),
    marginHorizontal: windowWidth(15),
    resizeMode: 'cover',
    borderRadius: windowHeight(55),
  },
  userName: {
    ...commonStyles.mediumTextBlack,
  },
  walletContainer: {
    backgroundColor: appColors.primary,
    marginHorizontal: windowWidth(15),
    height: windowHeight(42),
    borderRadius: windowHeight(5.5),
    alignItems: 'center',
    paddingHorizontal: windowWidth(15),
    marginTop: windowHeight(15),
    justifyContent: 'space-between',
    marginBottom: windowHeight(4),
  },
  walletBalance: {
    ...commonStyles.regularText,
    color: appColors.whiteColor,
    fontSize: fontSizes.FONT18,
  },
  char: {
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT25,
  },
  nameTag: {
    alignItems: 'center',
    justifyContent: 'center',
    width: windowHeight(53),
    height: windowHeight(51),
    backgroundColor: appColors.primary,
    borderRadius: windowHeight(74),
    marginHorizontal: windowHeight(10),
  },
  userView: {
    paddingHorizontal: windowHeight(3),
  },
    ratingBox:{
    height:windowHeight(20),
    alignItems:'center',
    borderRadius:windowWidth(55),
    paddingHorizontal:windowWidth(15),
    justifyContent:'space-between'
  }
});
