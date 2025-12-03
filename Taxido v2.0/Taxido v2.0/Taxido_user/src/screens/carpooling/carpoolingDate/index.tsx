
import { BarProgress, Header } from '@src/commonComponent'
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Calendar } from "react-native-calendars";
import { RightArrows, LeftArrow } from "@utils/icons";
import styles from "./styles";
import { months } from "../../dateTimeSchedule/data";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { useValues } from '@src/utils/context/index';
import { Button, LineContainer } from "@src/commonComponent";
import { useAppNavigation, useAppRoute } from "@src/utils/navigation";
import { useSelector } from "react-redux";

const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function carpoolingDate() {
    const [selecte, setSelecte] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(monthNames[new Date().getMonth()]);
    const [openMonth, setOpenMonth] = useState(false);
    const [openYear, setOpenYear] = useState(false);
    const [periods, setPeriods] = useState(["AM", "PM"]);
    const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
    const [day, setday] = useState(new Date().getDate().toString());
    const [datee, setDate] = useState("");
    const [time, setTime] = useState("00");
    const { navigate, goBack } = useAppNavigation();
    const route = useAppRoute();
    const { fieldValue, categoryId, categorySlug } = route.params || {};
    const { linearColorStyle, textColorStyle, isDark, bgContainer, viewRTLStyle, textRTLStyle, isRTL } = useValues()
    const { translateData } = useSelector((state) => state.setting);

    const currentYear = new Date().getFullYear().toString();

    const years = Array.from({ length: 5 }, (_, i) => {
        const year = (parseInt(currentYear) + i).toString();
        return { label: year, value: year, disabled: true };
    });

    const [selectedYear, setSelectedYear] = useState(currentYear);


    const gotoBack = () => {
        navigate("EditVehicle");
    };

    const handleLeftArrowClick = () => {
        setSelectedPeriodIndex(0);
    };

    const handleRightArrowClick = () => {
        setSelectedPeriodIndex(1);
    };

    const handleDecrease = () => {
        let newTime = parseInt(time, 10) - 1;
        if (newTime >= 0) {
            setTime(newTime.toString().padStart(2, "0"));
        }
    };

    const handleIncrease = () => {
        let newTime = parseInt(time, 10) + 1;
        if (newTime <= 60) {
            setTime(newTime.toString().padStart(2, "0"));
        }
    };

    const [hour, setHour] = useState("00");
    const handleDecreaseHour = () => {
        let newHour = parseInt(hour, 10) - 1;
        if (newHour >= 0) {
            setHour(newHour.toString().padStart(2, "0"));
        }
    };

    const handleIncreaseHour = () => {
        let newHour = parseInt(hour, 10) + 1;
        if (newHour <= 12) {
            setHour(newHour.toString().padStart(2, "0"));
        }
    };

    useEffect(() => {
        const selectedMonthObject = months.find(
            (month) => month.value === selectedMonth
        );
        if (selectedMonthObject) {
            setDate(`${selectedYear}-${selectedMonthObject.no}-01`);
        }
    }, [selectedMonth, selectedYear]);


    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={{ backgroundColor: 'white', height: windowHeight(18) }}>
                <BarProgress fill={3} totalBars={6} />
            </View>
            <Text style={{ marginHorizontal: windowWidth(20), marginTop: windowHeight(15), fontFamily: appFonts.semiBold, fontSize: fontSizes.FONT23 }}>When do you plan to go?</Text>


            <Text style={{ marginHorizontal: windowWidth(20), fontFamily: appFonts.regular, marginTop: windowHeight(15) }}>Select date and time</Text>
            <Text style={[styles.selectDate, { textAlign: textRTLStyle }]}>
                {day} {selectedMonth} {selectedYear}, {hour}:{time}{" "}
                {periods[selectedPeriodIndex]}
            </Text>


            <View style={[styles.dropdownRow, { flexDirection: viewRTLStyle, zIndex: 3000 }]}>
                <View style={styles.dropdownWrapper}>
                    <DropDownPicker
                        open={openMonth}
                        value={selectedMonth}
                        items={months}
                        defaultValue={selectedMonth}
                        setOpen={setOpenMonth}
                        setValue={setSelectedMonth}
                        containerStyle={styles.dropdownContainer}
                        style={[styles.dropdown, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkPrimary : appColors.border }]}
                        textStyle={[styles.dropDownText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                        zIndex={2}
                        placeholder={translateData.selectMonth}
                        dropDownContainerStyle={{ backgroundColor: isDark ? appColors.bgDark : appColors.lightGray, borderColor: isDark ? appColors.bgDark : appColors.border, maxHeight: windowHeight(450) }}
                        tickIconStyle={{
                            tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                        }}
                        textStyle={{
                            textAlign: isRTL ? "right" : "left",
                            color: isDark ? appColors.whiteColor : appColors.blackColor,
                        }}
                        iconContainerStyle={{
                            color: isDark ? appColors.whiteColor : appColors.blackColor,
                        }}
                        arrowIconStyle={{
                            tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                        }}
                        placeholderStyle={{
                            color: isDark ? appColors.darkText : appColors.regularText,
                        }}
                    />
                </View>
                <View style={styles.dropdownWrapper}>
                    <DropDownPicker
                        open={openYear}
                        value={selectedYear}
                        items={years}
                        defaultValue={selectedYear}
                        setOpen={setOpenYear}
                        setValue={setSelectedYear}
                        placeholder={currentYear}
                        containerStyle={styles.dropdownContainer2}
                        onChangeItem={(item: { value: React.SetStateAction<string> }) =>
                            setSelectedYear(item.value)
                        }
                        style={[styles.dropdown, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkPrimary : appColors.border }]}
                        textStyle={[styles.dropDownText, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                        zIndex={2}
                        dropDownContainerStyle={{ backgroundColor: isDark ? appColors.bgDark : appColors.lightGray, borderColor: isDark ? appColors.bgDark : appColors.border }}
                        tickIconStyle={{
                            tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                        }}
                        textStyle={{
                            textAlign: isRTL ? "right" : "left",
                            color: isDark ? appColors.whiteColor : appColors.blackColor,
                        }}
                        iconContainerStyle={{
                            color: isDark ? appColors.whiteColor : appColors.blackColor,
                        }}
                        arrowIconStyle={{
                            tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                        }}
                        placeholderStyle={{
                            color: isDark ? appColors.darkText : appColors.regularText,
                        }}
                    />
                </View>
            </View>

            <View style={styles.calView}>
                <View style={styles.lineContainer1}>
                    <LineContainer />
                </View>
                <Calendar
                    key={datee + ""}
                    style={styles.calendar}
                    minDate={new Date().toISOString().split("T")[0]}
                    markedDates={{
                        [selecte]: {
                            selected: true,
                            disableTouchEvent: true,
                            customStyles: {
                                container: {
                                    backgroundColor: appColors.primary,
                                    borderRadius: windowHeight(5),
                                },
                            },
                        },
                    }}

                    hideExtraDays={false}
                    theme={{
                        backgroundColor: appColors.whiteColor,
                        calendarBackground: isDark ? appColors.darkPrimary : appColors.whiteColor,
                        textSectionTitleColor: appColors.textSectionTitleColor,
                        selectedDayBackgroundColor: appColors.selectedDayBackgroundColor,
                        selectedDayTextColor: appColors.whiteColor,
                        todayTextColor: appColors.todayTextColor,
                        dayTextColor: appColors.gray,
                        todayBackgroundColor: appColors.whiteColor,
                        arrowColor: isDark ? appColors.whiteColor : appColors.blackColor,
                        dotColor: appColors.primary,
                        'stylesheet.calendar.header': {

                            dayHeader: {
                                color: appColors.gray,
                                fontSize: fontSizes.FONT16,
                                marginTop: windowHeight(3),
                                fontFamily: appFonts.medium,
                                textTransform: 'uppercase',
                            },
                        },
                    }}
                    current={datee}

                    onDayPress={(day) => {
                        const today = new Date().toISOString().split("T")[0];
                        if (day.dateString < today) {
                            alert("You cannot select a past date.");
                            return;
                        }
                        setday(day.day);
                        setSelecte(day.dateString);
                    }}
                    markingType={"custom"}
                    dayComponent={({ date, state, marking, onPress }) => {
                        let parent = [];
                        let backgroundColor = isDark ? linearColorStyle : appColors.lightGray;
                        let color = isDark ? appColors.whiteColor : appColors.blackColor;
                        if (state === "disabled") {
                            backgroundColor = isDark ? appColors.darkPrimary : "";
                            color = isDark ? appColors.darkPrimary : appColors.gray;
                        } else if (marking && marking.selected) {
                            backgroundColor = appColors.primary;
                            color = appColors.whiteColor;
                        }

                        parent.push(
                            <TouchableOpacity
                                activeOpacity={0.7}

                                onPress={() => onPress(date)}
                                style={[styles.dateView, { backgroundColor }]}
                            >
                                <Text style={[styles.dateText, { color }]}>{date.day}</Text>
                            </TouchableOpacity>
                        );
                        return parent;
                    }}
                />
            </View>

            <View style={[styles.timeContainer, { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor, borderColor: isDark ? appColors.darkPrimary : appColors.border }, { flexDirection: viewRTLStyle }]}>
                <View style={[styles.arrowView2, { flexDirection: viewRTLStyle }]}>
                    <TouchableOpacity style={styles.arrowView} onPress={handleDecreaseHour} activeOpacity={0.7}
                    >
                        <LeftArrow />
                    </TouchableOpacity>
                    <Text style={styles.time}>{hour}</Text>
                    <TouchableOpacity style={styles.arrowView} onPress={handleIncreaseHour} activeOpacity={0.7}
                    >
                        <RightArrows />
                    </TouchableOpacity>
                </View>
                <View style={[styles.line, { borderRightColor: isDark ? appColors.darkBorder : appColors.border }]} />
                <View style={[styles.arrowView1, { flexDirection: viewRTLStyle }]}>
                    <TouchableOpacity style={styles.arrowView} onPress={handleDecrease} activeOpacity={0.7}
                    >
                        <LeftArrow />
                    </TouchableOpacity>
                    <Text style={styles.time}>{time}</Text>
                    <TouchableOpacity style={styles.arrowView} onPress={handleIncrease} activeOpacity={0.7}
                    >
                        <RightArrows />
                    </TouchableOpacity>
                </View>
                <View style={[styles.line, { borderRightColor: isDark ? appColors.darkBorder : appColors.border }]} />
                <View style={[styles.arrowView3, { flexDirection: viewRTLStyle }]}>
                    <TouchableOpacity style={styles.arrowView} onPress={handleLeftArrowClick} activeOpacity={0.7}
                    >
                        <LeftArrow />
                    </TouchableOpacity>
                    <Text style={[styles.day, { color: textColorStyle }]}>{periods[selectedPeriodIndex]}</Text>
                    <TouchableOpacity style={styles.arrowView} onPress={handleRightArrowClick} activeOpacity={0.7}
                    >
                        <RightArrows />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.btnView}>
                <Button title={translateData.confirm} onPress={gotoBack} />
            </View>
        </View>
    )
}

