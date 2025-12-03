import React from 'react'
import { windowHeight, windowWidth } from '../../../../theme/appConstant'
import appColors from '../../../../theme/appColors'
import ContentLoader, { Circle, Rect } from 'react-content-loader/native'
import { useValues } from '../../../../utils/context'

export function SkeletonEditProfile() {
  const { isDark } = useValues()
  return (
    <ContentLoader
      speed={1}
      width={windowWidth(90)}
      height={windowHeight(40)}
      backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
      foregroundColor={
        isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight
      }
    >
      <Circle cx={windowWidth(45)} cy={windowHeight(8)} r={windowWidth(10)} />

      <Rect
        x={windowWidth(5)}
        y={windowHeight(16)}
        width={windowWidth(82)}
        height={windowHeight(5.5)}
        rx={0}
        ry={0}
      />
      <Rect
        x={windowWidth(5)}
        y={windowHeight(24)}
        width={windowWidth(15)}
        height={windowHeight(5.5)}
        rx={0}
        ry={0}
      />
      <Rect
        x={windowWidth(25)}
        y={windowHeight(24)}
        width={windowWidth(62)}
        height={windowHeight(5.5)}
        rx={0}
        ry={0}
      />
      <Rect
        x={windowWidth(5)}
        y={windowHeight(32)}
        width={windowWidth(82)}
        height={windowHeight(5.5)}
        rx={0}
        ry={0}
      />
    </ContentLoader>
  )
}
