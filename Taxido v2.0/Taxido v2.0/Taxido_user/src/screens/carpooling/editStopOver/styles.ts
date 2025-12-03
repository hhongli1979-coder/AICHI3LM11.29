import {StyleSheet} from 'react-native';
import {appFonts, fontSizes, windowHeight, windowWidth} from '@src/themes';
import {appColors} from '@src/themes';

const styles = StyleSheet.create({
  view: {flex: 1},
  container: {
    paddingHorizontal: windowWidth(5),
    paddingTop: 20,
    marginHorizontal: windowWidth(10),
    marginTop: windowHeight(15),
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconColumn: {
    width: 40,
    alignItems: 'center',
    position: 'relative',
  },
  line: {
    position: 'absolute',
    width: 2,
    height: windowHeight(40),
    borderStyle: 'dashed',
    borderLeftWidth: windowHeight(1),
    borderColor: appColors.gray,
    top: windowHeight(18),
  },
  labelColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingVertical: windowHeight(4),
    paddingHorizontal: windowHeight(7),
  },
  label: {
    fontWeight: '500',
    color: appColors.blackColor,
    paddingVertical: windowHeight(10),
    width: '85%',
    right: windowHeight(7),
    bottom: windowHeight(8),
  },
  mapLink: {
    color: appColors.primary,
    fontSize: fontSizes.FONT19,
    marginTop: windowHeight(3),
    textDecorationLine: 'underline',
    marginHorizontal: windowWidth(15),
    fontFamily: appFonts.medium,
  },
  btn: {
    position: 'absolute',
    marginHorizontal: windowWidth(20),
    bottom: windowHeight(14),
    left: 0,
    right: 0,
  },
  border: {
    borderBottomWidth: windowHeight(8),
    borderBottomColor: appColors.border,
  },
  progressBar: {
    backgroundColor: 'white',
    height: windowHeight(18),
  },
  descriptionView: {
    marginHorizontal: windowWidth(20),
  },
  description: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT25,
    color: appColors.primaryText,
    width: '80%',
    top: windowHeight(18),
  },
  stepType: {
    marginBottom: windowHeight(17),
  },
});

export default styles;
