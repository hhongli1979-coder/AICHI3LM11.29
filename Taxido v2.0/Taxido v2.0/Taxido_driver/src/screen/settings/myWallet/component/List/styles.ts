import { Platform, StyleSheet } from 'react-native'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import {
  fontSizes,
  windowHeight,
  windowWidth,
} from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  dataView: {
    maxHeight: windowHeight(52),
    marginHorizontal: windowWidth(4),
    borderRadius: 8,
    marginTop: windowHeight(2.5),
    overflow: 'hidden',
    borderWidth: windowHeight(0.1),
  },
  list: {
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(4),
    marginVertical: windowHeight(2),
  },
  receiptView: {
    height: windowHeight(5),
    width: windowWidth(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  detailView: {
    marginHorizontal: windowWidth(3),
    justifyContent: 'center',
  },
  description: {
    color: appColors.secondaryFont,
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.regular,
  },
  id: {
    fontSize: fontSizes.FONT3,
    fontFamily: appFonts.medium,
    width: windowWidth(40),
  },
  amountView: {
    marginVertical: windowHeight(1),
    width: windowWidth(30),
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  amount: {
    fontSize: fontSizes.FONT3HALF,
    fontFamily: appFonts.medium,
  },
  icons: {
    marginVertical: windowHeight(0.5),
    marginHorizontal: windowWidth(0.5),
  },
  dash: {
    borderBottomWidth: 1,
    borderStyle: Platform.OS === 'ios' ? 'solid' : 'dashed',
    marginHorizontal: windowWidth(4),
  },
})
export default styles
