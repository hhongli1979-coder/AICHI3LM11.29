import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useValues } from "@src/utils/context/index";;
import { serviceDataGet, translateDataGet } from "@src/api/store/actions";
import { appColors, appFonts, fontSizes, windowHeight } from "@src/themes";
import { CustomRadioButton } from "@src/commonComponent/radioButton/customRadioButton";
import { Button, SolidLine } from "@src/commonComponent";
import { styles } from "../../style";
import { AppDispatch } from "@src/api/store";

interface LanguageBottomSheetProps {
    isVisible: boolean;
    onClose: () => void;
    selectedLanguage: string;
    setSelectedLanguage: (lang: string) => void;
    setSelectedLang: any
}

export function LanguageBottomSheet({ isVisible, onClose, selectedLanguage, setSelectedLanguage, setSelectedLang }: LanguageBottomSheetProps) {
    const { languageData, translateData } = useSelector((state: any) => state.setting);
    const dispatch = useDispatch<AppDispatch>();
    const { isDark, textRTLStyle, viewRTLStyle, bgFullStyle, textColorStyle, setIsRTL } = useValues();
    const snapPoints = useMemo(() => ["60%"], []);
    const sheetRef = useRef<BottomSheetModal>(null);
    const [tempSelectedLanguage, setTempSelectedLanguage] = React.useState(selectedLanguage);

    useEffect(() => {
        if (isVisible) {
            setTempSelectedLanguage(selectedLanguage);
            sheetRef.current?.present();
        } else {
            sheetRef.current?.dismiss();
        }
    }, [isVisible]);

    const closeLanguage = async () => {
        try {
            setSelectedLanguage(tempSelectedLanguage);
            setSelectedLang(tempSelectedLanguage);

            if (tempSelectedLanguage === "ar") {
                setIsRTL(true);
            } else {
                setIsRTL(false);
            }

            await AsyncStorage.setItem("selectedLanguage", tempSelectedLanguage);
            dispatch(translateDataGet());
            await dispatch(serviceDataGet());

            await sheetRef.current?.dismiss();
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                pressBehavior="close"
                appearsOnIndex={0}
                disappearsOnIndex={-1}
            />
        ),
        []
    );

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={sheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose
                backdropComponent={renderBackdrop}
                backgroundStyle={{ backgroundColor: bgFullStyle }}
                onDismiss={onClose}
                handleIndicatorStyle={{ backgroundColor: appColors.primary, width: "13%" }}
            >
                <BottomSheetView style={{ padding: windowHeight(15) }}>
                    <Text
                        style={{
                            color: textColorStyle,
                            fontSize: fontSizes.FONT20,
                            fontFamily: appFonts.medium,
                            textAlign: "center",
                            marginVertical: 10,
                        }}
                    >
                        {translateData.changeLanguage}
                    </Text>

                    {languageData?.data?.map((item: any, index: number) => {
                        const isLast = index === languageData.data.length - 1;
                        return (
                            <View key={item.locale} style={styles.languageContainer}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[
                                        { flexDirection: viewRTLStyle, alignItems: "center", marginVertical: windowHeight(7) },
                                    ]}
                                    onPress={() => setTempSelectedLanguage(item.locale)}
                                >
                                    <Image style={styles.flagImage} source={{ uri: item.flag }} />
                                    <Text
                                        style={{
                                            marginHorizontal: 10,
                                            flex: 1,
                                            textAlign: textRTLStyle,
                                            color: isDark ? appColors.whiteColor : appColors.primaryText,
                                            fontSize: fontSizes.FONT17,
                                            fontFamily: appFonts.medium,
                                            fontWeight: tempSelectedLanguage === item.locale ? "500" : "300",
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                    <View style={{ left: windowHeight(12) }}>
                                        <CustomRadioButton
                                            selected={tempSelectedLanguage === item.locale}
                                            onPress={() => setTempSelectedLanguage(item.locale)}
                                        />
                                    </View>
                                </TouchableOpacity>
                                {!isLast && <SolidLine color={isDark ? appColors.darkBorder : appColors.border} />}
                            </View>
                        );
                    })}

                    <View style={styles.updateButton1}>
                        <Button title={translateData.update} onPress={closeLanguage} />
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
}
