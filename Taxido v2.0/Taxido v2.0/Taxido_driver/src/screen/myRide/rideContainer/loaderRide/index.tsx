import React from 'react'
import { View } from 'react-native'
import { useValues } from '../../../../utils/context'
import { useTheme } from '@react-navigation/native'
import styles from './styles'
import { windowHeight, windowWidth } from '../../../../theme/appConstant'
import ContentLoader, { Circle, Rect } from 'react-content-loader/native'
import appColors from '../../../../theme/appColors'
import { SkeletonAppPage } from '../../../settings/appSettings/component'

export function LoaderRide() {
  const { isDark } = useValues()
  const { colors } = useTheme()

  return (
    <View style={[styles.container]}>
      <View
        style={[
          styles.rideInfoContainer,
          {
            backgroundColor: isDark ? colors.card : appColors.white,
            borderColor: colors.border,
          },
        ]}
      >
        <ContentLoader
          speed={2}
          width={windowWidth(90)}
          height={windowHeight(37)}
          backgroundColor={
            isDark ? appColors.bgDark : appColors.loaderBackground
          }
          foregroundColor={
            isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight
          }
        >
          <Circle
            cx={windowWidth(6.7)}
            cy={windowHeight(3.4)}
            r={windowWidth(5.8)}
          />
          <Rect
            x={windowWidth(17)}
            y={windowHeight(2)}
            width={windowWidth(40)}
            height={windowHeight(2.5)}
            rx={0}
          />
          <Circle
            cx={windowWidth(69)}
            cy={windowHeight(3)}
            r={windowWidth(4.5)}
          />
          <Circle
            cx={windowWidth(80)}
            cy={windowHeight(3)}
            r={windowWidth(4.5)}
          />

          <Rect
            x={windowWidth(1)}
            y={windowHeight(14.8)}
            width={windowWidth(60)}
            height={windowHeight(2.3)}
            rx={0}
          />
          <Rect
            x={windowWidth(1)}
            y={windowHeight(18.5)}
            width={windowWidth(80)}
            height={windowHeight(2.3)}
            rx={0}
          />
          <Rect
            x={windowWidth(1)}
            y={windowHeight(22.8)}
            width={windowWidth(82.3)}
            height={windowHeight(10.3)}
            rx={0}
          />
        </ContentLoader>
        <View style={styles.loaderApp}>
          <SkeletonAppPage />
        </View>
      </View>
      <View
        style={[
          styles.rideInfoContainer1,
          {
            backgroundColor: isDark ? colors.card : appColors.white,
            borderColor: colors.border,
          },
        ]}
      >
        <ContentLoader
          speed={2}
          width={windowWidth(90)}
          height={windowHeight(10)}
          backgroundColor={
            isDark ? appColors.bgDark : appColors.loaderBackground
          }
          foregroundColor={
            isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight
          }
        >
          <Rect
            x={windowWidth(1)}
            y={windowHeight(0.3)}
            width={windowWidth(72)}
            height={windowHeight(2.5)}
            rx={0}
          />
          <Rect
            x={windowWidth(1)}
            y={windowHeight(4.3)}
            width={windowWidth(82)}
            height={windowHeight(2.3)}
            rx={0}
          />
        </ContentLoader>
      </View>
    </View>
  )
}
