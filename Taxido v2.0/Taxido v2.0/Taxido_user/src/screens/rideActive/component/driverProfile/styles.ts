import { StyleSheet } from "react-native";
import { appColors } from '@src/themes';
import { fontSizes, windowHeight, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
    profile: {
        height: windowHeight(9.5),
        width: '100%',
        justifyContent: 'space-between',
    },
    subProfile: {
        marginHorizontal: windowWidth(2.5),
        marginVertical: windowHeight(1.2),
    },
    userImage: {
        height: windowHeight(6.8),
        width: windowWidth(13.6),
    },
    userName: {
        marginHorizontal: windowWidth(1.5),
        marginTop: windowWidth(1),
    },
    carTitle: {
        color: appColors.blackColor,
        fontSize: fontSizes.FONT16,
        marginHorizontal: windowWidth(6),
        marginTop: windowHeight(4.5),
    },
    line: {
        borderLeftWidth: windowHeight(0.9),
        borderLeftColor: appColors.border,
        height: windowHeight(13),
        marginTop: windowHeight(6.5),
    },
});

export default styles