import { StyleSheet } from 'react-native';
import { appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { commonStyles } from '../../../styles/commonStyle';
import { appColors } from '@src/themes';
import { external } from '../../../styles/externalStyle';

const styles = StyleSheet.create({
  container: {
    marginVertical: windowHeight(15),
    marginTop: windowHeight(30),
  },
  topCategoryTitle: {
    textAlign: 'right',
    width: '100%',
    paddingHorizontal: windowWidth(20),
  },
  mainContainer: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: windowHeight(68),
    paddingVertical: windowHeight(9.3),
    marginHorizontal: windowHeight(9),
  },
  itemContainer: {
    width: windowWidth(210),
    borderWidth: windowHeight(1),
    borderColor: appColors.lightGray,
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(5),
    ...commonStyles.shadowContainer,
    height: windowHeight(68),
    marginHorizontal: windowWidth(10),
    marginBottom: windowHeight(15),
  },
  itemText: {
    ...commonStyles.mediumTextBlack12,
    color: appColors.primaryText,
    fontSize: fontSizes.FONT19,
  },
  iconContainer: {
    ...external.fd_row,
    ...external.js_space,
    ...external.mt_10,
    ...external.ai_center,
  },
  carImage: {
    width: windowWidth(90),
    resizeMode: 'contain',
    height: windowHeight(50),
    position: 'absolute',
    bottom: windowHeight(4.8),
  },
  itemSeparator: {
    width: windowWidth(28),
  },
  listContainer: {
    width: "100%",
    alignItems: "center",
    height: windowHeight(75),
  },
  flatListContent: {
    alignItems: "center",
  },
  item: {
    paddingHorizontal: windowWidth(20),
    alignItems: "center",
  },
  highlightLine: {
    height: windowHeight(1.8),
    width: windowWidth(80),
    backgroundColor: appColors.primary,
    marginTop: windowHeight(5),
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    borderRadius: windowHeight(10),
  },
  invisibleLine: {
    height: windowHeight(1.8),
    width: 20,
    backgroundColor: "transparent",
    marginTop: 5,
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  mainLine: {
    height: windowHeight(1.8),
    width: '100%',
    backgroundColor: appColors.sliderLine,
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
  selectedText: {
    fontWeight: "bold",
    color: "blue",
  },
  image: {
    height: windowHeight(50),
    width: windowHeight(50),
    resizeMode: 'contain',
  },
  text: {
    fontSize: fontSizes.FONT18,
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    width: windowWidth(100),
    textAlign: 'center',
  },
  rentalImage: {
    marginHorizontal: windowHeight(15),
    marginBottom: windowHeight(5),
    marginTop: windowHeight(15),
    width: '90%',
    alignSelf: "center",
    resizeMode: 'stretch',
    height: windowHeight(150),
  },
  packageMainView: {
    padding: windowHeight(10),
    marginHorizontal: windowHeight(15),
    marginTop: windowHeight(15),
    borderRadius: windowHeight(6),
    width: '90%',
    alignSelf: "center",
    borderWidth: windowHeight(1),
  },
  searchView: {
    alignItems: "center",
    paddingHorizontal: windowWidth(15),
    borderRadius: windowHeight(5),
    width: "100%",
    height: windowHeight(40),
  },
  whereNext: {
    fontFamily: appFonts.semiBold,
    paddingHorizontal: windowWidth(10),
    fontSize: fontSizes.FONT20,
  },
  homeRecentSearch: {
    color: appColors.gray,
    fontFamily: appFonts.regular,
    marginBottom: windowHeight(8),
    marginTop: windowHeight(12),
  },
  adajanText: {
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(8),
  },
  bottomLocationView: {
    alignItems: "center",
    marginTop: windowHeight(1.5),
  },
  locationLine: {
    marginVertical: windowHeight(3),
  },
  centerLocation: {
    alignItems: 'center',
    backgroundColor: appColors.whiteColor,
    marginHorizontal: windowWidth(25),
    padding: windowHeight(10),
    borderWidth: 1,
    borderColor: appColors.border,
    borderRadius: windowHeight(5),
  },
  emptyContainer: {
    padding: windowHeight(15),
    alignItems: 'center',
  },
  backBtnStyle: {
    height: windowHeight(22),
    width: windowHeight(22),
    position: 'absolute',
    zIndex: 1,
    top: windowHeight(22),
    borderRadius: windowHeight(22),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: appColors.border,
    right: windowWidth(18),
    marginLeft: windowWidth(18),
  },
  backBtnStyle1: {
    height: windowHeight(22),
    width: windowHeight(22),
    position: 'absolute',
    zIndex: 1,
    top: windowHeight(22),
    borderRadius: windowHeight(22),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: appColors.border,
    left: windowWidth(18),
  },
  titleTextDetail: {
    fontSize: fontSizes.FONT18,
    width: windowWidth(362),
    color: appColors.gray,
    fontFamily: appFonts.regular,
    marginHorizontal: windowWidth(10),
  },
  bottomLine: {
    borderBottomWidth: windowHeight(0.9),
  },
  loaderAddress: {
    marginTop: windowHeight(10),
  },
});

export { styles };
