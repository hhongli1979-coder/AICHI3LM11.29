import { Image, View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { appColors, windowHeight } from "@src/themes";
import { useValues } from "@src/utils/context";
import Images from "@src/utils/images";
import { Camera } from "@utils/icons";
import { styles } from "../style";

export function ImageContainer({ data, imageUri, bottomSheetRef }: any) {
  const { bgFullStyle, isDark } = useValues();


  return (
    <>
      <View style={{ position: 'absolute', width: '100%', height: windowHeight(50) }}>
        <Image source={Images.profileBackground} style={{ width: '100%', height: windowHeight(78), borderTopLeftRadius: windowHeight(8), borderTopRightRadius: windowHeight(8) }} />
      </View>
      <View style={styles.profileImageContainer}>
        <View style={[styles.profileImageWrapper, { borderColor: isDark ? appColors.darkBorder : appColors.border }]}>
          {imageUri ? (
            <Image style={styles.profileImage} source={{ uri: imageUri }} />
          ) : (
            <Text style={[styles.char, { color: appColors.primary }]}>
              {data?.name?.charAt(0) || ""}
            </Text>
          )}
          <View style={[styles.editIconContainer, { backgroundColor: bgFullStyle }]}>
            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.present()}
              activeOpacity={0.7}
            >
              <Camera />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
