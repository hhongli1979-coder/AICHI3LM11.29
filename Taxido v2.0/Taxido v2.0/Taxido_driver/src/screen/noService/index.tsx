import React, { useState } from "react";
import styles from "./styles";
import Images from "../../utils/images/images";
import { Image, Text, View } from "react-native";
import { Button, notificationHelper } from "../../commonComponents";
import Icons from "../../utils/icons/icons";
import appColors from "../../theme/appColors";
import { useValues } from "../../utils/context";
import { useDispatch, useSelector } from "react-redux";
import useStoredLocation from "../../commonComponents/helper/useStoredLocation";
import { useAppNavigation } from "../../utils/navigation";
import { currentZone } from "../../api/store/action";
import { AppDispatch } from "../../api/store";


export function NoService() {

    const dispatch = useDispatch<AppDispatch>();
    const { isDark, viewRtlStyle } = useValues()
    const { latitude, longitude } = useStoredLocation();
    const { replace } = useAppNavigation();
    const [zoneLoading, setZoneLoading] = useState(false);
    const { translateData } = useSelector((state: any) => state.setting)


    const gotoRefresh = () => {
        setZoneLoading(true)
        dispatch(currentZone({ lat: latitude, lng: longitude }))
            .unwrap()
            .then((res) => {
                if (!res.success) {
                    replace("Splash")
                }
                setZoneLoading(false)
            })
            .catch((error) => {
                notificationHelper('', error, 'error')
                setZoneLoading(false)

            });
    };


    return (
        <View style={[styles.main, { backgroundColor: isDark ? appColors.black : appColors.white }]}>
            <Image source={isDark ? Images.noServiceDark : Images.noService} resizeMode="contain" style={styles.image} />
            <View style={[styles.container, { flexDirection: viewRtlStyle }]}>
                <Text style={[styles.title, { color: isDark ? appColors.white : appColors.primaryFont }]}>{translateData.noServiceText}</Text>
                <Icons.Info />
            </View>
            <Text style={styles.text}>{translateData.noServiceDescription}</Text>
            <View style={styles.btn}>
                <Button title={translateData.refresh} backgroundColor={appColors.primary} color={appColors.white} onPress={gotoRefresh} loading={zoneLoading} />
            </View >
        </View >
    )
}