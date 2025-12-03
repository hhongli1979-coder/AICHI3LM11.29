import { useTheme } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import appFonts from '../../../../../theme/appFonts'
import { DropdownProps } from '../../type'
import styles from './styles'
import Icons from '../../../../../utils/icons/icons'

export function Dropdown({
  open,
  value,
  items,
  onChange,
  setOpen,
  containerStyle,
  zIndex,
  placeholderValue,
}: DropdownProps) {
  const { colors } = useTheme()
  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...containerStyle,
        }}
        itemStyle={{ justifyContent: 'flex-start', borderColor: colors.border }}
        dropDownStyle={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
        setOpen={setOpen}
        setValue={onChange}
        closeAfterSelect={false}
        zIndex={zIndex}
        dropDownContainerStyle={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
        placeholder={placeholderValue}
        placeholderStyle={styles.placeholderStyles}
        labelStyle={{ color: colors.text, fontFamily: appFonts.medium }}
        textStyle={{ color: colors.text }}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
          nestedScrollEnabled: true,
        }}
          ArrowDownIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '-90deg' }] }]}>
                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '90deg' }] }]}>

                                <Icons.Back color={colors.text} />
                            </View>
                        )}
      />
    </View>
  )
}
