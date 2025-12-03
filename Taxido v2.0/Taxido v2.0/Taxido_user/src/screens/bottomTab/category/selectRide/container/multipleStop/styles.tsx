import { StyleSheet } from 'react-native';
import { appColors ,windowHeight, windowWidth} from '@src/themes'; 
import { external } from '../../../../../../styles/externalStyle';
import { commonStyles } from '../../../../../../styles/commonStyle';


export const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.lightGreen,
    alignSelf: 'center',
    borderRadius: windowHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
    width: '93%',
    marginHorizontal: windowWidth(20),
    marginBottom: windowHeight(4),
    paddingVertical: windowHeight(13),
  },
  text: {
    ...external.ti_center,
    ...commonStyles.mediumTextBlack12,
    ...external.as_center,
    color: appColors.primary,
    fontWeight: '500',
  },
});