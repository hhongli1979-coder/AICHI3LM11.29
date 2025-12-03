import React from 'react'
import { View } from 'react-native'
import ContentLoader, { Rect } from 'react-content-loader/native'
import { windowHeight, windowWidth } from '../../../../theme/appConstant'
import { useValues } from '../../../../utils/context'
import appColors from '../../../../theme/appColors'
import styles from './styles'

export function LoaderStatus() {
  const { isDark } = useValues()

  return (
    <View style={styles.container}>
      {[...Array(4)].map((_, index) => (
        <ContentLoader
          key={index}
          speed={1}
          width={windowWidth(20)}
          height={windowHeight(7)}
          backgroundColor={
            isDark ? appColors.bgDark : appColors.loaderBackground
          }
          foregroundColor={
            isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight
          }
        >
          <Rect
            x="0"
            y="0"
            rx="0"
            ry="0"
            width={windowWidth(20)}
            height={windowHeight(3.5)}
          />
        </ContentLoader>
      ))}
    </View>
  )
}
