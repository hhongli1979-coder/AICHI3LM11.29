import { StyleSheet } from "react-native";
import { windowHeight, appColors, appFonts, fontSizes, windowWidth } from "@src/themes";
import { external } from "@src/styles/externalStyle";
import { commonStyles } from "@src/styles/commonStyle";

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    view: {
        backgroundColor: appColors.lightGray,
        paddingHorizontal: windowWidth(14)
    },
    scrollView: { padding: windowHeight(10), borderRadius: windowHeight(5), borderWidth: windowHeight(1), borderColor: appColors.border, marginTop: windowHeight(20), width: '95.5%', alignSelf: 'center' },
    stepContainer: {
        alignItems: "center",
        top: windowHeight(8)
    },
    citiesView: { paddingHorizontal: windowWidth(0), marginBottom: windowHeight(0) },
    iconView: { marginBottom: windowHeight(28) },
    iconColumn: {
        alignItems: "center",
        position: "relative",
    },
    line: {
        position: "absolute",
        width: windowHeight(0.1),
        height: windowHeight(37),
        borderStyle: "dashed",
        borderLeftWidth: windowHeight(0.7),
        borderLeftColor: appColors.gray,
        top: windowHeight(16),
    },
    labelColumn: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        paddingVertical: windowHeight(2),
        paddingHorizontal: windowHeight(4),
        marginHorizontal: windowHeight(0)
    },
    label: {
        fontWeight: "500",
        color: appColors.blackColor,
        paddingVertical: windowHeight(10),
        width: "85%",
        bottom: windowHeight(13),
        flex: 1,
        marginHorizontal: windowHeight(4)
    },
    selectorRow: {
        flexDirection: 'row',
        paddingHorizontal: windowWidth(1),
        marginTop: windowHeight(9)
      },
      dropdownWrapper: {
        flexDirection: 'row',
        marginHorizontal: windowWidth(9)
      },
      iconTextRow: {
        alignItems: 'center',
      },
      dropdown: {
        width: '82%',
      },
      dropdownContainer: {
        height: windowHeight(38),
        width: windowWidth(250),
      },
      dropdownContainer1: {
        height: windowHeight(38),
        width: windowWidth(250),
        right: windowWidth(40)
      },
      selectedContainer: {
        borderWidth: windowHeight(1.2),
        borderColor: appColors.primary,
      },
      rideInfoContainer: {
        width: '95%',
        backgroundColor: appColors.whiteColor,
        borderRadius: windowHeight(5.9),
        paddingHorizontal: windowHeight(12),
        paddingTop: windowHeight(12),
        paddingVertical: windowHeight(9),
        alignSelf:'center',
        borderWidth:windowHeight(1)
      },
      profileImage: {
        width: windowWidth(50),
        height: windowHeight(35),
        resizeMode: 'contain'
      },
      profileTextContainer: {
        ...external.mh_20,
        ...external.fg_1,
      },
      profileName: {
        ...commonStyles.mediumTextBlack12,
        fontSize: fontSizes.FONT19,
      },
      carInfoText: {
        ...commonStyles.regularText,
      },
      profileInfoContainer: {
        justifyContent: "space-between",
      },
      starContainer: { alignItems: "flex-start", justifyContent: "center" ,top:windowHeight(10)},
        MessageMainView: {
          width: windowWidth(100),
          justifyContent: "space-between",
        },
        MessageView: {
          alignItems: "center",
          justifyContent: "center", height: windowHeight(30),
          width: windowHeight(30),
          borderRadius: windowHeight(20),
          borderWidth: windowHeight(1),
        },
        safetyCallView: {
          alignItems: "center",
          justifyContent: "center", height: windowHeight(30),
          width: windowHeight(30),
          borderRadius: windowHeight(20),
          borderWidth: windowHeight(1),
        },
        serviceMainView: { justifyContent: "space-between" },
        serviceView: { marginTop: windowHeight(12) },
        carInfoContainer: {
            alignItems: 'center',
            marginTop: windowHeight(3),
          },

})
export default styles;