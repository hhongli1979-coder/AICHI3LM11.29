import { StyleSheet } from "react-native";
import { windowHeight, windowWidth } from "@src/themes";
import { external } from "@src/styles/externalStyle";
import { commonStyles } from "@src/styles/commonStyle";

const styles = StyleSheet.create({
  reviews_count1: {
    height: windowHeight(15.2),
    width: windowWidth(280),
  },
  dashedLine: {
    height: 0.1,
    width: "100%",
    borderBottomWidth: windowHeight(0.9),
    borderStyle: "dashed",
    marginVertical: windowHeight(8),
  },
  iconStar: {
    marginHorizontal: windowWidth(3),
    marginVertical: windowHeight(3),
  },
  pickUpLocationStyles: {
    ...commonStyles.regularText,
    fontWeight: "300",
    width: windowHeight(20),
    height: windowHeight(5),
  },
  itemStyle: {
    ...commonStyles.regularText,
    fontWeight: "300",
    width: windowHeight(20),
    height: windowHeight(5),
  },
  reviews_count: {
    height: windowHeight(2),
    width: windowWidth(18),
  },
  rating_count: {
    height: windowHeight(20),
    width: windowWidth(17.5),
  },
  icon: {
    borderStyle: "dotted",
    height: windowHeight(20),
    borderLeftWidth: windowHeight(0.9),
    marginHorizontal: windowHeight(5),
  },
  ratingContainer: {
    marginHorizontal: windowWidth(3),
  },

  container: {
    ...external.mh_20,
  },
  rideInfoContainer: {
    width: "100%",
    borderRadius: windowHeight(5.9),
    paddingHorizontal: windowHeight(12),
    paddingTop: windowHeight(12),
    paddingVertical: windowHeight(9),
    height: windowHeight(200),
  },
  profileInfoContainer: {
    justifyContent: "space-between",
  },
  profileImage: {
    width: windowWidth(51),
    height: windowHeight(35),
    resizeMode: "contain",
    borderRadius: windowHeight(16),
  },
  profileTextContainer: {
    flexGrow: 0.95,
  },
  profileName: {
    height: windowHeight(15),
    width: windowWidth(180),
    position: "absolute",
    top: windowHeight(-25),
    left: windowHeight(43),
  },
  carInfoContainer: {
    alignItems: "center",
    marginTop: windowHeight(3),
  },
  carInfoText: {
    width: windowHeight(20),
    height: windowHeight(5),
  },
  ratingText: {
    ...commonStyles.mediumTextBlack12,
    width: windowHeight(20),
    height: windowHeight(5),
  },
  tripImage: {
    width: windowWidth(50),
    height: windowHeight(25),
    resizeMode: "contain",
  },
  rideInfoContainer1: {
    width: "100%",
    borderRadius: windowHeight(2),
    paddingHorizontal: windowHeight(1.5),
    paddingTop: windowHeight(1.8),
    paddingVertical: windowHeight(1),
    height: windowHeight(68),
    marginTop: windowHeight(15),
  },
  reviews_count3: {
    height: windowHeight(2.5),
    width: windowWidth(72),
  },
});

export default styles;
