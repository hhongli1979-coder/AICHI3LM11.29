import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import {
  windowHeight,
  windowWidth,
  fontSizes,
} from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'

const styles = StyleSheet.create({
  space: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(0.8),
  },
  main: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  sub: {
    minHeight: '100%',
  },
  spaceHorizantal: {
    marginHorizontal: windowWidth(4),
  },
  buttonView: {
    flex: 0.1,
  },
  titleText: {
    color: appColors.red,
    marginTop: windowHeight(0.5),
    fontSize: fontSizes.FONT3,
  },
  dateContainer: {
    marginBottom: windowHeight(3),
  },
  inputBox: {
    borderWidth: windowHeight(0.15),
    borderRadius: windowHeight(0.5),
    padding: windowHeight(1.7),
    borderColor: appColors.border,
    backgroundColor: appColors.white,
    marginTop: windowHeight(0.3),
  },
  contentContainer: {
    flex: 1,
    paddingTop: windowHeight(1),
    height: windowHeight(30),
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(1.5),
  },
  filledBar: {
    backgroundColor: appColors.primary,
    flex: 1,
    height: windowHeight(0.7),
    borderRadius: windowHeight(1),
    marginHorizontal: windowWidth(0.3),
  },
  emptyBar: {
    flex: 1,
    height: windowHeight(0.7),
    borderRadius: windowHeight(1),
    marginHorizontal: windowWidth(0.3),
  },
})
export default styles
