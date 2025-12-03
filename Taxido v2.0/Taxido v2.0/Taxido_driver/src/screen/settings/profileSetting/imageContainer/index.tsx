import { Image, View, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import styles from '../styles'
import Icons from '../../../../utils/icons/icons'
import { useTheme } from '@react-navigation/native'
import { windowHeight } from '../../../../theme/appConstant'

export function ImageContainer({ data, openBottomSheet, imageUri }: any) {
  const { colors } = useTheme();
  const userName = data?.name || '';
  const firstLetter = userName.charAt(0).toUpperCase();


  return (
    <View style={{ marginTop: windowHeight(7) }}>
      <View style={[styles.profileImageView, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {imageUri ? (
          <Image style={styles.profileImage} source={{ uri: imageUri }} />
        ) : (
          <View style={styles.charImage}>
            <Text style={styles.firstLetter}>{firstLetter}</Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.editIconContainer, { borderColor: colors.border, backgroundColor: colors.card }]}
          onPress={openBottomSheet}  //  call parent function
        >
          <Icons.Camera />
        </TouchableOpacity>
      </View>
    </View>
  );
}
