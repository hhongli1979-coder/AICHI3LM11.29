import { StyleSheet } from 'react-native'
import { windowHeight, windowWidth } from '../../../../../../theme/appConstant'

const styles = StyleSheet.create({
  dataView: {
    maxHeight: windowHeight(80),
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
    borderRadius: windowHeight(5),
  },
  detailView: {
    marginHorizontal: windowWidth(3),
    justifyContent: 'center',
  },
  description: {
    height: windowHeight(2),
    width: windowWidth(20),
  },
  id: {
    height: windowHeight(2),
    width: windowWidth(20),
  },
  amountView: {
    marginVertical: windowHeight(1),
  },
  amount: {
    height: windowHeight(2),
    width: windowWidth(20),
    top: windowHeight(5),
  },
  icons: {
    marginVertical: windowHeight(0.5),
    marginHorizontal: windowWidth(0.5),
  },
  dash: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginHorizontal: windowWidth(4),
  },
})
export default styles
