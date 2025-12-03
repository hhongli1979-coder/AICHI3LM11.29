import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import styles from './styles'
import Icons from '../../../../../utils/icons/icons'
import appColors from '../../../../../theme/appColors'
import { useValues } from '../../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import { useSelector } from 'react-redux'

export function List({ walletTypedata }: any) {
  const { colors } = useTheme()
  const { viewRtlStyle, textRtlStyle } = useValues()
  const { zoneValue } = useSelector((state: any) => state.zoneUpdate)

  return (
    <View
      style={[
        styles.dataView,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {walletTypedata?.map((data: any, index: number) => (
          <View key={index}>
            <View style={[styles.list, { flexDirection: viewRtlStyle }]}>
              <View style={{ flexDirection: viewRtlStyle }}>
                <View
                  style={[
                    styles.receiptView,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Icons.Receipt color={colors.text} />
                </View>
                <View style={styles.detailView}>
                  <Text
                    style={[
                      styles.id,
                      { color: colors.text, textAlign: textRtlStyle },
                    ]}
                  >
                    {data.detail.length > 50 ? `${data.detail.slice(0, 50)}...` : data.detail}
                  </Text>
                </View>
              </View>

              <View
                style={[styles.amountView, { flexDirection: viewRtlStyle }]}
              >
                <View style={styles.icons}>
                  {data.type === 'debit' ? <Icons.Send /> : <Icons.Recived />}
                </View>
                <Text
                  style={[
                    styles.amount,
                    {
                      color:
                        data.type === 'debit' ? appColors.red : appColors.price,
                    },
                  ]}
                >
                  {zoneValue?.currency_symbol}
                  {(zoneValue?.exchange_rate * data.amount).toFixed(2)}
                </Text>
              </View>
            </View>
            {index !== walletTypedata.length - 1 && (
              <View style={[styles.dash, { borderColor: colors.border }]} />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
