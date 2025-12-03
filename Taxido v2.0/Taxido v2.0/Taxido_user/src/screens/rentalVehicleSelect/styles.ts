import { StyleSheet } from "react-native";
import { appColors, appFonts, windowHeight, windowWidth, fontSizes } from "@src/themes";

const styles = StyleSheet.create({
  container: {
    marginHorizontal: windowWidth(0),
    flex:1,
  },
  title: {
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(10),
    marginHorizontal: windowWidth(21),
  },
  flatListContainer: {marginHorizontal:windowHeight(14)},
  border: {
    borderBottomWidth: windowHeight(0.9),
    width: "100%",
  },
  vehicleItem: {
    alignItems: "center",
    marginRight: windowWidth(20),
    borderWidth: windowHeight(1),
    borderRadius: windowHeight(6),
    paddingHorizontal: windowHeight(19.5),
    height:windowHeight(90),
    justifyContent:'center',
  },
  vehicleImage: {
    width: windowHeight(50),
    height: windowHeight(50),
    borderRadius: windowHeight(6),
    resizeMode: "contain",
  },
  vehicleName: {
    fontFamily: appFonts.regular,
    marginTop: windowHeight(5),
  },
  selectedVehicleItem: {
    borderColor: appColors.primary,
  },
  listContainer: {
    borderWidth: windowHeight(1),
    marginHorizontal: windowWidth(18.9),
    borderRadius: windowHeight(5),
    marginTop: windowHeight(3),
    paddingTop:windowHeight(10),
    paddingHorizontal:windowWidth(15)
  },
  titleContainer: {
    justifyContent: "space-between",
    padding: windowWidth(4),
    marginVertical:windowHeight(5),
  },
  carBrand: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
  },
  carImg: {
    height: windowHeight(100),
    width: "100%",
    borderRadius: windowHeight(5),
    marginBottom: windowHeight(1.5),
    resizeMode:"cover"
  },
  descContainer: {
    justifyContent: "space-between",
    marginHorizontal: windowWidth(3),
  },
  engineInfo: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    width: windowWidth(260),
  },
  rentPrice: {
    color: appColors.price,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
  },
  perDay: {
    color: appColors.regularText,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT16,
  },
  dashLine: {
    borderBottomWidth: windowHeight(0.9),
    borderStyle: "dashed",
    marginVertical: windowHeight(8),
    marginHorizontal: windowWidth(3),
  },
  driverTitle: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT21,
  },
  tagContainer: {
    flexWrap: "wrap",
    marginVertical:windowHeight(6)
  },
  iconBox: {
    padding: windowWidth(10),
    borderRadius: windowWidth(7),
    alignItems: "center",
    marginBottom: windowHeight(8.5),
    marginHorizontal: windowWidth(7),
  },
  iconTitle: {
    color: appColors.regularText,
    marginLeft: windowWidth(9),
    fontFamily: appFonts.regular,
  },
  noData:{
    height:windowHeight(300),
    width:windowWidth(300),
    resizeMode:'contain',
  },
  noDateContainer:{
    alignItems:'center',
    justifyContent:'center',
    flex:0.6
  },
  listDateContainer:{
    flex:0.82
  },
  vehicleContainer:{
    flex:0.18,
  },
  titles:{
    color:appColors.primaryText,
    fontFamily:appFonts.medium
  },
  subTitle:{
    color:appColors.regularText,
    fontFamily:appFonts.regular,
    textAlign:'center',
    paddingHorizontal:windowWidth(10),
    marginTop:windowHeight(6)
  },
  direction:{
    justifyContent:'center',
    alignItems:'center'
  },
  starIcon:{
    marginHorizontal:windowWidth(5)
  },
  icon:{
    marginHorizontal:windowWidth(5),
    alignItems:'center',
    justifyContent:'center'
  },
  rating:{
    color:appColors.regularText,
    fontFamily:appFonts.regular
  },
  listStyle:{ paddingBottom: windowHeight(18.6) },
});

export default styles;
