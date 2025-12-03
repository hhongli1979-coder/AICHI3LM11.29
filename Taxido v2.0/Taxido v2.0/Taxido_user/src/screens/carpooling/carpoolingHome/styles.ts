import { StyleSheet } from "react-native";
import { appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { appColors } from "@src/themes";

export const styles = StyleSheet.create({
  mainView: { flex: 1, backgroundColor: appColors.whiteColor },
  back: { height: windowHeight(35), width: windowHeight(35), borderWidth: windowHeight(1), borderColor: appColors.border, borderRadius: windowHeight(5), alignItems: 'center', justifyContent: 'center' },
  iconContainer: {
    height: windowHeight(35),
    width: windowHeight(35),
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(30),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: windowHeight(9)
  },
  input: {
    flex: 1,
    fontFamily: appFonts.regular,
    color: appColors.gray,
    alignSelf: 'center',
    alignItems: 'center',
  },
  swapButton: {
    position: "absolute",
    right: windowWidth(29),
    top: windowHeight(25),
    backgroundColor: appColors.whiteColor,
    height: windowHeight(35),
    width: windowHeight(35),
    borderRadius: windowHeight(20),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    height: '220%',
  },
  inputBox: {
    backgroundColor: appColors.lightGray,
    height: windowHeight(45),
    borderRadius: windowHeight(6),
    flexDirection: "row",
    alignItems: "center",
    marginVertical: windowHeight(5),
    width: '92.5%',
    alignSelf: 'center',
    bottom: windowHeight(12)
  },
  slider: { top: windowHeight(6), marginBottom: windowHeight(45) },
  adajanText: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(8),
  },
  headerView: { height: windowHeight(60), backgroundColor: appColors.whiteColor, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: windowWidth(20), alignItems: 'center' },
  headerText: { color: appColors.primaryText, fontFamily: appFonts.semiBold, fontSize: fontSizes.FONT22 },
  add: { height: windowHeight(35), width: windowHeight(35), borderWidth: windowHeight(1), borderColor: appColors.border, borderRadius: windowHeight(5), alignItems: 'center', justifyContent: 'center' },
  mapView: { height: windowHeight(100) },
  view: { marginTop: '43%' },
  searchRide: { textAlign: 'center', color: appColors.gray, fontFamily: appFonts.medium },
  createRide: { textAlign: 'center', color: appColors.whiteColor, fontFamily: appFonts.medium },
  lineContainer: { marginHorizontal: windowHeight(20), bottom: windowHeight(1), height: windowHeight(12) },
  createRideView: { borderRadius: windowHeight(6), height: windowHeight(40), width: '47.7%', justifyContent: 'center', backgroundColor: appColors.primary },
  searchRideView: { borderRadius: windowHeight(6), height: windowHeight(40), width: '47.7%', borderColor: appColors.border, borderWidth: windowHeight(1.5), justifyContent: 'center' },
  rideView: { flexDirection: 'row', marginHorizontal: windowHeight(10), justifyContent: 'space-between', paddingHorizontal: windowHeight(3) },
  buttonView: { width: '92%', alignSelf: 'center', top: windowHeight(8) },
  recent: {
    color: appColors.gray,
    fontFamily: appFonts.regular,
    marginBottom: windowHeight(8),
    marginTop: windowHeight(18)
  },
  locationView: { top: windowHeight(0) },
  locationMainView: { borderRadius: windowHeight(6), paddingVertical: windowHeight(20), width: '92%', borderColor: appColors.border, borderWidth: windowHeight(1.5), alignSelf: 'center' },
  textView: { flexDirection: 'row', alignItems: "center", marginTop: windowHeight(3) },
  addressView: {
    borderBottomWidth: windowHeight(1),
    borderColor: appColors.border,
    marginVertical: windowHeight(7),
    top: windowHeight(0.2)
  },
  addressMainView:{ marginHorizontal: windowHeight(12) },
});
