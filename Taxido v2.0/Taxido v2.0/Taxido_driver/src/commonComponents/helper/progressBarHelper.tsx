import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import appColors from '../../theme/appColors';

export function ProgressBar({ onComplete }) {
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 30000,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished && onComplete) {
                onComplete();
            }
        });
    }, []);

    const widthInterpolated = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 5,
        backgroundColor: appColors.loader,
        overflow: 'hidden',
        borderRadius: 5,
    },
    progressBar: {
        height: '100%',
        backgroundColor: appColors.primary,
    },
});

