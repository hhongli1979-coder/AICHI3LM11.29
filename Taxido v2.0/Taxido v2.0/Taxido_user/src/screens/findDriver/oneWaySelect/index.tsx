import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { Button, Header } from "@src/commonComponent";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { CalenderSmall, ClockSmall, Gps, PickLocation, Radio } from "@src/utils/icons";
import { useValues } from "@src/utils/context/index";;
import { useSelector } from "react-redux";
import DropDownPicker from "react-native-dropdown-picker";
import styless from "@src/screens/bottomTab/myRide/pendingRideScreen/styles";
import { useNavigation } from "@react-navigation/native";



export function OneWaySelect() {

    const { viewRTLStyle, isDark, textRTLStyle, bgFullStyle } = useValues()
    const { translateData } = useSelector((state) => state.setting);
    const navigation = useNavigation()

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
    const carTypes = [
        { label: 'Hatchback', value: 'hatchback' },
        { label: 'Sedan', value: 'sedan' },
        { label: 'SUV', value: 'suv' },
    ];

    const transmissionTypes = [
        { label: 'Automatic', value: 'automatic' },
        { label: 'Manual', value: 'manual' },
    ];

    const [selectedCarType, setSelectedCarType] = useState('hatchback');
    const [selectedTransmission, setSelectedTransmission] = useState('automatic');
    const [openCarType, setOpenCarType] = useState(false);
    const [openTransmissionType, setOpenTransmissionType] = useState(false);

    const DriverOption = ({ title, price, isSelected }) => (
        <View style={[styles.container, isSelected && styles.selectedContainer, { backgroundColor: bgFullStyle }]}>
            <View style={[styles.header, { flexDirection: viewRTLStyle }]}>
                <Text style={styles.title}>{title}</Text>
                <View style={[styles.infoIcon, { borderColor: isDark ? appColors.darkBorder : appColors.blackColor }]}>
                    <Text style={[styles.infoText, { color: isDark ? appColors.darkBorder : appColors.blackColor }]}>!</Text>
                </View>
            </View>
            <Text style={[styles.price, isSelected && styles.selectedPrice, { textAlign: textRTLStyle }]}>${price}</Text>
        </View>
    );
    return (
        <View style={styles.main}>
            <Header value="One Way" />
            <View style={[styles.view, { backgroundColor: isDark ? '#1F1F1F' : appColors.lightGray }]}>
                <View style={[styles.scrollView, { backgroundColor: bgFullStyle, borderColor: isDark ? appColors.darkBorder : appColors.border }]}>

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
                <Text style={{ color: isDark ? appColors.whiteColor : appColors.primaryText, marginHorizontal: windowWidth(10), fontFamily: appFonts.medium, fontSize: fontSizes.FONT17, textAlign: textRTLStyle }}>Select Car Type</Text>
                <View style={[styles.selectorRow]}>
                    <View style={[styles.dropdownWrapper, { flexDirection: viewRTLStyle }]}>
                        <DropDownPicker
                            open={openCarType}
                            value={selectedCarType}
                            items={carTypes}
                            setOpen={setOpenCarType}
                            setValue={setSelectedCarType}
                            containerStyle={styles.dropdownContainer}
                            style={[styles.dropdown, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkPrimary : appColors.whiteColor }]}
                            textStyle={[styles.dropDownText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                            zIndex={2}
                            placeholder={translateData.selectCarType}
                            dropDownContainerStyle={{
                                backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
                                borderColor: isDark ? appColors.bgDark : appColors.border,
                                maxHeight: windowHeight(450),
                                width: windowWidth(208)
                            }}
                            tickIconStyle={{
                                tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                            }}
                            iconContainerStyle={{
                                color: isDark ? appColors.whiteColor : appColors.blackColor,
                            }}
                            arrowIconStyle={{
                                tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                            }}
                        />
                    </View>

                    <View style={styles.dropdownWrapper}>
                        <DropDownPicker
                            open={openTransmissionType}
                            value={selectedTransmission}
                            items={transmissionTypes}
                            setOpen={setOpenTransmissionType}
                            setValue={setSelectedTransmission}
                            containerStyle={styles.dropdownContainer1}
                            style={[styles.dropdown, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkPrimary : appColors.whiteColor }]}
                            textStyle={[styles.dropDownText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                            zIndex={1}
                            placeholder={translateData.selectTransmission}
                            dropDownContainerStyle={{
                                backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
                                borderColor: isDark ? appColors.bgDark : appColors.border,
                                maxHeight: windowHeight(450),
                                width: windowWidth(208)

                            }}
                            tickIconStyle={{
                                tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                            }}
                            iconContainerStyle={{
                                color: isDark ? appColors.whiteColor : appColors.blackColor,
                            }}
                            arrowIconStyle={{
                                tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                            }}
                        />
                    </View>
                </View>
                <Text style={{ color: isDark ? appColors.whiteColor : appColors.primaryText, marginHorizontal: windowWidth(10), fontFamily: appFonts.medium, fontSize: fontSizes.FONT17, marginTop: windowHeight(20), textAlign: textRTLStyle }}>Estimated Usage</Text>
                <View style={[styles.wrapper, { flexDirection: viewRTLStyle }]}>
                    <DriverOption title="Classic Driver" price="500" isSelected={true} />
                    <DriverOption title="Plus Driver" price="800" isSelected={false} />
                </View>
            </View>
            <View style={{ width: '91%', alignSelf: 'center', bottom: windowHeight(15), position: 'absolute' }}>
                <Button title="Request" onPress={() => navigation.navigate('OneWayRideDetails')} />
            </View>


        </View>
    )
}