import React, { useEffect, useContext } from 'react';
import { TextInput, View } from 'react-native';
import { PickLocation } from '@utils/icons';
import { styles } from './styles';
import { PickUpDetailProps } from './types';
import { LocationContext } from '../../utils/locationContext';
import { appColors } from '@src/themes';
import { useSelector } from 'react-redux';
import { useValues } from '@src/utils/context/index';

export function RentalLocationSearch({ bgColor, setPickupLocation, activeField, setActiveField, pickupLocation }: PickUpDetailProps) {
    const { isDark, viewRTLStyle } = useValues();
    const context = useContext(LocationContext);
    const { pickupLocationLocal, setPickupLocationLocal } = context;
    const { translateData } = useSelector((state) => state.setting);

    useEffect(() => {
        if (activeField === 'pickupLocation') {
            setPickupLocationLocal(pickupLocation);
        }
    }, [activeField, pickupLocation]);

    const handleInputChange = (text: string, id: number) => {
        if (id === 1) {
            setPickupLocationLocal(text);
            setPickupLocation(text);
        }
    };

    const handleFocus = (id: number) => {
        if (id === 1) {
            setActiveField('pickupLocation');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? bgColor : appColors.lightGray }, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
            <View style={[styles.inputContainer, { flexDirection: viewRTLStyle }]}>
                <View style={styles.iconContainer}>
                    <PickLocation width={20} height={20} />
                </View>
                <View style={styles.inputWithIcons}>
                    <TextInput
                        style={[styles.input, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}
                        placeholderTextColor={isDark ? appColors.darkText : appColors.regularText}
                        placeholder={translateData.pickupLocation}
                        value={pickupLocationLocal}
                        onChangeText={(text) => handleInputChange(text, 1)}
                        onFocus={() => handleFocus(1)}
                    />
                </View>
            </View>
        </View>
    );
};
