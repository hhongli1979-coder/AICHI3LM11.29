import React, { useEffect, useContext } from "react";
import { TextInput, View, TouchableOpacity, Text } from "react-native";
import { Add, Minus, Gps, PickLocation, Close } from "@utils/icons";
import { styles } from "./styles";
import { PickUpDetailProps } from "./types";
import { useValues } from '@src/utils/context/index';
import { LocationContext } from "../../utils/locationContext";
import { appColors, windowHeight } from "@src/themes";
import { useSelector } from "react-redux";

export function PickUpDetails({ border, setPickupLocation, setStops, setDestination, activeField, setActiveField,
  destination, pickupLocation, stops }: PickUpDetailProps) {
  const { textColorStyle, isDark, viewRTLStyle, isRTL, textRTLStyle } = useValues();
  const context = useContext(LocationContext);
  const { pickupLocationLocal, setPickupLocationLocal, stopsLocal, setStopsLocal, destinationLocal, setDestinationLocal } = context;
  const { translateData } = useSelector((state: any) => state.setting);


  useEffect(() => {
    if (activeField === "pickupLocation") {
      setPickupLocationLocal(pickupLocation);
    } else if (activeField === "destination") {
      setDestinationLocal(destination);
    } else if (activeField?.startsWith("stop-")) {
      const stopIndex = parseInt(activeField.split("-")[1], 10) - 1;
      setStopsLocal(
        stops?.map((stop: any, index: number) => (index === stopIndex ? stop : stop))
      );
    }
  }, [activeField, destination, pickupLocation, stops]);

  const addStop = () => {
    if (stopsLocal.length < 3) {
      const newStops = [...stopsLocal, ""];
      setStopsLocal(newStops);
      setStops(newStops);
    }
  };

  const removeStop = (index: number) => {
    const updatedStops = stopsLocal.filter((_: any, i: any) => i !== index);
    setStopsLocal(updatedStops);
    setStops(updatedStops);

    if (updatedStops.length === 0) {
      setActiveField("destination");
    } else if (index === stopsLocal.length - 1) {
      setActiveField(`stop-${updatedStops.length}`);
    }
  };

  const handleInputChange = (text: string, id: number) => {
    if (id === 1) {
      setPickupLocationLocal(text);
      setPickupLocation(text);
    } else if (id === 2) {
      setDestinationLocal(text);
      setDestination(text);
    } else {
      const updatedStops = stopsLocal?.map((stop: number, index: number) =>
        index + 3 === id ? text : stop
      );
      setStopsLocal(updatedStops);
      setStops(updatedStops);
    }
  };

  const handleFocus = (id: number) => {
    if (id === 1) {
      setActiveField("pickupLocation");
    } else if (id === 2) {
      setActiveField("destination");
    } else {
      setActiveField(`stop-${id - 2}`);
    }
  };

  const handleCloseStop = (index: number) => {
    const updatedStops = [...stopsLocal];
    updatedStops[index] = "";
    setStopsLocal(updatedStops);
    setStops(updatedStops);
  };

  const handleClosepickup = () => {
    setPickupLocationLocal("");
    setPickupLocation("");
  };

  const handleCloseDestination = () => {
    setDestination("");
    setDestinationLocal("");
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray,
          borderColor: border,
        },
      ]}
    >
      <View
        style={styles.scrollContainer}
      >
        <View style={[styles.inputContainer, { flexDirection: viewRTLStyle }]}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray },
            ]}
          >
            <Gps width={20} height={20} />
          </View>
          <View
            style={[styles.inputWithIcons, { flexDirection: viewRTLStyle }]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? appColors.whiteColor : appColors.primaryText,
                },
                { textAlign: textRTLStyle },
              ]}
              placeholderTextColor={
                isDark ? appColors.darkText : appColors.regularText
              }
              placeholder={translateData.pickupLocationTittle}
              value={pickupLocationLocal}
              onChangeText={(text) => handleInputChange(text, 1)}
              onFocus={() => handleFocus(1)}
            />
          </View>
          {pickupLocationLocal?.length >= 1 && (
            <TouchableOpacity onPress={handleClosepickup} activeOpacity={0.7}
            >
              <Close />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            borderColor: isDark ? appColors.darkBorder : appColors.border,
            borderBottomWidth: windowHeight(0.3),
            width: "86%",
            marginHorizontal: isRTL ? windowHeight(8) : windowHeight(29),
          }}
        />

        <View
          style={[
            styles.line2,
            {
              borderColor: isDark
                ? appColors.regularText
                : appColors.blackColor,
            },
            { left: isRTL ? "96%" : windowHeight(9.9) },
          ]}
        />
        {stopsLocal?.map((stop: any, index: number) => (
          <View
            key={index + 3}
            style={[
              styles.inputContainer,
              index === stopsLocal.length - 1 ? {} : { marginBottom: 8 },
              { flexDirection: viewRTLStyle },
            ]}
          >
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.numberContainer,
                  {
                    backgroundColor: isDark
                      ? appColors.whiteColor
                      : appColors.blackColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.numberText,
                    {
                      color: isDark
                        ? appColors.blackColor
                        : appColors.whiteColor,
                    },
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
            </View>
            <View style={styles.inputWithIcons}>
              <TextInput
                style={[
                  styles.input,
                  index === stopsLocal.length - 1
                    ? {}
                    : {
                      borderBottomWidth: windowHeight(0.9),
                      borderBottomColor: isDark
                        ? appColors.darkBorder
                        : appColors.border,
                    },
                  { textAlign: textRTLStyle },
                  {
                    borderColor: isDark
                      ? appColors.darkBorder
                      : appColors.border,
                  },
                ]}
                placeholderTextColor={
                  isDark ? appColors.darkText : appColors.regularText
                }
                placeholder={translateData.addStopPlaceHolderText}
                value={stop}
                onChangeText={(text) => handleInputChange(text, index + 3)}
                onFocus={() => handleFocus(index + 3)}
              />

              <View
                style={[
                  styles.addButton,
                  { flexDirection: viewRTLStyle },
                  { right: isRTL ? "85%" : windowHeight(6) },
                ]}
              >
                {stopsLocal[index]?.trim() !== "" && (
                  <TouchableOpacity onPress={() => handleCloseStop(index)} activeOpacity={0.7}
                  >
                    <Close />
                  </TouchableOpacity>
                )}
                {index === stopsLocal.length - 1 && (
                  <>
                    <View style={styles.iconSpacing} />
                    <TouchableOpacity onPress={() => removeStop(index)} activeOpacity={0.7}
                    >
                      <Minus colors={textColorStyle} width={20} height={20} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
            {index < stopsLocal.length && (
              <View
                style={[
                  styles.line,
                  { borderColor: appColors.regularText },
                  { left: isRTL ? "96%" : 12 },
                ]}
              />
            )}
          </View>
        ))}

        <View style={[styles.inputContainer, { flexDirection: viewRTLStyle }]}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: isDark ? appColors.darkPrimary : appColors.lightGray },
            ]}
          >
            <PickLocation width={20} height={20} />
          </View>
          <View style={styles.inputWithIcons}>
            <View style={styles.inputWidth}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDark
                      ? appColors.whiteColor
                      : appColors.primaryText,
                  },
                  { textAlign: textRTLStyle },
                  { left: isRTL ? windowHeight(55) : windowHeight(0) },
                ]}
                placeholderTextColor={
                  isDark ? appColors.darkText : appColors.regularText
                }
                placeholder={translateData.enterDestinationPlaceholderText}
                value={destinationLocal}
                onChangeText={(text) => handleInputChange(text, 2)}
                onFocus={() => handleFocus(2)}
              />
            </View>
            <View
              style={[
                styles.addButton,
                { flexDirection: viewRTLStyle },
                { right: isRTL ? "85%" : windowHeight(6) },
              ]}
            >
              {destinationLocal?.length >= 1 && (
                <TouchableOpacity onPress={handleCloseDestination} activeOpacity={0.7}
                >
                  <Close />
                </TouchableOpacity>
              )}
              {stopsLocal.length < 3 && (
                <>
                  <View style={styles.iconSpacing} />
                  <TouchableOpacity onPress={addStop} activeOpacity={0.7}
                  >
                    <Add colors={textColorStyle} width={20} height={20} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
