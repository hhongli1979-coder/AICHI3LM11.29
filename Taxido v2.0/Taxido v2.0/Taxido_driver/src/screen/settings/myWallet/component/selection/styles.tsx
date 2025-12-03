import { StyleSheet } from 'react-native'
import appFonts from '../../../../../theme/appFonts'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import appColors from '../../../../../theme/appColors';


const styles = StyleSheet.create({
  selection: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(1.5),
  },
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  tab: {
    paddingVertical: windowHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
    width:'50%'
  },
  leftTab: {
    borderTopLeftRadius: windowHeight(1),
    borderBottomLeftRadius: windowHeight(1),
    borderTopRightRadius: windowHeight(1),
    borderBottomRightRadius: windowHeight(1),
  },
  rightTab: {
    borderTopRightRadius: windowHeight(1),
    borderBottomRightRadius: windowHeight(1),
    borderTopLeftRadius: windowHeight(1),
    borderBottomLeftRadius: windowHeight(1),
  },
  activeTab: {
    backgroundColor: appColors.primary,
  },
  inactiveTab: {
    backgroundColor: appColors.white,

  },
  activeText: {
    color: appColors.white,
    fontFamily: appFonts.medium,
    height: windowHeight(2.35)

  },
  inactiveText: {
    color: appColors.iconColor,
    fontFamily: appFonts.medium,
    height: windowHeight(2.35)
  },
});
export default styles
