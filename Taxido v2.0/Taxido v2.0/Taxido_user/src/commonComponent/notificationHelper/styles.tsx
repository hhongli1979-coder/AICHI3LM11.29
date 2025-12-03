import { appColors } from "@src/themes";
import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        padding: 16,
        elevation: 4,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        color: appColors.whiteColor,
        fontWeight: "bold",
        marginBottom: 4,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: appColors.whiteColor,
    },
});

export default styles;