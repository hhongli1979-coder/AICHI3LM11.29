import { View, Text } from 'react-native'
import React from 'react'
import { Switch } from '../'
import styles from '../darkTheme/styles'
import Icons from '../../../../../utils/icons/icons'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'

export function Rtl() {
  const { colors } = useTheme()
  const { viewRtlStyle, setRtl, rtl } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)

  AsyncStorage.getItem('selectedLanguage')
    .then(selectedLanguage => {
      if (selectedLanguage !== null) {
      } else {
      }
    })
    .catch(error => {
    })

  const onRtl = () => {
    setRtl(prevState => !prevState)
    AsyncStorage.setItem('rtl', JSON.stringify(!rtl))
  }

  return (
    <View>
      <View style={[styles.main, { flexDirection: viewRtlStyle }]}>
        <View style={[styles.container, { flexDirection: viewRtlStyle }]}>
          <View
            style={[styles.iconView, { backgroundColor: colors.background }]}
          >
            <Icons.Rtl color={colors.text} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            {translateData.rtl}
          </Text>
        </View>
        <Switch switchOn={rtl} onPress={onRtl} background={colors.background} />
      </View>
    </View>
  )
}
