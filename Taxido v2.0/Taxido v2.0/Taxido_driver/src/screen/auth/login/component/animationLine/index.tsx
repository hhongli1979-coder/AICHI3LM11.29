import { View } from 'react-native'
import React from 'react'
import { windowHeight } from '../../../../../theme/appConstant'
import { useValues } from '../../../../../utils/context'
import styles from './styles'
import Gifs from '../../../../../utils/gifs/gifs'
import FastImage from 'react-native-fast-image'

export function LineAnimation() {
  const { rtl } = useValues()

  return (
    <View
      style={[styles.container, { alignSelf: rtl ? 'flex-end' : 'flex-start' }]}
    >
      <FastImage
        style={[
          styles.image,
          { right: rtl ? windowHeight(2) : windowHeight(0.5) },
        ]}
        source={Gifs.lineAnimation}
      />
    </View>
  )
}
