import { Header } from "@src/commonComponent";
import Checkbox from "@src/commonComponent/checkBox";
import { appColors, windowHeight } from "@src/themes";
import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import styles from "./styles";

export function RideListFilter() {
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption1, setSelectedOption1] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [selectedOption3, setSelectedOption3] = useState(null);
    const [selectedOption4, setSelectedOption4] = useState(null);


    const filterOptions = ["Best Match", "Highest Rated Driver", "Price (Low to High)", "Price (High to Low)", "Distance (Nearest First)"];
    const passengerPreferences = ["Women Only", "Men Only", "Mixed Group"];
    const luggageAllowance = ["1 Carry-on Only", "Extra Luggage Allowed", "Trunk Space Available"];
    const smokingPreference = ["Non-Smoking Ride", "Smoking Allowed", "Smoke Breaks Outside Only"];
    const petPolicy = ["Pet Friendly", "No Pets Allowed"];

    const handleCheckboxPress = (option) => {
        setSelectedOption(option);
    };

    const handleCheckboxPress1 = (option) => {
        setSelectedOption1(option);
    };

    const handleCheckboxPress2 = (option) => {
        setSelectedOption2(option);
    };

    const handleCheckboxPress3 = (option) => {
        setSelectedOption3(option);
    };

    const handleCheckboxPress4 = (option) => {
        setSelectedOption4(option);
    };





    return (
        <View style={styles.view}>
            <Header value="Filter" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={styles.mainView}
                >
                    <Text style={styles.sortBy}>Sort By</Text>

                    {filterOptions.map((item) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => handleCheckboxPress(item)}
                            activeOpacity={0.7}
                            style={styles.filterOptions}
                        >
                            <Text
                                style={styles.itemText}
                            >
                                {item}
                            </Text>
                            <Checkbox
                                isChecked={selectedOption === item}
                                onPress={() => handleCheckboxPress(item)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>



                <View
                    style={styles.mainView}
                >
                    <Text style={styles.passengerText}>Passenger Preferences</Text>

                    {passengerPreferences.map((item) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => handleCheckboxPress(item)}
                            activeOpacity={0.7}
                            style={styles.filterOptions}
                        >
                            <Text
                                style={styles.itemText}
                            >
                                {item}
                            </Text>
                            <Checkbox
                                isChecked={selectedOption1 === item}
                                onPress={() => handleCheckboxPress1(item)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>


                <View
                    style={styles.mainView}
                >
                    <Text style={styles.sortBy}>Luggage Allowance</Text>

                    {luggageAllowance.map((item) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => handleCheckboxPress2(item)}
                            activeOpacity={0.7}
                            style={styles.filterOptions}
                        >
                            <Text
                                style={styles.itemText}
                            >
                                {item}
                            </Text>
                            <Checkbox
                                isChecked={selectedOption2 === item}
                                onPress={() => handleCheckboxPress2(item)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>




                <View
                    style={styles.mainView}
                >
                    <Text style={styles.passengerText}>Smoking Preference</Text>

                    {smokingPreference.map((item) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => handleCheckboxPress3(item)}
                            activeOpacity={0.7}
                            style={styles.filterOptions}
                        >
                            <Text
                                style={styles.itemText}
                            >
                                {item}
                            </Text>
                            <Checkbox
                                isChecked={selectedOption3 === item}
                                onPress={() => handleCheckboxPress3(item)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>





                <View
                    style={{
                        backgroundColor: appColors.whiteColor,
                        padding: windowHeight(10),
                        borderRadius: windowHeight(5),
                        borderWidth: windowHeight(1),
                        borderColor: appColors.border,
                        marginTop: windowHeight(14),
                        width: "91%",
                        alignSelf: "center",
                    }}
                >
                    <Text style={styles.sortBy}>Pet Policy</Text>

                    {petPolicy.map((item) => (
                        <TouchableOpacity
                            key={item}
                            onPress={() => handleCheckboxPress4(item)}
                            activeOpacity={0.7}
                            style={styles.filterOptions}
                        >
                            <Text
                                style={styles.itemText}
                            >
                                {item}
                            </Text>
                            <Checkbox
                                isChecked={selectedOption4 === item}
                                onPress={() => handleCheckboxPress4(item)}
                            />
                        </TouchableOpacity>
                    ))}
                </View>


                <View style={styles.viewMain}>
                    <View style={styles.textView}>
                        <Text style={styles.clear}>Clear</Text>
                    </View>

                    <View style={styles.textView}>
                        <Text style={styles.text}>Apply</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}
