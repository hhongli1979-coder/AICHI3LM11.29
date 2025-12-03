import {StyleSheet} from 'react-native';
import {windowHeight} from '@src/themes';
import { appColors } from '@src/themes'; 

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.whiteColor,
    elevation: 1,
    borderWidth: windowHeight(1),
    borderColor: appColors.primaryGray,
    borderRadius: windowHeight(5.8),
    paddingVertical: windowHeight(10),
  },
});
export {styles};
