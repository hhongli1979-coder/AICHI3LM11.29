import { View, Text, Image, TouchableOpacity, ScrollView, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import { Header } from '@src/commonComponent'
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes'
import Images from '@src/utils/images'
import { Gps, Message, PickLocation, PlatNumber, Radio, RatingEmptyStart, RatingStar, SafetyCall, Toyota } from '@src/utils/icons'
import styles from './styles'
import { useNavigation, useTheme } from '@react-navigation/native'
import { useValues } from '@src/utils/context/index';

export function CarpoolingDetails() {
    const { colors } = useTheme()
    const { textColorStyle, bgFullStyle, viewRTLStyle, textRTLStyle } = useValues()
    const navigation = useNavigation();
    const cities = [
        { label: 'Toronto', type: 'start' },
        { label: 'Mississauga', type: 'middle' },
        { label: 'Vancouver', type: 'middle' },
        { label: 'Calgary', type: 'end' },
    ];

    const cityStatuses = {
        Toronto: "Start",
        Mississauga: "Arrived",
        Vancouver: "Arrived",
        Calgary: "Reached"
    };

    useEffect(() => {
        const backAction = () => {
            navigation.navigate("MyTabs"); // make sure "Home" is your screen name
            return true; // prevent default back behavior
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [navigation]);

    const handleEditStopover = (stop) => {
        if (stop.type === 'middle') {
        }
    };

    return (
        <View style={styles.view}>
            <Header value='Ride Details' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.scrollView}>
                    <View style={styles.scrollMainView}>
                        <View style={styles.container}>
                            <Image source={Images.authBg} style={styles.authBg} />
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.corollaText}>Toyota Corolla Altis</Text>
                                <View style={styles.platNumberView}>
                                    <PlatNumber />
                                    <Text style={styles.cLMV069}>CLMV069</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.line1} />
                        <View style={styles.rideIdView}>
                            <Text style={styles.text}>Ride ID</Text>
                            <Text style={styles.text}>#1011</Text>
                        </View>
                        <View style={styles.dateTimeView}>
                            <Text style={styles.text}>Date & Time</Text>
                            <Text style={styles.text}>Nov 29,2024 7:45PM</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: windowHeight(8.9) }}>
                            <Text style={styles.text}>Distance</Text>
                            <Text style={styles.text}>10 hours 57 mins</Text>
                        </View>
                        <View style={styles.dateTimeView}>
                            <Text style={styles.text}>Total Km</Text>
                            <Text style={styles.text}>544km</Text>
                        </View>
                        <View style={styles.luggageView}>
                            <Text style={styles.text}>Luggage</Text>
                            <Text style={styles.text}>1</Text>
                        </View>
                    </View>


                    <View style={{ backgroundColor: appColors.whiteColor, padding: windowHeight(10), marginVertical: windowHeight(15), borderRadius: windowHeight(5), borderWidth: windowHeight(1), borderColor: appColors.border }}>
                        <View style={styles.bookView}>
                            <Text style={styles.text}>Book Seats</Text>
                            <Text style={styles.text}>1</Text>
                        </View>
                        <View style={styles.amountView}>
                            <Text style={styles.text}>Total Amount</Text>
                            <Text style={styles.text}>$4640</Text>
                        </View>
                    </View>


                    <View style={styles.citiesMainContainer}>
                        <View style={styles.citiesContainer}>
                            <Text style={styles.citiesDate}>Thu 28 Mar</Text>
                            {cities.map((step, index) => (
                                <View key={index} style={styles.stepContainer}>
                                    <View style={styles.iconColumn}>
                                        <View style={styles.stepType}>
                                            {step.type === 'start' && <PickLocation />}
                                            {step.type === 'middle' && <Radio />}
                                            {step.type === 'end' && <Gps />}
                                        </View>
                                        {index !== cities.length - 1 && <View style={styles.line} />}
                                    </View>

                                    <TouchableOpacity
                                        style={styles.labelColumn}
                                        onPress={() => step.type === 'middle' && handleEditStopover(step)}
                                    >
                                        <Text style={[
                                            styles.label,
                                            { color: step.type === 'middle' ? appColors.blackColor : appColors.gray }
                                        ]}>
                                            {step.label}
                                        </Text>
                                        {cityStatuses[step.label] && (
                                            <View style={styles.cityStatusesView}>
                                                <Text style={styles.cityStatusesViewLabel}>
                                                    {cityStatuses[step.label]}
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>

                                    <View style={styles.border} />
                                </View>
                            ))}
                        </View>
                    </View>


                    <View
                        style={styles.imageMainView}
                    >
                        <View
                            style={styles.imageView}
                        >
                            <Image
                                source={Images.defultImage}
                                style={styles.defaultImage}
                            />

                            <View style={styles.userView}>
                                <Text
                                    style={styles.jonathan}
                                >
                                    Jonathan Higgins
                                </Text>

                                <View style={styles.arrayView1}>
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <RatingStar key={index} />
                                    ))}
                                    <RatingEmptyStart />
                                    <Text
                                        style={styles.starPoint1}
                                    >
                                        4.8
                                    </Text>
                                    <Text
                                        style={styles.starNumber1}
                                    >
                                        (127)
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.callingView}>
                                <TouchableOpacity
                                    style={[
                                        styles.MessageView,
                                        { borderColor: colors.border },
                                    ]}
                                    activeOpacity={0.7}
                                >
                                    <Message />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[
                                        styles.safetyCallView,
                                        { borderColor: colors.border },
                                    ]}
                                >
                                    <SafetyCall color={appColors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>


                        <View style={styles.dashedLine} />
                        <View style={styles.toyotaView}>
                            <Toyota />
                            <Text style={styles.altisText}>Toyota Corolla Altis</Text>
                            <Text style={styles.changeText}>Change</Text>
                        </View>
                        <View style={styles.dashedLine} />

                        <Text style={styles.travelPreferences}>Travel Preferences:</Text>
                        <View style={styles.viewDot}>
                            <Text style={styles.dot}>.</Text>
                            <Text style={styles.travelText}>I love to talk!</Text>

                        </View>
                        <View style={styles.dotMainView}>
                            <Text style={styles.dot}>.</Text>
                            <Text style={styles.travelText}>I prefer a smoke-free ride.</Text>
                        </View>
                        <View style={styles.dotMainView}>
                            <Text style={styles.dot}>.</Text>
                            <Text style={styles.travelText}>I enjoy music depending on the moment.</Text>
                        </View>
                        <View style={styles.dotView}>
                            <Text style={styles.dot}>.</Text>
                            <Text style={styles.travelText}>No pets, please.</Text>
                        </View>

                    </View>

                    <View
                        style={styles.imageMainView}
                    >
                        <View style={styles.imageView}>
                            <Image
                                source={Images.defultImage}
                                style={styles.defaultImage}
                            />

                            <View style={{ marginHorizontal: windowHeight(6) }}>
                                <Text
                                    style={styles.jonathan}
                                >
                                    Jonathan Higgins
                                </Text>
                                <View style={styles.arrayView}>
                                    {Array.from({ length: 4 }).map((_, index) => (
                                        <RatingStar key={index} />
                                    ))}
                                    <RatingEmptyStart />
                                    <Text
                                        style={styles.starPoint}
                                    >4.8</Text>
                                    <Text
                                        style={styles.starNumber}
                                    >(127)</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.dashedLine} />
                        <View style={styles.viewBottom}>
                            <Text style={styles.paymentMethodText}>Payment Method</Text>
                            <Text style={styles.cashText}>Cash</Text>
                        </View>
                        <View style={styles.bottomMainView}>
                            <Text style={styles.statusText}>Status</Text>
                            <Text style={styles.paidText}>Paid</Text>
                        </View>
                        <View style={styles.bottomView}>
                            <View style={styles.textView}>
                                <Text style={styles.viewDetails}>Report</Text>
                            </View>
                            <View style={styles.textView}>
                                <Text style={styles.viewDetails}>View Details</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

