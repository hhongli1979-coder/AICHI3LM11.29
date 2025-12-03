import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import { fontSizes, windowHeight, windowWidth } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
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
    flex: 0.1
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
    marginTop: windowHeight(0.3)
  },
  contentContainer: {
    flex: 1,
    paddingTop: windowHeight(1),
    height: windowHeight(30)
  },
})

export default styles
