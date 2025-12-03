import { StyleSheet } from 'react-native';
import { commonStyles } from '../../../styles/commonStyle';
import { windowHeight } from '@src/themes';
import { appColors } from '@src/themes';
import { external } from '../../../styles/externalStyle';

const styles = StyleSheet.create({
  container: {
    ...commonStyles.shadowContainer,
    backgroundColor: appColors.whiteColor,
    paddingHorizontal: windowHeight(16),
    borderTopRightRadius: windowHeight(16),
    borderTopLeftRadius: windowHeight(16),
    borderBottomLeftRadius: windowHeight(0),
    borderBottomRightRadius: windowHeight(0)
  },
  backgroundImage: {
    width: '100%',
    height: windowHeight(200),
    resizeMode: 'contain',
    marginBottom: windowHeight(-40)
  },
  contentContainer: {
    justifyContent: 'flex-end',
  },
  img: {
    height: windowHeight(28),
    width: windowHeight(90),
    ...external.as_center,
    marginTop: windowHeight(8),
    resizeMode: 'contain',
  },
  imageMainView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageView: {
    justifyContent: "flex-end",
  },
});

export default styles;
