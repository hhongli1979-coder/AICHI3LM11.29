import React, { useState, useRef, useEffect } from "react";
import { Text, TouchableOpacity, View, ScrollView, StyleSheet, Pressable, BackHandler } from "react-native";
import appColors from "../../../theme/appColors";
import { Header } from "../../../commonComponents";
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import appFonts from "../../../theme/appFonts";
import { windowHeight, fontSizes, windowWidth } from "../../../theme/appConstant";
import { useSelector } from "react-redux";
import Icons from "../../../utils/icons/icons";
import { useValues } from "../../../utils/context";
import localStyles from "./styles";
import { useNavigation } from "@react-navigation/native";

export function TotalEarnings() {
    const { dashBoardList } = useSelector((state) => state.dashboard);
    const initialEarningsData = dashBoardList?.day?.dayRevenues?.revenues;
    const weekEarningsData = dashBoardList?.week?.weekRevenues?.revenues;
    const monthEarningsData = dashBoardList?.month?.monthRevenues?.revenues;
    const dayLabels = dashBoardList?.day?.dayRevenues?.days;
    const weekLabels = dashBoardList?.week?.weekRevenues?.days;
    const monthLabels = dashBoardList?.month?.monthRevenues?.months;
    const { isDark, rtl } = useValues()
    const { translateData } = useSelector(state => state.setting)
    const [selectedPeriod, setSelectedPeriod] = useState('Day');
    const [chartData, setChartData] = useState(initialEarningsData);
    const options = [translateData?.day, translateData?.week, translateData?.month];
    const chartScrollViewRef = useRef(null);
    const [scrollX, setScrollX] = useState(0);
    const navigation = useNavigation()

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

    const handleScroll = (event) => {
        setScrollX(event.nativeEvent.contentOffset.x);
    };
    const updateChartData = (period) => {
        setSelectedPeriod(period);

        setSelectedBarIndex(null);

        switch (period) {
            case 'Day':
                setChartData(initialEarningsData);
                break;
            case 'Week':
                setChartData(weekEarningsData);
                break;
            case 'Month':
                setChartData(monthEarningsData);
                break;
            default:
                setChartData(initialEarningsData);
        }
    };


    const getLabels = () => {
        switch (selectedPeriod) {
            case 'Day':
                return dayLabels;
            case 'Week':
                return weekLabels;
            case 'Month':
                return monthLabels.slice(0, chartData.length);
            default:
                return [];
        }
    };

    const labels = getLabels();
    const chartHeight = 200;
    const chartHorizontalPadding = windowHeight(2);
    const baseBarActualWidth = windowHeight(1.5);
    const baseBarSpacing = windowWidth(8);
    const barActualWidth = baseBarActualWidth;
    const barContainerWidth = baseBarActualWidth + baseBarSpacing;
    const totalChartContentWidth = chartData?.length * barContainerWidth + chartHorizontalPadding * 2;
    const maxValue = Math.max(...chartData);
    const yAxisMax = Math.max(30, Math.ceil(maxValue / 5) * 5);
    const fixedYAxisLabels = [yAxisMax, (yAxisMax * 5) / 6, (yAxisMax * 4) / 6, (yAxisMax * 3) / 6, (yAxisMax * 2) / 6, yAxisMax / 6, 0].map(val => Math.round(val));


    const formatValue = (value) => {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value?.toString();
    };

    useEffect(() => {
        if (chartScrollViewRef.current) {
            chartScrollViewRef.current.scrollTo({ x: 0, animated: true });
        }
    }, [chartData]);

    const [selectedBarIndex, setSelectedBarIndex] = useState(null);
    const [tooltipWidth, setTooltipWidth] = useState(0);
    const tooltipMargin = windowHeight(3.5);

    const AvgCard = ({ earnings, rides }: any) => (
        <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', justifyContent: 'space-between', marginHorizontal: windowHeight(2.5), marginBottom: windowHeight(2) }}>
            <View
                style={{
                    backgroundColor: isDark ? appColors.darkThemeSub : appColors.white, borderWidth: 1,
                    borderColor: isDark ? appColors.darkBorderBlack : appColors.border,
                    borderRadius: windowHeight(0.8), width: '48%'
                }}>
                <View style={{ flexDirection: 'row', margin: windowHeight(1.5) }}>
                    <View style={{ height: windowHeight(6.5), width: windowHeight(6.5), backgroundColor: appColors.whiteopicity, alignItems: 'center', justifyContent: 'center', borderRadius: windowHeight(0.8) }}>
                        <Icons.Earnings />
                    </View>
                    <View style={{ height: windowHeight(6.5), justifyContent: 'center', marginHorizontal: windowWidth(3) }}>
                        <Text style={{ fontFamily: appFonts.bold, color: appColors.blueShade, fontSize: fontSizes.FONT4 }}>{dashBoardList?.ride?.currency_symbol}{earnings}</Text>
                    </View>
                </View>
                <Text style={{
                    paddingBottom: windowHeight(1), marginHorizontal: windowHeight(1.5), fontFamily: appFonts.medium,
                    color: isDark ? appColors.white : appColors.black
                }}>{translateData?.averageEarnings}</Text>
            </View>
            <View style={{
                backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                borderWidth: 1,
                borderColor: isDark ? appColors.darkBorderBlack : appColors.border,
                borderRadius: windowHeight(0.8), width: '48%'
            }}>
                <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', margin: windowHeight(1.5) }}>
                    <View style={{ height: windowHeight(6.5), width: windowHeight(6.5), backgroundColor: appColors.bgColor2, alignItems: 'center', justifyContent: 'center', borderRadius: windowHeight(0.8) }}>
                        <Icons.Rides />
                    </View>
                    <View style={{ height: windowHeight(6.5), justifyContent: 'center', marginHorizontal: windowWidth(3) }}>
                        <Text style={{ fontFamily: appFonts.bold, color: appColors.orange, fontSize: fontSizes.FONT4 }}>{rides} {dashBoardList?.driver_performance?.unit}</Text>
                    </View>
                </View>
                <Text style={{
                    paddingBottom: windowHeight(1), marginHorizontal: windowHeight(1.5), fontFamily: appFonts.medium,
                    color: isDark ? appColors.white : appColors.black,
                    textAlign: rtl ? 'right' : 'left'
                }}>{translateData?.averageRides}</Text>
            </View>
        </View>
    );

    const RecordCard = ({ date, amount }) => (
        <View style={[localStyles.recordCard, { backgroundColor: isDark ? appColors.darkThemeSub : appColors.white },

        { borderColor: isDark ? appColors.darkBorderBlack : appColors.border }]}>
            <Text style={[localStyles.recordCardLabel, { color: isDark ? appColors.darkText : appColors.iconColor, textAlign: rtl ? 'right' : 'left' }]}>Date</Text>
            {date ? (
                <View style={[localStyles.recordCardContent, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                    <Text style={[localStyles.recordCardDate, { color: isDark ? appColors.white : appColors.black }]}>{date}</Text>
                    <Text style={localStyles.recordCardAmount}>
                        {dashBoardList?.ride?.currency_symbol}
                        {amount}
                    </Text>
                </View>
            ) : (
                <Text style={[localStyles.nodata, { color: isDark ? appColors.white : appColors.black, textAlign: rtl ? 'right' : 'left' }]}>{translateData?.noDataAvailable}</Text>
            )}

        </View>
    );

    const renderAvg = () => {
        switch (selectedPeriod) {
            case 'Day':
                return null;

            case 'Week':
                return <AvgCard earnings={dashBoardList?.week?.averages?.average_earnings} rides={dashBoardList?.week?.averages?.average_rides} />;

            case 'Month':
                return <AvgCard earnings={dashBoardList?.month?.averages?.average_earnings} rides={dashBoardList?.month?.averages?.average_rides} />;
            default:
                return null;
        }
    }

    const renderRecord = () => {
        switch (selectedPeriod) {
            case 'Day':
                return <RecordCard date={dashBoardList?.day?.highest_records?.daily?.date} amount={dashBoardList?.day?.highest_records?.daily?.amount} />;

            case 'Week':
                return <RecordCard date={dashBoardList?.week?.highest_records?.weekly?.date} amount={dashBoardList?.week?.highest_records?.weekly?.amount} />;

            case 'Month':
                return <RecordCard date={dashBoardList?.month?.highest_records?.monthly?.date} amount={dashBoardList?.month?.highest_records?.monthly?.amount} />;

            default:
                return null;
        }
    };




    return (
        <View style={{ flex: 1, }}>
            <Header title={translateData?.totalEarning} />
            <View style={{ backgroundColor: isDark ? appColors.bgDark : appColors.graybackground, flex: 1 }}>

                <View style={[localStyles.optionsContainer, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                { backgroundColor: isDark ? appColors.darkThemeSub : appColors.white },
                                localStyles.option,
                                selectedPeriod === option && localStyles.selectedOption
                            ]}
                            onPress={() => {
                                updateChartData(option);
                                renderRecord();
                            }}
                        >
                            <Text
                                style={[
                                    localStyles.optionText,
                                    { color: isDark ? appColors.darkText : appColors.black },
                                    selectedPeriod === option && localStyles.selectedText
                                ]}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[localStyles.title, { color: isDark ? appColors.white : appColors.black, textAlign: rtl ? 'right' : 'left' }]}>{translateData?.totalEarning}</Text>
                <View style={[localStyles.card, { backgroundColor: isDark ? appColors.darkThemeSub : appColors.white }, { borderColor: isDark ? appColors.darkBorderBlack : appColors.border }]}>

                    <View style={[localStyles.chartAndLabelsWrapper,]}>
                        <View style={localStyles.yAxisLabels}>
                            {fixedYAxisLabels.map((value, i) => (
                                <Text key={`y-label-${i}`} style={[localStyles.yAxisLabel, { textAlign: rtl ? 'right' : 'left' }]}>
                                    {value}
                                </Text>
                            ))}
                        </View>

                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            ref={chartScrollViewRef}
                            scrollEventThrottle={16}
                            onScroll={handleScroll}
                            contentContainerStyle={{
                                paddingHorizontal: chartHorizontalPadding,
                                flexDirection: 'column',
                                flexGrow: 1,
                            }}
                        >
                            <Svg
                                width={totalChartContentWidth}
                                height={chartHeight}
                                style={localStyles.svg}
                            >
                                {Array.from({ length: fixedYAxisLabels.length }).map((_, i) => {
                                    const y = (i / (fixedYAxisLabels.length - 1)) * chartHeight;
                                    return (
                                        <Line
                                            key={`grid-line-${i}`}
                                            x1="0"
                                            y1={y}
                                            x2={totalChartContentWidth}
                                            y2={y}
                                            stroke="#E0E0E0"
                                            strokeWidth="0.5"
                                            strokeDasharray="4 4"
                                        />
                                    );
                                })}

                                {chartData.map((value, index) => {
                                    const barHeight = (value / yAxisMax) * chartHeight;
                                    const x = index * barContainerWidth + (barContainerWidth - barActualWidth) / 2;
                                    const y = chartHeight - barHeight;

                                    return (
                                        <Rect
                                            key={`bar-${index}`}
                                            x={x}
                                            y={y}
                                            width={barActualWidth}
                                            height={barHeight}
                                            fill={appColors.primary}
                                            rx={2}
                                        />
                                    );
                                })}
                            </Svg>

                            <View style={[StyleSheet.absoluteFillObject, { flexDirection: rtl ? 'row-reverse' : 'row', left: chartHorizontalPadding, bottom: 0 }]}>
                                {chartData.map((_, index) => {
                                    return (
                                        <Pressable
                                            key={`touchable-${index}`}
                                            onPress={() => {
                                                setSelectedBarIndex(index);

                                                const xOffset = index * barContainerWidth - windowWidth(40);
                                                chartScrollViewRef.current?.scrollTo({ x: xOffset, animated: true });
                                            }}
                                            style={{
                                                width: barContainerWidth,
                                                height: chartHeight,
                                                backgroundColor: 'transparent',
                                            }}
                                        />
                                    );
                                })}
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: windowHeight(10),
                                    width: totalChartContentWidth,
                                    justifyContent: 'flex-start',
                                }}
                            >
                                {labels.map((label, index) => {
                                    return (
                                        <View
                                            key={`label-${index}`}
                                            style={{
                                                width: barContainerWidth,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text style={localStyles.xAxisLabelText}>
                                                {label}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>

                    {selectedBarIndex !== null && (


                        <View
                            onLayout={(event) => {
                                const { width } = event.nativeEvent.layout;
                                setTooltipWidth(width);
                            }}
                            style={[
                                localStyles.tooltipContainer,
                                {
                                    bottom: (chartData[selectedBarIndex] / yAxisMax) * chartHeight + tooltipMargin,
                                    left: chartHorizontalPadding
                                        + selectedBarIndex * barContainerWidth
                                        + (barContainerWidth / 2)
                                        - (tooltipWidth / 3.9)
                                        - scrollX,
                                },
                            ]}
                        >
                            <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', justifyContent: 'space-between', gap: 8 }}>
                                <Text style={localStyles.tooltipText}>{translateData?.income}: </Text>
                                <Text style={{
                                    color: appColors.primary,
                                    fontSize: fontSizes.FONT3HALF,
                                    fontFamily: appFonts.medium,
                                }}>
                                    {dashBoardList?.ride?.currency_symbol}{formatValue(chartData[selectedBarIndex])}
                                </Text>
                            </View>
                            <View style={localStyles.tooltipArrow} />
                        </View>
                    )}
                </View>
                {renderAvg()}
                <Text style={[localStyles.highestRecordTitle, { color: isDark ? appColors.darkText : appColors.iconColor, textAlign: rtl ? 'right' : 'left' }]}>
                    {translateData?.highestRecord}
                </Text>
                {renderRecord()}
            </View>
        </View>
    );
}
