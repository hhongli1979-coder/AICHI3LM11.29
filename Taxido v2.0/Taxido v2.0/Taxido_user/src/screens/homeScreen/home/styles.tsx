import { StyleSheet } from 'react-native';
import { appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { appColors } from '@src/themes';
import { external } from '../../../styles/externalStyle';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.primary,
    paddingTop: windowHeight(15),
  },
  containerStyle: {
    backgroundColor: appColors.lightGray,
    ...external.Pb_30,
  },
  modelView: {
    alignSelf: "center",
    width: windowWidth(260)
  },
  swipeView: {
    position: "absolute",
    bottom: windowHeight(5),
    zIndex: 0,
    height: windowHeight(55),
    width: "100%",
    backgroundColor: 'transparent',
    paddingHorizontal: windowHeight(5)
  },
  swipeContainer: {
    borderRadius: windowHeight(4),
    marginHorizontal: windowWidth(18),
    backgroundColor: appColors.primary,
    marginVertical: windowHeight(5.9)
  },
  activeRideGo: {
    width: windowHeight(55),
    height: windowHeight(55)
  },
  titleStyle: {
    fontFamily: appFonts.medium,
  },
  title: {
    color: appColors.go,
    fontSize: fontSizes.FONT70,
    fontFamily: appFonts.bold,
  },
  homeBottom: {
    marginTop: windowHeight(30),
    marginBottom: windowHeight(30),
    marginHorizontal: windowWidth(18)
  },
  madeBy: {
    fontFamily: appFonts.medium,
  },
  madeByContainer: {
    marginVertical: windowHeight(10),
    flexDirection: 'row',
  },
  todayOfferContainer: {
    paddingHorizontal: windowHeight(3),
  },
  image: {
    height: windowHeight(300),
    width: windowWidth(400),
    alignSelf: 'center',
    marginTop: windowHeight(50),
  },
  titles: {
    fontSize: fontSizes.FONT22,
    fontFamily: appFonts.medium,
    alignSelf: 'center',
  },


  base: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    position: "absolute",
  },
  boxContent: {
    alignItems: "center",
  },
  name: {
    fontSize: 15,
  },
  number: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 2,
  },
  bubbleNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
});

export default styles;
