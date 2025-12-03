import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import SwitchToggle from 'react-native-switch-toggle'
import Icons from '../../../../utils/icons/icons'
import appColors from '../../../../theme/appColors'
import styles from './styles'
import images from '../../../../utils/images/images'
import { useNavigation, useTheme } from '@react-navigation/native'
import { useValues } from '../../../../utils/context'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/main/types'
import { windowWidth } from '../../../../theme/appConstant'
import { useSelector } from 'react-redux'

interface HeaderProps {
  isOn: boolean
  toggleSwitch: () => void
  setDriverModal: (value: boolean) => void
  driverModal: boolean
}
type navigation = NativeStackNavigationProp<RootStackParamList>

export function Header({ isOn, toggleSwitch, setDriverModal }: HeaderProps) {
  const { colors } = useTheme()
  const { viewRtlStyle } = useValues()
  const { navigate } = useNavigation<navigation>()
  const { translateData } = useSelector((state: any) => state.setting)
  const { selfDriver } = useSelector((state: any) => state.account)
  const { notificationList } = useSelector((state: any) => state.notification)


  return (
    <View style={styles.headerMain}>
      <View style={styles.headerMargin}>
        <View style={[styles.headerAlign, { flexDirection: viewRtlStyle }]}>
          <View style={[styles.headerTitle, { flexDirection: viewRtlStyle }]}>
            <Image source={images.splash} style={styles.logo} />
          </View>
          <View style={{ flexDirection: viewRtlStyle }}>
            {selfDriver?.fleet_manager?.name && (
              <TouchableOpacity
                style={[
                  styles.notificationIcon,
                  { marginHorizontal: windowWidth(4) },
                ]}
                activeOpacity={0.7}
                onPress={() => setDriverModal(true)}
              >
                <Icons.InfoDetails />
              </TouchableOpacity>
            )}

            {notificationList?.data?.length > 0 ? (
              <TouchableOpacity
                style={styles.notificationIcon}
                activeOpacity={0.7}
                onPress={() => navigate('Notification')}
              >
                <Icons.Notifications />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.notificationIcon}
                activeOpacity={0.7}
                onPress={() => navigate('Notification')}

              >
                <Icons.Notification color={appColors.white} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={[
            styles.switchContainer,
            { backgroundColor: colors.card, flexDirection: viewRtlStyle },
          ]}
        >
          <View style={{ flexDirection: viewRtlStyle, gap: 3 }}>
            <Text style={[styles.valueTitle, { color: colors.text }]}>
              {translateData.availableForRide}
            </Text>
            <Text
              style={[
                styles.valueTitle,
                { color: isOn ? appColors.price : appColors.red },
              ]}
            >
              {isOn
                ? `(${translateData.homeOnlineText})`
                : `(${translateData.homeOflineText})`}
            </Text>
          </View>
          <SwitchToggle
            switchOn={isOn}
            onPress={toggleSwitch}
            circleStyle={styles.switchCircle}
            backgroundColorOff={appColors.cardicon}
            backgroundColorOn={appColors.primary}
            circleColorOn={appColors.white}
            circleColorOff={appColors.primary}
            containerStyle={styles.containerStyle}
          />
        </View>
      </View>
    </View>
  )
}