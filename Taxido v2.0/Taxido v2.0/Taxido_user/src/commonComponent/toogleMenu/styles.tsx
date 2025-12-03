import { StyleSheet } from 'react-native';
import { appColors, appFonts, fontSizes, windowHeight } from '@src/themes';
import { external } from '../../styles/externalStyle';
import { commonStyles } from '../../styles/commonStyle';

const styles = StyleSheet.create({
  postionContainer: {
    width: '99.5%',
    borderRadius: windowHeight(5),
    paddingHorizontal: windowHeight(10),
    paddingVertical: windowHeight(10),
    marginHorizontal: windowHeight(0.9),
    borderTopWidth: windowHeight(0.9),
    borderColor: appColors.lightGray,
    borderTopRightRadius: windowHeight(0),
    borderTopLeftRadius: windowHeight(0),
    ...commonStyles.shadowContainer,
  },
  container: {
    marginTop: windowHeight(4),
    width: '100%',
    borderRadius: windowHeight(5),
    paddingLeft: windowHeight(10),
    paddingVertical: windowHeight(10),
    marginHorizontal: windowHeight(0.9),
    borderTopWidth: windowHeight(0.9),
    position: 'absolute',
    top: 0,
    zIndex: 9999,
  },
  topContainer: {
    width: '100%',
    height: windowHeight(40),
    marginTop: windowHeight(6),
    borderRadius: windowHeight(5),
    ...external.fd_row,
    ...external.ai_center,
    paddingHorizontal: windowHeight(10),
    borderWidth: windowHeight(1),
  },
  topContainerStyle: {
    width: '100%',
    height: windowHeight(36),
    backgroundColor: appColors.whiteColor,
    marginTop: windowHeight(6),
    borderRadius: windowHeight(5),
    ...external.fd_row,
    ...external.ai_center,
    ...external.js_space,
    paddingHorizontal: windowHeight(10),
    borderTopRightRadius: windowHeight(0),
    borderTopLeftRadius: windowHeight(0),
  },
  icon: {
    marginHorizontal: windowHeight(8),
  },
  title: {
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT19,
    paddingTop: windowHeight(9.7),
  },
  toggleHeight: {
    maxHeight: windowHeight(75),
  },
});
export { styles };
