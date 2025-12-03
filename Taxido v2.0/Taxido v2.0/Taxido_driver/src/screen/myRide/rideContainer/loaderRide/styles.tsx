import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
  container: {
    marginHorizontal: windowHeight(2),
    marginTop: windowHeight(2.3),
  },
  rideInfoContainer: {
    width: '100%',
    borderRadius: 6,
    paddingHorizontal: windowHeight(1.5),
    paddingTop: windowHeight(1.8),
    paddingVertical: windowHeight(1),
    borderWidth: windowHeight(0.1),
    height: windowHeight(37),
  },
  reviews_count1: {
    height: windowHeight(2.2),
    width: windowWidth(50),
  },
  rideInfoContainer1: {
    width: '100%',
    borderRadius: 6,
    paddingHorizontal: windowHeight(1.5),
    paddingTop: windowHeight(1.8),
    paddingVertical: windowHeight(1),
    borderWidth: windowHeight(0.1),
    height: windowHeight(10),
    marginTop: windowHeight(2),
  },
  reviews_count3: {
    height: windowHeight(2.5),
    width: windowWidth(72),
  },
  loaderApp: {
    position: 'absolute',
    top: windowHeight(7.9),
    paddingHorizontal: windowHeight(0.3),
  },
})

export default styles
