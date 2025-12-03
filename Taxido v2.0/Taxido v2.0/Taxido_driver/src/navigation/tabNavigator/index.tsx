import React, { useMemo, useCallback } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Home } from '../../screen/home'
import { MyRide, Settings } from '../../screen'
import { Text, TouchableOpacity, Vibration } from 'react-native'
import appColors from '../../theme/appColors'
import Icons from '../../utils/icons/icons'
import styles from './styles'
import { useSelector } from 'react-redux'
import { useValues } from '../../utils/context'
import { DashBoard } from '../../screen/dashBoard'
import { FleetDashBoard, FleetHome } from '../../screen/fleet'

const Tab = createBottomTabNavigator()

const TabLabel = React.memo(({ focused, label, rtl }: { focused: boolean; label: string; rtl: boolean }) => (
  <Text
    style={[
      styles.tabBarLabelStyle,
      {
        color: focused ? appColors.white : appColors.categoryTitle,
        textAlign: rtl ? 'right' : 'left',
        writingDirection: rtl ? 'rtl' : 'ltr',
      },
    ]}
  >
    {label}
  </Text>
))

const TabIcon = React.memo(({ Icon, focused }: { Icon: any; focused: boolean }) => (
  <Icon color={focused ? appColors.white : appColors.categoryTitle} />
))

export default function App() {
  const { translateData } = useSelector((state: any) => state.setting)
  const { rtl } = useValues()
  const { selfDriver } = useSelector((state: any) => state.account)

  const defaultTranslations = useMemo(() => ({
    home: 'Home',
    activeRide: 'DashBoard',
    myRide: 'My Ride',
    settings: 'Settings',
  }), [])

  const t = translateData || defaultTranslations
  const type = selfDriver?.role

  const screens = useMemo(() => {
    return type === 'driver'
      ? [
        {
          name: 'Home',
          component: Home,
          icon: Icons.Home,
          label: t.home,
        },
        {
          name: 'DashBoard',
          component: DashBoard,
          icon: Icons.DashBoard,
          label: translateData?.dashboard,
        },
        {
          name: 'My Ride',
          component: MyRide,
          icon: Icons.Car,
          label: t.myRide,
        },
        {
          name: 'Settings',
          component: Settings,
          icon: Icons.Setting,
          label: t.settings,
        },
      ]
      : [
        {
          name: 'Home',
          component: FleetHome,
          icon: Icons.Home,
          label: t.home,
        },
        {
          name: 'DashBoard',
          component: DashBoard,
          icon: Icons.DashBoard,
          label: translateData?.dashboard,
        },
        {
          name: 'FleetDashBoard',
          component: FleetDashBoard,
          icon: Icons.DriverTab,
          label: translateData?.drivers,
        },
        {
          name: 'Settings',
          component: Settings,
          icon: Icons.Setting,
          label: t.settings,
        },
      ]
  }, [type, t.home, t.myRide, t.settings, translateData?.dashboard])

  // Memoize ordered screens to prevent unnecessary array operations
  const orderedScreens = useMemo(() => {
    return rtl ? [...screens].reverse() : screens
  }, [rtl, screens])

  // Memoized vibration handler
  const handleTabPress = useCallback((onPress: () => void) => {
    Vibration.vibrate(42)
    onPress()
  }, [])

  // Memoize screen options to prevent recreation on every render
  const screenOptions = useMemo(() => ({
    tabBarStyle: styles.tabBarContainer,
    headerShown: false,
  }), [])

  return (
    <Tab.Navigator
      initialRouteName='Home'
      detachInactiveScreens={false}
      screenOptions={screenOptions}
    >
      {orderedScreens.map(({ name, component, icon: Icon, label }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            unmountOnBlur: false,
            lazy: true,
            tabBarIcon: ({ focused }) => <TabIcon Icon={Icon} focused={focused} />,
            tabBarButton: (props: any) => (
              <TouchableOpacity
                {...props}
                onPress={() => handleTabPress(props.onPress)}
              />
            ),
            tabBarLabel: ({ focused }) => <TabLabel focused={focused} label={label} rtl={rtl} />,
          }}
        />
      ))}
    </Tab.Navigator>
  )
}
