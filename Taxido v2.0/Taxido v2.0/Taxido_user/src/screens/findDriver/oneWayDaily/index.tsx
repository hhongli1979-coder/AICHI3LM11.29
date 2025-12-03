import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { useValues } from "@src/utils/context/index";;
import { Header } from "@src/commonComponent";
import { Gps, Message, PickLocation, Radio, RatingEmptyStart, RatingHalfStar, RatingStar, SafetyCall } from "@src/utils/icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useSelector } from "react-redux";
import { commonStyles } from "@src/styles/commonStyle";
import Images from "@src/utils/images";
import { useTheme } from "@react-navigation/native";

export function OneWayDaily() {

    const { viewRTLStyle, isDark, textRTLStyle, bgFullLayout, textColorStyle, bgFullStyle } = useValues()
    const { translateData } = useSelector((state) => state.setting);
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
    const { colors } = useTheme()

    return (
        <View style={styles.main}>
            <Header value="Daily" />
            <View style={[styles.view, { backgroundColor: isDark ? '#1F1F1F' : appColors.lightGray, height: '100%' }]}>
                <View style={[styles.scrollView, { backgroundColor: appColors.whiteColor, borderColor: isDark ? appColors.darkBorder : appColors.border }]}>

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
                <Text style={{ color: isDark ? appColors.whiteColor : appColors.primaryText, marginHorizontal: windowWidth(10), fontFamily: appFonts.medium, fontSize: fontSizes.FONT17, textAlign: textRTLStyle, marginTop: windowHeight(18) }}>Select Car Type</Text>
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
                <Text style={{ color: isDark ? appColors.whiteColor : appColors.primaryText, marginHorizontal: windowWidth(10), fontFamily: appFonts.medium, fontSize: fontSizes.FONT17, textAlign: textRTLStyle, marginTop: windowHeight(20) }}>Select Driver For Daily Travel</Text>

                <View
                    style={[styles.rideInfoContainer, { backgroundColor: bgFullStyle, marginTop: windowHeight(18), borderColor: isDark ? appColors.darkBorder : appColors.border }]}
                >
                    <View
                        style={[
                            styles.profileInfoContainer,
                            { flexDirection: viewRTLStyle },
                        ]}
                    >
                        <Image
                            style={styles.profileImage}
                            source={

                                Images.defultImage
                            }
                        />

                        <View style={styles.profileTextContainer}>
                            <Text
                                style={[
                                    styles.profileName,
                                    { color: textColorStyle },
                                    { textAlign: textRTLStyle },
                                ]}
                            >
                                Jonathan Higgins                            </Text>

                        </View>
                        <View
                            style={[styles.serviceMainView, { flexDirection: viewRTLStyle, right: '22%' }]}
                        >
                            <View style={[styles.serviceView, { flexDirection: viewRTLStyle }]}>


                            </View>

                            <View
                                style={[
                                    styles.MessageMainView,
                                    {
                                        flexDirection: viewRTLStyle,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.MessageView,
                                        {
                                            borderColor: isDark ? appColors.darkBorder : colors.border,
                                        },
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <Message />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[
                                        styles.safetyCallView,
                                        {
                                            borderColor: isDark ? appColors.darkBorder : colors.border,
                                        },
                                    ]}
                                >
                                    <SafetyCall color={appColors.primary} />
                                </TouchableOpacity>
                            </View>



                        </View>

                    </View>

                    <View style={{ marginHorizontal: windowWidth(68), bottom: windowHeight(18) }}>

                        <View style={{ flexDirection: viewRTLStyle }}>
                            {Array.from({ length: 5 }).map((_, index) => {
                                const fullStarThreshold = index + 1;
                                const halfStarThreshold = index + 0.5;
                                if (fullStarThreshold) {
                                    return <RatingStar key={index} />;
                                } else if (halfStarThreshold) {
                                    return <RatingHalfStar key={index} />;
                                } else {
                                    return <RatingEmptyStart key={index} />;
                                }
                            })}
                            <View style={{ flexDirection: viewRTLStyle }}>
                                <Text
                                    style={[
                                        commonStyles.mediumTextBlack12,
                                        { marginHorizontal: windowWidth(4), color: isDark ? appColors.whiteColor : appColors.primaryText },
                                    ]}
                                >
                                    4.8
                                </Text>
                                <Text style={[styles.carInfoText]}>
                                    (127)
                                </Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ borderBottomColor: isDark ? appColors.darkBorder : appColors.border, borderBottomWidth: 1, borderStyle: 'dashed' }} />
                    <View style={{ flexDirection: viewRTLStyle, justifyContent: 'space-between', marginTop: windowHeight(9) }}>
                        <Text style={{ color: textColorStyle, fontSize: fontSizes.FONT19, fontFamily: appFonts.semiBold }}>Per Day Price</Text>
                        <Text style={{ color: appColors.gray, fontSize: fontSizes.FONT19, fontFamily: appFonts.semiBold }}>$150/day</Text>
                    </View>
                </View>
                <View
                    style={[styles.rideInfoContainer, { backgroundColor: bgFullStyle, marginTop: windowHeight(18), borderColor: isDark ? appColors.darkBorder : appColors.border }]}
                >
                    <View
                        style={[
                            styles.profileInfoContainer,
                            { flexDirection: viewRTLStyle },
                        ]}
                    >
                        <Image
                            style={styles.profileImage}
                            source={

                                Images.defultImage
                            }
                        />

                        <View style={styles.profileTextContainer}>
                            <Text
                                style={[
                                    styles.profileName,
                                    { color: textColorStyle },
                                    { textAlign: textRTLStyle },
                                ]}
                            >
                                Jonathan Higgins                            </Text>

                        </View>
                        <View
                            style={[styles.serviceMainView, { flexDirection: viewRTLStyle, right: '22%' }]}
                        >
                            <View style={[styles.serviceView, { flexDirection: viewRTLStyle }]}>


                            </View>

                            <View
                                style={[
                                    styles.MessageMainView,
                                    {
                                        flexDirection: viewRTLStyle,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.MessageView,
                                        {
                                            borderColor: isDark ? appColors.darkBorder : colors.border,
                                        },
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <Message />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[
                                        styles.safetyCallView,
                                        {
                                            borderColor: isDark ? appColors.darkBorder : colors.border,
                                        },
                                    ]}
                                >
                                    <SafetyCall color={appColors.primary} />
                                </TouchableOpacity>
                            </View>



                        </View>

                    </View>

                    <View style={{ marginHorizontal: windowWidth(68), bottom: windowHeight(18) }}>

                        <View style={{ flexDirection: viewRTLStyle }}>
                            {Array.from({ length: 5 }).map((_, index) => {
                                const fullStarThreshold = index + 1;
                                const halfStarThreshold = index + 0.5;
                                if (fullStarThreshold) {
                                    return <RatingStar key={index} />;
                                } else if (halfStarThreshold) {
                                    return <RatingHalfStar key={index} />;
                                } else {
                                    return <RatingEmptyStart key={index} />;
                                }
                            })}
                            <View style={{ flexDirection: viewRTLStyle }}>
                                <Text
                                    style={[
                                        commonStyles.mediumTextBlack12,
                                        { marginHorizontal: windowWidth(4), color: isDark ? appColors.whiteColor : appColors.primaryText },
                                    ]}
                                >
                                    4.8
                                </Text>
                                <Text style={[styles.carInfoText]}>
                                    (127)
                                </Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ borderBottomColor: isDark ? appColors.darkBorder : appColors.border, borderBottomWidth: 1, borderStyle: 'dashed' }} />
                    <View style={{ flexDirection: viewRTLStyle, justifyContent: 'space-between', marginTop: windowHeight(9) }}>
                        <Text style={{ color: textColorStyle, fontSize: fontSizes.FONT19, fontFamily: appFonts.semiBold }}>Per Day Price</Text>
                        <Text style={{ color: appColors.gray, fontSize: fontSizes.FONT19, fontFamily: appFonts.semiBold }}>$150/day</Text>
                    </View>
                </View>
                <View
                    style={[styles.rideInfoContainer, { backgroundColor: bgFullStyle, marginTop: windowHeight(18), borderColor: isDark ? appColors.darkBorder : appColors.border }]}
                >
                    <View
                        style={[
                            styles.profileInfoContainer,
                            { flexDirection: viewRTLStyle },
                        ]}
                    >
                        <Image
                            style={styles.profileImage}
                            source={

                                Images.defultImage
                            }
                        />

                        <View style={styles.profileTextContainer}>
                            <Text
                                style={[
                                    styles.profileName,
                                    { color: textColorStyle },
                                    { textAlign: textRTLStyle },
                                ]}
                            >
                                Jonathan Higgins                            </Text>

                        </View>
                        <View
                            style={[styles.serviceMainView, { flexDirection: viewRTLStyle, right: '22%' }]}
                        >
                            <View style={[styles.serviceView, { flexDirection: viewRTLStyle }]}>


                            </View>

                            <View
                                style={[
                                    styles.MessageMainView,
                                    {
                                        flexDirection: viewRTLStyle,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.MessageView,
                                        {
                                            borderColor: isDark ? appColors.darkBorder : colors.border,
                                        },
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <Message />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[
                                        styles.safetyCallView,
                                        {
                                            borderColor: isDark ? appColors.darkBorder : colors.border,
                                        },
                                    ]}
                                >
                                    <SafetyCall color={appColors.primary} />
                                </TouchableOpacity>
                            </View>



                        </View>

                    </View>

                    <View style={{ marginHorizontal: windowWidth(68), bottom: windowHeight(18) }}>

                        <View style={{ flexDirection: viewRTLStyle }}>
                            {Array.from({ length: 5 }).map((_, index) => {
                                const fullStarThreshold = index + 1;
                                const halfStarThreshold = index + 0.5;
                                if (fullStarThreshold) {
                                    return <RatingStar key={index} />;
                                } else if (halfStarThreshold) {
                                    return <RatingHalfStar key={index} />;
                                } else {
                                    return <RatingEmptyStart key={index} />;
                                }
                            })}
                            <View style={{ flexDirection: viewRTLStyle }}>
                                <Text
                                    style={[
                                        commonStyles.mediumTextBlack12,
                                        { marginHorizontal: windowWidth(4), color: isDark ? appColors.whiteColor : appColors.primaryText },
                                    ]}
                                >
                                    4.8
                                </Text>
                                <Text style={[styles.carInfoText]}>
                                    (127)
                                </Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ borderBottomColor: isDark ? appColors.darkBorder : appColors.border, borderBottomWidth: 1, borderStyle: 'dashed' }} />
                    <View style={{ flexDirection: viewRTLStyle, justifyContent: 'space-between', marginTop: windowHeight(9) }}>
                        <Text style={{ color: textColorStyle, fontSize: fontSizes.FONT19, fontFamily: appFonts.semiBold }}>Per Day Price</Text>
                        <Text style={{ color: appColors.gray, fontSize: fontSizes.FONT19, fontFamily: appFonts.semiBold }}>$150/day</Text>
                    </View>
                </View>
            </View>
        </View>

    )
}