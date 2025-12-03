import { Button, Header, RadioButton } from "@src/commonComponent";
import { appColors } from "@src/themes";
import { CloseCircle, Gps, IdCard, Message, PickLocation, Radio, RatingEmptyStart, RatingStar, Report, ShareRide, Toyota } from "@src/utils/icons";
import React, { useState } from "react";
import { Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { useTheme } from "@react-navigation/native";
import Images from "@src/utils/images";
import { ScrollView } from "react-native-gesture-handler";

export function CarpolingRideDetails() {

    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedOption1, setSelectedOption1] = useState<string | null>(null);

    const cities = [
        { label: '3920 Grand Park Dr #8, Mississauga, ON L5B 4M6, Canada', type: 'start' },
        { label: '620 Eglinton Ave W, Mississauga, ON L5R 3V2, Canada', type: 'middle' },
        { label: '620 Eglinton Ave W, Mississauga, ON L5R 3V2, Canada', type: 'middle' },
        { label: '3920 Grand Park Dr #8, Mississauga, ON L5B 4M6, Canada', type: 'end' },
    ];
    const reportRideOptions = [
        "Driver didn’t show up",
        "Unsafe driving behaviour",
        "Overcharged for the ride",
        "Smoking or strong odors in the car",
        "Loud or disruptive music",
        "Unexpected stops or route changes",
        "Discrimination or harassment",
    ];

    const { colors } = useTheme()

    return (
        <View style={styles.flexView}>
            <Header value="Ride Details" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.scrollView}>
                    <View style={styles.citiesView}>
                        <Text style={styles.date}>Thu 28 Mar</Text>
                        {cities.map((step, index) => (
                            <View key={index} style={styles.stepContainer}>
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
                                        { color: step.type === 'middle' ? appColors.blackColor : appColors.gray }
                                    ]}>
                                        {step.label}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.bottomView}>
                    <View style={styles.bookSeatsView}>
                        <Text style={styles.totalAmountText}>Book Seats</Text>
                        <Text style={styles.price}>0</Text>
                    </View>
                    <View style={styles.totalAmountView}>
                        <Text style={styles.totalAmountText}>Total Amount</Text>
                        <Text style={styles.price}>$4640</Text>
                    </View>
                </View>
                <View
                    style={styles.userData}
                >

                    <View
                        style={styles.imageView}
                    >
                        <Image
                            source={Images.defultImage}
                            style={styles.image}
                        />

                        <View style={styles.nameView}>
                            <Text
                                style={styles.Jonathan}
                            >
                                Jonathan Higgins
                            </Text>

                            <View style={styles.starView}>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <RatingStar key={index} />
                                ))}
                                <RatingEmptyStart />
                                <Text
                                    style={styles.starPoint}
                                >
                                    4.8
                                </Text>
                                <Text
                                    style={styles.digit}
                                >
                                    (127)
                                </Text>
                            </View>
                        </View>

                        <View style={styles.messageView}>
                            <TouchableOpacity
                                style={[
                                    styles.MessageView,
                                    { borderColor: colors.border },
                                ]}
                                activeOpacity={0.7}
                            >
                                <Message />
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={styles.dashedLine1} />
                    <View style={styles.toyotaView}>
                        <Toyota />
                        <Text style={styles.toyota}>Toyota Corolla Altis</Text>
                    </View>
                    <View style={styles.dashedLine1} />
                    <Text style={styles.travel}>Travel Preferences:</Text>
                    <View style={styles.talkView}>
                        <Text style={styles.dot}>.</Text>
                        <Text style={styles.travelText}>I love to talk!</Text>

                    </View>
                    <View style={styles.dependingView}>
                        <Text style={styles.dot}>.</Text>
                        <Text style={styles.travelText}>I prefer a smoke-free ride.</Text>
                    </View>
                    <View style={styles.dependingView}>
                        <Text style={styles.dot}>.</Text>
                        <Text style={styles.travelText}>I enjoy music depending on the moment.</Text>
                    </View>
                    <View style={styles.noPetsTextView}>
                        <Text style={styles.dot}>.</Text>
                        <Text style={styles.travelText}>No pets, please.</Text>
                    </View>
                </View>
                <View style={styles.vieww}>
                    <TouchableOpacity style={styles.rideView} onPress={() => setReportModalVisible(true)}
                    >
                        <Report />
                        <Text style={styles.report}>Report</Text>
                    </TouchableOpacity>
                    <View style={styles.dashedLine2} />

                    <View style={styles.rideView}>
                        <ShareRide />
                        <Text style={styles.report}>Share Ride</Text>
                    </View>
                </View>
                <View style={styles.button}>
                    <Button title="Book Now" />
                </View>
            </ScrollView>
            <Modal
                transparent={true}
                visible={reportModalVisible}
                animationType="slide"
                onRequestClose={() => setReportModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.viewModal}>
                        <TouchableOpacity
                            style={{ alignSelf: "flex-end" }}
                            onPress={() => setReportModalVisible(false)}
                        >
                            <CloseCircle />
                        </TouchableOpacity>

                        <Text style={styles.reportRideText}>Report Ride</Text>
                        <View style={styles.reportRideOptionsViewMain}>
                            {reportRideOptions.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.reportRideOptionsView}
                                    onPress={() => setSelectedOption(item)}
                                >
                                    <Text>{item}</Text>

                                    <RadioButton
                                        color={appColors.primary}
                                        checked={selectedOption1 === item}
                                        onPress={() => setSelectedOption1(item)}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.aboutText}>Tell Us About More</Text>
                        <View
                            style={styles.cardMainView}
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

                            <View style={styles.reportTextView}>
                                <Text style={styles.reportText}>Report</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    )
}