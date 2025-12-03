import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { appColors } from "@src/themes";
import { PickLocation, Radio, RightArrowSmall, Target } from "@src/utils/icons";
import { BarProgress, Button, Header } from "@src/commonComponent";
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from "./styles";

export function EditStopOver() {
    const route = useRoute();
    const { stopovers = [] } = route.params || {};
    const navigation = useNavigation();

    const handleEditStopover = (stop) => {
    };

    return (
        <View style={styles.view}>
            <Header />
            <View style={styles.progressBar}>
                <BarProgress fill={2} totalBars={6} />
            </View>
            <View style={styles.descriptionView}>
                <Text style={styles.description}>
                    These are the best locations to halt. Is that fine for you?
                </Text>
            </View>
            <View style={styles.container}>
                {stopovers.map((step, index) => (
                    <View key={index} style={styles.stepContainer}>
                        <View style={styles.iconColumn}>
                            <View style={styles.stepType}>
                                {step.type === 'start' && <PickLocation />}
                                {step.type === 'middle' && <Radio />}
                                {step.type === 'end' && <Target />}
                            </View>
                            {index !== stopovers.length - 1 && <View style={styles.line} />}
                        </View>

                        <TouchableOpacity
                            style={styles.labelColumn}
                            onPress={() => step.type === 'middle' && handleEditStopover(step)}
                        >
                            <Text style={[
                                styles.label,
                                { color: step.type === 'middle' ? appColors.blackColor : appColors.gray }
                            ]}>
                                {step.label}
                            </Text>
                            {step.type === 'middle' && <RightArrowSmall />}
                        </TouchableOpacity>

                        <View style={styles.border} />
                    </View>
                ))}
            </View>
            <Text style={styles.mapLink}>View on Map</Text>

            <View style={styles.btn}>
                <Button title='Next' onPress={() => navigation.navigate('carpoolingDate')} />
            </View>
        </View>
    );
}
