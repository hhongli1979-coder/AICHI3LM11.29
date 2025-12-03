import { View, Text } from 'react-native'
import React from 'react'
import styles from './styles'
import { useSelector } from 'react-redux'

export function Review() {
    const { translateData } = useSelector((state: any) => state.setting)

    return (
        <View style={styles.main}>
            <Text style={styles.title}>{translateData.customerRatingReviews}</Text>
        </View>
    )
}
