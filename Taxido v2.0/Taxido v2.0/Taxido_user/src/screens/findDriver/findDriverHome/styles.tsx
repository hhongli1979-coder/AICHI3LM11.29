import { StyleSheet } from "react-native";
import { windowHeight, appColors, appFonts, fontSizes, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: appColors.whiteColor,
  }, 
  containerHeader:{
    backgroundColor:appColors.primary,
    paddingTop: windowHeight(15),
  },
  mapContainer: {
    flex: 1,
    marginTop: windowHeight(0)
  },
  map: {
    height: '220%',
  },
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
  slider: { 
    top: windowHeight(6),
     marginBottom: windowHeight(45)
     },
  adajanText: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(8),
  },
  mapView: {
     height: windowHeight(100)
     },
  view: { 
    marginTop: '43%'
   },
  searchRide: { 
    textAlign: 'center', 
    color: appColors.gray,
     fontFamily: appFonts.medium 
    },
  createRide: { 
    textAlign: 'center',
     color: appColors.whiteColor,
      fontFamily: appFonts.medium 
    },
  lineContainer: { 
    marginHorizontal: windowHeight(20),
     bottom: windowHeight(1),
      height: windowHeight(12) 
    },
  createRideView: { 
    borderRadius: windowHeight(6),
     height: windowHeight(40),
      width: '47.7%',
       justifyContent: 'center',
        backgroundColor: appColors.primary 
      },
  searchRideView: { 
    borderRadius: windowHeight(6),
     height: windowHeight(40),
      width: '47.7%',
       borderColor: appColors.border, 
       borderWidth: windowHeight(1.5),
        justifyContent: 'center'
       },
  rideView: { 
    flexDirection: 'row',
     marginHorizontal: windowHeight(10),
      justifyContent: 'space-between',
       paddingHorizontal: windowHeight(3) 
      },
  buttonView: { 
    width: '92%', 
    alignSelf: 'center',
     top: windowHeight(8) 
    },
  recent: {
    color: appColors.gray,
    fontFamily: appFonts.regular,
    marginBottom: windowHeight(8),
    marginTop: windowHeight(18)
  },
  locationView: {
     top: windowHeight(0) 
    },
  locationMainView: {
     borderRadius: windowHeight(6),
      paddingVertical: windowHeight(20),
       width: '92%', 
       borderColor: appColors.border,
        borderWidth: windowHeight(1.5),
         alignSelf: 'center'
         },
  addressView: {
    borderBottomWidth: windowHeight(1),
    borderColor: appColors.border,
    marginVertical: windowHeight(7),
    top: windowHeight(0.2)
  },
  addressMainView: {
     marginHorizontal: windowHeight(12)
     },
  selectedText: {
    fontWeight: "bold",
    color: "blue",
  },
  image: {
    height: windowHeight(50),
    width: windowHeight(50),
    resizeMode: 'contain'
  },
  item: {
    paddingHorizontal: windowWidth(20),
    alignItems: "center",
  },
  highlightLine: {
    height: windowHeight(2.1),
    width: windowWidth(95),
    backgroundColor: appColors.primary,
    marginTop: windowHeight(79),
    position: 'absolute',
    zIndex: 1,
    borderRadius: windowHeight(10),
    right:windowWidth(9)
  },
  invisibleLine: {
    height: windowHeight(1.8),
    width: 20,
    backgroundColor: "transparent",
    marginTop: 5,
    position: 'absolute',
    bottom: 0,
    zIndex: 1
  },
  mainLine: {
    height: windowHeight(1.8),
    width: '100%',
    backgroundColor: appColors.sliderLine,
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
  text: {
    fontSize: fontSizes.FONT18,
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    width: windowWidth(100),
    textAlign: 'center',
    height: windowHeight(20),
    marginTop: windowHeight(3)
  },

  bottomLine: {
    height: windowHeight(1.8),
    backgroundColor: appColors.sliderLine,
    bottom: windowHeight(1),
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
  packageMainView: {
    padding: windowHeight(10),
    marginHorizontal: windowHeight(15),
    marginTop: windowHeight(15),
    marginBottom: windowHeight(5),
    borderRadius: windowHeight(5),
    width: '90%',
    alignSelf: "center",
     borderWidth: windowHeight(1)
  },
  searchView: {
    alignItems: "center",
    paddingHorizontal: windowWidth(15),
    borderRadius: windowHeight(5),
    width: "100%",
    height: windowHeight(40),
  },
  itemDivider: {
    height: 1,
    backgroundColor: appColors.loaderPrimary,
    marginVertical: windowHeight(3),
  },

  locationLine: {
    marginVertical: windowHeight(9),
    borderBottomWidth: windowHeight(1),
  },
  centerLocation: {
    alignItems: 'center',
    paddingVertical: windowHeight(5)
  },
})
export default styles;