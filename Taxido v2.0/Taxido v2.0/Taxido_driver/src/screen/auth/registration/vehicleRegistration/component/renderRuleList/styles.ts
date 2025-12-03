import { StyleSheet } from 'react-native'
import appColors from '../../../../../../theme/appColors'
import { windowHeight } from '../../../../../../theme/appConstant'
import appFonts from '../../../../../../theme/appFonts'

const styles = StyleSheet.create({
  main: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: windowHeight(1),
  },
  title: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.medium,
  },
})

export default styles
