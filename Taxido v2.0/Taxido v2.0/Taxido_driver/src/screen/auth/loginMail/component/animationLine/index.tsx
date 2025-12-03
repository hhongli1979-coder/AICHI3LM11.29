import { View, StyleSheet } from 'react-native'
import React from 'react'
import { windowHeight, windowWidth } from '../../../../../theme/appConstant'
import FastImage from 'react-native-fast-image'
import Gifs from '../../../../../utils/gifs/gifs'

export function LineAnimation() {
  return (
    <View style={[styles.container]}>
      <FastImage source={Gifs.lineAnimation} style={styles.image}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: windowHeight(2),
    width: windowWidth(6),
  },
  image: {
    width: windowWidth(30),
    height: windowHeight(12),
    transform: [{ rotate: '-90deg' }],
    resizeMode: 'contain',
  },
})
