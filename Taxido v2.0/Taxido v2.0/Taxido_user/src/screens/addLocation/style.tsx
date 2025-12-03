import { StyleSheet } from 'react-native';
import { external } from '../../styles/externalStyle';
import { windowHeight } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    ...external.mh_20,
    flex: 1,
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    width: '90%',
    marginBottom: windowHeight(16),
  },
  containerStyle: {
    paddingBottom: '50%',
  },
});

export { styles };
