import {StyleSheet} from 'react-native';
import {
  windowHeight,
  appColors,
  appFonts,
  fontSizes,
  windowWidth,
} from '@src/themes';

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  view: {
    backgroundColor: appColors.lightGray,
    paddingHorizontal: windowWidth(14),
    height: '100%',
  },

  scrollView: {
    padding: windowHeight(10),
    borderRadius: windowHeight(5),
    borderWidth: windowHeight(1),
    marginTop: windowHeight(16),
    width: '95.5%',
    alignSelf: 'center',
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: windowHeight(8),
  },
  citiesView: {
    paddingHorizontal: windowWidth(0),
    marginBottom: windowHeight(0),
  },
  iconView: {
    marginBottom: windowHeight(28),
  },
  iconColumn: {
    alignItems: 'center',
    position: 'relative',
  },
  line: {
    position: 'absolute',
    width: windowHeight(0.1),
    height: windowHeight(37),
    borderStyle: 'dashed',
    borderLeftWidth: windowHeight(0.7),
    borderLeftColor: appColors.gray,
    top: windowHeight(16),
  },
  labelColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingVertical: windowHeight(2.6),
    paddingHorizontal: windowHeight(4),
    marginHorizontal: windowHeight(0),
  },
  label: {
    fontWeight: '500',
    color: appColors.blackColor,
    paddingVertical: windowHeight(10),
    width: '85%',
    bottom: windowHeight(9),
    flex: 1,
    marginHorizontal: windowHeight(4),
  },
  linee: {
    borderLeftWidth: 1,
    borderColor: appColors.border,
    height: windowHeight(42),
    borderStyle: 'dashed',
  },
  vieww: {marginTop: windowHeight(5)},
  totalDaysView: {
    marginHorizontal: windowWidth(10),
    marginVertical: windowHeight(10),
  },
  rentalLine: {
    borderLeftWidth: 1,
    borderColor: appColors.border,
    height: windowHeight(50),
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  scheduleView: {
    justifyContent: 'space-between',
    marginVertical: windowHeight(15),
    marginHorizontal: windowWidth(10),
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    borderRadius: windowHeight(5),
    backgroundColor: appColors.whiteColor,
  },
  cancelledView: {marginHorizontal: windowWidth(20)},
  timeText: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
  },
  startDateText: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
  },
  clockSmall: {
    marginTop: windowHeight(5),
  },
  viewRental: {
    flexDirection: 'column',
    padding: windowHeight(12),
  },
  selectorRow: {
    flexDirection: 'row',
    paddingHorizontal: windowWidth(1),
    marginTop: windowHeight(9),
  },
  dropdownWrapper: {
    flexDirection: 'row',
    marginHorizontal: windowWidth(9),
  },
  iconTextRow: {
    alignItems: 'center',
  },
  dropdown: {
    width: '82%',
  },
  dropdownContainer: {
    height: windowHeight(38),
    width: windowWidth(250),
  },
  dropdownContainer1: {
    height: windowHeight(38),
    width: windowWidth(250),
    right: windowWidth(40),
  },
  selectedContainer: {
    borderWidth: windowHeight(1.2),
    borderColor: appColors.primary,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth(6),
    marginTop: windowWidth(6),
  },
  title: {
    color: appColors.gray,
    fontSize: fontSizes.FONT17,
    fontFamily: appFonts.regular,
  },
  infoIcon: {
    width: windowHeight(14),
    height: windowHeight(14),
    borderRadius: 10,
    borderWidth: windowHeight(0.9),
    borderColor: appColors.blackColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: appColors.blackColor,
    fontSize: fontSizes.FONT13,
    fontFamily: appFonts.medium,
  },
  price: {
    color: appColors.primary,
    fontSize: fontSizes.FONT17,
    fontFamily: appFonts.semiBold,
    marginTop: windowHeight(5),
    marginHorizontal: windowWidth(6),
  },
  selectedPrice: {
    color: appColors.primary,
    marginHorizontal: windowWidth(6),
  },
  wrapper: {
    flexDirection: 'row',
    gap: windowHeight(15),
    alignItems: 'flex-start',
    paddingHorizontal: windowWidth(19),
    marginTop: windowHeight(10),
  },
  container: {
    borderWidth: windowHeight(0.9),
    borderColor: appColors.border,
    borderRadius: windowHeight(5),
    padding: windowHeight(6),
    width: '50%',
    boxSizing: 'border-box',
    backgroundColor: appColors.whiteColor,
    height: '110%',
    right: windowWidth(10),
  },
});
export default styles;
