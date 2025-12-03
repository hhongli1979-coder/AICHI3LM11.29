import React, { useState } from "react";
import styles from "./style";
import Images from "@src/utils/images";
import { Image, Text, View } from "react-native";
import { Info } from "@src/utils/icons";
import { useValues } from "@src/utils/context/index";;
import { appColors } from "@src/themes";
import { Button, notificationHelper } from "@src/commonComponent";
import { useDispatch, useSelector } from "react-redux";
import useStoredLocation from "@src/components/helper/useStoredLocation";
import { useAppNavigation } from "@src/utils/navigation";
import { userZone } from "@src/api/store/actions";

export function NoService() {
    const { viewRTLStyle, isDark, bgContainer } = useValues()
    const dispatch = useDispatch();
    const { latitude, longitude } = useStoredLocation();
    const { replace } = useAppNavigation();
    const [refreshLoading, setRefreshLoading] = useState(false);
    const { translateData } = useSelector((state: any) => state.setting);

    const gotoRefresh = () => {
        setRefreshLoading(true)
        dispatch(userZone({ lat: latitude, lng: longitude }))
            .unwrap()
            .then((res) => {
                if (!res.success) {
                    setRefreshLoading(false);
                    replace('Splash')
                }
            })
            .catch((error) => {
                setRefreshLoading(false);
                notificationHelper('', error, 'error');
            });
    };


    return (
        <View style={[styles.main, { backgroundColor: bgContainer }]}>
            <Image source={isDark ? Images.noServiceDark : Images.noServices} resizeMode="contain" style={styles.image} />
            <View style={[styles.container, { flexDirection: viewRTLStyle }]}>
                <Text style={[styles.title, { color: isDark ? appColors.whiteColor : appColors.primaryText }]}>{translateData.ServiceUnavailableNo}</Text>
                <Info />
            </View>
            <Text style={styles.text}>{translateData.ServiceUnavailableNoTextt}</Text>
            <View style={styles.btn}>
                <Button title={translateData.refresh} onPress={gotoRefresh} loading={refreshLoading} />
            </View>
        </View>
    )
}