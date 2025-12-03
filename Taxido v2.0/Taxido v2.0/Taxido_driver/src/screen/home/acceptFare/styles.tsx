import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapSection: {
    flex: 0.7,
    backgroundColor: appColors.primaryLight,
  },
  greenSection: {
    position: 'absolute',
    bottom: windowHeight(0),
    width: '100%',
    height: windowHeight(39),
    flexDirection: 'column',
  },
  fab: {
    position: 'absolute',
    right: windowWidth(3),
    bottom: '30%',
    borderRadius: windowHeight(10),
    zIndex: 10,
    marginBottom: windowHeight(22)
  },
  additionalSection: {
    marginVertical: windowHeight(2),
    alignItems: 'center',
    marginHorizontal: windowWidth(4),
    borderRadius: windowHeight(1.6),
    borderWidth: windowHeight(0.1),
    height: windowHeight(16)
  },
  date: {
    height: windowHeight(4),
    alignItems: 'center',
  },
  address: {
    height: windowHeight(4),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timing: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4,
  },
  space: {
    marginHorizontal: windowWidth(1.5),
  },
  backButton: {
    position: 'absolute',
    marginHorizontal: windowWidth(3),
    top: windowHeight(0.5),
  },
  fabMini: {
    position: 'absolute',
    right: windowWidth(3),
    backgroundColor: 'white',
    borderRadius: windowHeight(10),
    zIndex: 11,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: windowHeight(22)
  },
})

export default styles
