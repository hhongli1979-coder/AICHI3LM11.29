import {StyleSheet} from 'react-native';
import { appColors } from '@src/themes'; 
import {external} from '../../../styles/externalStyle';
import {windowHeight} from '@src/themes';

const style = StyleSheet.create({
  container: {
    ...external.fd_row,
    ...external.ai_center,
    backgroundColor: appColors.whiteColor,
    paddingHorizontal: windowHeight(15),
    borderRadius: windowHeight(5.8),
    marginTop: windowHeight(9),
    marginRight: windowHeight(14),
    borderWidth: windowHeight(1),
    borderColor: appColors.primaryGray,
    paddingVertical: windowHeight(6.5),
    elevation: 1,
  },
});

export {style};
