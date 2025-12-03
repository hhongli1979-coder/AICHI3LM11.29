import { StyleSheet } from 'react-native';
import { appColors } from '@src/themes';
import { windowHeight } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.modelBg,
  },
  valueBar: {
    width: '92%',
    paddingVertical: windowHeight(14),
    borderRadius: windowHeight(8),
    paddingHorizontal: windowHeight(14),
  },
});

export { styles };
