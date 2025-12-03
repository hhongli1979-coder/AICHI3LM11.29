import { useTheme } from '@react-navigation/native'
import React from 'react'
import { View, Text } from 'react-native'
import { BackButton } from '../backButtonHeader'
import { useValues } from '../../utils/context'
import styles from './styles'

interface HeaderProps {
  title?: string
  backgroundColor?: string
}

export function Header({
  title,
  backgroundColor,
}: HeaderProps): React.ReactElement {
  const { colors } = useTheme()
  const { viewRtlStyle } = useValues()

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: backgroundColor ? backgroundColor : colors.card,
          flexDirection: viewRtlStyle,
        },
      ]}
    >
      <BackButton />
      <View style={styles.headerTitle}>
        <Text style={[styles.activeRide, { color: colors.text }]}>{title}</Text>
      </View>
    </View>
  )
}
