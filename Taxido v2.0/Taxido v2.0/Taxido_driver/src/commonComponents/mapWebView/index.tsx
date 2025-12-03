import React, { useEffect } from 'react';
import { BackHandler, Touchable, TouchableOpacity, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { windowHeight } from '../../theme/appConstant';
import appColors from '../../theme/appColors';
import appFonts from '../../theme/appFonts';

export function MapWebView() {
    const navigation = useNavigation();
    const route = useRoute();
    const { lat, lng, type }: any = route.params || {};
      const { translateData } = useSelector((state: any) => state.setting)

    const mapType = (type || '').toLowerCase();

    const url =
        mapType === 'waze'
            ? `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
            : mapType === 'bing'
                ? `https://bing.com/maps/default.aspx?cp=${lat}~${lng}`
                : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });

        return () => backHandler.remove();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ height: windowHeight(5), backgroundColor: appColors.activeColor, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: appColors.white, textAlign: 'center', justifyContent: 'center', fontFamily: appFonts.medium }}>{translateData?.gotoapp}</Text>
            </TouchableOpacity>
            <WebView source={{ uri: url }} />
        </View>
    );
};



