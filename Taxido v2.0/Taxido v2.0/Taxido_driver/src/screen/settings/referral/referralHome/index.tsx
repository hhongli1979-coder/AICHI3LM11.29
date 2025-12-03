import { View, Text, TouchableOpacity, ScrollView, Share, Image } from 'react-native'
import React from 'react'
import { fontSizes, windowHeight } from '../../../../theme/appConstant';
import appFonts from '../../../../theme/appFonts';
import appColors from '../../../../theme/appColors';
import Images from '../../../../utils/images/images';
import { useDispatch, useSelector } from 'react-redux';
import { useAppNavigation } from '../../../../utils/navigation';
import { useValues } from '../../../../utils/context';
import Clipboard from '@react-native-clipboard/clipboard';
import Icons from '../../../../utils/icons/icons';
import { Header } from '../../../../commonComponents';
import styles from './styles';
import { referralData } from '../../../../api/store/action';

export function ReferralHome() {
    const { viewRtlStyle, isDark, rtl } = useValues();
    const { selfDriver } = useSelector((state: any) => state.account);
    const { taxidoSettingData, translateData } = useSelector((state: any) => state.setting);
    const { navigate }: any = useAppNavigation();
    const dispatch = useDispatch();


    const Workdata = [
        { data: `${translateData.referralTerm1}` },
        { data: `${translateData.referralEarn} ${taxidoSettingData?.taxido_values?.referral?.referrer_bonus_percentage}% ${translateData.referralTerm2}` },
        { data: `${translateData.referralTerm3}` },
    ];

    const gotoList = () => {
        dispatch(referralData());
        navigate('ReferralList')
    };

    const handleShareReferral = async () => {
        try {
            const referralCode = selfDriver?.referral_code;
            const message = `${translateData.referralShare1} *${referralCode}* ${translateData.referralShare2}\n\n ${translateData.referralShare3}\n👉 https://play.google.com/store/apps/details?id=com.taxidouserui&hl=en_IN`;

            await Share.share({
                message,
                title: "Invite to Taxido",
            });
        } catch (error) {
            console.error("❌ Error sharing referral:", error);
        }
    };


    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: isDark ? appColors.bgDark : appColors.lightGray,
                    flex: 1,
                }}
            >
                <Header title={translateData.referralHeader} />

                <ScrollView contentContainerStyle={{ paddingBottom: windowHeight(5), paddingTop: windowHeight(0.8) }}>
                    <View>
                        <Image source={Images.referral} style={styles.image} />
                        <View style={styles.position}>
                            <Text style={styles.des}>
                                {translateData.referralEarn}{" "}
                                <Text
                                    style={[
                                        { fontFamily: appFonts.bold, color: appColors.white },
                                    ]}
                                >
                                    {taxidoSettingData?.taxido_values?.referral?.referral_amount}
                                </Text>{" "}
                                {translateData.referralFirst}
                            </Text>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={[styles.button, { flexDirection: viewRtlStyle }]}
                                onPress={() => {
                                    Clipboard.setString(selfDriver?.referral_code || '');
                                }}
                            >
                                <Icons.Copy color={appColors.primary} />
                                <Text style={styles.buttonText}>{selfDriver?.referral_code}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View
                        style={[
                            styles.box,
                            {
                                borderColor: isDark
                                    ? appColors.darkBorderBlack
                                    : appColors.border,
                            },
                            {
                                backgroundColor: isDark
                                    ? appColors.bgDark
                                    : appColors.white,
                            },
                        ]}
                    >
                        <View
                            style={[
                                { flexDirection: viewRtlStyle },
                                {
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                },
                            ]}
                        >
                            <Text style={styles.que}>{translateData.referralWork}</Text>
                            <Text style={[styles.trems]}>{translateData.referralTC}</Text>
                        </View>

                        <View>
                            {Workdata.map((item, id) => (
                                <View
                                    key={id}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginVertical: windowHeight(1),
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: appFonts.medium,
                                            fontSize: fontSizes.FONT3HALF,
                                            color: isDark
                                                ? appColors.white
                                                : appColors.black,
                                            marginRight: rtl ? 0 : 8,
                                            marginLeft: rtl ? 8 : 0,
                                        }}
                                    >
                                        {id + 1}.
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: appFonts.medium,
                                            fontSize: fontSizes.FONT3HALF,
                                            color: isDark
                                                ? appColors.white
                                                : appColors.black,
                                        }}
                                    >
                                        {item.data}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <Text style={styles.note}>
                        <Text style={{ fontFamily: appFonts.bold }}>{translateData.referralNote} </Text>{translateData.referralNoteData}
                    </Text>

                    <View>
                        <Image source={Images.referral1} style={styles.image} />
                        <View style={styles.position}>
                            <Text style={[styles.que, { fontFamily: appFonts.medium }]}>{translateData.referralTitle}</Text>
                            <Text style={styles.des1}>{translateData.referralDescription}</Text>
                            <TouchableOpacity style={styles.viewButton} onPress={gotoList}>
                                <Text style={styles.text}>{translateData.referralViewAll}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>

                <TouchableOpacity
                    onPress={handleShareReferral}
                    style={{
                        backgroundColor: appColors.primary,
                        paddingVertical: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        margin: 15,
                    }}
                >
                    <Text
                        style={{
                            color: appColors.white,
                            fontFamily: appFonts.bold,
                            fontSize: fontSizes.FONT4,
                        }}
                    >
                        {translateData.referralShare}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

