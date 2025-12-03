import { StyleSheet } from 'react-native';
import { appColors } from '@src/themes';
import { windowHeight } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.whiteColor,
    marginVertical: windowHeight(14),
    borderRadius: windowHeight(5),
    paddingVertical: windowHeight(5),
  },
});

export { styles };
