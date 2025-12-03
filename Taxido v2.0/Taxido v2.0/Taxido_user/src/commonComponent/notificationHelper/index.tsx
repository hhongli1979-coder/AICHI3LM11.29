import { Notifier } from "react-native-notifier";
import React from "react";
import { View, Text } from "react-native";
import { CustomNotificationProps } from "../type";
import styles from "./styles";

const CustomNotification = ({ description, alertType }: CustomNotificationProps) => {
  const backgroundColor =
    alertType === "error"
      ? "#FF4D4F"
      : alertType === "success"
        ? "#52C41A"
        : alertType === "warn"
          ? "#FAAD14"
          : "#1890FF";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export function notificationHelper(title: any, message: any, type = "info") {
  Notifier.showNotification({
    title,
    description: message,
    duration: 3000,
    showAnimationDuration: 800,
    hideAnimationDuration: 800,
    Component: CustomNotification,
    componentProps: {
      alertType: type,
    },
  });
}

