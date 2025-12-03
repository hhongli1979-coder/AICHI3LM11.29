import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../styles'
import { Police, SafetyCall, LocationGreen, Close } from '@utils/icons'
import { useValues } from '@src/utils/context/index';
import { useSelector } from 'react-redux'

export function ModalContect({ onpress }: { onpress: () => void }) {
    const { linearColorStyle, textColorStyle, viewRTLStyle, bgContainer, } = useValues();
    const { translateData } = useSelector((state) => state.setting);

    return (
        <View style={styles.modalBg} >
            <View style={[styles.modalBgMain, { backgroundColor: linearColorStyle }]}>
                <TouchableOpacity style={styles.close} onPress={onpress} activeOpacity={0.7}
                >
                    <Close />
                </TouchableOpacity>
                <Text style={[styles.title, { color: textColorStyle }]}>{translateData.keepYourselfSafe}</Text>
                <View style={{ flexDirection: viewRTLStyle }}>
                    <TouchableOpacity style={[styles.box, { backgroundColor: bgContainer }]} activeOpacity={0.7}
                    >
                        <Police />
                        <Text style={[styles.callReason, { color: textColorStyle }]}>{translateData.callThePolice}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.box, { backgroundColor: bgContainer }]} activeOpacity={0.7}
                    >
                        <SafetyCall />
                        <Text style={[styles.callReason, { color: textColorStyle }]}>{translateData.callSafetySupport}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.box, { backgroundColor: bgContainer }]} activeOpacity={0.7}
                    >
                        <LocationGreen />
                        <Text style={[styles.callReason, { color: textColorStyle }]}>{translateData.callSafetySupport}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
