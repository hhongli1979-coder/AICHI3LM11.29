import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from './styles'
import { LocationFill } from '@utils/icons'
import { useValues } from '@src/utils/context/index';
import { appColors } from '@src/themes';
import { fontSizes, windowWidth } from '@src/themes'
import { useAppNavigation } from '@src/utils/navigation'
import { useSelector } from 'react-redux'

export function Address({ DropLocation }: { DropLocation: string }) {
    const { viewRTLStyle, textColorStyle, textRTLStyle } = useValues();
    const { navigate } = useAppNavigation();
    const { translateData } = useSelector((state) => state.setting);

    const gotoPay = () => {
        navigate('Payment')
    };

    return (
        <TouchableOpacity onPress={gotoPay} style={[styles.addressView, { flexDirection: viewRTLStyle }]} activeOpacity={0.7}
        >
            <View style={{ flexDirection: viewRTLStyle }}>
                <View style={styles.locationFill}>
                    <LocationFill color={textColorStyle} />
                </View>
                <View style={styles.addressDetail}>
                    <Text style={[styles.city, { color: textColorStyle, textAlign: textRTLStyle, width: windowWidth(250), fontSize: fontSizes.FONT19 }]}>{DropLocation}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.changeView} activeOpacity={0.7}
            >
                <View style={[styles.dropOffText, { flexDirection: viewRTLStyle }]}>
                    <Text style={{ color: appColors.regularText, textAlign: textRTLStyle }}> {'\u2022 '}{translateData.dropOff}</Text>
                </View>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
