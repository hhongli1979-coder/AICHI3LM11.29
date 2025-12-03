import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Button, CustomRadioButton, Header, notificationHelper } from '../../../commonComponents'
import styles from './styles'
import { useDispatch, useSelector } from 'react-redux'
import appColors from '../../../theme/appColors'
import { useValues } from '../../../utils/context'
import { useTheme } from '@react-navigation/native'
import { SkeletonAppPage } from '../appSettings/component'
import { windowHeight, windowWidth } from '../../../theme/appConstant'
import { getValue } from '../../../utils/localstorage'
import { walletTopUpData } from '../../../api/store/action'
import { AppDispatch } from '../../../api/store'
import { WalletTopUpDatainterface } from '../../../api/interface/walletInterface'
import { useAppNavigation } from '../../../utils/navigation'

export function TopUp() {
    const { translateData } = useSelector((state: any) => state.setting)
    const { textRtlStyle, viewRtlStyle, isDark } = useValues()
    const { colors } = useTheme()
    const { zoneValue } = useSelector((state: any) => state.zoneUpdate);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { paymentMethodData } = useSelector((state: any) => state.wallet)
    const [amount, setAmount] = useState<any>(null);
    const [topupLoading, setTopuploading] = useState<boolean>(false);
    const activePaymentMethods = paymentMethodData?.filter((method: any) => method?.status == true);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { navigate } = useAppNavigation();
    const paymentData = (index: number, name: any) => {
        setSelectedItem(index === selectedItem ? null : index);
        setSelectedPaymentMethod(index === selectedItem ? null : name);
    };


    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const addBalance = async () => {
        if (amount <= 0) {
            notificationHelper("", translateData.enterAmount, "error");
            setTopuploading(false)
            return;
        }

        if (!selectedPaymentMethod) {
            notificationHelper("", translateData.selectPaymentmethod, "error");
            setTopuploading(false)
            return;
        }
        setTopuploading(true)
        const currencyCode = await getValue('selectedCurrency')

        let payload: WalletTopUpDatainterface = {
            amount: amount,
            payment_method: selectedPaymentMethod,
            currency_code: zoneValue?.currency_code,
            currency_symbol: zoneValue?.currency_symbol
        };

        dispatch(walletTopUpData(payload))
            .unwrap()
            .then(async (res: any) => {

                if (res?.is_redirect) {
                    navigate("PaymentWebView", {
                        url: res.url,
                        selectedPaymentMethod: selectedPaymentMethod,
                        dataValue: res,
                    });
                    setTopuploading(false)
                }
            })
            .catch((error) => {
            });
    };

    const renderItem = ({ item, index }: any) => {
        return (
            <TouchableOpacity

                onPress={() => {
                    if (!topupLoading) paymentData(index, item?.slug);
                }} activeOpacity={0.7}>
                <View style={{ flexDirection: viewRtlStyle, justifyContent: 'space-between' }}>
                    <View
                        style={[
                            {
                                backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
                                flexDirection: viewRtlStyle,
                                paddingVertical: windowHeight(1.1),
                                paddingHorizontal: windowWidth(4),
                            },
                        ]}
                    >
                        <TouchableOpacity style={{ flexDirection: viewRtlStyle, flex: 1 }} activeOpacity={1}>
                            <View style={styles.imageBg}>
                                <Image source={{ uri: item.image }} style={styles.paymentImage} />
                            </View>

                        </TouchableOpacity>
                        <View style={styles.mailInfo}>
                            <Text style={[styles.mail, { color: isDark ? appColors.white : appColors.black }]}>
                                {item.name}
                            </Text>
                        </View>
                    </View>
                    <CustomRadioButton selected={index === selectedItem} onPress={() => {
                        if (!topupLoading) paymentData(index, item?.slug);
                    }} />

                </View>
                {index !== activePaymentMethods.length - 1 && (
                    <View style={{
                        borderBottomWidth: windowHeight(0.1),
                        borderColor: colors.border, marginHorizontal: windowWidth(4.5),
                        marginTop: windowHeight(1.2),
                        bottom: windowHeight(0.5)
                    }}
                    />
                )}
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.main}>
            <Header title={translateData.topupWallettttt} />
            <View style={styles.listView}>
                <Text style={[styles.amount, { textAlign: textRtlStyle }]}>
                    {translateData.amount}
                </Text>

                <View style={styles.inputContainer}>
                    <View
                        style={[
                            styles.inputView,
                            {
                                backgroundColor: colors.card,
                                flexDirection: viewRtlStyle,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Text style={{ color: isDark ? appColors.white : appColors.black, marginBottom: windowHeight(0.5) }}>{zoneValue?.currency_symbol}</Text>
                        <TextInput
                            style={[
                                styles.textinput,
                                { backgroundColor: colors.card, color: colors.text },
                            ]}
                            placeholder={translateData.amount}
                            placeholderTextColor={
                                isDark ? appColors.darkText : appColors.secondaryFont
                            }
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={(text) => setAmount(text)}
                        />
                    </View>
                    <Text
                        style={[
                            styles.title,
                            { color: colors.text, textAlign: textRtlStyle },
                        ]}
                    >
                        {translateData.selectMethod}
                    </Text>

                    <View style={styles.button}>
                        <Button
                            backgroundColor={appColors.primary}
                            color={appColors.white}
                            margin={0}
                            loading={topupLoading} title={translateData.addBalance}
                            onPress={addBalance}
                        />
                    </View>
                    <View >
                        <View
                            style={[
                                styles.container,
                                { backgroundColor: isDark ? appColors.darkThemeSub : appColors.white, borderColor: colors.border },
                            ]}
                        >
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, index) => (
                                    <View style={{
                                        paddingHorizontal: windowHeight(12), paddingVertical: windowHeight(10), top: windowHeight(0), borderBottomWidth: windowHeight(0.3), marginHorizontal: windowHeight(4),
                                        borderColor: colors.border
                                    }}>
                                        <SkeletonAppPage />
                                    </View>
                                ))
                            ) : (
                                <FlatList
                                    data={activePaymentMethods.filter((item: any) => item?.name.toLowerCase() !== 'cash')}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id}
                                    scrollEnabled={true}
                                    showsVerticalScrollIndicator={false}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

