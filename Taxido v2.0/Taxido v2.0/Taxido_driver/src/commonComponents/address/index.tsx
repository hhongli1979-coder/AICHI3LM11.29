import { View, Image } from 'react-native'
import React from 'react'
import styles from './styles'
import images from '../../utils/images/images'
import { AddressData } from '..'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../utils/context'

interface AddressDataProps {
  color?: string
  rideDetails?: string
}

export function Address({ color, rideDetails }: AddressDataProps) {
  const { colors } = useTheme()
  const { viewRtlStyle } = useValues()

  return (
    <View>
      <View style={[styles.direction, { flexDirection: viewRtlStyle }]}>
        <Image source={images.line} style={styles.lineImage} />
        <Image source={images.line} style={styles.lineImage} />
      </View>
      <View
        style={[
          styles.addressbox,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <AddressData
          color={color}
          locationDetails={rideDetails?.locations}
          rideDetails={rideDetails}
        />
      </View>
    </View>
  )
}
