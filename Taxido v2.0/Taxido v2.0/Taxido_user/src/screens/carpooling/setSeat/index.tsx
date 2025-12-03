import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { BarProgress, Button, Header } from "@src/commonComponent";
import {
    appColors,
    appFonts,
    fontSizes,
    windowHeight,
    windowWidth,
} from "@src/themes";
import { Add, Minus } from "@src/utils/icons";
import { FlatList } from "react-native-gesture-handler";
import Checkbox from "@src/commonComponent/checkBox";
import { useAppNavigation } from "@src/utils/navigation";

export function SeatSet() {
    const rules = ["Maximum of 2 Passengers in the Back Seat", "Women Only"];
    const [selectedRules, setSelectedRules] = useState([]);
    const [count, setCount] = useState(1)
    const { navigate } = useAppNavigation();

    const handleNext = () => {
        navigate('PriceSet')
    };

    const handleCheckboxPress = (rule) => {
        if (selectedRules.includes(rule)) {
            setSelectedRules(selectedRules.filter((item) => item !== rule));
        } else {
            setSelectedRules([...selectedRules, rule]);
        }
    };

    const increaseCount = () => {
        setCount(prevCount => prevCount + 1);
    };

    const decreaseCount = () => {
        if (count > 1) {
            setCount(prevCount => prevCount - 1);
        }
    };
    const renderItem = ({ item, index }) => (
        <>
            <TouchableOpacity
                onPress={() => handleCheckboxPress(item)}
                activeOpacity={0.7}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: appColors.whiteColor,
                    marginVertical: windowHeight(7),
                    borderRadius: windowHeight(5),
                }}
            >
                <Checkbox
                    isChecked={selectedRules.includes(item)}
                    onPress={() => handleCheckboxPress(item)}
                    label={item}
                    labelStyle={{
                        paddingHorizontal: windowHeight(4),
                        fontFamily: appFonts.medium,
                        fontSize: fontSizes.FONT18,
                    }}
                />
            </TouchableOpacity>
            {index !== rules.length - 1 && (
                <View
                    style={{
                        borderBottomWidth: windowHeight(1),
                        borderColor: appColors.border,
                    }}
                />
            )}
        </>
    );

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={{ backgroundColor: "white", height: windowHeight(18) }}>
                <BarProgress fill={5} totalBars={6} />
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
                    How many passengers can you accommodate?
                </Text>
                <View
                    style={{
                        backgroundColor: appColors.whiteColor,
                        borderRadius: windowHeight(5),
                        padding: windowHeight(10),
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
                                }}
                            >
                                {count}
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
                    <Text
                        style={{
                            marginTop: windowHeight(10),
                            fontFamily: appFonts.medium,
                            color: appColors.gray,
                        }}
                    >
                        Passenger Preferences:
                    </Text>
                    <View style={{ marginTop: windowHeight(8) }}>
                        <FlatList
                            data={rules}
                            keyExtractor={(item) => item}
                            renderItem={renderItem}
                        />
                    </View>
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
                <Button onPress={handleNext} title="Next" />
            </View>
        </View>
    );
}
