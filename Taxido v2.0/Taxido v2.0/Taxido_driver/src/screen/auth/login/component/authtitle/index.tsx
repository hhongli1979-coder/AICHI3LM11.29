import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native'
import { useValues } from '../../../../../utils/context'
import styles from '../loginView/styles'
import { LineAnimation } from '../animationLine'

interface AuthTitleProps {
  title: string;
  subTitle?: string;
}

export function AuthTitle({ title, subTitle }: AuthTitleProps) {
  const { colors } = useTheme()
  const { textRtlStyle } = useValues()

  return (
    <View style={styles.container}>
      <LineAnimation />
      <Text
        style={[
          styles.mainTitle,
          { color: colors.text, textAlign: textRtlStyle },
        ]}
      >
        {title}
      </Text>
      <Text style={[styles.subTitle, { textAlign: textRtlStyle }]}>
        {subTitle}
      </Text>
    </View>
  )
}
