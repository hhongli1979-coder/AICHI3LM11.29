import { StyleSheet } from 'react-native';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { commonStyles } from '@src/styles/commonStyle';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: windowHeight(80),
    backgroundColor: appColors.lightGray,
    alignItems: 'center',
  },
  imgContainer: {
    width: windowWidth(80),
    height: windowHeight(45),
    resizeMode: 'contain',
  },
  vehicleContainer: {

    height: windowHeight(60),
    width: windowHeight(60),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(4),
    marginTop: windowHeight(8),
  },
  vehicleContainer1: {
    backgroundColor: appColors.whiteColor,
    height: windowHeight(60),
    width: windowHeight(60),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(15),
  },

  imgContainer1: {
    width: windowWidth(80),
    height: windowHeight(50),
    resizeMode: 'contain',
    borderRadius: windowHeight(4),
  },
  platNumberView: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: windowHeight(2),
  },

  rating: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    marginStart: windowWidth(2),
  },
  vehicleText: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT21,
    flex: 1,
  },
  vehicle_info: {
    marginHorizontal: windowHeight(5),
    fontFamily: appFonts.medium,
  },
  vehicleView: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginHorizontal: windowWidth(5),
  },
  iconTitle: {
    color: appColors.regularText,
    marginLeft: windowWidth(9),
    fontFamily: appFonts.regular,
  },
  tagContainer: {
    flexWrap: "wrap",
    marginVertical: windowHeight(10),
    marginHorizontal: windowHeight(8),
  },
  billSummary: {
    ...commonStyles.extraBold,
    color: appColors.primaryText,
    marginTop: windowHeight(4.5),
    marginHorizontal: windowWidth(18),
  },
  title: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
  },
  descContainer: {
    justifyContent: "space-between",
    marginHorizontal: windowWidth(15),
  },
  engineInfo: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    width: windowWidth(330),
  },
  rentPrice: {
    color: appColors.price,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
    right: windowWidth(5),
  },
  perDay: {
    color: appColors.regularText,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT16,
  },
  titleContainer: {
    justifyContent: "space-between",
    padding: windowWidth(4),
    marginVertical: windowHeight(5),
  },
  carBrand: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
  },
  direction: {
    alignItems: 'center',
    width: '90%',
  },
  starIcon: {
    marginHorizontal: windowWidth(5),
  },
  iconView: {
    padding: windowWidth(10),
    borderRadius: windowWidth(7),
    alignItems: "center",
    marginBottom: windowHeight(8.5),
    marginHorizontal: windowWidth(7),
  },
});

export { styles };
