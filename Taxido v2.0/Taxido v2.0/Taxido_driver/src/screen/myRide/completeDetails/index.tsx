import { View } from 'react-native'
import React from 'react'
import { Header, Button } from '../../../commonComponents'
import { Details } from '../component'
import appColors from '../../../theme/appColors'
import styles from './styles'
import { useSelector } from 'react-redux'

export function CompleteDetails() {
  const { translateData } = useSelector((state: any) => state.setting)

  return (
    <View style={styles.main}>
      <Header title={translateData.titleCompletedRide} />
      <Details />
      <View style={styles.buttonView}>
        <Button
          backgroundColor={appColors.invoiceBtn}
          color={appColors.black}
          title={translateData.downloadInvoice}
        />
      </View>
    </View>
  )
}
