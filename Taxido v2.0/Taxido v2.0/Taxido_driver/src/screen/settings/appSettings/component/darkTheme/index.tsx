import { View, Text } from 'react-native'
import React from 'react'
import Icons from '../../../../../utils/icons/icons'
import { Switch } from '../'
import styles from './styles'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'

export function DarkTheme() {
  const { colors } = useTheme()
  const { isDark, setIsDark, viewRtlStyle } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)

  const onTheme = () => {
    setIsDark(prevState => !prevState)
    AsyncStorage.setItem('darkTheme', JSON.stringify(!isDark))
  }

  return (
    <View>
      <View style={[styles.main, { flexDirection: viewRtlStyle }]}>
        <View style={[styles.container, { flexDirection: viewRtlStyle }]}>
          <View
            style={[styles.iconView, { backgroundColor: colors.background }]}
          >
            <Icons.Theme color={colors.text} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{translateData.appPagesTheme}</Text>
        </View>
        <Switch
          switchOn={isDark}
          onPress={onTheme}
          background={colors.background}
        />
      </View>
      <View style={[styles.border, { borderColor: colors.border }]} />
    </View>
  )
}
