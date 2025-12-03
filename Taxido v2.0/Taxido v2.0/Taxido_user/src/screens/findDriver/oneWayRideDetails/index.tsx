import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { Button, CommonModal, Header, RadioButton } from "@src/commonComponent";
import { CalenderSmall, ClockSmall, Close, CloseCircle, Gps, IdCard, PickLocation, Radio } from "@src/utils/icons";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { useValues } from "@src/utils/context/index";;
import { useSelector } from "react-redux";
import { CustomRadioButton } from "@src/commonComponent/radioButton/customRadioButton";
import { commonStyles } from "@src/styles/commonStyle";
import { external } from "@src/styles/externalStyle";
import styless from "@src/screens/bottomTab/myRide/pendingRideScreen/styles";
import { apiformatDates } from "@src/utils/functions";


export function OneWayRideDetails() {
    const [modalVisible, setModalVisible] = useState(false);

    const { viewRTLStyle, isDark, textColorStyle, bgContainer, textRTLStyle, bgFullLayout, bgFullStyle, viewSelfRTLStyle, isRTL } = useValues()
    const { translateData } = useSelector((state) => state.setting);

    const formatDates = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const ampm = date.getHours() >= 12 ? "PM" : "AM";

        return {
            date: `${day} ${month}’${year}`,
            time: `${hours}:${minutes} ${ampm}`,
        };
    };
    const formattedDate = formatDates(new Date());
    const cities = [
        { label: '220 Yonge St, Toronto, ON M5B 2H1, Canada', text: 'Pickup location', type: 'start' },
        { label: '17600 Yonge St, Newmarket, ON L3Y 4Z1, Canada', text: 'Destination', type: 'middle' },
    ];



    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(null);

    const reportRideOptions = [
        "Change of Plans",
        "Rescheduling",
        "Driver Issue",
        "Pricing Concern",
        "Route Change",
        "Accidental Booking",
        "Other",
    ];
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedOption1, setSelectedOption1] = useState<string | null>(null);
    const onPress = (method) => {
        setSelectedPaymentMethod(method);
    };
    const PaymentMethodItem = ({ label, method, selectedPaymentMethod, onPress }) => (
        <View
            style={{
                flexDirection: viewRTLStyle,
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: windowWidth(19),
                marginTop: windowHeight(11),
            }}
        >
            <View style={{ flexDirection: viewRTLStyle, alignItems: 'center', flex: 1 }}>
                <View style={[styles.bottomView, { borderColor: isDark ? appColors.darkBorder : appColors.border, borderWidth: windowHeight(1), borderRadius: windowHeight(7) }]} />
                <Text
                    style={[styles.labelText, {
                        color: isDark ? appColors.whiteColor : appColors.primaryText,
                        textAlign: textRTLStyle

                    }]}
                >
                    Paying Via Cash                </Text>
            </View>

            <View style={{ left: windowHeight(3) }}>

                <Text style={{ color: appColors.primary, fontFamily: appFonts.medium, textDecorationLine: 'underline' }}>Go Cashless</Text>
            </View>
        </View>
    );



    return (
        <View style={styles.main}>
            <Header value="One Way" />
            <View style={[styles.view, { backgroundColor: isDark ? '#1F1F1F' : appColors.lightGray, height: '100%' }]}>
                <View
                    style={[styless.scheduleView, {
                        flexDirection: viewRTLStyle,
                        backgroundColor: bgFullStyle,
                        borderColor: isDark ? appColors.darkBorder : appColors.border,
                        marginTop: windowHeight(19),
                        width: '95%',
                        alignSelf: 'center'

                    }]}
                >
                    <View
                        style={styless.viewRental}
                    >
                        <Text
                            style={[styless.startDateText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                        >
                            {translateData.startDate}
                        </Text>
                        <View
                            style={[styless.clockSmall, {
                                flexDirection: viewRTLStyle,
                            }]}
                        >
                            <CalenderSmall />
                            <Text
                                style={styless.timeText}
                            >
                                {" "}
                                {formattedDate.date}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={[styless.rentalLine, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}
                    />
                    <View
                        style={styless.viewRental}
                    >
                        <Text
                            style={[styless.startDateText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                        >
                            {translateData.startTime}
                        </Text>
                        <View
                            style={[styless.clockSmall, {
                                flexDirection: viewRTLStyle,
                            }]}
                        >
                            <ClockSmall />
                            <Text
                                style={styless.timeText}
                            >
                                {formattedDate.time}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.scrollView, { backgroundColor: bgFullLayout, borderColor: isDark ? appColors.darkBorder : appColors.border }]}>

                    <View style={styles.citiesView}>
                        {cities.map((step, index) => (
                            <View key={index} style={[styles.stepContainer, { flexDirection: viewRTLStyle }]}>
                                <View style={styles.iconColumn}>
                                    <View style={styles.iconView}>


                                        {step.type === 'start' && <PickLocation />}

                                        {step.type === 'middle' && <Radio />}
                                        {step.type === 'end' && <Gps />}
                                    </View>
                                    {index !== cities.length - 1 && <View style={styles.line} />}

                                </View>

                                <TouchableOpacity
                                    style={styles.labelColumn}
                                >
                                    <Text style={[
                                        styles.label,
                                        { color: isDark ? appColors.whiteColor : appColors.gray, textAlign: textRTLStyle }
                                    ]}>
                                        {step.label}
                                    </Text>

                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                </View>
                <View
                    style={[
                        styles.containerCoupon,
                        { flexDirection: viewRTLStyle },
                        {
                            backgroundColor: bgContainer,
                            borderColor: isDark ? appColors.darkBorder : appColors.border,
                        },
                    ]}
                >
                    <TextInput
                        style={[styles.input, { color: textColorStyle, textAlign: textRTLStyle }]}

                        placeholder={'Apply Promo Code'}
                        placeholderTextColor={appColors.regularText}
                    />
                    <TouchableOpacity style={styles.buttonAdd} activeOpacity={0.7}
                    >
                        <Text style={styles.buttonAddText}>Apply</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ color: isDark ? appColors.whiteColor : appColors.primaryText, marginHorizontal: windowWidth(10), fontFamily: appFonts.medium, fontSize: fontSizes.FONT17, marginTop: windowHeight(19), textAlign: textRTLStyle }}>Payment Options</Text>
                <View style={[styles.paymentMethodView, {
                    backgroundColor: bgContainer,
                    borderColor: isDark ? appColors.darkBorder : appColors.border,
                }]}>
                    <PaymentMethodItem />

                </View>

            </View>
            <View style={styles.proceedToPayBtn}>
                <Button title={'Modify Booking'} onPress={() => setModalVisible(true)} />
            </View>

            <CommonModal
                isVisible={modalVisible}
                onPress={() => setModalVisible(false)}
                value={
                    <View>
                        <TouchableOpacity style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }} onPress={() => setModalVisible(false)}>
                            <Close />
                        </TouchableOpacity>
                        <Text style={{ color: isDark ? appColors.whiteColor : appColors.primaryText, textAlign: 'center', fontFamily: appFonts.medium, fontSize: fontSizes.FONT21 }}>Modify Booking</Text>
                        <Text
                            style={[

                                external.ti_center,
                                {
                                    color: '#797D83', fontFamily: appFonts.regular,
                                    fontSize: fontSizes.FONT18,

                                    marginTop: windowHeight(8)
                                },
                            ]}
                        >
                            Would you like to change your booking to a different date and time?
                        </Text>

                        <View
                            style={[
                                external.ai_center,
                                external.js_space,
                                external.mt_25,
                                { flexDirection: viewRTLStyle },
                            ]}
                        >
                            <Button
                                backgroundColor={appColors.lightGray}
                                title={'Cancel'}
                                width="47.5%"
                                onPress={() => setModalVisible(false)}
                                textColor={appColors.primaryText}
                            />
                            <Button
                                backgroundColor={appColors.primary}
                                title={'Reschedule'}
                                width="47.5%"
                                onPress={() => setReportModalVisible(true)}
                            />
                        </View>
                    </View>
                }
            />

            <Modal
                transparent={true}
                visible={reportModalVisible}
                animationType="slide"
                onRequestClose={() => setReportModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={[styles.viewModal, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor }]}>
                        <TouchableOpacity
                            style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}
                            onPress={() => setReportModalVisible(false)}
                        >
                            <CloseCircle />
                        </TouchableOpacity>

                        <Text style={[styles.reportRideText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>Choose a Cancellation Reason</Text>
                        <View style={styles.reportRideOptionsViewMain}>
                            {reportRideOptions.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.reportRideOptionsView, { flexDirection: viewRTLStyle }]}
                                    onPress={() => setSelectedOption(item)}
                                >
                                    <Text style={{ color: isDark ? appColors.whiteColor : appColors.primaryText }}>{item}</Text>

                                    <RadioButton
                                        color={appColors.primary}
                                        checked={selectedOption1 === item}
                                        onPress={() => setSelectedOption1(item)}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.aboutText, { color: isDark ? appColors.whiteColor : appColors.primaryText, textAlign: textRTLStyle }]}>Tell Us About More</Text>
                        <View
                            style={[styles.cardMainView, { flexDirection: viewRTLStyle, backgroundColor: bgFullLayout, borderColor: isDark ? appColors.darkBorder : appColors.border }]}
                        >
                            <View style={styles.idCardView}>
                                <IdCard />
                            </View>
                            <View>
                                <TextInput
                                    style={styles.textInput}
                                    multiline
                                    numberOfLines={5}
                                    placeholder="Write here...."
                                    placeholderTextColor={appColors.gray}
                                />
                            </View>
                        </View>
                        <View style={styles.textView}>
                            <TouchableOpacity style={styles.cancelTextView} onPress={() => setReportModalVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>


                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    )
}