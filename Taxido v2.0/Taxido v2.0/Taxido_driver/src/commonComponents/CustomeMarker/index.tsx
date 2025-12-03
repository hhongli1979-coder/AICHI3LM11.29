import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';

type imageurlProps = {
    imageUrl: any
}

export function CustomMarker({ imageUrl }: imageurlProps) {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: imageUrl }}
                style={styles.markerImage}
                resizeMode="contain"
            />
        </View>
    );
};

