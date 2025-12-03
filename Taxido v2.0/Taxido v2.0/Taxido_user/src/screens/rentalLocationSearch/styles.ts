import { StyleSheet } from 'react-native';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: windowHeight(1),
    paddingHorizontal: windowWidth(20),
    paddingTop: windowHeight(5),
    justifyContent: 'flex-end',
    borderRadius: windowWidth(8),
    borderColor: appColors.border,
  },
  scrollContainer: {
    position: 'relative',
  },
  inputContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: windowWidth(30),
    height: windowHeight(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberContainer: {
    width: windowWidth(27),
    height: windowHeight(19),
    borderRadius: windowWidth(20),
    backgroundColor: appColors.blackColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: appColors.whiteColor,
    textAlign: 'center',
    fontSize: fontSizes.FONT16,
  },
  inputWithIcons: {
    flex: 1,
    position: 'relative',
  },
  input: {
    height: windowHeight(36),
    borderColor: appColors.border,
    flex: 1,
    paddingTop: windowHeight(7),
    fontFamily: appFonts.medium,
    marginHorizontal: windowWidth(10),
  },
  iconSpacing: {
    borderLeftWidth: windowHeight(0.9),
    borderColor: appColors.border,
    height: windowHeight(22),
    marginHorizontal: windowWidth(8),
  },
  addButton: {
    position: 'absolute',
    right: 10,
    top: '40%',
    transform: [{ translateY: -10 }],
  },
  line: {
    position: 'absolute',
    left: 12,
    top: '50%',
    width: 1,
    height: '100%',
    zIndex: -1,
    borderRightWidth: windowHeight(0.9),
    borderStyle: 'dashed',
  },
  line2: {
    position: 'absolute',
    left: 12,
    top: 20,
    width: 1,
    height: 42,
    zIndex: -1,
    borderRightWidth: windowHeight(0.9),
    borderStyle: 'dashed',
  },
});

export { styles };
