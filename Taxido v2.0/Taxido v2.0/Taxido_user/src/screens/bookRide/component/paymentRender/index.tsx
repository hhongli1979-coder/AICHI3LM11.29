import React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { appColors } from "@src/themes";
import { RadioButton } from "@src/commonComponent";
import { styles } from "../../styles";

interface PaymentItemProps {
    item: any;
    index: number;
    isDark: boolean;
    viewRTLStyle: "row" | "row-reverse";
    textColorStyle: string;
    textRTLStyle: "left" | "right";
    selectedItem1: number | any;
    paymentData: (index: number) => void;
    activePaymentMethodsLength: number;

}

const PaymentItem: React.FC<PaymentItemProps> = ({ item, index, isDark, viewRTLStyle, textColorStyle, textRTLStyle, selectedItem1, paymentData, activePaymentMethodsLength }) => {
    return (
        <>
            <TouchableOpacity
                onPress={() => paymentData(index)}
                activeOpacity={0.7}
                style={[
                    styles.modalPaymentView,
                    { backgroundColor: "transparent", flexDirection: viewRTLStyle },
                ]}
            >
                <View style={[styles.paymentView, { flexDirection: viewRTLStyle }]}>
                    <View
                        style={[
                            styles.imageBg,
                            {
                                borderColor: isDark
                                    ? appColors.darkBorder
                                    : appColors.lightGray,
                            },
                        ]}
                    >
                        <Image source={{ uri: item?.image }} style={styles.paymentImage} />
                    </View>
                    <View style={styles.mailInfo}>
                        <Text
                            style={[
                                styles.mail,
                                { color: textColorStyle, textAlign: textRTLStyle },
                            ]}
                        >
                            {item?.name}
                        </Text>
                    </View>
                </View>
                <View style={styles.payBtn}>
                    <RadioButton
                        onPress={() => paymentData(index)}
                        checked={index === selectedItem1}
                        color={appColors.primary}
                    />
                </View>
            </TouchableOpacity>

            {index !== activePaymentMethodsLength - 1 && (
                <View
                    style={[
                        styles.borderPayment,
                        {
                            borderColor: isDark
                                ? appColors.darkBorder
                                : appColors.lightGray,
                        },
                    ]}
                />
            )}
        </>
    );
};

export default React.memo(PaymentItem);
