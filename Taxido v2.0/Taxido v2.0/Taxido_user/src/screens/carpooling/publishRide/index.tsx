import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Button, Header, RadioButton } from "@src/commonComponent";
import { TextInput } from "react-native-gesture-handler";
import {
    Add,
    ArrowDownSmall,
    ArrowUpSmall,
    CalenderSmall,
    CarSmall,
    Location,
    Swap,
} from "@src/utils/icons";
import { appColors } from "@src/themes";
import { styles } from "./styles";
import { external } from "@src/styles/externalStyle";
import { useAppNavigation } from "@src/utils/navigation";

export function PublishRide() {
    const [dropDownEnable, setDropdownEnable] = useState(false);
    const [selectedOption, setSelectedOption] = useState();
    const { navigate } = useAppNavigation();

    const gotoMap = () => { };
    return (
        <View style={styles.view}>
            <Header value="Publish Ride" />
            <View
                style={styles.mainView}
            >
                <View>
                    <TouchableOpacity
                        style={styles.inputBox}
                        activeOpacity={0.7}
                        onPress={gotoMap}
                    >
                        <View style={styles.iconContainer}>
                            <Location />
                        </View>
                        <TextInput
                            placeholder="Pickup Location"
                            style={styles.input}
                            editable={false}
                        />
                    </TouchableOpacity>
                    <View style={styles.inputBox}>
                        <View style={styles.iconContainer}>
                            <Location />
                        </View>
                        <TextInput placeholder="Drop-off Location" style={styles.input} />
                    </View>
                    <TouchableOpacity style={styles.swapButton}>
                        <Swap />
                    </TouchableOpacity>
                </View>
                <View
                    style={styles.line}
                />
                <View style={styles.inputBox}>
                    <View style={styles.iconContainer}>
                        <CalenderSmall />
                    </View>
                    <TextInput placeholder="Select Date & Time" style={styles.input} />
                </View>
                <View style={styles.inputBoxDropDown}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[external.fd_row, { alignItems: "center" }]}
                        onPress={() => setDropdownEnable(!dropDownEnable)}
                    >
                        <View style={styles.iconContainer}>
                            <CarSmall />
                        </View>
                        <Text style={styles.input}>Select Vehicle</Text>
                        <TouchableOpacity
                            style={styles.dropDownEnable}
                            onPress={() => setDropdownEnable(!dropDownEnable)}
                        >
                            {dropDownEnable ? <ArrowUpSmall /> : <ArrowDownSmall />}
                        </TouchableOpacity>
                    </TouchableOpacity>

                    {dropDownEnable && (
                        <View style={styles.addMainView}>
                            <TouchableOpacity onPress={() => navigate('AddVehicle')}
                                style={styles.addView}
                            >
                                <Add colors={appColors.primary} />
                                <Text
                                    style={styles.addNewVehicle}
                                >
                                    Add New Vehicle
                                </Text>
                            </TouchableOpacity>
                            <View>
                                <View style={styles.bottomView1}>
                                    <RadioButton color={appColors.primary} checked={selectedOption === "1"}
                                        onPress={() => setSelectedOption("1")} />
                                    <Text style={styles.vehicleNumber}>Vehicle Number 1</Text>
                                </View>
                                <View style={styles.bottomView1}>
                                    <RadioButton color={appColors.primary} checked={selectedOption === "2"}
                                        onPress={() => setSelectedOption("2")} />
                                    <Text style={styles.vehicleNumber}>Vehicle Number 1</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.btn}>
                <Button title="Next" onPress={() => navigate('Stopover')} />
            </View>
        </View>
    );
}
