import { View, Text } from 'react-native'
import React from 'react'
import styles from '../../../screens/homeScreen/home/styles'
import { useSelector } from 'react-redux'
import { appColors } from '@src/themes'
import { useValues } from '@src/utils/context/index'

export function BottomTitle() {
    const { taxidoSettingData } = useSelector((state: any) => state.setting);
    const { viewRTLStyle, textRTLStyle, isDark } = useValues()

    return (
        <View>
            <View style={styles.homeBottom}>
                <Text style={[styles.title, { textAlign: textRTLStyle }]}>{taxidoSettingData?.taxido_values?.general?.footer_branding_hashtag}</Text>
                <View style={[styles.madeByContainer, { flexDirection: viewRTLStyle }]}>
                    <Text style={[styles.madeBy, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{taxidoSettingData?.taxido_values?.general?.footer_branding_attribution}</Text>
                </View>
            </View>
        </View>
    )
}

