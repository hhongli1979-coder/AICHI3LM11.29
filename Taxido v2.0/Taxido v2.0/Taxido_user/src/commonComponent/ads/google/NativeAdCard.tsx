import { appColors, appFonts, fontSizes, windowHeight } from "@src/themes";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
    NativeAd,
    NativeAdView,
    NativeAsset,
    NativeMediaView,
    NativeAssetType,
    TestIds,
    AdEventType,
} from "react-native-google-mobile-ads";
import { useSelector } from "react-redux";

type Props = {
    heights?: number;
    adsHeight?: number;
};

const NativeAdComponent = ({ heights = windowHeight(40), adsHeight }: Props) => {
    const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);
    const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting)

    const NativeAdsId = taxidoSettingData?.taxido_values?.ads?.native_android_unit_id

    useEffect(() => {
        let removeListener: any;

        NativeAd.createForAdRequest(TestIds.NATIVE)
            .then(ad => {
                setNativeAd(ad);

                removeListener = ad.addAdEventListener(
                    AdEventType.LOADED,
                    () => console.log("Native ad loaded")
                );

                ad.load();
            })
            .catch(error => console.error("Error loading native ad:", error));

        return () => {
            if (removeListener) removeListener();
        };
    }, []);

    if (!nativeAd) {
        return (
            <View style={[styles.placeholder, { height: heights }]}>
                <Text>{translateData?.loadingAd}</Text>
            </View >
        );
    }

    return (
        <NativeAdView nativeAd={nativeAd} style={[styles.adView, { height: heights }]}>
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
                <Text style={styles.headline}>{nativeAd.headline}</Text>
            </NativeAsset>

            <NativeMediaView style={[styles.media, { height: adsHeight }]} />

            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
                <View style={styles.ctaButton}>
                    <Text style={styles.ctaText}>{nativeAd.callToAction}</Text>
                </View>
            </NativeAsset>
        </NativeAdView>
    );
};


export default NativeAdComponent;

const styles = StyleSheet.create({
    placeholder: {
        width: "92%",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eee",
        borderRadius: windowHeight(10),
        marginVertical: windowHeight(8),
    },
    adView: {
        width: "100%",
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: windowHeight(10),
        padding: windowHeight(10),
        overflow: "hidden",
        alignItems: 'center',
        alignContent: 'center'
    },

    headline: {
        fontSize: fontSizes.FONT22,
        fontFamily: appFonts.medium,
        marginBottom: windowHeight(5)
    },
    media: {
        width: "100%",
        marginVertical: windowHeight(5)
    },

    ctaButton: {
        width: "100%",
        marginTop: windowHeight(8),
        paddingVertical: windowHeight(5),
        paddingHorizontal: windowHeight(10),
        borderRadius: windowHeight(5),
        backgroundColor: "#007bff",
        alignSelf: "flex-start",
    },
    ctaText: {
        textAlign: "center",
        color: appColors.whiteColor,
        fontSize: fontSizes.FONT20,
        fontFamily: appFonts.medium,
    },
});
