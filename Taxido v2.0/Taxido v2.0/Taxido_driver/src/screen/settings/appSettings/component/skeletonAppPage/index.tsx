import React from 'react'
import { View } from 'react-native'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import styles from './styles'
import { useValues } from '../../../../../utils/context'
import appColors from '../../../../../theme/appColors'
import { windowWidth } from '../../../../../theme/appConstant'

export function SkeletonAppPage() {
  const { isDark } = useValues()
  const commonY = styles.icon.height / 2 + styles.main.marginVertical

  return (
    <View>
      <ContentLoader
        speed={1}
        width={windowWidth(90)}
        height={styles.icon.height + styles.main.marginVertical * 2}
        backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
        foregroundColor={
          isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight
        }
      >
        <Circle
          cx={styles.main.marginHorizontal + styles.icon.width / 2}
          cy={commonY}
          r={styles.icon.width / 2}
        />

        <Rect
          x={
            styles.main.marginHorizontal +
            styles.icon.width +
            styles.title.marginHorizontal
          }
          y={commonY - styles.title.height / 2}
          width={styles.title.width}
          height={styles.title.height}
          rx={0}
          ry={0}
        />

        <Rect
          x={windowWidth(85) - styles.switch.width + 10}
          y={commonY - styles.switch.height / 2}
          width={styles.switch.width}
          height={styles.switch.height}
          rx={0}
          ry={0}
        />
      </ContentLoader>
    </View>
  )
}
