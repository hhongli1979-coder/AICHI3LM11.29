import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { Button, Header } from "@src/commonComponent";
import { Ambulance, IdCard, PickLocation } from "@src/utils/icons";
import { useValues } from "@src/utils/context/index";;
import { appColors, appFonts, windowHeight, windowWidth } from "@src/themes";
import { useSelector } from "react-redux";
import { CustomRadioButton } from "@src/commonComponent/radioButton/customRadioButton";
import { AmbulancePaymentProps } from "./type";


export function AmbulancePayment() {
    const { textRTLStyle, isDark, viewRTLStyle, bgFullLayout, bgContainer } = useValues();
    const { translateData } = useSelector((state: any) => state.setting);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(null);

    const onPress: any = (method: any) => {
        setSelectedPaymentMethod(method);
    };

    const PaymentMethodItem = ({ label, method, selectedPaymentMethod, onPress }: AmbulancePaymentProps) => (
        <View
            style={{
                flexDirection: viewRTLStyle,
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: windowWidth(19),
                marginTop: windowHeight(15),
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={[styles.bottomView, { borderColor: isDark ? appColors.darkBorder : appColors.border, borderWidth: windowHeight(1), borderRadius: windowHeight(7) }]} />
                <Text
                    style={[styles.labelText, {
                        color: isDark ? appColors.whiteColor : appColors.primaryText,

                    }]}
                >
                    {label}
                </Text>
            </View>

            <View style={{ left: windowHeight(15) }}>
                <CustomRadioButton
                    selected={selectedPaymentMethod === method}
                    onPress={() => onPress(method)}
                />
            </View>
        </View>
    );


    return (
        <View style={styles.main}>
            <Header value={translateData.paymentHeader} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: isDark ? appColors.primaryText : appColors.lightGray }}>
                <View
                    style={[styles.mainContainer, { flexDirection: viewRTLStyle, backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border }]}
                >
                    <View>
                        <PickLocation />
                    </View>
                    <View style={styles.pickUpView}>
                        <Text
                            style={[styles.pickUp, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                        >
                            {translateData.pickupLocation}
                        </Text>
                        <Text
                            style={[styles.locationText, { textAlign: textRTLStyle }]}
                        >
                            {translateData.addressPayment}

                        </Text>
                    </View>
                </View>
                <Text
                    style={[styles.description, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                >
                    {translateData.additionalDescription}
                </Text>
                <View
                    style={[styles.ambulanceView, { flexDirection: viewRTLStyle, backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border }]}
                >
                    <View style={styles.idCard}>
                        <IdCard />
                    </View>
                    <View>
                        <TextInput
                            style={[styles.textInput, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border, textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                            multiline
                            numberOfLines={5}
                            placeholder={translateData.writePlaceholder}
                            placeholderTextColor={appColors.gray}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}

                    style={[styles.container, {
                        backgroundColor:
                            isDark ? appColors.darkPrimary : appColors.lightButton
                        , borderColor: isDark ? appColors.darkBorder : appColors.border,
                    }, { flexDirection: viewRTLStyle }]}>
                    <View
                        style={[styles.bottomView, { backgroundColor: isDark ? bgFullLayout : appColors.lightGray }]}
                    >
                        <Ambulance />
                    </View>
                    <View
                        style={styles.textView}>
                        <Text
                            style={[styles.itemText, { color: isDark ? appColors.whiteColor : appColors.primaryText, textAlign: textRTLStyle }]}
                        >{translateData.cityHospitalambulance}  </Text>
                        <Text
                            style={[styles.text, { textAlign: textRTLStyle }]}>
                            {translateData.emergencySupport}
                        </Text>
                        <View style={[styles.minView, { backgroundColor: isDark ? appColors.darkBorder : appColors.border }]} />
                        <View style={[styles.emergencySupportView, { flexDirection: viewRTLStyle }]}>
                            <Text style={styles.dollarPrice}>$256.23</Text>
                            <Text style={styles.minText}>47 {translateData.timeMin}</Text>
                        </View>
                    </View>

                </TouchableOpacity>
                <View style={[styles.containerCoupon, {
                    flexDirection: viewRTLStyle, backgroundColor: bgContainer,
                    borderColor: isDark ? appColors.darkBorder : appColors.border,
                }]}>
                    <TextInput
                        style={[styles.input, { color: isDark ? appColors.whiteColor : '#797D83', textAlign: textRTLStyle }]}
                        placeholder={translateData.applyPromoCode}
                        placeholderTextColor={appColors.regularText}
                    />
                    <TouchableOpacity style={styles.buttonAdd} activeOpacity={0.7}
                    >
                        <Text style={styles.buttonAddText}>{translateData.apply}</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[styles.billSummaryText, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData.billSummary}</Text>
                <View style={[styles.billView, { backgroundColor: bgContainer, borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
                    <View style={[styles.ambulancePriceView, { flexDirection: viewRTLStyle }]}>
                        <Text style={[styles.totalBillText, { fontFamily: appFonts.medium, color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData.ambulancePrice}</Text>
                        <Text style={[styles.totalBillText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>$100</Text>

                    </View>
                    <View style={[styles.ambulancePriceView, { flexDirection: viewRTLStyle }]}>
                        <Text style={[styles.totalBillText, { fontFamily: appFonts.medium, color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData.couponSavings}</Text>
                        <Text style={styles.savingPrice}>-$10</Text>

                    </View>
                    <View style={[styles.ambulanceBottomView, { backgroundColor: isDark ? appColors.darkBorder : appColors.border }]} />
                    <View style={[styles.ambulancePriceView, { flexDirection: viewRTLStyle }]}>
                        <Text style={[styles.totalBillText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData.totalBill}</Text>
                        <Text style={styles.bottomPrice}>$100</Text>

                    </View>


                </View>
                <Text style={[styles.paymentMethodText, { textAlign: textRTLStyle, color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData.paymentMethod}</Text>

                <View style={[styles.paymentMethodView, {
                    backgroundColor: bgContainer,
                    borderColor: isDark ? appColors.darkBorder : appColors.border,
                }]}>
                    <PaymentMethodItem
                        label={translateData.creditCardAmbulance}
                        method="creditCard"
                        selectedPaymentMethod={selectedPaymentMethod}
                        onPress={onPress}
                    />
                    <View style={[styles.lineMethod, { backgroundColor: isDark ? appColors.darkBorder : appColors.border }]} />
                    <PaymentMethodItem
                        label={translateData.payPalAmbulance}
                        method="paypal"
                        selectedPaymentMethod={selectedPaymentMethod}
                        onPress={onPress}
                    />
                    <View style={[styles.lineMethod, { backgroundColor: isDark ? appColors.darkBorder : appColors.border }]} />

                    <PaymentMethodItem
                        label={translateData.googlePayAmbulance}
                        method="googlePay"
                        selectedPaymentMethod={selectedPaymentMethod}
                        onPress={onPress}
                    />
                    <View style={[styles.lineMethod, { backgroundColor: isDark ? appColors.darkBorder : appColors.border }]} />

                    <View style={styles.cash}>
                        <PaymentMethodItem
                            label={translateData.cashAmbulance}
                            method="cash"
                            selectedPaymentMethod={selectedPaymentMethod}
                            onPress={onPress}
                        />
                    </View>
                </View>
                <View style={styles.btnn}>
                    <View style={styles.proceedToPayBtn}>
                        <Button title={translateData.proceedToPay} />
                    </View>
                </View>

            </ScrollView >

        </View >
    )
}