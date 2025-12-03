import {StyleSheet} from 'react-native';
import {appColors, windowHeight, windowWidth} from '@src/themes';

const styles = StyleSheet.create({
  container: {
    paddingBottom: windowHeight(8),
  },
  swipeContainer: {
    marginHorizontal: windowHeight(9.5),
    height: windowHeight(150),
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: windowHeight(-20),
    alignSelf: 'center',
  },
  paginationDot: {
    width: windowHeight(6),
    height: windowHeight(6),
    borderRadius: windowHeight(8),
    backgroundColor: appColors.go,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: appColors.primary,
    width: windowWidth(36),
    height: windowHeight(6),
  },
});
export default styles;
