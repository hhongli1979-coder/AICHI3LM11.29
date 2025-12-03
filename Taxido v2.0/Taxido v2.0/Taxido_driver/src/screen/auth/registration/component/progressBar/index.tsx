import { View } from 'react-native'
import React from 'react'
import styles from './styles'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'
import appColors from '../../../../../theme/appColors'

interface FilledBarsProps {
  fill: number
}

export function ProgressBar({ fill }: FilledBarsProps) {
  const bars = Array(3).fill(0)
  const { colors } = useTheme()
  const { viewRtlStyle, isDark } = useValues()
  return (
    <View style={{ backgroundColor: isDark ? colors.card : appColors.white }}>
      <View style={[styles.container, { flexDirection: viewRtlStyle }]}>
        {bars?.map((_, index) => (
          <View
            key={index}
            style={[
              index < fill
                ? styles.filledBar
                : [
                  styles.emptyBar,
                  {
                    backgroundColor: isDark
                      ? appColors.darkFillBar
                      : appColors.subPrimary,
                  },
                ],
            ]}
          />
        ))}
      </View>
    </View>
  )
}
