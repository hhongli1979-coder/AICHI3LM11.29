import React, { forwardRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { appColors } from "@src/themes";
import { windowHeight, windowWidth } from "@src/themes";
import { CloseCircle } from "@src/utils/icons";
import { styles } from '../../styles'
import { external } from "@src/styles/externalStyle";

interface CouponsBottomSheetProps {
    couponsSnapPoints: (string | number)[];
    bgContainer: string;
    isDark: boolean;
    textColorStyle: string;
    textRTLStyle: "left" | "right";
    viewRTLStyle: "row" | "row-reverse";
    translateData: any;
    inputValue: string;
    setInputValue: (val: string) => void;
    handlePress: () => void;
    isValid: boolean;
    couponValue: any;
    successMessage: string;
    removeCoupon: () => void;
    gotoCoupon: () => void;
}

const CouponsBottomSheet = forwardRef<BottomSheetModal, CouponsBottomSheetProps>(
    (
        {
            couponsSnapPoints,
            bgContainer,
            isDark,
            textColorStyle,
            textRTLStyle,
            viewRTLStyle,
            translateData,
            inputValue,
            setInputValue,
            handlePress,
            isValid,
            couponValue,
            successMessage,
            removeCoupon,
            gotoCoupon,
        },
        ref
    ) => {
        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={couponsSnapPoints}
                backgroundStyle={{ backgroundColor: bgContainer }}
                handleIndicatorStyle={{
                    backgroundColor: isDark
                        ? appColors.whiteColor
                        : appColors.primaryText,
                    width: windowWidth(40),
                }}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
            >
                <BottomSheetView style={external.fx_1}>
                    <View>
                        <TouchableOpacity
                            style={{
                                alignSelf: "flex-end",
                                marginHorizontal: windowWidth(15),
                            }}
                            onPress={() => (ref as any).current?.close()}
                        >
                            <CloseCircle />
                        </TouchableOpacity>
                        <Text
                            style={[
                                styles.payment,
                                { color: textColorStyle, textAlign: textRTLStyle },
                            ]}
                        >
                            {translateData.applyCoupons}
                        </Text>
                    </View>

                    <View style={{ marginHorizontal: windowWidth(15) }}>
                        <View
                            style={[
                                styles.containerCouponMain,
                                {
                                    flexDirection: viewRTLStyle,
                                    backgroundColor: bgContainer,
                                    borderColor: isDark
                                        ? appColors.darkBorder
                                        : appColors.border,
                                },
                            ]}
                        >
                            <TextInput
                                style={[styles.input, { color: textColorStyle }]}
                                value={inputValue}
                                onChangeText={setInputValue}
                                placeholder={translateData.applyPromoCode}
                                placeholderTextColor={appColors.regularText}
                            />
                            <TouchableOpacity
                                style={styles.buttonAdd}
                                onPress={handlePress}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.buttonAddText}>
                                    {translateData.apply}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Validation / Actions */}
                        <View style={{ marginBottom: windowHeight(22) }}>
                            {!isValid && (
                                <Text style={styles.invalidPromoText}>
                                    {translateData.invalidPromo}
                                </Text>
                            )}
                            {couponValue?.success === true && (
                                <Text style={[styles.successMessage,{color:appColors.primary}]}>{successMessage}</Text>
                            )}

                            {inputValue?.length > 0 ? (
                                <TouchableOpacity onPress={removeCoupon} activeOpacity={0.7}>
                                    <Text
                                        style={[
                                            styles.viewCoupon,
                                            { textDecorationLine: "underline" },
                                        ]}
                                    >
                                        {translateData.remove}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={gotoCoupon} activeOpacity={0.7}>
                                    <Text style={styles.viewCoupon}>
                                        {translateData.allCoupon}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

export default CouponsBottomSheet;
