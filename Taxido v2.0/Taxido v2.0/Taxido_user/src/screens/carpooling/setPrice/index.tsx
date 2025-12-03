import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes'
import { Add, Minus, RightArrowSmall } from '@src/utils/icons'
import { BarProgress, Button, Header } from '@src/commonComponent'
import { useAppNavigation } from '@src/utils/navigation'
import { useSelector } from 'react-redux'

export function PriceSet() {
    const [count, setCount] = useState(4640)
    const { navigate } = useAppNavigation();
    const { zoneValue } = useSelector((state: any) => state.zone);


    const handleNext = () => {
        navigate('CarpoolingDetails')
    };

    const increaseCount = () => {
        setCount(prevCount => prevCount + 1);
    };

    const decreaseCount = () => {
        if (count > 1) {
            setCount(prevCount => prevCount - 1);
        }
    };
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={{ backgroundColor: "white", height: windowHeight(18) }}>
                <BarProgress fill={6} totalBars={6} />
            </View>
            <View style={{ marginHorizontal: windowWidth(20) }}>
                <Text
                    style={{
                        fontFamily: appFonts.semiBold,
                        fontSize: fontSizes.FONT27,
                        marginVertical: windowHeight(18),
                        color: appColors.primaryText,
                    }}
                >
                    Set your Seat Price
                </Text>
                <View
                    style={{
                        backgroundColor: appColors.whiteColor,
                        borderRadius: windowHeight(5),
                        padding: windowHeight(10),
                        marginBottom: windowHeight(10)
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                height: windowHeight(40),
                                width: windowHeight(40),
                                borderColor: appColors.border,
                                borderWidth: windowHeight(1),
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: windowHeight(5),
                            }}
                            onPress={decreaseCount}
                        >
                            <Minus colors={appColors.primary} />
                        </TouchableOpacity>
                        <View
                            style={{
                                height: windowHeight(40),
                                width: windowHeight(170),
                                borderColor: appColors.border,
                                borderWidth: windowHeight(1),
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: windowHeight(5),
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: appFonts.semiBold,
                                    fontSize: fontSizes.FONT28,
                                    color: appColors.primary
                                }}
                            >
                                {zoneValue.currency_symbol}{count}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                height: windowHeight(40),
                                width: windowHeight(40),
                                borderColor: appColors.border,
                                borderWidth: windowHeight(1),
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: windowHeight(5),
                            }}
                            onPress={increaseCount}
                        >
                            <Add colors={appColors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: appColors.lightGreen, marginTop: windowHeight(18), padding: windowHeight(5), borderRadius: windowHeight(3), }}>
                        <Text style={{ fontFamily: appFonts.regular, color: appColors.price }}>Recommended Price: $4640</Text>
                    </View>
                    <Text style={{ marginVertical: windowHeight(5), fontFamily: appFonts.regular, color: appColors.gray }}>Ideal price for this ride! You'll find passengers quickly.</Text>
                    <View style={{ marginTop: windowHeight(5) }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: appColors.gray, fontFamily: appFonts.regular, fontSize: fontSizes.FONT20 }}>Total Distance:</Text>
                            <Text style={{ color: appColors.gray, fontFamily: appFonts.regular, fontSize: fontSizes.FONT20 }}>580 km</Text>
                        </View>
                        <View style={{ borderBottomWidth: windowHeight(1), borderBottomColor: appColors.border, marginVertical: windowHeight(5) }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: appColors.gray, fontFamily: appFonts.regular, fontSize: fontSizes.FONT20 }}>Price per km:</Text>
                            <Text style={{ color: appColors.gray, fontFamily: appFonts.regular, fontSize: fontSizes.FONT20 }}>$8.00</Text>
                        </View>
                    </View>
                </View>
                <Text style={{ fontFamily: appFonts.semiBold, marginTop: windowHeight(5), }}>Stopover Prices</Text>
                <View style={{ flexDirection: 'row', backgroundColor: appColors.whiteColor, justifyContent: 'space-between', padding: windowHeight(12), marginVertical: windowHeight(10), borderRadius: windowHeight(5) }}>
                    <Text style={{ fontFamily: appFonts.regular, color: appColors.gray }}>Stopover Prices</Text><RightArrowSmall />
                </View>
                <Text style={{ fontFamily: appFonts.semiBold, marginTop: windowHeight(5), }}>Luggage Allowed</Text>
                <View style={{ flexDirection: 'row', backgroundColor: appColors.whiteColor, justifyContent: 'space-between', padding: windowHeight(12), marginVertical: windowHeight(10), borderRadius: windowHeight(5) }}>
                    <Text style={{ fontFamily: appFonts.regular, color: appColors.gray }}>Select</Text><RightArrowSmall />
                </View>
                <Text style={{ fontFamily: appFonts.semiBold, marginTop: windowHeight(5), }}>Preferences</Text>
                <TouchableOpacity onPress={() => navigate("Preferences")} activeOpacity={0.7} style={{ flexDirection: 'row', backgroundColor: appColors.whiteColor, justifyContent: 'space-between', padding: windowHeight(12), marginVertical: windowHeight(10), borderRadius: windowHeight(5) }}>
                    <Text style={{ fontFamily: appFonts.regular, color: appColors.gray }}>Select</Text><RightArrowSmall />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: windowHeight(5) }}>
                    <Text style={{ color: appColors.primaryText, fontFamily: appFonts.semiBold }}>Account Verification</Text>
                    <TouchableOpacity onPress={() => navigate('Accountverification')} activeOpacity={0.7}>
                        <Text style={{ color: appColors.primary, fontFamily: appFonts.semiBold, textDecorationLine: 'underline' }}>Verify Now</Text>
                    </TouchableOpacity>
                </View>


            </View>
            <View
                style={{
                    position: "absolute",
                    marginHorizontal: windowWidth(20),
                    bottom: windowHeight(14),
                    left: 0,
                    right: 0,
                }}
            >
                <Button onPress={handleNext} title="Create Ride" />
            </View>
        </View>

    )
}

