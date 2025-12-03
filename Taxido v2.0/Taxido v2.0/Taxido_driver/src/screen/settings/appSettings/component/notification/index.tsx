import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Switch } from '../'
import styles from '../darkTheme/styles'
import Icons from '../../../../../utils/icons/icons'
import { useTheme, useNavigation } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../../navigation/main/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'

type navigation = NativeStackNavigationProp<RootStackParamList>

export function Notification() {
  const { colors } = useTheme()
  const { viewRtlStyle, notificationValue, setNotificationValues } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)
  const { navigate } = useNavigation<navigation>()

  useEffect(() => {
    const loadNotificationState = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('isNotificationOn')
        if (storedValue !== null) {
          setNotificationValues(storedValue === 'true')
        } else {
          setNotificationValues(true)
          await AsyncStorage.setItem('isNotificationOn', 'true')
        }
      } catch (error) {
      }
    }
    loadNotificationState()
  }, [])

  const onNotification = async () => {
    try {
      const newValue = !notificationValue
      setNotificationValues(newValue)
      await AsyncStorage.setItem('isNotificationOn', newValue.toString())
    } catch (error) {
    }
  }

  return (
    <View>
      <View style={[styles.main, { flexDirection: viewRtlStyle }]}>
        <View style={[styles.container, { flexDirection: viewRtlStyle }]}>
          <TouchableOpacity
            style={[styles.iconView, { backgroundColor: colors.background }]}
            activeOpacity={0.7}
            onPress={() => navigate('Notification')}
          >
            <Icons.Notification color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            {translateData.notification}
          </Text>
        </View>
        <Switch
          switchOn={notificationValue}
          onPress={onNotification}
          background={colors.background}
        />
      </View>
      <View style={[styles.border, { borderColor: colors.border }]} />
    </View>
  )
}
