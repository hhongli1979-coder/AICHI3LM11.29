import { StyleSheet } from 'react-native'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'
import {
  fontSizes,
  windowHeight,
  windowWidth,
} from '../../../theme/appConstant'

const styles = StyleSheet.create({
  fieldContainer: {
    alignItems: 'center',
    marginBottom: windowHeight(1.3),
  },
  bullet: {
    fontSize: fontSizes.FONT5,
    marginRight: windowHeight(0.9),
  },
  input: {
    flex: 1,
    borderBottomWidth: windowHeight(0.1),
    fontSize: fontSizes.FONT4,
    padding: windowHeight(0.5),
    fontFamily: appFonts.regular,
  },
  addButton: {
    backgroundColor: appColors.graybackground,
    padding: windowHeight(0),
    borderRadius: windowHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
    top: windowHeight(0.5),
  },
  removeButton: {
    backgroundColor: appColors.graybackground,
    padding: windowHeight(0.1),
    borderRadius: windowHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    marginVertical: windowHeight(2),
  },
  subContainer: {
    marginHorizontal: windowWidth(4),
  },
  title: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
    marginBottom: windowHeight(1),
  },
  dropContainer: {
    marginBottom: windowHeight(0.5),
  },
  swiperStyle: {
    height: windowHeight(38),
    width: '100%',
  },
  vehiclePlaceholder: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
  },
  vehicleStyle: {
    paddingHorizontal: windowHeight(2),
  },
  vehicleText: {
    fontFamily: appFonts.regular
  },
  vehicleLabel: {
    fontFamily: appFonts.regular
  },
  zonePlaceholder: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    fontSize: fontSizes.FONT4,
  },
  zoneStyle: {
    paddingHorizontal: windowHeight(2)
  },
  vehicleInput: {
    marginTop: windowHeight(0.8)
  },
  vehicleType: {
    bottom: windowHeight(0.8)
  },
  fualType: {
    bottom: windowHeight(1)
  },
  vehicleSpeed: {
    marginTop: windowHeight(1)
  },
  vehicleMileage: {
    bottom: windowHeight(0.5)
  },
  bagCount: {
    bottom: windowHeight(1)
  },
  vehicleStatusContainer: {
    marginTop: windowHeight(2.3)
  },
  descriptionField: {
    textAlignVertical: 'top',
    borderWidth: windowHeight(0.1),
    borderRadius: windowHeight(0.8),
    height: windowHeight(16),
    color: appColors.primaryFont,
    paddingHorizontal: windowHeight(2),
  },
  registrationInput: {
    marginTop: windowHeight(0.9)
  },
  uploadContainer: {
    backgroundColor: appColors.white,
    padding: windowWidth(2),
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(1),
    borderRadius: windowHeight(1),
    borderWidth: windowHeight(0.1),
  },
  uploadSubContainer: {
    justifyContent: 'space-between',
    marginVertical: windowHeight(1),
    paddingHorizontal: windowHeight(0.7),
  },
  uploadTitle: {
    fontFamily: appFonts.medium,
  },
  uploadImgContainer: {
    borderColor: appColors.secondaryFont,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight(12),
    borderRadius: windowHeight(0.5),
  },
  uploadedImg: {
    width: '100%',
    height: '100%',
    borderRadius: windowHeight(0.5),
  },
  imgClose: {
    height: windowHeight(3),
    width: windowHeight(3),
    backgroundColor: appColors.closeBg,
    position: 'absolute',
    top: windowHeight(0),
    right: windowHeight(0),
    borderTopRightRadius: windowHeight(0.5),
    borderBottomLeftRadius: windowHeight(0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeHolder: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    marginVertical: windowHeight(0.5),
    textAlign: 'center',
  },
  imgContainer: {
    width: '100%',
    marginVertical: windowHeight(1),
    justifyContent: 'space-between',
    paddingHorizontal: windowHeight(1),
    bottom: windowHeight(1),
  },
  imgUpload: {
    width: '47.5%',
    borderColor: appColors.secondaryFont,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight(12),
    borderRadius: windowHeight(0.5),
  },
  imgContainer2: {
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: windowHeight(1),
    marginBottom: windowHeight(0.5),
  },
  inputContainer: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(1),
  },
  driverAllow: { justifyContent: 'space-between' },
  withDriver: {
    color: appColors.primaryFont,
    fontFamily: appFonts.medium,
  },
  gearTitle: {
    color: appColors.primaryFont,
    bottom: windowHeight(0.7),
    fontFamily: appFonts.medium,
  },
  border: {
    borderColor: appColors.border,
  },
  titleInterior: {
    fontFamily: appFonts.medium,
    marginBottom: windowHeight(0.5),
    bottom: windowHeight(0.5),
  },
  listView: {
    paddingHorizontal: windowWidth(2),
    paddingVertical: windowHeight(0.5),
    borderWidth: windowHeight(0.1),
    borderRadius: windowWidth(2),
  },
  statusContainer: {
    justifyContent: 'space-between',
    bottom: windowHeight(0.5),
  },
  modalTitle: {
    textAlign: 'center',
    fontFamily: appFonts.medium,
    marginTop: windowHeight(2),
    width: windowWidth(60),
    fontSize: fontSizes.FONT4HALF,
    alignSelf: 'center'
  },
  closeContainer: {
    position: 'absolute',
    top: windowHeight(1),
    marginHorizontal: windowHeight(1)
  },
  swiperContainer: {
    height: windowHeight(38),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperDot: {
    marginTop: windowHeight(8),
    marginHorizontal: windowHeight(1)
  },
  buttonContainer: {
    marginTop: windowHeight(1),
    marginBottom: windowHeight(2.3),
  },
  sliderView: {
    alignItems: 'center',
    marginTop: windowHeight(2),
  },
  sliderImg: {
    height: windowHeight(21),
    borderRadius: windowHeight(1.5),
    resizeMode: 'contain',
  },
  sliderTitle: {
    fontFamily: appFonts.medium,
    marginTop: windowHeight(2),
    textAlign: 'center',
    fontSize: fontSizes.FONT3HALF,
  },
  sliderDesc: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
    marginTop: windowHeight(0.8),
    textAlign: 'center',
    marginHorizontal: '10%',
    fontSize: fontSizes.FONT3HALF,
  },
  errorText: {
    color: 'red',
    marginTop: windowHeight(1),
    fontSize:fontSizes.FONT3SMALL
  },
  btnMargin: {
    marginBottom: windowHeight(2),
    width:'105%',
    alignSelf:'center'
  },
  modalOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
  },
  handleDeleteClick: { width: '50%' }
})
export { styles }
