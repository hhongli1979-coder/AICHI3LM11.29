import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Icons from '../../../../../utils/icons/icons'
import styles from './styles'
import { useValues } from '../../../../../utils/context'
import { useNavigation, useTheme } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../../navigation/main/types'
import { useSelector } from 'react-redux'

type navigation = NativeStackNavigationProp<RootStackParamList>

export function SettingHeader() {
  const { colors } = useTheme()
  const { viewRtlStyle } = useValues()
  const { navigate } = useNavigation<navigation>()
  const { translateData } = useSelector((state: any) => state.setting)

  const gotoNotification = () => {
    navigate('Notification')
  }
  const myWallet = () => {
    navigate('MyWallet')
  }

  return (
    <View
      style={[
        styles.main,
        { backgroundColor: colors.card, flexDirection: viewRtlStyle },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {translateData.settings}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={gotoNotification}
          style={[styles.iconView, { borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Icons.Notification color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={myWallet}
          style={[styles.iconView, { borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Icons.WalletSetting color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
