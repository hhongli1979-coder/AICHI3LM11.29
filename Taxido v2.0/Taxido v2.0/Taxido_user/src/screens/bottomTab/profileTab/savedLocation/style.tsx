import { StyleSheet } from "react-native";
import { commonStyles } from "../../../../styles/commonStyle";
import { external } from "../../../../styles/externalStyle";
import { appColors, appFonts, windowHeight, windowWidth, fontSizes } from "@src/themes";

const styles = StyleSheet.create({
  mainView: {
    marginTop: windowHeight(10),
    marginBottom: windowHeight(60),
  },
  container: {
    ...commonStyles.flexContainer,
  },
  containerList: {
    backgroundColor: appColors.whiteColor,
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    marginBottom: windowHeight(10),
    borderRadius: windowHeight(5.5),
  },
  headerContainer: {
    backgroundColor: appColors.whiteColor,
  },
  listItemContainer: {
    marginTop: windowHeight(4),
    paddingHorizontal: windowWidth(20),
    alignItems: "center",
    paddingVertical: windowHeight(9),
  },
  iconContainer: {
    width: windowHeight(36),
    height: windowHeight(36),
    backgroundColor: appColors.lightGray,
    borderRadius: windowHeight(36),
    alignItems: "center",
    justifyContent: "center",
  },
  detailsContainer: {
    ...external.mh_8,
    width: "44.5%",
  },
  addressContainer: {
    backgroundColor: appColors.whiteColor,
    ...commonStyles.shadowContainer,
    borderRadius: windowHeight(5.5),
    paddingHorizontal: windowWidth(24),
    paddingVertical: windowHeight(11.5),
  },
  dashedLine: {
    height: windowHeight(0.1),
    width: "100%",
    borderWidth: windowHeight(1),
    borderColor: appColors.primaryGray,
    borderStyle: "dashed",
    marginVertical: windowHeight(13),
  },
  pickUpLocationStyles: {
    ...commonStyles.regularText,
    fontWeight: "300",
    fontSize: fontSizes.FONT16,
    color: appColors.primaryText,
  },
  itemStyle: {
    ...commonStyles.regularText,
    fontSize: fontSizes.FONT16,
  },
  headerContainers: {
    height: windowHeight(52),
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: windowWidth(20),
  },
  backButton: {
    height: windowHeight(30),
    width: windowHeight(30),
    borderWidth: windowHeight(1),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(4),
  },
  headerTitle: {
    fontSize: fontSizes.FONT23,
    fontFamily: appFonts.medium,
  },
  noDataContainer: {
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dashLine: {
    borderBottomWidth: windowHeight(0.8),
    borderStyle: "dashed",
    marginHorizontal: windowWidth(40),
    top: windowHeight(4),
  },
  locationContainer: {
    maxHeight: windowHeight(60),
    alignItems: "center",
    paddingHorizontal: windowHeight(5),
    paddingVertical: windowHeight(13),
  },
  modalContainer: {
    alignSelf: "center",
    width: windowWidth(260),
  },
  locationListView: {
    marginTop: windowHeight(10),
  },
  pickLocationView: {
    marginHorizontal: windowWidth(11),
  },
  locationText: {
    width: windowWidth(380),
  },
});

export { styles };
