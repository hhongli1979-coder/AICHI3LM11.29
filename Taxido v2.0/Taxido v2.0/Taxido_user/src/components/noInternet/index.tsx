import { View, Text } from "react-native";
import React from "react";
import { styles } from "./styles";
import { Info } from "@src/utils/icons";
import { Menu, MenuOptions, MenuTrigger, renderers } from "react-native-popup-menu";
import { commonStyles } from "@src/styles/commonStyle";
import { useValues } from "@src/utils/context/index";;
import { appColors, appFonts, fontSizes, windowHeight, windowWidth } from "@src/themes";
import FastImage from "react-native-fast-image";
import Images from "@src/utils/images";
import { useSelector } from "react-redux";
import { RootState } from "@src/api/store";
import { NoInternetProps } from "./type";


export function NoInternet({ title, details, image, btnHide, status, infoIcon }: NoInternetProps) {
  const { viewRTLStyle, isDark } = useValues();
  const { Popover } = renderers;
  const { translateData }: undefined | any = useSelector((state: RootState) => state.setting);

  return (
    <View style={styles.mainContainer}>
      <FastImage source={image} style={styles.image} resizeMode="contain" />
      <View style={[styles.mainView, { flexDirection: viewRTLStyle }]}>
        <Text style={[styles.title, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>
          {title}
        </Text>

        {infoIcon && status && (
          <Menu renderer={Popover} rendererProps={{ preferredPlacement: "bottom" }}>
            <MenuTrigger style={styles.info}>
              <Info />
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: commonStyles.popupContainer }}>
              <Text style={commonStyles.popupText}>{status}</Text>
            </MenuOptions>
          </Menu>
        )}
      </View>

      <Text style={[styles.details, { color: isDark ? appColors.whiteColor : appColors.regularText }]}>
        {details}
      </Text>

      {!btnHide && (
        <View style={{ justifyContent: 'center', bottom: '20%' }}>
          <FastImage
            source={Images.noInternet}
            style={{
              width: windowHeight(230),
              height: windowHeight(230),
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
          <View style={[styles.mainView]}>
            <Text style={{
              textAlign: 'center',
              color: appColors.blackColor,
              fontSize: fontSizes.FONT22,
              fontFamily: appFonts.medium,
              top: windowHeight(1)
            }}>{translateData.noInternettText}
            </Text>
            <Menu
              renderer={Popover}
              rendererProps={{ preferredPlacement: "bottom" }}>
              <MenuTrigger style={styles.info}>
              </MenuTrigger>
              <MenuOptions>
              </MenuOptions>
            </Menu>
          </View>
          <Text style={{
            textAlign: 'center',
            color: appColors.gray,
            fontSize: fontSizes.FONT18,
            fontFamily: appFonts.regular,
            marginTop: windowHeight(8),
            paddingHorizontal: windowWidth(15)
          }}>{translateData.noInternettTitttle}</Text>
        </View>
      )}
    </View>
  );
}
