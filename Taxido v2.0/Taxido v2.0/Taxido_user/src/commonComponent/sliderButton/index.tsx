import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import Images from "@src/utils/images";
import { useAppNavigation } from "@src/utils/navigation";
import React, { useRef } from "react";
import { View, StyleSheet, Animated, PanResponder } from "react-native";
import FastImage from "react-native-fast-image";

const BUTTON_WIDTH = windowWidth(510) * 0.85;
const BUTTON_HEIGHT = windowHeight(47);
const SLIDER_SIZE = BUTTON_HEIGHT - 14.3;
const LEFT_PADDING = windowWidth(9);
const RIGHT_PADDING = windowWidth(12);
const MAX_SLIDE = BUTTON_WIDTH - SLIDER_SIZE - RIGHT_PADDING;

const SwipeButton = ({ buttonText }: any) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const { navigate }: any = useAppNavigation();

  const resetButton = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(textTranslateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onSwipeSuccess = () => {
    navigate("RideScreen");

    Animated.timing(translateX, {
      toValue: MAX_SLIDE,
      duration: 200,
      useNativeDriver: false,
    }).start();


    Animated.timing(textTranslateX, {
      toValue: MAX_SLIDE * 0.6,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(textOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setTimeout(resetButton, 1000);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      let newValue = Math.min(Math.max(0, gesture.dx), MAX_SLIDE);
      translateX.setValue(newValue);
      textTranslateX.setValue(newValue * 0.6);

      let newOpacity = 1 - newValue / MAX_SLIDE;
      textOpacity.setValue(newOpacity);
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > MAX_SLIDE - 10) {
        onSwipeSuccess();
      } else {
        resetButton();
      }
    },
  });
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
          <FastImage source={Images.activeRideGo} style={styles.activeRideGo} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  swipeButton: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: windowHeight(6),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    backgroundColor: appColors.primary,
  },
  swipeText: {
    color: appColors.whiteColor,
    fontSize: fontSizes.FONT22,
    fontWeight: "bold",
    position: "absolute",
    textAlign: "center",
    width: "100%",
    fontFamily: appFonts.bold,
  },
  slider: {
    width: SLIDER_SIZE,
    height: SLIDER_SIZE,
    borderRadius: windowHeight(6),
    backgroundColor: appColors.thumbIcon,
    position: "absolute",
    left: LEFT_PADDING,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    shadowColor: appColors.blackColor,
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  activeRideGo: {
    width: windowHeight(50),
    height: windowHeight(35),
  },
});

export default SwipeButton;
