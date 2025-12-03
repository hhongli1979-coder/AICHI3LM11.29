import React from 'react'
import { View } from 'react-native'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import { useValues } from '../../../utils/context'
import { useTheme } from '@react-navigation/native'
import { windowHeight, windowWidth } from '../../../theme/appConstant'
import styles from './styles'
import appColors from '../../../theme/appColors'

export function NotificationLoader() {
  const { viewRtlStyle, isDark } = useValues()
  const { colors } = useTheme()

  return (
    <View
      style={[
        styles.mainContainer,
        {
          flexDirection: viewRtlStyle === 'rtl' ? 'row-reverse' : 'row',
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
      ]}
    >
      <ContentLoader
        speed={1.5}
        width={windowWidth(90)}
        height={windowHeight(8.7)}
        backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
        foregroundColor={
          isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight
        }
      >
        <Circle
          cx={windowWidth(5)}
          cy={windowHeight(2.6)}
          r={windowHeight(2.5)}
        />
        <Rect
          x={windowWidth(13)}
          y={windowHeight(0.5)}
          width={windowWidth(30)}
          height={windowHeight(1.9)}
          rx={0}
        />
        <Rect
          x={windowWidth(13)}
          y={windowHeight(3)}
          width={windowWidth(64)}
          height={windowHeight(1.9)}
          rx={0}
        />
        <Rect
          x={windowWidth(13)}
          y={windowHeight(7.3)}
          width={windowWidth(20)}
          height={windowHeight(1.5)}
          rx={0}
        />
      </ContentLoader>
    </View>
  )
}
