import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'

const styles = StyleSheet.create({
  main: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: windowWidth(3),
    marginVertical: windowHeight(1.6),
    flexDirection: 'row',
  },
  container: {
    alignItems: 'center',
  },
  icon: {
    height: windowHeight(5.2),
    width: windowWidth(11),
    borderRadius: windowHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginHorizontal: windowWidth(3),
    height: windowHeight(2.5),
    width: windowWidth(30),
    marginVertical: windowHeight(2),
    top: windowHeight(4),
  },
  switch: {
    height: windowHeight(2.5),
    marginHorizontal: windowWidth(29),

    width: windowWidth(10),
  },
})
export default styles
