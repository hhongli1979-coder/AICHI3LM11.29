import React, { useRef } from 'react'
import { View, StyleSheet, Animated, PanResponder } from 'react-native'
import { windowHeight, windowWidth, fontSizes } from '../../theme/appConstant'
import appColors from '../../theme/appColors'
import appFonts from '../../theme/appFonts'
import Gifs from '../../utils/gifs/gifs'
import FastImage from "react-native-fast-image";
import { useAppNavigation } from '../../utils/navigation'

const BUTTON_WIDTH = windowWidth(110) * 0.85
const BUTTON_HEIGHT = windowHeight(7.6)
const SLIDER_SIZE = BUTTON_HEIGHT - 10
const LEFT_PADDING = windowWidth(1.5)
const RIGHT_PADDING = windowWidth(3)
const MAX_SLIDE = BUTTON_WIDTH - SLIDER_SIZE - RIGHT_PADDING

const SwipeButton = ({ buttonText }: any) => {
  const translateX = useRef(new Animated.Value(0)).current
  const textTranslateX = useRef(new Animated.Value(0)).current
  const textOpacity = useRef(new Animated.Value(1)).current
  const { navigate } = useAppNavigation()

  const resetButton = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start()

    Animated.timing(textTranslateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start()

    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  const onSwipeSuccess = () => {
    navigate('MyRide')

    Animated.timing(translateX, {
      toValue: MAX_SLIDE,
      duration: 200,
      useNativeDriver: false,
    }).start()

    Animated.timing(textTranslateX, {
      toValue: MAX_SLIDE * 0.6,
      duration: 200,
      useNativeDriver: false,
    }).start()

    Animated.timing(textOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start()

    setTimeout(resetButton, 1000)
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      let newValue = Math.min(Math.max(0, gesture.dx), MAX_SLIDE)
      translateX.setValue(newValue)
      textTranslateX.setValue(newValue * 0.6)

      let newOpacity = 1 - newValue / MAX_SLIDE
      textOpacity.setValue(newOpacity)
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > MAX_SLIDE - 10) {
        onSwipeSuccess()
      } else {
        resetButton()
      }
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.swipeButton}>
        <Animated.Text
          style={[
            styles.swipeText,
            {
              transform: [{ translateX: textTranslateX }],
              opacity: textOpacity,
            },
          ]}
        >
          {buttonText}
        </Animated.Text>

        <Animated.View
          style={[styles.slider, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        >
          <FastImage source={Gifs.ActiveRideGo} style={styles.activeRideGo} />
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  swipeButton: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: windowHeight(1.3),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: appColors.value,
  },
  swipeText: {
    color: appColors.primary,
    fontSize: fontSizes.FONT4,
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    fontFamily: appFonts.medium,
  },
  slider: {
    width: windowHeight(6),
    height: windowHeight(6),
    borderRadius: windowHeight(0.8),
    backgroundColor: appColors.white,
    position: 'absolute',
    left: LEFT_PADDING,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: appColors.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  activeRideGo: {
    width: windowHeight(8),
    height: windowHeight(8),
  },
})

export default SwipeButton
