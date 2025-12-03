import { useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { navigate } from './navigationService';

export const Verificationhelper = () => {
    const { selfDriver } = useSelector((state: any) => state.account);

    useEffect(() => {
        if (!selfDriver?.id) return;

        const unsubscribe = firestore()
            .collection('driverTrack')
            .doc(selfDriver?.id.toString())
            .onSnapshot(doc => {
                if (!doc || !doc.exists) {
                    return;
                }
                const data = doc.data();

                if (data?.is_verified == 0) {
                    navigate('Verification');
                } else {
                    navigate('TabNav')
                }
            });
        return () => unsubscribe();
    }, [selfDriver?.id]);
};
