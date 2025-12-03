import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { appColors } from '@src/themes';
import styles from './styles';
import { useValues } from '@src/utils/context/index';
import { RadioButtonProps } from '@src/commonComponent/type';


export function CustomRadioButton({ label, selected, onPress }: RadioButtonProps) {
    const { viewRTLStyle, isDark } = useValues();
    const { colors } = useTheme();

    return (
        <TouchableOpacity onPress={onPress} style={[styles.radioButton, { flexDirection: viewRTLStyle }]} activeOpacity={0.7} >
            <View
                style={[
                    styles.radioButtonOuter,
                    {
                        borderColor: selected ? isDark ? appColors.dotDark : appColors.lightGreen : isDark ? appColors.darkBorder : appColors.border,
                        backgroundColor: selected
                            ? (isDark ? appColors.dotDark : appColors.lightGreen)
                            : isDark ? appColors.bgDark : colors.background,
                    }
                ]}>
                {selected && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};