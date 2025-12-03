import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icons from '../../../../../utils/icons/icons'
import styles from './styles'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'
import appColors from '../../../../../theme/appColors'

export function LanguageModal({ openSheet, tempSelectedLanguage }: any) {
  const { colors } = useTheme()
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const { viewRtlStyle, setRtl, rtl, isDark } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)

  useEffect(() => {
    (async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('selectedLanguage')
        const rtlValue = await AsyncStorage.getItem('rtl')

        if (storedLanguage) {
          setSelectedLanguage(storedLanguage)
        }

        if (rtlValue !== null) {
          setRtl(JSON.parse(rtlValue))
        } else {
          setRtl(storedLanguage === 'ar')
        }

      } catch (error) {
      }
    })()
  }, [])




  return (
    <View>
      <View style={[styles.border, { borderColor: colors.border }]} />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={openSheet}
        style={[styles.main, { flexDirection: viewRtlStyle }]}
      >
        <View style={[styles.container, { flexDirection: viewRtlStyle }]}>
          <View
            style={[styles.iconView, { backgroundColor: colors.background }]}
          >
            <Icons.Language color={colors.text} />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              {translateData.changeLanguage}
            </Text>
            <Text style={[styles.modalTitle, { textAlign: rtl ? 'right' : 'left' }, { color: isDark ? appColors.darkText : appColors.secondaryFont }]}>{tempSelectedLanguage}</Text>
          </View>
        </View>
        <Icons.NextLarge color={appColors.iconColor} />

      </TouchableOpacity>

    </View>
  )
}





