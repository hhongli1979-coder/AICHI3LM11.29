import React, { useCallback, useEffect } from 'react'
import { BackHandler, View } from 'react-native'
import { Header } from '../component'
import styles from './styles'
import { RideStatus } from '../rideStatus'
import appColors from '../../../theme/appColors'
import { rideDataGets } from '../../../api/store/action'
import { useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { AppDispatch } from '../../../api/store'
import { useAppNavigation } from '../../../utils/navigation'

export function MyRide() {
  const dispatch = useDispatch<AppDispatch>()
  const navigation = useAppNavigation()

  useFocusEffect(
    useCallback(() => {
      dispatch(rideDataGets())
    }, [dispatch])
  );

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View style={styles.main}>
      <Header />
      <View>
        <View
          style={{
            backgroundColor: appColors.graybackground,
          }}
        >
          <RideStatus />
        </View>
      </View>
    </View>
  )
}

export default MyRide
