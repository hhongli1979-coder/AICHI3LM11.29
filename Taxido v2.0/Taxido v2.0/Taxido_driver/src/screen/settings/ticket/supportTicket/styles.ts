import { StyleSheet } from 'react-native'
import appColors from '../../../../theme/appColors'
import {
  fontSizes,
  windowHeight,
  windowWidth,
} from '../../../../theme/appConstant'
import appFonts from '../../../../theme/appFonts'

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  headerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: windowWidth(4),
    height: windowHeight(10),
  },
  header: {
    borderWidth: windowHeight(0.1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowHeight(0.7),
    height: windowHeight(4.5),
    width: windowHeight(4.5),
  },
  text: {
    fontSize: fontSizes.FONT5,
    fontFamily: appFonts.medium,
  },
  ticketContainer: {
    borderWidth: windowHeight(0.1),
    paddingHorizontal: windowWidth(4),
    paddingBottom: windowHeight(2),
    borderRadius: windowHeight(1),
  },
  ticketText: {
    color: appColors.primary,
    marginTop: windowHeight(1.8),
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT4,
  },
  imgContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { height: windowHeight(40), width: windowHeight(40) },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: windowHeight(1.5),
  },
  emptyTicket: {
    fontFamily: appFonts.bold,
    fontSize: fontSizes.FONT5,
  },
  menuTrigger: {
    marginHorizontal: windowWidth(2),
    paddingTop: windowHeight(0.2),
  },
  noTicketText: {
    color: appColors.secondaryFont,
    width: windowWidth(80),
    textAlign: 'center',
    fontFamily: appFonts.regular,
  },
  priorityText: {
    color: appColors.red,
    fontFamily: appFonts.regular,
  },
  priorityContainer: {
    backgroundColor: appColors.lightRed,
    paddingHorizontal: windowWidth(6),
    paddingVertical: windowHeight(1),
    borderRadius: windowHeight(2),
    marginHorizontal: windowWidth(2),
  },
  departmentText: {
    color: appColors.darkPurpal,
    fontFamily: appFonts.regular,
  },
  departmentContainer: {
    backgroundColor: appColors.lightPurpal,
    paddingHorizontal: windowWidth(2),
    paddingVertical: windowHeight(1),
    borderRadius: windowHeight(2),
  },
  container: {
    width: '99%',
    borderTopWidth: windowHeight(0.1),
    marginVertical: windowHeight(1.5),
  },
  messageText: {
    color: appColors.secondaryFont,
    fontFamily: appFonts.regular,
  },
  subjectText: {
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(1.5),
  },
  ticket_status: {
    color: appColors.primary,
    fontFamily: appFonts.regular,
  },
  ticket_status_Container: {
    paddingHorizontal: windowWidth(2),
    paddingVertical: windowHeight(1),
    backgroundColor: appColors.cardicon,
    borderRadius: windowHeight(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticket_Container: {
    width: '25%',
    justifyContent: 'center',
  },
  created_at_Text: {
    color: appColors.secondaryFont,
    marginTop: windowHeight(1),
    fontFamily: appFonts.regular,
  },
  created_Container: { width: '75%' },
  created_Main_Container: { width: '100%' },
  containerMain: {
    marginHorizontal: windowWidth(4),
    marginTop: windowHeight(2),
    top: windowHeight(0.8),
  },
  contentContainerStyle: { paddingBottom: windowHeight(10) },
})

export default styles
