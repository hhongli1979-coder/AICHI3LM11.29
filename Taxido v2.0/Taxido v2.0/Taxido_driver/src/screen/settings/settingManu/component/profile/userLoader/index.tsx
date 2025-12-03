import React from 'react'
import { useValues } from '../../../../../../utils/context'
import { View } from 'react-native'
import ContentLoader, { Rect, Circle } from 'react-content-loader/native'
import styles from './styles'
import appColors from '../../../../../../theme/appColors'

export function UserContainerLoader() {
  const { isDark } = useValues()

  return (
    <View>
      <ContentLoader
        speed={1}
        width="100%"
        height={
          styles.walletContain.height +
          styles.detainContain.marginVertical * 2 +
          styles.profileImage.height
        }
        backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
        foregroundColor={
          isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight
        }
      >
        <Circle
          cx={
            styles.detainContain.marginHorizontal +
            styles.profileImage.width / 2
          }
          cy={
            styles.profileImage.height / 2 + styles.detainContain.marginVertical
          }
          r={styles.profileImage.width / 2}
        />

        <Rect
          x={
            styles.profileImage.width +
            styles.detainContain.marginHorizontal * 2
          }
          y={styles.detainContain.marginVertical + styles.details.top}
          width={styles.name.width}
          height={styles.name.height}
          rx={0}
          ry={0}
        />

        <Rect
          x={styles.walletContain.marginHorizontal}
          y={
            styles.profileImage.height + styles.detainContain.marginVertical * 2
          }
          width={styles.walletContain.width}
          height={styles.walletContain.height}
          rx={0}
          ry={0}
        />
      </ContentLoader>
    </View>
  )
}
