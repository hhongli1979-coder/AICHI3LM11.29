import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import styles from './styles'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'

interface DatePickerProps {
  label: string
  date: Date
  onChange: (date: Date) => void
}

export function DatePicker({ label, date, onChange }: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false)
  const { colors } = useTheme()
  const { textRtlStyle, viewRtlStyle } = useValues()

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowPicker(false)
    onChange(selectedDate || date)
  }

  return (
    <View style={[styles.main, { flexDirection: viewRtlStyle }]}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPicker(true)}>
        <Text
          style={[
            styles.label,
            { color: colors.text, textAlign: textRtlStyle },
          ]}
        >
          {label}
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, textAlign: textRtlStyle },
          ]}
          editable={false}
          value={date.toLocaleDateString()}
        />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  )
}
