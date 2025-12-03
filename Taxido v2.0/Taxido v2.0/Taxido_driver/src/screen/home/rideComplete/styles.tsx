import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import { windowHeight, windowWidth } from '../../../theme/appConstant'

const styles = StyleSheet.create({
  mapSection: {
    flex: 0.85,
    backgroundColor: appColors.primaryLight,
  },
  extraSection: {
    flex: 0.1,
  },
  greenSection: {
    bottom: windowHeight(2),
    width: '100%',
    height: windowHeight(22),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  additionalSection: {
    marginVertical: windowHeight(2),
    alignItems: 'center',
    height: windowHeight(15.5),
    marginHorizontal: windowWidth(4),
    borderRadius: 5,
    borderWidth: windowHeight(0.1),
  },
  backButton: {
    position: 'absolute',
    marginHorizontal: windowWidth(3),
    top: windowHeight(0.5),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  hourly_package_view: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourly_package_main_view: {
    width: 1,
    height: '50%',
    backgroundColor: appColors.categoryTitle,
    marginVertical: 13,
  },
  usedTextView: {
    justifyContent: 'space-evenly',
    borderRadius: 9,
    height: 50,
    width: '45%',
    marginHorizontal: 8,
  },
  totalView: {
    width: 1,
    height: '50%',
    backgroundColor: appColors.categoryTitle,
    marginVertical: 13,
  },
  vehicle_map_icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  loading: {
    width: 100,
    height: 100,
  },
  rideDataMainView: {
    justifyContent: 'space-evenly',
    height: 50,
    width: '100%',
    position: 'absolute',
    top: 60,
  },
  rideDataView: {
    justifyContent: 'space-around',
    borderRadius: 9,
    height: 50,
    width: '45%',
    marginHorizontal: 8,
  },
  bottomSheetlayer: {
    flex: 1,
    height: windowHeight(80),
    marginTop: windowHeight(2)
  },
  fab: {
    position: 'absolute',
    right: windowWidth(2),
    bottom: '34%',
    borderRadius: windowHeight(10),
    zIndex: 10,
  },
  fabMini: {
    position: 'absolute',
    right: windowWidth(2),
    backgroundColor: 'white',
    borderRadius: windowHeight(10),
    zIndex: 11,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width:'92%',
    alignSelf:'center'
  },
  halfButton: {
    width:windowWidth(48)
  },
})
export default styles
