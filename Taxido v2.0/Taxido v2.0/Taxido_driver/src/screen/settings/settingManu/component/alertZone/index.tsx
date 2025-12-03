import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icons from '../../../../../utils/icons/icons'
import appColors from '../../../../../theme/appColors'
import appFonts from '../../../../../theme/appFonts'
import styles from './styles'
import { ListItem } from '../'
import { useValues } from '../../../../../utils/context'
import { useSelector } from 'react-redux'
import { fontSizes, windowHeight } from '../../../../../theme/appConstant'
import { useTheme } from '@react-navigation/native'


export function AlertZone({ openSheet, openLogoutSheet }: any) {
  const { textRtlStyle } = useValues()
  const { translateData } = useSelector((state: any) => state.setting)
  const { colors } = useTheme()

  return (
    <>
      <Text
        style={[
          styles.title,
          {
            textAlign: textRtlStyle,

          },
          { color: colors.text, textAlign: textRtlStyle },
        ]}
      >
        {translateData.alertZone}
      </Text>

      <View style={[styles.main, { backgroundColor: colors.card, borderColor: colors.border },]}>
        <ListItem
          icon={<Icons.Delete />}
          text={translateData.deleteAccount}
          backgroundColor={appColors.alertIconBg}
          color={appColors.red}
          onPress={openSheet}
        />
      </View>

      <TouchableOpacity
        onPress={openLogoutSheet}
        style={{
          width: '100%',
          alignItems: 'center',
          marginTop: windowHeight(1),
        }}
      >
        <Text
          style={{
            color: appColors.primary,
            fontFamily: appFonts.medium,
            fontSize: fontSizes.FONT4HALF,
            marginVertical: windowHeight(0.8),
          }}
        >
          {translateData.logout}
        </Text>
      </TouchableOpacity>
    </>
  )
}