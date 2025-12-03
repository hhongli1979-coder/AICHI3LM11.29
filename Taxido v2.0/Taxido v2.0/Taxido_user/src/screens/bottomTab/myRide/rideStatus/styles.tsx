import { StyleSheet } from 'react-native';
import { appColors, windowWidth } from '@src/themes';
import { windowHeight } from '@src/themes';

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: appColors.whiteColor,
    marginVertical: windowHeight(10),
    marginHorizontal: windowWidth(20),
    borderRadius: windowHeight(5),
    marginBottom: windowHeight(18)
  },
  container: {
    backgroundColor: appColors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(5),
    height: windowHeight(30),
    width: windowWidth(140),
    overflow: 'hidden',
  },
});

export { styles };
