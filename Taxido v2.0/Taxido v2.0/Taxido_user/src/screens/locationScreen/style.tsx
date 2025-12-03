import { StyleSheet } from 'react-native';
import { external } from '../../styles/externalStyle';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    ...external.js_end,
    ...external.ai_center,
    ...external.fx_1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export { styles };
