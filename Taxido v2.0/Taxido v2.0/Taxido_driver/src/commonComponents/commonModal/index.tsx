import React from "react";
import { DimensionValue, Modal, TouchableOpacity, View } from "react-native";
import appColors from "../../theme/appColors";
import { useValues } from "../../utils/context";
import styles from "./styles";
import { useTheme } from "@react-navigation/native";

interface CommonModelTypes {
    isVisible?: boolean;
    value?: React.ReactNode;
    animationType?: any;
    paddingTop?: DimensionValue;
    justifyContent?: any;
    closeModal?: any;
    onPress?: any;
}

export function CommonModal({ isVisible,
    value,
    justifyContent,
    paddingTop,
    closeModal,
    onPress }: CommonModelTypes) {
    const { isDark } = useValues();
    const { colors } = useTheme()

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            onRequestClose={closeModal}
            animationType='none'
        >
            <TouchableOpacity onPress={onPress}
                activeOpacity={2}
                style={[
                    styles.container,
                    { justifyContent: justifyContent || 'center' },
                    { paddingTop: paddingTop },
                ]}>
                <TouchableOpacity activeOpacity={2}

                    style={[
                        styles.valueBar,
                        { backgroundColor: isDark ? colors.card : appColors.white },
                    ]}>
                    <View>{value}</View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}