import { StyleSheet } from "react-native";
import { windowHeight, fontSizes, windowWidth } from "../../../theme/appConstant";
import appColors from "../../../theme/appColors";
import appFonts from '../../../theme/appFonts'

const localStyles = StyleSheet.create({
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: windowHeight(0.8),
    padding: windowHeight(1),
    marginTop: windowHeight(2)
  },
  option: {
    paddingVertical: windowHeight(1.4),
    paddingHorizontal: windowWidth(9),
    borderRadius: windowHeight(5),
  },
  selectedOption: {
    backgroundColor: appColors.primary,
  },
  optionText: {
    color: appColors.black,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT3HALF,
  },
  selectedText: {
    color: appColors.white,
  },
  title: {
    color: appColors.black,
    fontFamily: appFonts.medium,
    marginHorizontal: windowHeight(2.5),
    fontSize: fontSizes.FONT4HALF,
    marginTop: windowHeight(2),
    marginBottom: windowHeight(1)
  },
  card: {
    backgroundColor: appColors.white,
    borderRadius: windowHeight(0.8),
    marginHorizontal: windowWidth(4),
    paddingVertical: windowHeight(2),
    position: 'relative',
    overflow: 'hidden',
    marginBottom: windowHeight(2),
    height: windowHeight(33),
    marginTop: windowHeight(0.8),
    width: '89.8%',
    alignSelf: 'center',
    borderColor: appColors.border,
    borderWidth: windowHeight(0.15)
  },
  chartAndLabelsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    height: windowHeight(25) + windowHeight(10),
    paddingRight: windowWidth(2),
    alignItems: 'flex-end',
    paddingBottom: windowHeight(8) + windowHeight(0),
    left: windowHeight(2)
  },
  yAxisLabel: {
    fontSize: fontSizes.FONT3HALF,
    color: appColors.iconColor,
    fontFamily: appFonts.regular,
  },
  svg: {

  },
  xAxisLabelText: {
    fontSize: fontSizes.FONT3HALF,
    color: appColors.iconColor,
    fontFamily: appFonts.regular,
    bottom: windowHeight(8.5)
  },
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: appColors.white,
    borderRadius: windowHeight(0.8),
    paddingHorizontal: windowHeight(1.3),
    paddingVertical: windowHeight(1),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1.5,
    marginLeft: 4.5
  },
  tooltipText: {
    color: appColors.iconColor,
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.medium,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -5,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: appColors.white,
  },
  highestRecordTitle: {
    color: appColors.iconColor,
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(5),
    fontSize: fontSizes.FONT4,
    marginTop: windowHeight(1),
  },
  recordCard: {
    backgroundColor: appColors.white,
    borderWidth: StyleSheet.hairlineWidth,
    width: '90%',
    alignSelf: 'center',
    height: windowHeight(8.4),
    borderRadius: windowHeight(0.7),
    borderColor: appColors.border,
    marginTop: windowHeight(1.5),
    paddingHorizontal: windowWidth(4),
    paddingVertical: windowHeight(1.5),
    justifyContent: 'space-between',
  },
  recordCardLabel: {
    color: appColors.iconColor,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT3HALF,
  },
  recordCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordCardDate: {
    color: appColors.black,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4,
  },
  recordCardAmount: {
    color: appColors.yellow,
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT4,
  },
  nodata: {
    fontFamily: appFonts.medium,
    color: appColors.primaryFont
  }
});

export default localStyles
