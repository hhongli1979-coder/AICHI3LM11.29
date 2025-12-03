import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, BackHandler, ImageBackground } from 'react-native'
import appColors from '../../theme/appColors'
import { fontSizes, windowHeight, windowWidth } from '../../theme/appConstant'
import appFonts from '../../theme/appFonts'
import Icons from '../../utils/icons/icons'
import Images from '../../utils/images/images'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useValues } from '../../utils/context'
import { notificationHelper } from '../../commonComponents'
import { useAppNavigation } from '../../utils/navigation'

export function FleetDriverDashBoard() {
    const { dashBoardList } = useSelector((state: any) => state.dashboard);
    const route = useRoute<any>()
    const { driverData } = route.params || ''
    const size = windowHeight(20)
    const strokeWidth = windowHeight(2)
    const radius = (size - strokeWidth) / 2
    const cx = size / 2
    const cy = size / 2
    const total = dashBoardList?.ride?.completed_rides + dashBoardList?.ride?.pending_rides + dashBoardList?.ride?.cancelled_rides
    const { navigate } = useAppNavigation()
    const { isDark, rtl } = useValues()
    const { translateData } = useSelector((state: any) => state.setting)
    const completeTotal = dashBoardList?.ride?.completed_rides
    const pendingTotal = dashBoardList?.ride?.pending_rides
    const cancelTotal = dashBoardList?.ride?.cancelled_rides

    const data = [
        { value: dashBoardList?.ride?.completed_rides, color: appColors.primary, label: translateData.completed },
        { value: dashBoardList?.ride?.pending_rides, color: appColors.value, label: translateData.pendingRide },
        { value: dashBoardList?.ride?.cancelled_rides, color: appColors.value1, label: translateData.cancelled },
    ]

    let startAngle = -90

    const gotoDetails = () => {
        if (dashBoardList?.ride?.total_earnings > 0) {
            navigate('TotalEarnings')
        } else {
            notificationHelper("", translateData.noEarning, "success")
        }
    }
    const navigation = useNavigation<any>()
    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);
    return (
        <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: isDark ? appColors.bgDark : appColors.graybackground, flex: 1 }}
        >
            <View>
                <View
                    style={{ backgroundColor: isDark ? appColors.darkThemeSub : appColors.white, height: windowHeight(10) }}
                >
                    <View
                        style={{
                            flexDirection: rtl ? 'row-reverse' : 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: windowHeight(3),
                            marginTop: windowHeight(2),
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: isDark ? appColors.white : appColors.primaryFont,
                                fontFamily: appFonts.medium,
                                fontSize: fontSizes.FONT5,
                            }}
                        >
                            {translateData.dashboard}
                        </Text>
                        <TouchableOpacity onPress={() => navigate('Notification')}
                            style={{
                                backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                                borderColor: isDark ? appColors.darkborder : appColors.border,
                                borderWidth: windowHeight(0.1),
                                width: windowHeight(5.5),
                                height: windowHeight(5.5),
                                borderRadius: windowHeight(3),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Icons.Notification color={isDark ? appColors.white : appColors.black} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ backgroundColor:isDark?appColors.darkThemeSub:  appColors.white, marginHorizontal: windowWidth(5), marginTop: windowHeight(3), paddingBottom: windowHeight(3), borderRadius: windowHeight(1) }}>
                    <View style={{ alignItems: 'center', marginTop: windowHeight(4) }}>
                        <Image source={Images.user} style={{ height: windowHeight(10), width: windowHeight(10), resizeMode: 'cover' }} />
                        <Text style={{ marginVertical: windowHeight(0.5), fontSize: fontSizes.FONT4HALF, fontFamily: appFonts.medium, color: isDark?appColors.white: appColors.primaryFont }}>{driverData?.name}</Text>
                        <Text style={{ fontSize: fontSizes.FONT3, fontFamily: appFonts.regular, color: appColors.secondaryFont }}>{driverData?.email}</Text>
                    </View>


                    <View style={{ paddingHorizontal: windowHeight(2), marginTop: windowHeight(3) }}>
                        <ImageBackground source={Images.cardBackground} style={{ width: '100%', borderRadius: windowHeight(0.8), overflow: 'hidden' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: windowHeight(2), marginTop: windowHeight(2) }}>
                                <View style={{
                                    height: windowHeight(7), width: windowWidth(23), backgroundColor: appColors.rgb, borderRadius: windowHeight(0.8), alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Text style={{ fontFamily: appFonts.regular, color: appColors.lightGreen1, marginBottom: windowHeight(0.5) }}>{translateData.completeRide}</Text>
                                    <Text style={{ fontFamily: appFonts.medium, color: appColors.white }}>{completeTotal}</Text>
                                </View>
                                <View style={{ height: windowHeight(7), width: windowWidth(23), backgroundColor: appColors.rgb, borderRadius: windowHeight(0.8), alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: appFonts.regular, color: appColors.lightGreen1, marginBottom: windowHeight(0.5) }}>{translateData.pending}</Text>
                                    <Text style={{ fontFamily: appFonts.medium, color: appColors.white }}>{pendingTotal}</Text>
                                </View>
                                <View style={{ height: windowHeight(7), width: windowWidth(23), backgroundColor: appColors.rgb, borderRadius: windowHeight(0.8), alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: appFonts.regular, color: appColors.lightGreen1, marginBottom: windowHeight(0.5) }}>{translateData.cancelled}</Text>
                                    <Text style={{ fontFamily: appFonts.medium, color: appColors.white }}>{cancelTotal}</Text>
                                </View>
                            </View>
                            <View style={{ borderTopWidth: 1.5, borderStyle: 'dashed', marginVertical: windowHeight(1), marginHorizontal: windowHeight(2), borderColor: '#81BFAF' }} />
                            <Text style={{ textAlign: 'center', paddingBottom: windowHeight(1), color: appColors.white, fontFamily: appFonts.medium }}>{translateData.viewRides}</Text>
                        </ImageBackground>
                    </View>
                </View>

                <View
                    style={{
                        height: windowHeight(80),
                        marginTop: windowHeight(3),
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                            borderColor: isDark ? appColors.darkborder : appColors.border,
                            borderWidth: windowHeight(0.1),
                            height: windowHeight(12),
                            width: '91%',
                            alignSelf: 'center',
                            marginTop: windowHeight(2.8),
                            borderRadius: windowHeight(0.8),
                            flexDirection: rtl ? 'row-reverse' : 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: windowHeight(2),
                        }}
                        onPress={gotoDetails}
                    >
                        <View
                            style={{
                                backgroundColor: appColors.gray,
                                width: windowHeight(8),
                                height: windowHeight(8),
                                borderRadius: windowHeight(0.8),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={Images.mapFrame}
                                resizeMode="contain"
                                style={{
                                    height: windowHeight(4),
                                    width: windowHeight(4),
                                }}
                            />
                        </View>

                        <View style={{ flex: 1, marginLeft: windowHeight(2) }}>
                            <Text
                                style={{
                                    color: isDark ? appColors.white : appColors.black,
                                    fontSize: fontSizes.FONT4,
                                    fontFamily: appFonts.medium,
                                }}
                            >
                                {translateData?.totalEarning}
                            </Text>
                            <Text
                                style={{
                                    color: appColors.yellow,
                                    fontSize: fontSizes.FONT4HALF,
                                    fontFamily: appFonts.bold,
                                    marginTop: windowHeight(0.5),
                                }}
                            >
                                {dashBoardList?.ride?.currency_symbol}{dashBoardList?.ride?.total_earnings}
                            </Text>
                        </View>

                        <Icons.LeftArrow color={isDark ? appColors.darkText : appColors.primaryFont} />
                    </TouchableOpacity>

                    <Text
                        style={{
                            color: isDark ? appColors.white : appColors.black,
                            marginHorizontal: windowWidth(5),
                            marginTop: windowHeight(2.5),
                            fontFamily: appFonts.medium,
                            fontSize: fontSizes.FONT4,
                        }}
                    >
                        {translateData.drivePerformance}
                    </Text>
                    <View
                        style={{
                            flexDirection: rtl ? 'row-reverse' : 'row',
                            justifyContent: 'space-between',
                            gap: 5,

                        }}
                    >
                        <View
                            style={{
                                height: windowHeight(21),
                                width: windowHeight(20),
                                borderColor: isDark ? appColors.darkborder : appColors.border,
                                borderWidth: windowHeight(0.1),
                                marginHorizontal: windowHeight(2.5),
                                borderRadius: windowHeight(0.8),
                                marginTop: windowHeight(2),
                                backgroundColor: isDark ? appColors.bgDark : appColors.white
                            }}
                        >
                            <View style={{ flexDirection: rtl ? 'row-reverse' : 'row' }}>
                                <View
                                    style={{
                                        backgroundColor: appColors.whiteopicity,
                                        height: windowHeight(6),
                                        width: windowHeight(6),
                                        borderRadius: windowHeight(0.7),
                                        marginTop: windowHeight(2),
                                        marginHorizontal: windowHeight(2),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image
                                        source={Images.mapFrame1}
                                        resizeMode="contain"
                                        style={{
                                            height: windowHeight(4),
                                            width: windowHeight(3),
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            color: appColors.blueShade,
                                            top: windowHeight(2),
                                            fontFamily: appFonts.bold,
                                            fontSize: fontSizes.FONT5,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {dashBoardList?.driver_performance?.total_distance}
                                    </Text>
                                    <Text
                                        style={{
                                            color: appColors.blueShade,
                                            top: windowHeight(2),
                                            fontFamily: appFonts.bold,
                                            fontSize: fontSizes.FONT5,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {dashBoardList?.driver_performance?.unit}
                                    </Text>
                                </View>
                            </View>
                            <Text
                                style={{
                                    color: isDark ? appColors.white : appColors.black,
                                    marginHorizontal: windowHeight(2),
                                    marginTop: windowHeight(1.7),
                                    fontFamily: appFonts.medium,
                                    textAlign: rtl ? 'right' : 'left'
                                }}
                            >
                                {translateData.totalDistances}
                            </Text>
                            <Image
                                source={Images.mapFrame2}
                                resizeMode="contain"
                                style={{
                                    height: windowHeight(10),
                                    width: windowHeight(21),
                                    alignSelf: 'center',
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: windowHeight(21),
                                width: windowHeight(20),
                                borderColor: isDark ? appColors.darkborder : appColors.border,
                                borderWidth: windowHeight(0.1),
                                borderRadius: windowHeight(0.8),
                                marginTop: windowHeight(2),
                                right: windowHeight(2.5),
                                backgroundColor: isDark ? appColors.bgDark : appColors.white
                            }}
                        >
                            <View style={{ flexDirection: rtl ? 'row-reverse' : 'row' }}>
                                <View
                                    style={{
                                        backgroundColor: appColors.bgColor2,
                                        height: windowHeight(6),
                                        width: windowHeight(6),
                                        borderRadius: windowHeight(0.7),
                                        marginTop: windowHeight(2),
                                        marginHorizontal: windowHeight(2),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image
                                        source={Images.mapFrame3}
                                        resizeMode="contain"
                                        style={{
                                            height: windowHeight(4),
                                            width: windowHeight(3),
                                        }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        color: appColors.orange,
                                        top: windowHeight(3.5),
                                        fontFamily: appFonts.bold,
                                        fontSize: fontSizes.FONT5,
                                        textAlign: rtl ? 'right' : 'left'
                                    }}
                                >
                                    {dashBoardList?.driver_performance?.total_hours}h
                                </Text>
                            </View>
                            <Text
                                style={{
                                    color: isDark ? appColors.white : appColors.black,
                                    marginHorizontal: windowHeight(2),
                                    marginTop: windowHeight(1.7),
                                    fontFamily: appFonts.medium,
                                    textAlign: rtl ? 'right' : 'left'
                                }}
                            >
                                {translateData.totalHours}
                            </Text>
                            <Image
                                source={Images.mapFrame4}
                                resizeMode="contain"
                                style={{
                                    height: windowHeight(10),
                                    width: windowHeight(21),
                                    alignSelf: 'center',
                                }}
                            />
                        </View>
                    </View>

                    <Text
                        style={{
                            color: isDark ? appColors.white : appColors.black,
                            marginHorizontal: windowWidth(5),
                            marginTop: windowHeight(2.5),
                            fontFamily: appFonts.medium,
                            fontSize: fontSizes.FONT4,
                        }}
                    >
                        {translateData.averageDrivePerformance}
                    </Text>
                    <View
                        style={{
                            flexDirection: rtl ? 'row-reverse' : 'row',
                            justifyContent: 'space-between',
                            gap: 5,
                        }}
                    >
                        <View
                            style={{
                                height: windowHeight(26),
                                width: windowHeight(20),
                                borderColor: isDark ? appColors.darkborder : appColors.border,
                                borderWidth: windowHeight(0.1),
                                marginHorizontal: windowHeight(2.5),
                                borderRadius: windowHeight(0.8),
                                marginTop: windowHeight(2),
                                backgroundColor: isDark ? appColors.bgDark : appColors.white
                            }}
                        >
                            <View style={{ flexDirection: rtl ? 'row-reverse' : 'row' }}>
                                <View
                                    style={{
                                        backgroundColor: appColors.gray,
                                        height: windowHeight(6),
                                        width: windowHeight(6),
                                        borderRadius: windowHeight(0.7),
                                        marginTop: windowHeight(2),
                                        marginHorizontal: windowHeight(2),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image
                                        source={Images.mapFrame5}
                                        resizeMode="contain"
                                        style={{
                                            height: windowHeight(4),
                                            width: windowHeight(3),
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            color: appColors.primary,
                                            top: windowHeight(2),
                                            fontFamily: appFonts.bold,
                                            fontSize: fontSizes.FONT5,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {dashBoardList?.driver_performance?.average_distance}
                                    </Text>
                                    <Text
                                        style={{
                                            color: appColors.primary,
                                            top: windowHeight(2),
                                            fontFamily: appFonts.bold,
                                            fontSize: fontSizes.FONT5,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {dashBoardList?.driver_performance?.unit}
                                    </Text>
                                </View>
                            </View>
                            <Text
                                style={{
                                    color: isDark ? appColors.white : appColors.black,
                                    marginHorizontal: windowHeight(2),
                                    marginTop: windowHeight(1.7),
                                    fontFamily: appFonts.medium,
                                    textAlign: rtl ? 'right' : 'left'
                                }}
                            >
                                {translateData.averageDistances}
                            </Text>
                            <Image
                                source={Images.mapFrame6}
                                style={{
                                    height: windowHeight(12.4),
                                    width: windowHeight(21),
                                    alignSelf: 'center',
                                    marginTop: windowHeight(1.8),
                                }}
                            />
                        </View>
                        <View
                            style={{
                                height: windowHeight(26),
                                width: windowHeight(20),
                                borderColor: isDark ? appColors.darkborder : appColors.border,
                                borderWidth: windowHeight(0.1),
                                borderRadius: windowHeight(0.8),
                                marginTop: windowHeight(2),
                                right: windowHeight(2.5),
                                backgroundColor: isDark ? appColors.bgDark : appColors.white
                            }}
                        >
                            <View style={{
                                flexDirection: rtl ? 'row-reverse' : 'row'
                            }}>
                                <View
                                    style={{
                                        backgroundColor: appColors.bgColor1,
                                        height: windowHeight(6),
                                        width: windowHeight(6),
                                        borderRadius: windowHeight(0.7),
                                        marginTop: windowHeight(2),
                                        marginHorizontal: windowHeight(2),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Image
                                        source={Images.mapFrame8}
                                        resizeMode="contain"
                                        style={{
                                            height: windowHeight(4),
                                            width: windowHeight(3),
                                        }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        color: appColors.setp,
                                        top: windowHeight(3.5),
                                        fontFamily: appFonts.bold,
                                        fontSize: fontSizes.FONT5,
                                    }}
                                >
                                    {dashBoardList?.driver_performance?.average_hours}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    color: isDark ? appColors.white : appColors.black,
                                    marginHorizontal: windowHeight(2),
                                    marginTop: windowHeight(1.7),
                                    fontFamily: appFonts.medium,
                                    textAlign: rtl ? 'right' : 'left'
                                }}
                            >
                                {translateData.averageHours}{' '}
                            </Text>
                            <Image
                                source={Images.mapFrame7}
                                style={{
                                    height: windowHeight(10),
                                    width: windowHeight(20),
                                    alignSelf: 'center',
                                    top: windowHeight(3),
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View >
        </ScrollView >
    )
}


