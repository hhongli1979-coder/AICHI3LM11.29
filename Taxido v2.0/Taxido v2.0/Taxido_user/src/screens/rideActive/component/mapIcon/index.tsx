import { View } from 'react-native'
import React from 'react'
import { Target, Shield } from '@utils/icons'
import styles from './styles'
import { useValues } from '@src/utils/context/index';

export function MapIcon() {
    const { viewSelfRTLStyle } = useValues();
    return (
        <View style={[styles.iconMapContainer, { alignContent: viewSelfRTLStyle }]}>
            <View style={[styles.target, { alignSelf: viewSelfRTLStyle }]} >
                <Target />
            </View>
            <View style={[styles.shield, { alignSelf: viewSelfRTLStyle }]} >
                <Shield />
            </View>
        </View>
    )
}
