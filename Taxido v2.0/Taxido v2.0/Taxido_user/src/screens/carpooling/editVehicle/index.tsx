import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { BarProgress, Button, Header, RadioButton } from "@src/commonComponent";
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import { useAppNavigation } from "@src/utils/navigation";
import { FlatList } from "react-native-gesture-handler";

export function EditVehicle() {
    const cars = ['Toyota Camry', 'Volkswagen', 'Montreal', 'BMW 3 Series'];
    const [selectedCar, setSelectedCar] = useState(null);
    const { navigate } = useAppNavigation();

    const handleCheckboxPress = (car) => {
        setSelectedCar(car);
    };

    const handleNext = () => {
        navigate('SeatSet')
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleCheckboxPress(item)} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', padding: windowHeight(12.1), backgroundColor: appColors.whiteColor, marginVertical: windowHeight(7), borderRadius: windowHeight(5) }}>
            <RadioButton color={appColors.primary}
                checked={selectedCar === item}
                onPress={() => handleCheckboxPress(item)} />
            <Text style={{ marginHorizontal: windowWidth(15), fontFamily: appFonts.medium }}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={{ backgroundColor: "white", height: windowHeight(18) }}>
                <BarProgress fill={4} totalBars={6} />
            </View>
            <View style={{ marginHorizontal: windowWidth(20) }}>
                <Text style={{ fontFamily: appFonts.semiBold, fontSize: fontSizes.FONT28, marginVertical: windowHeight(18), color: appColors.primaryText }}>
                    Which vehicle will you take for your trip?
                </Text>
                <Text style={{ fontFamily: appFonts.regular, color: appColors.gray, fontSize: fontSizes.FONT20 }}>
                    Select Vehicle for Trip:
                </Text>
                <View style={{ marginTop: windowHeight(8) }}>
                    <FlatList
                        data={cars}
                        keyExtractor={(item) => item}
                        renderItem={renderItem}
                        removeClippedSubviews={true}
                    />
                </View>
                <TouchableOpacity activeOpacity={0.7}>
                    <Text style={{ fontFamily: appFonts.semiBold, color: appColors.primary, fontSize: fontSizes.FONT20, marginVertical: windowHeight(6) }}>
                        +  Add New Vehicle
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ position: 'absolute', marginHorizontal: windowWidth(20), bottom: windowHeight(14), left: 0, right: 0 }}>
                <Button onPress={handleNext} title='Next' />
            </View>
        </View>
    );
}
