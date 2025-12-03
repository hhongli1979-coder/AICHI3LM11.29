import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView } from 'react-native'
import appColors from '../../../theme/appColors'
import { Switch } from '../appSettings/component/'
import { personValue, totalKM, vehicalType } from './data'
import { DatePicker, Dropdown } from './component/'
import styles from './styles'
import { Input, Button, Header } from '../../../commonComponents'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../utils/context'
import { windowHeight } from '../chat/context'
import { useSelector } from 'react-redux'

export function AddNewOffer() {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [selectVehicleValue, setselectVehicleValue] = useState(false)
  const [selectedValue, setSelectedValue] = useState(null)
  const [selectedKMValue, setSelectedKMValue] = useState('1')
  const [isThemeOn, setIsThemeOn] = useState(false)
  const [openVehicle, setOpenVehicle] = useState(false)
  const [open, setOpen] = useState(false)
  const [openKM, setOpenKM] = useState(false)
  const { colors } = useTheme()
  const { viewRtlStyle, textRtlStyle, rtl, isDark } = useValues()
  const { translateData } = useSelector(state => state.setting)

  const handleStartDateChange = date => setStartDate(date)
  const handleEndDateChange = date => setEndDate(date)
  const handleThemeToggle = () => setIsThemeOn(prevState => !prevState)

  return (
    <ScrollView
      style={[styles.main, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Header title={translateData.titleAddNewOffer} />
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text
          style={[
            styles.title,
            { color: colors.text, textAlign: textRtlStyle },
          ]}
        >
          {translateData.vehicleType}
        </Text>
        <View style={styles.selectDropDownStyle}>
          <Dropdown
            open={openVehicle}
            value={selectVehicleValue}
            items={vehicalType}
            onChange={setselectVehicleValue}
            setOpen={setOpenVehicle}
            zIndex={20}
            placeholderValue={translateData.selectVehicleType}
            style={[
              {
                borderColor: isDark ? appColors.darkBorder : appColors.border,
                flexDirection: viewRtlStyle,
              },
            ]}
            textStyle={{
              textAlign: rtl ? 'right' : 'left',
            }}
          />
        </View>
        <View style={styles.inputFild}>
          <Input
            title={translateData.discount}
            titleShow={true}
            placeholder={translateData.enterYourNumber}
            keyboardType="default"
            warning={translateData.enterPhone}
            backgroundColor={colors.card}
          />
        </View>
        <View style={{ flexDirection: viewRtlStyle }}>
          <View style={styles.datePickerStyle}>
            <DatePicker
              label={translateData.startDate}
              date={startDate}
              onChange={handleStartDateChange}
            />
          </View>
          <View style={styles.datePickerStyle1}>
            <DatePicker
              label={translateData.endDate}
              date={endDate}
              onChange={handleEndDateChange}
            />
          </View>
        </View>
        <Text
          style={[
            styles.title,
            { color: colors.text, textAlign: textRtlStyle },
            { bottom: windowHeight(9) },
          ]}
        >
          {translateData.availableSeats}
        </Text>
        <View style={styles.selectVehicleStyle}>
          <Dropdown
            open={open}
            value={selectedValue}
            items={personValue}
            onChange={setSelectedValue}
            setOpen={setOpen}
            zIndex={2}
            style={[
              {
                borderColor: isDark ? appColors.darkborder : appColors.border,
                flexDirection: viewRtlStyle,
              },
            ]}
            textStyle={{
              textAlign: rtl ? 'right' : 'left',
            }}
          />
        </View>
        <Text
          style={[
            styles.title,
            { color: colors.text, textAlign: textRtlStyle },
            { bottom: windowHeight(6.8) },
          ]}
        >
          {translateData.availableArea}
        </Text>
        <View style={[styles.dropdownView, { flexDirection: viewRtlStyle }]}>
          <View style={[styles.inputView, { borderColor: colors.border }]}>
            <TextInput
              style={[
                styles.input,
                { color: isDark ? appColors.white : appColors.primaryFont },
              ]}
              placeholderTextColor={appColors.secondaryFont}
            />
          </View>
          <Dropdown
            open={openKM}
            value={selectedKMValue}
            items={totalKM}
            onChange={setSelectedKMValue}
            setOpen={setOpenKM}
            containerStyle={styles.dropDownStyle}
            zIndex={1}
          />
        </View>
        <View style={styles.dashLine} />
        <View style={[styles.statusView, { flexDirection: viewRtlStyle }]}>
          <Text style={[styles.titleStatus, { color: colors.text }]}>
            {translateData.offerActiveStatus}
          </Text>
          <Switch
            switchOn={isThemeOn}
            onPress={handleThemeToggle}
            background={colors.background}
          />
        </View>
        <Text style={[styles.discription, { textAlign: textRtlStyle }]}>
          {translateData.note}
        </Text>
      </View>
      <View></View>
      <Button
        title={translateData.createOffer}
        backgroundColor={appColors.primary}
        color={appColors.white}
      />
    </ScrollView>
  )
}
