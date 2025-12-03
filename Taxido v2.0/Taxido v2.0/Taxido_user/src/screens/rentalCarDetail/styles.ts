import { StyleSheet } from 'react-native';
import { appColors, windowHeight, windowWidth, fontSizes, appFonts } from '@src/themes';

const styles = StyleSheet.create({
  backBtn: {
    height: windowHeight(30),
    width: windowHeight(30),
    borderWidth: windowHeight(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(5),
    position: 'absolute',
    margin: windowHeight(15),
    zIndex: 2,
  },
  subImgContainer: {
    justifyContent: 'center',
    marginTop: windowHeight(-20),
  },
  subImgView: {
    borderWidth: windowHeight(1),
    marginHorizontal: windowWidth(6),
    borderColor: 'transparent',
    borderRadius: windowHeight(5),
    bottom: windowHeight(20),
  },
  selectedSubImg: {
    borderColor: appColors.primary,
  },
  subImg: {
    height: windowHeight(36.5),
    width: windowHeight(38.5),
    borderRadius: windowHeight(3.5),
  },
  mainImg: {
    height: windowHeight(220),
    width: 'auto',
    resizeMode: 'cover',
  },
  container: {
    marginHorizontal: windowWidth(23.3),
  },
  subContainer: {
    borderWidth: windowHeight(1),
    paddingHorizontal: windowWidth(15),
    borderRadius: windowHeight(4),
    paddingBottom: windowHeight(10),
  },
  titleView: {
    justifyContent: 'space-between',
    marginTop: windowHeight(8),
  },
  title: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
  },
  rateContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: windowWidth(52),
  },
  rating: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
  },
  detailContainer: {
    justifyContent: 'space-between',
    marginTop: windowHeight(5),
  },
  detail: {
    color: appColors.regularText,
    fontFamily: appFonts.medium,
    width: windowWidth(310),
  },
  price: {
    color: appColors.price,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
  },
  day: {
    color: appColors.regularText,
    fontSize: fontSizes.FONT18,
  },
  border: {
    borderBottomWidth: windowHeight(0.9),
    borderStyle: 'dashed',
    marginVertical: windowHeight(12),
  },
  driverContainer: {
    justifyContent: 'space-between',
    marginTop: windowHeight(5),
  },
  carDetails: {
    flexWrap: 'wrap',
    marginTop: windowHeight(10),
    borderRadius: windowHeight(4),
  },
  detailIcon: {
    padding: windowWidth(10),
    borderRadius: windowWidth(8),
    alignItems: 'center',
    marginHorizontal: windowHeight(4),
    marginBottom: windowHeight(8),
  },
  detailTitle: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    marginHorizontal: windowHeight(5),
  },
  description: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(3),
    alignItems: 'center',
    top: windowHeight(4),
  },
  gif: {
    resizeMode: 'contain',
    height: windowHeight(110),
    width: windowHeight(110),
    alignSelf: 'center',
    marginTop: windowHeight(2),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modelButtonView: {
    width: '100%',
    paddingHorizontal: windowWidth(3),
    marginBottom: windowHeight(15),
    marginTop: windowHeight(45),
  },
  modelSuccess: {
    fontFamily: appFonts.medium,
    color: '#797D83',
    fontSize: fontSizes.FONT18,
    textAlign: 'center',
    top: windowHeight(31.5),
    marginBottom: windowHeight(5),
    paddingHorizontal: windowWidth(4),
  },
  requestSuccess: {
    fontFamily: appFonts.semiBold,
    fontSize: fontSizes.FONT23,
    textAlign: 'center',
    top: windowHeight(28),
  },
  modelView1: {
    position: 'absolute',
    top: windowHeight(2),
    right: windowWidth(2),
    zIndex: 10,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    top: windowHeight(12),
  },

  shadowContainer: {
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: appColors.whiteColor,
    borderRadius: windowHeight(55),
  },
  timerText: {
    position: 'absolute',
    color: appColors.primary,
    fontSize: fontSizes.FONT28,
    fontFamily: appFonts.bold,
  },
});

export { styles };
