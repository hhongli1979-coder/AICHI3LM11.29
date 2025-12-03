import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { BarProgress, Button, Header } from '@src/commonComponent';
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from '@src/themes';
import Checkbox from '@src/commonComponent/checkBox';
import { useAppNavigation } from '@src/utils/navigation';

export function Stopover() {
    const cities = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'];
    const [selectedCities, setSelectedCities] = useState([]);
    const { navigate } = useAppNavigation();

    const handleCheckboxPress = (city) => {
        if (selectedCities.includes(city)) {
            setSelectedCities(selectedCities.filter((item) => item !== city));
        } else {
            setSelectedCities([...selectedCities, city]);
        }
    };

    const handleNext = () => {
        if (selectedCities.length === 0) return;
        const formattedSteps = [];
        formattedSteps.push({ id: 0, label: selectedCities[0], type: 'start' });
        if (selectedCities.length > 1) {
            const middleStops = selectedCities.slice(1, -1).map((city, index) => ({
                id: index + 1,
                label: city,
                type: 'middle',
            }));
            formattedSteps.push(...middleStops);
        }
        formattedSteps.push({
            id: selectedCities.length,
            label: selectedCities[selectedCities.length - 1],
            type: 'end',
        });
        navigate('EditStopOver', { stopovers: formattedSteps });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleCheckboxPress(item)} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', padding: windowHeight(12.1), backgroundColor: appColors.whiteColor, marginVertical: windowHeight(7), borderRadius: windowHeight(5) }}>
            <Checkbox
                isChecked={selectedCities.includes(item)}
                onPress={() => handleCheckboxPress(item)}
                label={item}
                labelStyle={{ paddingHorizontal: windowHeight(4), fontFamily: appFonts.semiBold }}
            />
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={{ backgroundColor: 'white', height: windowHeight(18) }}>
                <BarProgress fill={1} totalBars={6} />
            </View>
            <View style={{ marginHorizontal: windowWidth(20) }}>
                <Text style={{ fontFamily: appFonts.semiBold, fontSize: fontSizes.FONT23, marginVertical: windowHeight(18), color: appColors.primaryText }}>
                    Add a Stopover to Pick Up Extra Passengers
                </Text>
                <Text style={{ fontFamily: appFonts.regular, color: appColors.gray, fontSize: fontSizes.FONT20 }}>
                    Select Cities for Stopovers:
                </Text>
                <View style={{ marginTop: windowHeight(8) }}>
                    <FlatList
                        data={cities}
                        keyExtractor={(item) => item}
                        renderItem={renderItem}
                    />
                </View>
                <TouchableOpacity activeOpacity={0.7}>
                    <Text style={{ fontFamily: appFonts.semiBold, color: appColors.primary, fontSize: fontSizes.FONT20, marginVertical: windowHeight(6) }}>
                        +  Add Another City
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ position: 'absolute', marginHorizontal: windowWidth(20), bottom: windowHeight(14), left: 0, right: 0 }}>
                <Button onPress={handleNext} title='Next' />
            </View>
        </View>
    );
}
