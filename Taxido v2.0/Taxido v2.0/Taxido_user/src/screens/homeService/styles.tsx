import { StyleSheet } from 'react-native';
import { appColors, fontSizes, windowHeight, windowWidth, appFonts } from '@src/themes';
import { external } from '@src/styles/externalStyle';

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  listContent: {
    padding: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginBottom: windowHeight(12),
    padding: windowHeight(8),
    backgroundColor: 'white',
    borderRadius: windowHeight(8),
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-between',
    marginHorizontal: windowWidth(20),
    marginTop: windowHeight(7.5),
  },
  categoryImage: {
    width: windowHeight(50),
    height: windowHeight(50),
    marginRight: windowHeight(5.5),
    resizeMode: 'contain',
  },
  categoryName: {
    fontSize: fontSizes.FONT21,
    color: appColors.primary,
    fontFamily: appFonts.medium,
  },
  listView: {
    flex: 1,
    marginTop: windowHeight(13),
  },
  renderView: {
    flexDirection: 'column',
    height: windowHeight(50),
    justifyContent: 'space-around',
  },
  mainLine: {
    height: windowHeight(2.5),
    width: '100%',
    backgroundColor: appColors.sliderLine,
    position: 'absolute',
    bottom: 0,
  },
  listContainer: {
    width: "100%",
    alignItems: "center",
    height: windowHeight(75),
    marginTop: windowHeight(32),
  },
  containerStyle: {
    backgroundColor: appColors.lightGray,
    ...external.Pb_30,
  },
});

export default styles;