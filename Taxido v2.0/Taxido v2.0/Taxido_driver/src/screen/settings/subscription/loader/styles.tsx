import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../theme/appConstant'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight(-5),
  },
  item: {
    borderRadius: windowWidth(5),
    padding: windowHeight(3),
    marginHorizontal: windowWidth(1.5),
    height: windowHeight(58),
    backgroundColor: 'red',
    width: windowWidth(80),
    alignSelf: 'center',
  },
  mainRound: {
    height: windowHeight(14),
    width: windowHeight(14),
    borderRadius: windowHeight(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerAlign: {
    alignItems: 'center',
  },
  itemText: {
    marginTop: windowHeight(3),
    height: windowHeight(3),
    width: windowWidth(30),
  },
})
export default styles
