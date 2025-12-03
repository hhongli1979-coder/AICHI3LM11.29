import { StyleSheet } from 'react-native';
import { windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
  transformLine: {
    height: windowHeight(10),
    width: windowWidth(100),
    resizeMode: 'cover',
    marginTop: windowHeight(10),
  },
});

export default styles;
