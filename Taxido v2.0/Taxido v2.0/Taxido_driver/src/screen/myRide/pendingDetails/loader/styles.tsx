import { StyleSheet } from 'react-native'
import { windowWidth, windowHeight } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: windowHeight(2),
    marginTop: windowHeight(2.3),
  },
  rideInfoContainer: {
    width: '92%',
    borderRadius: 6,
    paddingHorizontal: windowHeight(1.5),
    paddingTop: windowHeight(1.8),
    paddingVertical: windowHeight(1),
    borderWidth: windowHeight(0.1),
    height: windowHeight(30),
    alignSelf: 'center',
    top: windowHeight(2),
  },
  profileInfoContainer: {
    justifyContent: 'space-between',
  },
  profileImage: {
    width: windowWidth(10),
    height: windowWidth(10),
    resizeMode: 'cover',
    borderRadius: windowWidth(12) / 2,
    overflow: 'hidden',
  },
  profileTextContainer: {
    flexGrow: 0.95,
  },
  profileName: {
    height: windowHeight(2),
    width: windowWidth(25),
  },
  carInfoContainer: {
    alignItems: 'center',
    marginTop: windowHeight(0.9),
  },
  reviews_count: {
    height: windowHeight(2),
    width: windowWidth(18),
  },
  rating_count: {
    height: windowHeight(2),
    width: windowWidth(19),
    top: windowHeight(0.2),
  },
  count: {
    height: windowHeight(2),
    width: windowWidth(19),
    top: windowHeight(0.2),
  },
  ratingContainer: {
    justifyContent: 'space-between',
  },
  callContainer: {
    borderRadius: windowWidth(10),
    height: windowHeight(4.5),
    width: windowHeight(4.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptedContainer: {
    width: windowWidth(20),
    justifyContent: 'space-between',
  },
  rating_count1: {
    height: windowHeight(2),
    width: windowWidth(29),
  },
  profileInfoContainer1: {
    justifyContent: 'space-between',
    top: windowHeight(2.3),
  },
  profileName1: {
    height: windowHeight(2),
    width: windowWidth(25),
    marginHorizontal: windowWidth(3),
  },
  reviews_count1: {
    height: windowHeight(2.2),
    width: windowWidth(50),
  },
  reviews_count2: {
    height: 200,
    width: windowWidth(61),
    top: windowHeight(2),
  },
  rideInfoContainer1: {
    width: '92%',
    borderRadius: 6,
    paddingHorizontal: windowHeight(1.5),
    paddingTop: windowHeight(1.8),
    paddingVertical: windowHeight(1),
    borderWidth: windowHeight(0.1),
    height: windowHeight(10),
    marginTop: windowHeight(2),
    alignSelf: 'center',
  },
  reviews_count3: {
    height: windowHeight(2.5),
    width: windowWidth(72),
  },
  reviews_count4: {
    height: windowHeight(2.5),
    width: windowWidth(72),
    top: windowHeight(2),
  },
})

export default styles
