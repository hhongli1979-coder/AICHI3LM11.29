import { StyleSheet } from "react-native";
import { appColors } from '@src/themes';
import { windowHeight, windowWidth } from "@src/themes";

const styles = StyleSheet.create({
    iconMapContainer: {
        height: windowHeight(80),
        marginHorizontal: windowWidth(18),
    },
    target: {
        height: windowHeight(35),
        width: windowWidth(50),
        backgroundColor: appColors.whiteColor,
        marginVertical: windowHeight(7.5),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: windowHeight(5),
    },
    shield: {
        height: windowHeight(35),
        width: windowWidth(50),
        backgroundColor: appColors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: windowHeight(5),
    },
});

export default styles