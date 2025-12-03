import React, { useState } from 'react';
import { View, Dimensions, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { HeaderContainer } from '@src/commonComponent';
import { appColors, windowHeight } from '@src/themes';
import { Download } from '@src/utils/icons';
import { useValues } from "@src/utils/context/index";
import { useSelector } from 'react-redux';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { URL } from '@src/api/config';

export function PdfViewer({ route }) {
    const { pdfUrl, rideNumber } = route?.params || {};
    const { bgContainer, imageRTLStyle, isDark, bgFullStyle } = useValues();
    const [loading, setLoading] = useState(true);
    const { translateData } = useSelector(state => state.setting);
    const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
    const [isSharing, setIsSharing] = useState(false);

    const downloadPdf = async () => {
        if (isSharing) return;
        setIsSharing(true);

        const name = `invoice${rideNumber}.pdf`;
        const pdfUrl = `${URL}/api/ride/rider-invoice/${rideNumber}`;
        const downloadDest =
            Platform.OS === 'android'
                ? `${RNFS.DownloadDirectoryPath}/${name}`
                : `${RNFS.DocumentDirectoryPath}/${name}`;

        try {
            const fileExists = await RNFS.exists(downloadDest);

            if (!fileExists) {
                await RNFS.downloadFile({
                    fromUrl: pdfUrl,
                    toFile: downloadDest,
                }).promise;
            }

            await Share.open({
                url: `file://${downloadDest}`,
                type: 'application/pdf',
                title: 'Share PDF',
            });
        } catch (err) {
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <View style={{ flex: 1, }}>
            <View style={[styles.headerView, { backgroundColor: bgFullStyle }]}>
                <HeaderContainer
                    show={true}
                    icon={
                        <View
                            style={[
                                styles.container,
                                {
                                    backgroundColor: bgContainer,
                                    borderColor: isDark ? appColors.darkBorder : appColors.border,
                                },
                                { transform: [{ scale: imageRTLStyle }] },
                            ]}>
                            <Download
                            />
                        </View>
                    }
                    onPressIcon={() => {
                        if (loading) {
                            return;
                        }
                        downloadPdf();
                    }}

                    value={translateData.invoice}

                />
            </View>
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={appColors.primary} />
                </View>
            )}
            <WebView
                source={{ uri: googleViewerUrl }}
                style={{ flex: 1, width: Dimensions.get('window').width }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onError={(error) => {
                    setLoading(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -25,
        marginLeft: -25,
        zIndex: 10,
    },
    container: {
        width: windowHeight(32),
        height: windowHeight(32),
        backgroundColor: appColors.whiteColor,
        borderWidth: windowHeight(1),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: windowHeight(5),
    },
    headerView: {
        height: windowHeight(60),
        justifyContent: 'center',
    },
});