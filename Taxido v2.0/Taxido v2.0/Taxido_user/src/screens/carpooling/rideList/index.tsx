import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { appColors, appFonts, fontSizes } from "@src/themes";
import { Back, CalenderSmall, ClockSmall, Filter, Message, RatingEmptyStart, RatingStar, RightArrow, SafetyCall, Seat1 } from "@src/utils/icons";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useAppNavigation } from "@src/utils/navigation";
import Images from "@src/utils/images";

export function RideList() {
    const navigation = useNavigation()
    const { navigate, goBack } = useAppNavigation();
    const { colors } = useTheme()

    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerMainView}>
                <TouchableOpacity onPress={goBack} activeOpacity={0.7} style={styles.back}>
                    <Back />
                </TouchableOpacity>
                <Text style={styles.hedaerText}></Text>
                <TouchableOpacity activeOpacity={0.7} style={styles.back}>
                    <Filter />
                </TouchableOpacity>
            </View>
            {Array.from({ length: 3 }).map((_, index) => (
                <View style={styles.dataView}>
                    <View style={styles.viewData}>
                        <Image
                            source={Images.defultImage}
                            style={styles.image}
                        />

                        <View style={styles.dataView1}>
                            <Text
                                style={styles.name}
                            >
                                Jonathan Higgins
                            </Text>

                            <View style={styles.starView}>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <RatingStar key={index} />
                                ))}
                                <RatingEmptyStart />
                                <Text
                                    style={styles.starNumber}
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

                        <View style={styles.view}>
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
                    <View style={styles.carView}>
                        <Text style={styles.toyotaText}>Toyota Corolla Altis</Text>
                        <View style={styles.seatMainView}>
                            <View style={styles.seatView}>
                                <Seat1 />
                                <Text style={styles.seatText}>2 Seat</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.dashedLine} />

                    <View
                        style={styles.dataView2}
                    >
                        <Text
                            style={styles.torontoText}
                        >
                            Toronto
                        </Text>

                        <View style={styles.rightArrow}>
                            <RightArrow />
                        </View>

                        <Text
                            style={styles.calgaryText}
                        >
                            Calgary
                        </Text>
                        <View style={styles.calenderSmall}>
                            <CalenderSmall />
                        </View>
                        <Text style={styles.dateAndYear}>15 Dec’2024</Text>
                    </View>
                    <View
                        style={styles.bottomView}>
                        <Text
                            style={{
                                color: appColors.primary,
                                fontSize: fontSizes.FONT20,
                                fontFamily: appFonts.semiBold,
                            }}
                        >
                            $4640
                        </Text>

                        <View style={styles.clockSmall}>
                            <ClockSmall />
                            <Text style={styles.time}>10:15 AM</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    )
}