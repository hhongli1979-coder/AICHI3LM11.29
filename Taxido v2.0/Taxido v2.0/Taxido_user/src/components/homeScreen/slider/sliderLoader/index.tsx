import React from "react";
import { ScrollView, View } from "react-native";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { appColors, windowHeight, windowWidth } from "@src/themes";
import { useValues } from "@src/utils/context/index";;

export function SliderLoader() {
  const { isDark } = useValues();
  const loaders = new Array(4).fill(null);

  const backgroundColor = isDark ? appColors.bgDark : appColors.loaderBackground;
  const foregroundColor = isDark ? appColors.darkPrimary : appColors.loaderLightHighlight;
  return (
    <ScrollView>
      <View style={{ alignItems: "center", width: "100%", top: windowHeight(13) }}>
        <ContentLoader
          speed={2}
          width={windowWidth(440)}
          height={windowHeight(155)}
          backgroundColor={isDark ? appColors.bgDark : appColors.loaderBackground}
          foregroundColor={isDark ? appColors.darkPrimary : appColors.loaderLightHighlight}
        >
          <Rect x="0" y="0" width="100%" height={windowHeight(140)} rx={windowHeight(8)} />
        </ContentLoader>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: windowWidth(5.9),
          left: windowHeight(4),
          top: windowHeight(10)
        }}
      >
        {loaders.map((_, index) => (
          <ContentLoader
            key={index}
            speed={2}
            width={90}
            height={90}
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
            style={{ marginHorizontal: windowWidth(2.8) }}
          >
            <Rect x={windowHeight(7)} y={windowHeight(10)} width={windowHeight(50)} height={windowHeight(45)} rx={windowHeight(4)} />
            <Rect x={windowHeight(7.5)} y={windowHeight(60)} rx={windowHeight(2.5)} ry={windowHeight(2.5)} width={windowHeight(49)} height={windowHeight(8)} />
          </ContentLoader>
        ))}
      </View>
      <View
        style={{
          backgroundColor: appColors.whiteColor,
          padding: windowHeight(10),
          margin: windowHeight(10),
          borderRadius: windowHeight(5),
          top: windowHeight(13),
          width: '95%',
          alignSelf: 'center',
          height: windowHeight(138)
        }}
      >
        <ContentLoader
          speed={2}
          width={"100%"}
          height={windowHeight(40)}
          backgroundColor={appColors.loaderBackground}
          foregroundColor={appColors.loaderLightHighlight}
          style={{
            backgroundColor: appColors.lightGray,
            width: "100%",
            height: windowHeight(40),
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: windowWidth(15),
            borderRadius: windowHeight(5),
          }}
        >
          <Rect x={windowHeight(10)} y={windowHeight(8)} rx={windowHeight(3)} ry={windowHeight(3)} width={windowHeight(25)} height={windowHeight(25)} />
          <Rect x={windowHeight(43)} y={windowHeight(15)} rx={windowHeight(2)} ry={windowHeight(2)} width={windowWidth(70)} height={windowHeight(10)} />
        </ContentLoader>
        <Rect x={windowHeight(5)} y={windowHeight(50)} width={windowWidth(30)} height={windowHeight(10)} rx={windowHeight(3)} ry={windowHeight(3)} />
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: windowHeight(10) }}>
          <ContentLoader speed={2} width={"100%"} height={windowHeight(30)} backgroundColor={appColors.loaderBackground} foregroundColor={appColors.loaderLightHighlight}>
            <Rect x={windowHeight(3)} y={windowHeight(3)} width={windowHeight(25)} height={windowHeight(25)} rx={windowHeight(3)} ry={windowHeight(3)} />
            <Rect x={windowHeight(35)} y={windowHeight(12)} width={windowWidth(60)} height={windowHeight(10)} rx={windowHeight(2)} ry={windowHeight(2)} />
          </ContentLoader>
        </View>

        <Rect x={windowHeight(5)} y={windowHeight(90)} width={"95%"} height={windowHeight(1)} rx={windowHeight(1)} ry={windowHeight(1)} />
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: windowHeight(10) }}>
          <ContentLoader speed={2} width={"100%"} height={windowHeight(30)} backgroundColor={appColors.loaderBackground} foregroundColor={appColors.loaderLightHighlight}>
            <Rect x={windowHeight(3)} y={windowHeight(3)} width={windowHeight(25)} height={windowHeight(25)} rx={windowHeight(3)} ry={windowHeight(3)} />
            <Rect x={windowHeight(35)} y={windowHeight(12)} width={windowWidth(60)} height={windowHeight(10)} rx={windowHeight(2)} ry={windowHeight(2)} />
          </ContentLoader>
        </View>
      </View>
      <View style={{ marginTop: windowHeight(15) }}>
        <ContentLoader
          speed={2}
          width={'107%'}
          height={windowHeight(215)}
          backgroundColor={backgroundColor}
          foregroundColor={foregroundColor}
        >
          <Rect x={windowWidth(10)} y={windowHeight(5)} width={windowWidth(120)} height={windowHeight(15)} rx={windowHeight(3)} ry={windowHeight(3)} />
          <Rect x={windowWidth(10)} y={windowHeight(30)} width='90%' height={windowHeight(210)} rx={windowHeight(4)} ry={windowHeight(4)} />
          <Circle cx={windowWidth(40)} cy={windowHeight(70)} r={windowHeight(25)} x={windowHeight(20)} y={windowHeight(0)} />
          <Rect x={windowWidth(130)} y={windowHeight(60)} width='50%' height={windowHeight(15)} rx={windowHeight(3)} ry={windowHeight(3)} />
          <Rect x={windowWidth(38)} y={windowHeight(110)} width='70%' height={windowHeight(19)} rx={windowHeight(3)} ry={windowHeight(3)} />
          <Circle cx={windowWidth(40)} cy={windowHeight(160)} r={windowHeight(5)} />
          <Rect x={windowWidth(55)} y={windowHeight(155)} width={windowWidth(200)} height={windowHeight(12)} rx={windowHeight(3)} ry={windowHeight(3)} />
          <Circle cx={windowWidth(40)} cy={windowHeight(190)} r={windowHeight(5)} />
          <Rect x={windowWidth(55)} y={windowHeight(185)} width={windowWidth(160)} height={windowHeight(12)} rx={windowHeight(3)} ry={windowHeight(3)} />
        </ContentLoader>
      </View>
      <View style={{ marginTop: windowHeight(15) }}>
        {[...Array(3)].map((_, index) => (
          <ContentLoader
            key={index}
            speed={1.5}
            width={"95.9%"}
            height={windowHeight(108)}
            backgroundColor={backgroundColor}
            foregroundColor={foregroundColor}
            style={{
              backgroundColor: appColors.whiteColor,
              borderRadius: windowHeight(6),
              padding: windowHeight(15),
              marginBottom: windowHeight(15),
              width: "98%",
              alignSelf: 'center'
            }}
          >
            <Rect x="5%" y={windowHeight(10)} width="50%" height="20" rx={windowHeight(3)} ry={windowHeight(3)} />
            <Rect x="5%" y={windowHeight(35)} width="80%" height="15" rx={windowHeight(3)} ry={windowHeight(3)} />
            <Rect x="5%" y={windowHeight(55)} width="60%" height="15" rx={windowHeight(3)} ry={windowHeight(3)} />
            <Rect x="5%" y={windowHeight(76)} width="30%" height="25" rx={windowHeight(3)} ry={windowHeight(3)} />
            <Rect x="75%" y={windowHeight(76)} width="20%" height="25" rx={windowHeight(3)} ry={windowHeight(3)} />
          </ContentLoader>
        ))}
      </View>
    </ScrollView>
  );
}
