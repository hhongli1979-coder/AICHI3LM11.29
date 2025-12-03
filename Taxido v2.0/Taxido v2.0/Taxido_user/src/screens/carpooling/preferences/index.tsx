import { View, Text } from "react-native";
import React, { useState } from "react";
import { Header } from "@src/commonComponent";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import DropDownPicker from 'react-native-dropdown-picker';
import { useValues } from "@src/utils/context/index";;
import { useAppNavigation } from "@src/utils/navigation";
import { useSelector } from "react-redux";
import styles from "./style";

export function Preferences() {
    const {
        bgFullLayout,
        isDark,
        viewRTLStyle,
        isRTL
    } = useValues();
    const [selectedPriority, setSelectedPriority] = useState(null);
    const { goBack } = useAppNavigation();
    const [open, setOpen] = useState(false);
    const { translateData } = useSelector((state) => state.setting);
    const [priorityList, setPriorityList] = useState([]);
    return (
        <View>
            <Header value="Select your Preferences" />
            <View style={{ marginHorizontal: windowWidth(20) }}>
                <Text style={{ color: appColors.gray, fontFamily: appFonts.regular, fontSize: fontSizes.FONT21, marginVertical: windowWidth(20) }}>Customize your ride experience by selecting your travel preferences.</Text>

                <Text style={styles.fieldTitle}>Conversation Preference</Text>
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
                <Text style={styles.fieldTitle}>Smoking Preference</Text>
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
                <Text style={styles.fieldTitle}>Ac Preference</Text>
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
                <Text style={styles.fieldTitle}>Music Preference</Text>
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
                <Text style={styles.fieldTitle}>Phone Calls</Text>
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
                <Text style={styles.fieldTitle}>Food Preference</Text>
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
                <Text style={styles.fieldTitle}>Pet Preference</Text>
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


            </View>
        </View>
    );
}
