import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Calendar, DateData } from 'react-native-calendars';
import { RightArrows, LeftArrow, Close } from '@utils/icons';
import styles from './styles';
import { months, years } from './data';
import Images from '@utils/images';
import { appColors } from '@src/themes';
import { useValues } from "@src/utils/context/index";
import { windowWidth } from '@src/themes';
import { useSelector } from 'react-redux';

interface DayComponentProps {
  date?: DateData;
  state?: 'selected' | 'disabled' | 'today' | 'normal';
  marking?: { selected: boolean };
  onPress?: (date: DateData) => void;
}

export function DateTimeSchedule({ onPress }: { onPress?: () => void }) {
  const [selecte, setSelecte] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const [periods, setPeriods] = useState(['AM', 'PM']);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const [day, setday] = useState('1');
  const [datee, setDate] = useState('');
  const [time, setTime] = useState('00');
  const { viewRTLStyle } = useValues();
  const { translateData } = useSelector((state) => state.setting);


  const handleLeftArrowClick = () => {
    setSelectedPeriodIndex(0);
  };
  const handleRightArrowClick = () => {
    setSelectedPeriodIndex(1);
  };


  const handleDecrease = () => {
    let newTime = parseInt(time, 10) - 1;
    if (newTime >= 0) {
      setTime(newTime.toString().padStart(2, '0'));
    }
  };

  const handleIncrease = () => {
    let newTime = parseInt(time, 10) + 1;
    if (newTime <= 60) {
      setTime(newTime.toString().padStart(2, '0'));
    }
  };

  const [hour, setHour] = useState('00');
  const handleDecreaseHour = () => {
    let newHour = parseInt(hour, 10) - 1;
    if (newHour >= 0) {
      setHour(newHour.toString().padStart(2, '0'));
    }
  };

  const handleIncreaseHour = () => {
    let newHour = parseInt(hour, 10) + 1;
    if (newHour <= 12) {
      setHour(newHour.toString().padStart(2, '0'));
    }
  };

  useEffect(() => {
    const selectedMonthObject = months.find(month => month.value === selectedMonth);
    if (selectedMonthObject) {

      setDate(`${selectedYear}-${selectedMonthObject.no}-01`);
    }
  }, [selectedMonth, selectedYear]);

  return (
    <View>
      <TouchableOpacity style={styles.closeBtn} onPress={onPress} activeOpacity={0.7}>
        <Close />
      </TouchableOpacity>
      <View style={styles.subContainer}>
        <Text style={styles.title}>{translateData.titleDate}</Text>
        <Text style={styles.selectDate}>{day} {selectedMonth} {selectedYear}, {hour}:{time} {periods[selectedPeriodIndex]}</Text>
      </View>
      <View style={[styles.dropdownRow, { flexDirection: viewRTLStyle }]}>
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={openMonth}
            value={selectedMonth}
            items={months}
            defaultValue={selectedMonth}
            setOpen={setOpenMonth}
            setValue={setSelectedMonth}
            containerStyle={styles.dropdownContainer}
            style={styles.dropdown}
            textStyle={styles.dropDownText}
            zIndex={2}
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
            containerStyle={styles.dropdownContainer}
            onChangeItem={(item: { value: React.SetStateAction<string>; }) => setSelectedYear(item.value)}
            style={styles.dropdown}
            textStyle={styles.dropDownText}
            zIndex={2}
          />
        </View>
      </View>
      <View style={[styles.imageView, { flexDirection: viewRTLStyle }]}>
        <Image source={Images.line2} style={styles.img} />
        <Image source={Images.line2} style={styles.img} />
      </View>
      <Calendar
        key={datee + ""}
        style={styles.calanderStyle}
        markedDates={{

          [selecte]: {
            selected: true,
            disableTouchEvent: true,
            customStyles: {
              container: {
                backgroundColor: appColors.primary,
                borderRadius: windowWidth(5)
              }
            }
          }
        }}
        hideExtraDays={false}
        theme={{
          backgroundColor: appColors.whiteColor,
          calendarBackground: appColors.whiteColor,
          textSectionTitleColor: appColors.textSectionTitleColor,
          selectedDayBackgroundColor: appColors.selectedDayBackgroundColor,
          selectedDayTextColor: appColors.whiteColor,
          todayTextColor: appColors.todayTextColor,
          dayTextColor: appColors.dayTextColor,
          todayBackgroundColor: appColors.whiteColor,
          arrowColor: appColors.blackColor,
          dotColor: appColors.primary,
        }}

        current={datee}
        onDayPress={(day: any) => {
          setday(day.day)
          setSelecte(day.dateString);
        }}
        markingType={'custom'}

        dayComponent={({ date, state, marking, onPress }: DayComponentProps) => {
          let parent = [];
          let backgroundColor = appColors.lightGray;
          let color = appColors.blackColor;
          if (state === 'disabled') {
            backgroundColor = appColors.whiteColor;
            color = appColors.regularText

          } else if (marking && marking.selected) {
            backgroundColor = appColors.primary;
            color = appColors.whiteColor
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
      <View style={[styles.timeContainer, { flexDirection: viewRTLStyle }]}>
        <View style={[styles.arrowView1, { flexDirection: viewRTLStyle }]}>
          <TouchableOpacity onPress={handleDecreaseHour} activeOpacity={0.7}>
            <LeftArrow />
          </TouchableOpacity>
          <Text style={styles.time}>{hour}</Text>
          <TouchableOpacity onPress={handleIncreaseHour} activeOpacity={0.7}>
            <RightArrows />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        <View style={[styles.arrowView, { flexDirection: viewRTLStyle }]}>
          <TouchableOpacity onPress={handleDecrease} activeOpacity={0.7}>
            <LeftArrow />
          </TouchableOpacity>
          <Text style={styles.time}>{time}</Text>
          <TouchableOpacity onPress={handleIncrease} activeOpacity={0.7}>
            <RightArrows />
          </TouchableOpacity>
        </View>
        <View style={styles.line} />
        <View style={[styles.arrowView2, { flexDirection: viewRTLStyle }]}>
          <TouchableOpacity onPress={handleLeftArrowClick} activeOpacity={0.7}>
            <LeftArrow />
          </TouchableOpacity>
          <Text style={styles.day}>{periods[selectedPeriodIndex]}</Text>
          <TouchableOpacity onPress={handleRightArrowClick} activeOpacity={0.7}>
            <RightArrows />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
