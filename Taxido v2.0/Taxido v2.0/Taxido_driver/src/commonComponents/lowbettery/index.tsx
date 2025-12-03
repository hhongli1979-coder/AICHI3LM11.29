// src/hooks/useBatteryLowLog.ts
import { useEffect, useRef } from 'react';
import DeviceInfo from 'react-native-device-info';
import { notificationHelper } from '../../commonComponents'
import { useSelector } from 'react-redux'

export function useBatteryLowLog() {
      const { translateData } = useSelector((state: any) => state.setting)
    
    const hasLogged20 = useRef(false);
    const hasLogged10 = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const checkBattery = async () => {
            try {
                const level = await DeviceInfo.getBatteryLevel(); // between 0 and 1
                const percent = Math.round(level * 100);

                if (percent <= 20 && !hasLogged20.current) {
                    notificationHelper('', translateData?.bettryhalf , 'error');
                    hasLogged20.current = true;
                }

                if (percent <= 10 && !hasLogged10.current) {
                    notificationHelper('',translateData?.bettry, 'error');
                    hasLogged10.current = true;
                }

                if (percent > 76) {
                    hasLogged20.current = false;
                    hasLogged10.current = false;
                }
            } catch (e) {
            }
        };

        intervalRef.current = setInterval(checkBattery, 60000);
        checkBattery();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);
}
