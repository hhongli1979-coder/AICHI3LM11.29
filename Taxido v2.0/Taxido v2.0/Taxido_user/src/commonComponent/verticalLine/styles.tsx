import { StyleSheet } from 'react-native';
import { windowHeight } from '@src/themes';

const styles = StyleSheet.create({
  verticalLine: {
    height: '100%',
    width: windowHeight(0.9),
    marginHorizontal: windowHeight(5),
    borderRadius: windowHeight(3),
    borderBottomEndRadius: windowHeight(8),
  },
});
export { styles };
