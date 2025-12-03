import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  container: {
  },
  innerContainer: {
    marginVertical: windowHeight(0.6),
    marginHorizontal: windowWidth(1.5),
    borderWidth: windowHeight(0.1),
    height: windowHeight(11.8),
    borderStyle: 'dashed',
    borderRadius: windowHeight(0.8),
    alignItems: 'center',
    justifyContent: 'center',
    width: '99.3%',
    alignSelf: 'center'
  },
  innerContainerImage: {
    marginVertical: windowHeight(0.7),
    marginHorizontal: windowWidth(1.5),
    borderWidth: windowHeight(0.1),
    height: windowHeight(15),
    borderRadius: windowHeight(0.5),
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
    width: '99.3%',
    alignSelf: 'center'
  },
  label: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.medium,
    top: windowHeight(0.2),
  },
  download: {
    bottom: windowHeight(0.3),
  },
})

export default styles
