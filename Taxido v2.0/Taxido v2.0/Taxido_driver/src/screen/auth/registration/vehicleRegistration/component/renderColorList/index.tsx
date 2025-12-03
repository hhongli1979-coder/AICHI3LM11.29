import React, { useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import appColors from '../../../../../../theme/appColors';
import { useTheme } from '@react-navigation/native';
import { useValues } from '../../../../../../utils/context';
import { windowHeight } from '../../../../../../theme/appConstant';
import styles from '../renderCategoryList/styles';
import { useSelector } from 'react-redux'; // Add this import
import Icons from '../../../../../../utils/icons/icons';

interface RenderColorListProps {
    selectedColor: string;
    handleColorSelect: (color: string) => void;
}

export function RenderColorList({
    handleColorSelect,
    selectedColor,
}: RenderColorListProps) {
    const { colors } = useTheme();
    const { isDark, viewRtlStyle } = useValues();
    const { translateData } = useSelector((state: any) => state.setting);
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string | null>(selectedColor || null);
    const [items, setItems] = useState<{ label: string; value: string }[]>([
        { label: 'White', value: 'White' },
        { label: 'Black', value: 'Black' },
        { label: 'Gray', value: 'Gray' },
        { label: 'Silver', value: 'Silver' },
        { label: 'Blue', value: 'Blue' },
        { label: 'Red', value: 'Red' },
        { label: 'Brown', value: 'Brown' },
        { label: 'Green', value: 'Green' },
        { label: 'Beige', value: 'Beige' },
        { label: 'Yellow', value: 'Yellow' },
    ]);

    const handleValueChange = (itemValue: string | null) => {
        setValue(itemValue);
        if (itemValue) {
            handleColorSelect(itemValue);
        }
    };

    return (
        <View>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                onChangeValue={handleValueChange}
                placeholder={translateData.selectColor || translateData.selectColor}
                containerStyle={styles.container}
                placeholderStyle={[
                    styles.placeholderStyles,
                    {
                        color: isDark
                            ? appColors.darkText
                            : appColors.secondaryFont,
                    },
                ]}
                style={{
                    backgroundColor: isDark
                        ? appColors.darkThemeSub
                        : appColors.white,
                    borderColor: colors.border,
                    flexDirection: viewRtlStyle,
                    paddingHorizontal: windowHeight(1.9),
                }}
                dropDownContainerStyle={{
                    backgroundColor: isDark ? colors.card : appColors.dropDownColor,
                    borderColor: colors.border,
                }}
                textStyle={[styles.text, { color: colors.text }]}
                labelStyle={[
                    styles.text,
                    { color: isDark ? appColors.white : appColors.black },
                ]}
                listItemLabelStyle={{
                    color: isDark ? appColors.white : appColors.black,
                }}
                scrollViewProps={{
                    showsVerticalScrollIndicator: false,
                    nestedScrollEnabled: true,
                }}
                zIndex={1}
                listMode="SCROLLVIEW"
                dropDownDirection="AUTO"
                  ArrowDownIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '-90deg' }] }]}>
                                <Icons.Back color={colors.text} />
                            </View>
                        )}
                        ArrowUpIconComponent={({ style }) => (
                            <View style={[{ transform: [{ rotate: '90deg' }] }]}>

                                <Icons.Back color={colors.text} />
                            </View>
                        )}
            />
        </View>
    );
}