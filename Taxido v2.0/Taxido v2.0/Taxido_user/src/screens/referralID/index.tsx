import { Header } from "@src/commonComponent";
import React from "react";
import { Image, Text, View, TouchableOpacity, ScrollView, Share } from "react-native";
import styles from "./style";
import { useValues } from "@src/utils/context";
import Images from "@src/utils/images";
import { appColors, appFonts, fontSizes, windowHeight } from "@src/themes";
import { Copy } from "@src/utils/icons";
import { useAppNavigation } from "@src/utils/navigation";
import { useDispatch, useSelector } from "react-redux";
import { referralData } from "@src/api/store/actions";
import Clipboard from '@react-native-clipboard/clipboard';

export function ReferralID() {
    const { viewRTLStyle, isDark, isRTL } = useValues();
    const { self } = useSelector((state: any) => state.account);
    const { taxidoSettingData, translateData } = useSelector((state: any) => state.setting);
    const { navigate }: any = useAppNavigation();
    const dispatch = useDispatch();


    const Workdata = [
        { data: `${translateData.referral1}` },
        { data: `${translateData.referralEarn} ${taxidoSettingData?.taxido_values?.referral?.referrer_bonus_percentage}% ${translateData.referral2}` },
        { data: `${translateData.referral3}` },
    ];

    const gotoList = () => {
        dispatch(referralData());
        navigate('ReferralList')
    };

    const handleShareReferral = async () => {
        try {
            const referralCode = self?.referral_code || "Code Note Found";
            const message = `🚖 ${translateData.referralShare1} *Taxido*! ${translateData.referralShare2}: *${referralCode}* ${translateData.referralShare3}.\n\n${translateData.referralShare4} 🚕\n👉 https://play.google.com/store/apps/details?id=com.taxidouserui&hl=en_IN`;

            await Share.share({
                message,
                title: `${translateData.referralInvite}`,
            });
        } catch (error) {
            console.error("❌ Error sharing referral:", error);
        }
    };


    return (
        <View
            style={{
                backgroundColor: isDark ? appColors.primaryText : appColors.lightGray, flex: 1,
            }}
        >
            <Header value={translateData.referralCodeTitle} />

            <ScrollView contentContainerStyle={{ paddingBottom: windowHeight(60), paddingTop: windowHeight(10) }}>
                <View>
                    <Image source={Images.referral} style={styles.image} />
                    <View style={styles.position}>
                        <Text style={styles.des}>
                            {translateData.earn}{" "}
                            <Text
                                style={[
                                    { fontFamily: appFonts.bold, color: appColors.whiteColor },
                                ]}
                            >
                                {taxidoSettingData?.taxido_values?.referral?.referral_amount}
                            </Text>{" "}
                            {translateData.referralDetails}
                        </Text>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.button, { flexDirection: viewRTLStyle }]}
                            onPress={() => {
                                Clipboard.setString(self?.referral_code || '');
                            }}
                        >
                            <Copy color={appColors.primary} />
                            <Text style={styles.buttonText}>{self?.referral_code}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    style={[
                        styles.box,
                        {
                            borderColor: isDark
                                ? appColors.darkBorder
                                : appColors.border,
                        },
                        {
                            backgroundColor: isDark
                                ? appColors.bgDark
                                : appColors.whiteColor,
                        },
                    ]}
                >
                    <View
                        style={[
                            { flexDirection: viewRTLStyle },
                            {
                                justifyContent: "space-between",
                                alignItems: "center",
                            },
                        ]}
                    >
                        <Text style={styles.que}>{translateData.referralWork}</Text>
                        <Text style={[styles.trems]}>{translateData.referralCondition}</Text>
                    </View>

                    <View style={{ marginTop: windowHeight(10) }}>
                        {Workdata.map((item, id) => (
                            <View
                                key={id}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginVertical: windowHeight(4),
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: appFonts.semiBold,
                                        fontSize: fontSizes.FONT17,
                                        color: isDark
                                            ? appColors.whiteColor
                                            : appColors.blackColor,
                                        marginRight: isRTL ? 0 : 8,
                                        marginLeft: isRTL ? 8 : 0,
                                    }}
                                >
                                    {id + 1}.
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: appFonts.semiBold,
                                        fontSize: fontSizes.FONT17,
                                        color: isDark
                                            ? appColors.whiteColor
                                            : appColors.blackColor,
                                    }}
                                >
                                    {item?.data}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <Text style={styles.note}>
                    <Text style={{ fontFamily: appFonts.bold }}>{translateData.noteTitle}: </Text>{translateData.referralNoteData}</Text>
                <View>

                    <Image source={Images.referral1} style={styles.image} />
                    <View style={styles.position}>
                        <Text style={[styles.que, { fontFamily: appFonts.semiBold }]}>{translateData.referralCard1}</Text>
                        <Text style={styles.des1}>{translateData.referralCard2}</Text>
                        <TouchableOpacity style={styles.viewButton} onPress={gotoList}>
                            <Text style={styles.text}>{translateData.viewAll}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity
                onPress={handleShareReferral}
                style={{
                    backgroundColor: appColors.primary,
                    paddingVertical: windowHeight(13),
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: windowHeight(5),
                    margin: windowHeight(15),
                }}
            >
                <Text
                    style={{
                        color: appColors.whiteColor,
                        fontFamily: appFonts.bold,
                        fontSize: fontSizes.FONT18,
                    }}
                >
                    {translateData.shareReferral}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
