import { StyleSheet } from "react-native";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';

const styles = StyleSheet.create({
  ticketContainer: {
    borderWidth: windowHeight(1),
    borderColor: appColors.border,
    paddingHorizontal: windowWidth(15),
    paddingBottom: windowHeight(10),
    borderRadius: windowHeight(5),
  },
  row: {
    width: "100%"
  },
  ticketStyle: {
    color: appColors.primary,
    marginTop: windowHeight(8),
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
  },
  createdAt: {
    color: appColors.regularText,
    marginTop: windowHeight(4),
    fontFamily: appFonts.regular,
  },
  statusContainer: {
    paddingHorizontal: windowWidth(10),
    paddingVertical: windowHeight(5),
    backgroundColor: appColors.lightButton,
    borderRadius: windowHeight(25),
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    color: appColors.primary,
    fontFamily: appFonts.regular,
  },
  subjectText: {
    fontFamily: appFonts.medium,
    marginVertical: windowHeight(8),
  },
  desText: {
    color: appColors.regularText,
    fontFamily: appFonts.regular,
  },
  departmentView: {
    borderTopWidth: windowHeight(0.9),
    marginHorizontal: windowWidth(1),
    borderColor: appColors.border,
    marginVertical: windowHeight(13),
  },
  departSubView: {
    backgroundColor: appColors.lightPurpal,
    paddingHorizontal: windowWidth(19),
    paddingVertical: windowHeight(5),
    borderRadius: windowHeight(20),
  },
  priorityView: {
    backgroundColor: appColors.lightRed,
    paddingHorizontal: windowWidth(19),
    paddingVertical: windowHeight(5),
    borderRadius: windowHeight(20),
    marginHorizontal: windowWidth(10),
  },
  priorityText: {
    color: appColors.textRed,
    fontFamily: appFonts.regular,
  },
  headerView: {
    height: windowHeight(54),
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: windowHeight(12),
  },
  backButton: {
    height: windowHeight(32),
    width: windowHeight(32),
    borderColor: appColors.border,
    borderWidth: windowHeight(1),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(5),
  },
  title: {
    fontSize: fontSizes.FONT23,
    fontFamily: appFonts.medium,
    color: appColors.primaryText,
  },
  addBtn: {
    height: windowHeight(32),
    width: windowHeight(32),
    borderColor: appColors.border,
    borderWidth: windowHeight(1),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: windowHeight(5),
  },
  ticketSubContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  noImg: {
    height: windowHeight(270),
    width: windowHeight(270),
  },
  emptyTicket: {
    color: appColors.primaryText,
    fontFamily: appFonts.medium,
    fontSize: fontSizes.FONT22,
  },
  marginHr: {
    marginHorizontal: windowWidth(5),
  },
  emptyTicketView: {
    marginVertical: windowHeight(8),
    alignItems: 'center',
  },
  noTicketText: {
    color: appColors.regularText,
    marginHorizontal: windowWidth(50),
    textAlign: "center",
    fontFamily: appFonts.regular,
  },
  renderTicketItemView: {
    marginHorizontal: windowWidth(20),
    marginTop: windowHeight(15),

  },
  formatDateView: { width: "75%" },
  status_Container: {
    width: "25%",
    justifyContent: "center",
  },
});

export default styles;