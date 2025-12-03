import React, { useRef, useCallback } from 'react';
import { View, Animated, PanResponder } from 'react-native';
import FastImage from 'react-native-fast-image';
import Gifs from '../../utils/gifs/gifs';
import { windowWidth } from '../../theme/appConstant';
import { useFocusEffect } from "@react-navigation/native";
import styles from './styles';

const CustomSlider = ({ buttonText = 'Slide to Start', onSwipeSuccess = () => { }, buttonWidth = 280, buttonHeight = 60, sliderSize = 50, leftPadding = 10, rightPadding = 20 }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const textTranslateX = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(1)).current;
    const maxSlide = buttonWidth - sliderSize - rightPadding;

    const resetButton = useCallback(() => {
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
    }, [translateX, textTranslateX, textOpacity]);

    const handleSwipeSuccess = () => {
        onSwipeSuccess();
        Animated.timing(translateX, {
            toValue: maxSlide,
            duration: 200,
            useNativeDriver: false,
        }).start();

        Animated.timing(textTranslateX, {
            toValue: maxSlide * 0.6,
            duration: 200,
            useNativeDriver: false,
        }).start();

        Animated.timing(textOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    useFocusEffect(
        useCallback(() => {
            resetButton();
        }, [resetButton])
    );

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            const newValue = Math.min(Math.max(0, gesture.dx), maxSlide);
            translateX.setValue(newValue);
            textTranslateX.setValue(newValue * 0.6);
            textOpacity.setValue(1 - newValue / maxSlide);
        },
        onPanResponderRelease: (_, gesture) => {
            if (gesture.dx > maxSlide - 10) {
                handleSwipeSuccess();
            } else {
                resetButton();
            }
        },
    });

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.swipeButton,
                    {
                        width: buttonWidth,
                        height: buttonHeight,
                        borderRadius: windowWidth(1.8),
                    },
                ]}
            >
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
                    style={[
                        styles.slider,
                        {
                            width: sliderSize,
                            height: sliderSize,
                            borderRadius: windowWidth(1.8),
                            left: leftPadding,
                            transform: [{ translateX }],
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <FastImage
                        source={Gifs.ActiveRideGo}
                        style={{
                            width: sliderSize + 10,
                            height: sliderSize + 10,
                        }}
                    />
                </Animated.View>
            </View>
        </View>
    );
};

export default CustomSlider;