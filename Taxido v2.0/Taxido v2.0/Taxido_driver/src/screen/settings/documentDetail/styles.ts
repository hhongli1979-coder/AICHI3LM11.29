import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'
import { windowHeight } from '../chat/context'

const documentstyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  uri: {
    width: '101%',
    height: 100,
    borderRadius: windowHeight(5),
  },
  downloadMainView: {
    borderRadius: 10,
    backgroundColor: appColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: appColors.border,
    padding: 10,
  },
  imageText: {
    color: 'gray',
    fontFamily: appFonts.medium,
    marginBottom: windowHeight(5),
  },
  downloadView: {
    borderWidth: 1.5,
    width: '100%',
    height: 100,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderStyle: 'dashed',
    borderColor: appColors.border,
  },
  fieldrequired: {
    color: appColors.red,
    marginTop: 5,
  },
  docName: {
    fontFamily: appFonts.regular,
    marginBottom: windowHeight(5),
  },
})
export default documentstyles
