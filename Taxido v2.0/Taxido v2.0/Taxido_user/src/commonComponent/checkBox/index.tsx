import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import styles from "./styles";
import { useValues } from "@src/utils/context/index";
import { CheckBoxProps } from "../type";


export default function Checkbox({ isChecked, onPress, label, labelStyle,style }: CheckBoxProps) {
  const { viewRTLStyle } = useValues()
  return (
    <TouchableOpacity
      style={[styles.container, { flexDirection: viewRTLStyle }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, isChecked && styles.checkedCheckbox,style]}>
        {isChecked && (
          <View style={styles.tickContainer}>
            <Text style={styles.tick}>✓</Text>
          </View>
        )}
      </View>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </TouchableOpacity>
  );
}

