import { View, Text, Alert, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Button, Header } from '@src/commonComponent'
import { useValues } from '@src/utils/context/index';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAppNavigation } from '@src/utils/navigation';
import DocumentPicker from "react-native-document-picker";
import styles from './styles';
import { useSelector } from 'react-redux';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import { CloseIcon, Download } from '@src/utils/icons';
import { Image } from 'react-native-svg';

export function Accountverification() {
    const { bgFullLayout, textColorStyle, textRTLStyle, isDark, viewRTLStyle, isRTL } = useValues();
    const [selectedPriority, setSelectedPriority] = useState(null);
    const { goBack } = useAppNavigation();
    const [files, setFiles] = useState([]);
    const [open, setOpen] = useState(false);
    const { translateData } = useSelector((state) => state.setting);
    const [priorityList, setPriorityList] = useState([]);

    const handleDocumentUpload = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
                allowMultiSelection: true,
            });
            setFiles([...files, ...response]);
        } catch (err) {
            if (!DocumentPicker.isCancel(err)) {
                Alert.alert("Error", translateData.uploadFails);
            }
        }
    }, [files]);

    const handleRemoveFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
    };

    return (
        <View style={{ flex: 1 }}>
            <Header value={translateData.accountVerification} />
            <View style={{ marginHorizontal: windowWidth(20) }}>
                <Text style={styles.fieldTitle}>{translateData.vehicleBrand}</Text>
                <DropDownPicker
                    open={open}
                    value={selectedPriority}
                    items={priorityList}
                    setOpen={setOpen}
                    setValue={setSelectedPriority}
                    placeholder={translateData.selectPriority}
                    style={[
                        styles.dropDownContainer,
                        {
                            backgroundColor: isDark ? bgFullLayout : appColors.whiteColor,
                            borderColor: isDark ? appColors.darkBorder : appColors.border,
                            flexDirection: viewRTLStyle,
                            paddingHorizontal: windowHeight(12),
                        },
                    ]}
                    dropDownContainerStyle={{
                        backgroundColor: isDark ? bgFullLayout : appColors.lightGray,
                        borderColor: isDark ? appColors.darkBorder : appColors.border,
                    }}
                    tickIconStyle={{
                        tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                    }}
                    textStyle={{
                        textAlign: isRTL ? "right" : "left",
                        color: isDark ? appColors.whiteColor : appColors.blackColor,
                        fontFamily: appFonts.regular,
                        fontSize: fontSizes.FONT17
                    }}
                    iconContainerStyle={{
                        color: isDark ? appColors.whiteColor : appColors.blackColor,
                    }}
                    arrowIconStyle={{
                        tintColor: isDark ? appColors.whiteColor : appColors.blackColor,
                    }}
                    placeholderStyle={{
                        color: isDark ? appColors.darkText : appColors.regularText,
                    }}
                    dropDownDirection="TOP"
                    zIndex={2}
                    rtl={isRTL}
                />
                <Text
                    style={[
                        styles.fieldTitle,
                        { color: textColorStyle },
                        { textAlign: textRTLStyle },
                        { fontFamily: appFonts.medium },
                    ]}
                >
                    {translateData.uploadVehicle}
                </Text>
                {files.length > 0 ? (
                    <View style={[styles.imgContainer, { flexDirection: viewRTLStyle }]}>
                        {files.map((file, index) => (
                            <View key={index} style={[styles.imgView, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
                                <TouchableOpacity
                                    style={styles.closeIcon}
                                    onPress={() => handleRemoveFile(index)}
                                >
                                    <CloseIcon />
                                </TouchableOpacity>
                                {file?.type?.includes("image") ? (
                                    <Image source={{ uri: file?.uri }} style={styles.img} />
                                ) : (
                                    <View style={styles.placeholder}>
                                        <Text style={styles.placeholderText}>{file?.name}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={handleDocumentUpload}
                        activeOpacity={0.7}
                        style={[
                            styles.docSelection,
                            { backgroundColor: isDark ? bgFullLayout : appColors.whiteColor },
                            { borderColor: isDark ? appColors.darkBorder : appColors.border },
                        ]}
                    >
                        <View style={styles.docContainer}>
                            <Download />
                            <Text style={styles.uploadText}>{translateData.upload}</Text>
                        </View>
                    </TouchableOpacity>
                )}

            </View>
            <View style={styles.btn}>
                <Button title={translateData.Save} onPress={goBack} />
            </View>
        </View>
    )
}

