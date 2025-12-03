import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Header } from '../../../commonComponents';
import appColors from '../../../theme/appColors';
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant';
import appFonts from '../../../theme/appFonts';
import Svg, { Circle } from 'react-native-svg';
import styles from './styles';
import Images from '../../../utils/images/images';
import { useSelector, useDispatch } from 'react-redux';
import { useValues } from '../../../utils/context';
import { navigate } from '../../../commonComponents/helper/navigationService';
import { incentivesValue } from '../../../api/store/action/incentiveAction';
import FastImage from 'react-native-fast-image';
import Gifs from '../../../utils/gifs/gifs';

export function Incentive() {
    const dispatch = useDispatch();
    const [dates, setDates] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const { isDark, rtl } = useValues();
    const { translateData } = useSelector((state: any) => state.setting);
    const { incentiveDataList } = useSelector((state: any) => state.incentives);

    useEffect(() => {
        const result: Date[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const pastDate = new Date();
            pastDate.setDate(today.getDate() - i);
            result.push(pastDate);
        }
        setDates(result);
    }, []);

    useEffect(() => {
        if (!selectedDate) {
            const today = new Date();
            const formatted = today.toISOString().split('T')[0];
            setSelectedDate(formatted);
        }
    }, []);

    useEffect(() => {
        if (!selectedDate) return;

        const dateObj = new Date(selectedDate);
        const formattedToday = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
        dispatch(incentivesValue({ incentivedate: formattedToday })).then((res: any) => {
        });
    }, [selectedDate]);

    const currentData =
        incentiveDataList?.weekly?.days?.find((d: any) => d.date === selectedDate) || incentiveDataList;

    const completedRides = currentData?.rides_completed || 0;

    const levels = incentiveDataList?.levels || [];
    let currentLevel = levels.find((lvl: any) => completedRides < lvl.target_rides);
    const achievedLevels = levels.filter((lvl: any) => completedRides >= lvl.target_rides);

    if (!currentLevel && levels.length > 0) {
        currentLevel = levels[levels.length - 1];
    }

    const nextTarget = currentLevel?.target_rides || 0;
    const bonusAmount = currentLevel?.incentive_amount || 0;

    const totalEarned = achievedLevels.reduce(
        (acc: number, lvl: any) => acc + parseFloat(lvl.incentive_amount || 0),
        0
    );

    const progressValue =
        currentLevel && completedRides <= nextTarget
            ? `${completedRides}/${nextTarget}`
            : `${nextTarget}/${nextTarget}`;

    const progressPercentage = Math.min((completedRides / nextTarget) * 100, 100);
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

    const formatShortDay = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
    };

    const handleSelect = (date: Date) => {
        const formatted = date.toISOString().split('T')[0];
        setSelectedDate(formatted);
    };

    const gotoTask = () => {
        const currentDayData =
            selectedDate && incentiveDataList?.weekly?.days
                ? incentiveDataList.weekly.days.find((day: any) => day.date === selectedDate)
                : null;

        const levels = currentDayData?.levels || incentiveDataList?.levels || [];

        let cumulativeRides = 0;
        const tasks = levels.map((level: any) => {
            const rideValue = Math.min(level.target_rides, cumulativeRides + level.target_rides - cumulativeRides);
            cumulativeRides += rideValue;
            return {
                id: level.id,
                target_rides: level.target_rides,
                incentive_amount: level.incentive_amount,
                rideValue: rideValue,
                is_completed: level.is_completed,
            };
        });

        navigate('IncentiveTask', { tasks: incentiveDataList?.levels, data: completedRides });
    };

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? appColors.bgDark : appColors.lightGray }}>
            <Header title={translateData?.incentive} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.incentiveTitle, { color: isDark ? appColors.white : appColors.primaryFont }]}>{translateData.incentiveTitle}</Text>
                <Text style={[styles.incentiveSubTitle, { color: isDark ? appColors.darkText : appColors.secondaryFont }]}>{translateData.incentiveDes}</Text>

                <View
                    style={{
                        backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                        borderWidth: 1,
                        borderColor: isDark ? appColors.darkborder : appColors.border,
                        height: windowHeight(11),
                        marginHorizontal: windowWidth(5),
                        borderRadius: windowHeight(0.8),
                        marginTop: windowHeight(2),
                        alignItems: 'center',
                    }}
                >
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={dates}
                        keyExtractor={(item) => item.toISOString()}
                        contentContainerStyle={{ paddingHorizontal: 8 }}
                        renderItem={({ item }) => {
                            const formattedDate = item.toISOString().split('T')[0];
                            const isSelected = selectedDate === formattedDate;

                            return (
                                <TouchableOpacity
                                    onPress={() => handleSelect(item)}
                                    style={{
                                        alignItems: 'center',
                                        marginHorizontal: windowWidth(1.5),
                                        marginTop: windowHeight(1.7),
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: isDark ? appColors.darkText : appColors.secondaryFont,
                                            fontSize: fontSizes.FONT3SMALL,
                                            fontFamily: appFonts.medium,
                                        }}
                                    >
                                        {formatShortDay(item)}
                                    </Text>

                                    <View
                                        style={{
                                            backgroundColor: isSelected ? appColors.primary : appColors.lightGray,
                                            borderRadius: windowHeight(0.8),
                                            height: windowHeight(4.2),
                                            width: windowHeight(4.2),
                                            marginTop: windowHeight(1),
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: isSelected ? appColors.white : appColors.primaryFont,
                                                fontFamily: appFonts.medium,
                                            }}
                                        >
                                            {item.getDate()}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        removeClippedSubviews={true}
                    />
                </View>

                <View style={styles.titleView}>
                    <Text style={[styles.titleTask, { color: isDark ? appColors.white : appColors.primaryFont }]}>{translateData?.tasks}</Text>
                    <TouchableOpacity activeOpacity={0.7} onPress={gotoTask}>
                        <Text style={[styles.titleViewAll, { color: isDark ? appColors.darkText : appColors.secondaryFont }]}>{translateData?.viewTask}</Text>
                    </TouchableOpacity>
                </View>



                <View style={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.contentContainer}>
                            {achievedLevels.length === levels.length && levels.length > 0 ? (
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: windowHeight(8.35) }}>
                                    <View>
                                        <FastImage source={Gifs.success} style={styles.successGif} resizeMode='contain' />
                                    </View>
                                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                        <Text
                                            style={{
                                                color: appColors.white,
                                                fontFamily: appFonts.bold,
                                                fontSize: fontSizes.FONT5,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {translateData?.cong}
                                        </Text>
                                        <Text
                                            style={{
                                                color: appColors.value,
                                                fontFamily: appFonts.regular,
                                                fontSize: fontSizes.FONT4,
                                                marginTop: 5,
                                            }}
                                        >
                                            {translateData?.lavelup}
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.contentContainer}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.title}>{translateData.dailyGoal}</Text>
                                        <Text style={styles.subtitle}>
                                            {translateData.complete} {nextTarget} {translateData.incentiveRideEarn} ₹
                                            {bonusAmount} {translateData.bonus}
                                        </Text>
                                    </View>

                                    <View style={styles.progressContainer}>
                                        <Svg width="80" height="80" style={styles.svg}>
                                            <Circle
                                                cx="40"
                                                cy="40"
                                                r={radius}
                                                stroke="rgba(255,255,255,0.3)"
                                                strokeWidth="6"
                                                fill="none"
                                            />
                                            <Circle
                                                cx="40"
                                                cy="40"
                                                r={radius}
                                                stroke="white"
                                                strokeWidth="6"
                                                fill="none"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset}
                                                strokeLinecap="round"
                                                rotation="-90"
                                                origin="40, 40"
                                            />
                                        </Svg>
                                        <View style={styles.progressText}>
                                            <Text style={styles.progressLabel}>{progressValue}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

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
                            borderColor: isDark ? appColors.darkBorderBlack : appColors.border,
                            borderWidth: windowHeight(0.1),
                            marginHorizontal: windowHeight(2.5),
                            borderRadius: windowHeight(0.8),
                            marginTop: windowHeight(2),
                            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,

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
                                    style={{ height: windowHeight(4), width: windowHeight(3) }}
                                />
                            </View>
                            <View>
                                <Text
                                    style={{
                                        color: appColors.blueShade,
                                        top: windowHeight(3.5),
                                        fontFamily: appFonts.bold,
                                        fontSize: fontSizes.FONT5,
                                        textAlign: 'center',
                                    }}
                                >
                                    {completedRides}
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={{
                                color: isDark ? appColors.white : appColors.black,
                                marginHorizontal: windowHeight(2),
                                marginTop: windowHeight(1.7),
                                fontFamily: appFonts.medium,
                                textAlign: rtl ? 'right' : 'left',
                            }}
                        >
                            {translateData.incentiveRide}
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
                            borderColor: isDark ? appColors.darkBorderBlack : appColors.border,
                            borderWidth: windowHeight(0.1),
                            borderRadius: windowHeight(0.8),
                            marginTop: windowHeight(2),
                            right: windowHeight(2.5),
                            backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
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
                                    marginHorizontal: windowHeight(1),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Image
                                    source={Images.mapFrame3}
                                    resizeMode="contain"
                                    style={{ height: windowHeight(4), width: windowHeight(3) }}
                                />
                            </View>
                            <Text
                                style={{
                                    color: appColors.orange,
                                    top: windowHeight(3.5),
                                    fontFamily: appFonts.bold,
                                    fontSize: fontSizes.FONT5,
                                    textAlign: rtl ? 'right' : 'left',
                                }}
                            >
                                {totalEarned}
                            </Text>
                        </View>
                        <Text
                            style={{
                                color: isDark ? appColors.white : appColors.black,
                                marginHorizontal: windowHeight(2),
                                marginTop: windowHeight(1.7),
                                fontFamily: appFonts.medium,
                                textAlign: rtl ? 'right' : 'left',
                            }}
                        >
                            {translateData.incentiveEarn}
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

                <Text style={[styles.bottomtext, { color: isDark ? appColors.darkText : appColors.secondaryFont }]}>{translateData.incentiveTagLine}</Text>
            </ScrollView>
        </View>
    );
}
