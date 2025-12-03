import React from 'react'
import { View } from 'react-native'
import { useValues } from '../../../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import styles from './styles'
import { windowHeight, windowWidth } from '../../../../../../theme/appConstant'
import appColors from '../../../../../../theme/appColors'

export function SkeletonWallet() {
  const { isDark } = useValues()
  const { colors } = useTheme()

  return (
    <View
      style={[
        styles.dataView,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <ContentLoader
        speed={2}
        width={windowWidth(90)}
        height={windowHeight(8)}
        backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
        foregroundColor={
          isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight
        }
      >
        <Circle cx={windowWidth(10)} cy={windowHeight(4)} r={windowWidth(5)} />
        <Rect
          x={windowWidth(18)}
          y={windowHeight(2.6)}
          width={windowWidth(40)}
          height={windowHeight(2.5)}
          rx={0}
        />

        <Rect
          x={windowWidth(73)}
          y={windowHeight(2.6)}
          width={windowWidth(15)}
          height={windowHeight(2.5)}
          rx={0}
        />
      </ContentLoader>
    </View>
  )
}
