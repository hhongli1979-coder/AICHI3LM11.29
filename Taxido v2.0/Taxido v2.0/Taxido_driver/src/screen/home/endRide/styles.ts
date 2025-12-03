import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import { windowHeight, fontSizes, windowWidth } from '../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  contain: {
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(2),
  },
  profile: {
    height: windowHeight(9.5),
    width: '100%',
    justifyContent: 'space-between',
  },
  box: {
    height: windowHeight(33.5),
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(1.3),
  },
  dot: {
    color: appColors.primary,
    fontSize: fontSizes.FONT8,
    lineHeight: windowHeight(2.5),
    marginHorizontal: windowWidth(0.8),
  },
  status: {
    color: appColors.primary,
  },
});

export default styles
