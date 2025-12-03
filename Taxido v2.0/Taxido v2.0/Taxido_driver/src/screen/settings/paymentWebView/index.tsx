import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import { paymentVerify, selfDriverData } from '../../../api/store/action';
import { PaymentVerifyInterface } from '../../../api/interface/walletInterface';
import { URL as API_URL } from '../../../api/config';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { notificationHelper } from '../../../commonComponents';
import { AppDispatch } from '../../../api/store';

export function PaymentWebView({ route }: any) {
  const [hasVerified, setHasVerified] = useState<boolean>(false);
  const { reset } = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const { url, selectedPaymentMethod, dataValue } = route.params || {};

  const handleResponse = async (navState: any) => {

    if (!navState?.url) {
      return;
    }

    if (hasVerified) {
      return;
    }

    const { token, payerID } = parseQueryParams(navState.url);

    if (token && payerID) {
      setHasVerified(true);
      await fetchPaymentData(token, payerID);
      return;
    }

    if (
      navState.url.includes('/status') ||
      navState.url.includes('/payment-success') ||
      navState.url.includes('/p/success')
    ) {
      setHasVerified(true);
      await fetchPaymentData(null, null);
      return;
    }

  };

  const parseQueryParams = (urlString: string) => {
    try {
      const parsed = new URL(urlString);
      const params = Object.fromEntries(parsed.searchParams.entries());
      return {
        token: params?.token || null,
        payerID: params?.PayerID || null,
      };
    } catch (error) {
      return { token: null, payerID: null };
    }
  };

  const { translateData } = useSelector((state: any) => state.setting)

  const fetchPaymentData: any = async (token?: string, payerID?: string) => {
    try {
      const fetchUrl = `${API_URL}/${selectedPaymentMethod}/status${token && payerID ? `?token=${token}&PayerID=${payerID}` : ''
        }`;

      const payload: PaymentVerifyInterface = {
        item_id: dataValue.item_id,
        type: dataValue.type,
        transaction_id: payerID ?? '', // safe null/undefined fallback
      };

      await dispatch(paymentVerify(payload)).unwrap();

      const selfData = await dispatch(selfDriverData()).unwrap();

      if (selfData) {

        notificationHelper('', translateData?.topupsuccess, 'success');
        reset({
          index: 0,
          routes: [{ name: 'TabNav' }],
        });
      } else {
        notificationHelper('Warning', translateData?.error, 'warning');
      }
    } catch (error: any) {
      notificationHelper('Error', translateData?.tryagin, 'danger');
    }
  };


  return (
    <WebView
      style={styles.modalview}
      startInLoadingState
      incognito
      androidLayerType="hardware"
      cacheEnabled={false}
      cacheMode={'LOAD_NO_CACHE'}
      source={{ uri: url }}
      onNavigationStateChange={handleResponse}
    />
  );
}
