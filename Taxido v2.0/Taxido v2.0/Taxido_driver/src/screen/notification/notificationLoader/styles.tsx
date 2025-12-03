import { StyleSheet } from 'react-native'
import { windowHeight } from '../../../theme/appConstant'

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: windowHeight(1.5),
    paddingHorizontal: windowHeight(1.6),
    borderRadius: windowHeight(0.9),
    borderWidth: windowHeight(0.1),
    overflow: 'hidden',
    paddingTop: windowHeight(1.9),
    width: '91.3%',
    alignSelf: 'center',
    bottom: windowHeight(1),
    marginTop: windowHeight(2),
  },
  iconContainer: {
    height: windowHeight(3.7),
    width: windowHeight(3.6),
    borderRadius: windowHeight(3),
    alignItems: 'center',
    justifyContent: 'center',
    top: windowHeight(0.1),
  },
  textContainer: {
    flex: 1,
    paddingLeft: windowHeight(1),
  },
  title: {
    height: windowHeight(1.8),
    width: '25%',

    top: windowHeight(0),
  },
  message: {
    height: windowHeight(1.8),
    width: '80%',
    top: windowHeight(0.7),
  },
})

export default styles
