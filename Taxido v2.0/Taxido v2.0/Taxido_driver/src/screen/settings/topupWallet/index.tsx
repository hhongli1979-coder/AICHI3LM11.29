import React, { useRef, useState } from 'react'
import { View } from 'react-native'
import { AddTopUp } from './component/'
import { Header, Button } from '../../../commonComponents'
import styles from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { fleetWalletData, fleetWithdrawData, fleetWithdrawRequestData, walletData, withdrawData, withdrawRequestData } from '../../../api/store/action'
import { notificationHelper } from '../../../commonComponents'
import appColors from '../../../theme/appColors'
import { WithdrawDataInterface } from '../../../api/interface/walletInterface'
import { useNavigation } from '@react-navigation/native'
import { AppDispatch } from '../../../api/store'

export function TopupWallet() {
  const { translateData } = useSelector((state: any) => state.setting)
  const dispatch = useDispatch<AppDispatch>()
  const { selfDriver } = useSelector((state: any) => state.account);
  const [loader, setLoader] = useState<boolean>(false)
  const navigation = useNavigation()
  const formRef = useRef<{ getValues: () => { withdrawAmount: string, description: string } }>(null)

  const handleWithdraw = async () => {
    if (!formRef.current) return;

    if (!selfDriver?.payment_account?.default) {
      notificationHelper('', "Bank details are required to make a withdrawal", 'error');
      return;
    }

    const { withdrawAmount, description } = formRef.current.getValues();

    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      notificationHelper('', "Please enter a valid amount", 'error');
      return;
    }

    setLoader(true);

    const payload: WithdrawDataInterface = {
      amount: Number(withdrawAmount),
      message: description,
      payment_type: selfDriver?.payment_account?.default,
    };

    try {
      const res =
        selfDriver?.role === 'fleet_manager'
          ? await dispatch(fleetWithdrawData(payload)).unwrap()
          : await dispatch(withdrawData(payload)).unwrap();

      if (['success', 'pending', 'completed'].includes(res.status)) {
        if (selfDriver?.role === 'fleet_manager') {
          await dispatch(fleetWalletData());
          await dispatch(fleetWithdrawRequestData());
        } else {
          await dispatch(walletData());
          await dispatch(withdrawRequestData());
        }

        notificationHelper('', translateData.withdrawSuccessful, 'success');
        navigation.goBack();
      } else {
        notificationHelper('', res.message || translateData.somethingwentwrong, 'error');
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      notificationHelper('', "Withdrawal failed. Please try again.", 'error');
    } finally {
      setLoader(false);
    }
  };


  return (
    <View style={styles.main}>
      <Header title={translateData.topupWallet} />

      <View style={styles.listView}>
        <AddTopUp ref={formRef} />
      </View>

      <View style={styles.button}>
        <Button
          backgroundColor={appColors.primary}
          color={appColors.white}
          title={translateData.addTopupBalance}
          margin={0}
          onPress={handleWithdraw}
          loading={loader}
        />
      </View>
    </View>
  )
}
