import { StyleSheet } from 'react-native';
import { windowHeight } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    marginVertical: windowHeight(16),
    borderRadius: windowHeight(5.5),
    paddingVertical: windowHeight(5),
  },
});

export { styles };
