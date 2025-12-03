import { StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import { fontSizes, windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  innerContainer: {
    marginVertical: windowHeight(0.6),
    marginHorizontal: windowWidth(1.5),
    borderWidth: windowHeight(0.15),
    height: windowHeight(14),
    borderStyle: 'dashed',
    borderRadius: windowHeight(0.8),
    alignItems: 'center',
    justifyContent: 'center',
    width: '92.3%',
    alignSelf: 'center',
    top: windowHeight(1)
  },
  innerContainerImage: {
    marginVertical: windowHeight(0.7),
    marginHorizontal: windowWidth(1.5),
    borderWidth: windowHeight(0.1),
    height: windowHeight(14),
    borderRadius: windowHeight(0.5),
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
    width: '92.3%',
    alignSelf: 'center'
  },
  label: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.medium,
    top: windowHeight(0.2),
  },
  download: {
    bottom: windowHeight(0.3)
  },
  dateView: {
    borderColor: appColors.border,
    borderWidth: windowHeight(0.15),
    width: '92.3%',
    alignSelf: 'center',
    height: windowHeight(5.5),
    borderRadius: windowHeight(0.5),
    justifyContent: 'center',
    paddingHorizontal: windowWidth(2),
  },
  label1: {
    marginTop: windowHeight(1.5),
    marginHorizontal: windowHeight(1.5),
    color: appColors.black,
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.medium,
  }
})

export default styles
