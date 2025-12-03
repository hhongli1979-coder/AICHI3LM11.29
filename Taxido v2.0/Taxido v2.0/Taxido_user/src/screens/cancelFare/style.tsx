import { StyleSheet } from 'react-native';
import { commonStyles } from '../../styles/commonStyle';
import { windowHeight, windowWidth } from '@src/themes';
import { external } from '../../styles/externalStyle';

const styles = StyleSheet.create({
  container: {
    marginVertical: windowHeight(8),
    borderRadius: windowHeight(15),
    overflow: 'hidden',
    paddingBottom: windowHeight(9),
  },
  img: {
    width: windowHeight(35),
    height: windowHeight(35),
    borderRadius: windowHeight(26),
  },
    img1: {
    width: windowHeight(35),
    height: windowHeight(35),
    borderRadius: windowHeight(26),
    alignItems:'center',
    justifyContent:'center'
  },
  titleText: {
    ...commonStyles.mediumTextBlack12,
    ...external.mh_5,
  },
  totalRating: {
    ...commonStyles.regularText,
    marginHorizontal: windowWidth(3),
  },
  headerContainer: {
    height: windowHeight(60),
    justifyContent: 'center',
  },
  rating: {
    marginVertical: windowHeight(3),
    marginHorizontal: windowWidth(5),
  },
  row: {
    flexDirection: "row"
  },
  modelView: {
    alignSelf: 'center',
    width: windowWidth(260),
  },
});

export { styles };
