import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import styles from './styles'
import commanStyle from '../../../style/commanStyles'
import { Review, Payment, Bill, TaxiDetails } from './component'
import { Address, Header } from '../../../commonComponents'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../utils/context'
import { useSelector } from 'react-redux'

export function EndRide() {
  const { colors } = useTheme()
  const { viewRtlStyle } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)

  return (
    <ScrollView
      style={[styles.main, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Header title={translateData.completeRides} />
      <View style={[styles.contain, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.box,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.profile, { flexDirection: viewRtlStyle }]}>
            <View
              style={[
                commanStyle.containerBtn,
                { flexDirection: viewRtlStyle },
              ]}
            >
              <Text style={styles.status}>● {translateData.complete}</Text>
            </View>
          </View>
          <TaxiDetails />
        </View>
        <Address />
        <Review />
        <Bill />
        <Payment />
      </View>
    </ScrollView>
  )
}
