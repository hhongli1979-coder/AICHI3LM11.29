import { StyleSheet } from 'react-native';
import { windowHeight, appFonts } from '@src/themes';

const styles = StyleSheet.create({
  buttonView: {
    marginVertical: windowHeight(18),
  },
  inputView: {
    paddingHorizontal: windowHeight(9),
    borderWidth: windowHeight(1),
    borderRadius: windowHeight(5),
    height: windowHeight(40),
  },
  weightText: {
    fontFamily: appFonts.medium,
    marginTop: windowHeight(9),
    marginBottom: windowHeight(4.8),
  },
  parcelText: {
    fontFamily: appFonts.medium,
    marginTop: windowHeight(9),
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default styles;
