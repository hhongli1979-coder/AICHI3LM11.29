import {StyleSheet} from 'react-native';
import {windowHeight} from '@src/themes';

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: windowHeight(270),
    borderRadius: windowHeight(8),
  },
});
export {styles};
