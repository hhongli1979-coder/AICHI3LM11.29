import { StyleSheet } from 'react-native'
import { fontSizes } from '../../../../../theme/appConstant'
import appColors from '../../../../../theme/appColors'

const styles = StyleSheet.create({
  container: { paddingHorizontal: 15, paddingTop: 5 },
  placeholderStyles: {
    color: appColors.secondaryFont,
    fontSize: fontSizes.FONT4,
  },
})
export default styles
