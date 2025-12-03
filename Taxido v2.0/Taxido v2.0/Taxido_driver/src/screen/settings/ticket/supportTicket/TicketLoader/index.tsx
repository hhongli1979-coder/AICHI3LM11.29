import React from 'react'
import { View } from 'react-native'
import ContentLoader, { Rect } from 'react-content-loader/native'
import { useTheme } from '@react-navigation/native'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import appColors from '../../../../../theme/appColors'
import { useValues } from '../../../../../utils/context'

export function TicketLoader() {
  const { isDark } = useValues()
  const { colors } = useTheme()

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        paddingHorizontal: windowWidth(5),
        paddingBottom: windowHeight(3),
        borderRadius: windowHeight(0.9),
        marginHorizontal: windowWidth(4),
        marginTop: windowHeight(2),
        height: windowHeight(22),
      }}
    >
      <ContentLoader
        speed={1.5}
        width={windowWidth(90)}
        height={windowHeight(20.1)}
        backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
        foregroundColor={
          isDark ? appColors.darkThemeSub : appColors.loaderLightHighlight
        }
      >
        <Rect
          x={windowWidth(0)}
          y={windowHeight(2)}
          width={windowWidth(25)}
          height={windowHeight(2.3)}
          rx={0}
        />
        <Rect
          x={windowWidth(65)}
          y={windowHeight(2)}
          width={windowWidth(18)}
          height={windowHeight(2.3)}
          rx={0}
        />
        <Rect
          x={windowWidth(0)}
          y={windowHeight(5.5)}
          width={windowWidth(36)}
          height={windowHeight(2.3)}
          rx={0}
        />
        <Rect
          x={windowWidth(0)}
          y={windowHeight(10)}
          width={windowWidth(83)}
          height={windowHeight(2.3)}
          rx={0}
        />
        <Rect
          x={windowWidth(0)}
          y={windowHeight(13.3)}
          width={windowWidth(36)}
          height={windowHeight(2.3)}
          rx={0}
        />
        <Rect
          x={windowWidth(0)}
          y={windowHeight(18.1)}
          width={windowWidth(45)}
          height={windowHeight(2.3)}
          rx={0}
        />
        <Rect
          x={windowWidth(60)}
          y={windowHeight(18.1)}
          width={windowWidth(25)}
          height={windowHeight(2.3)}
          rx={0}
        />
      </ContentLoader>
    </View>
  )
}
