import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const CustomBackHandler = ({ targetScreen = 'MyTabs' }) => {
  const { navigate }: any = useNavigation();

  useEffect(() => {
    const backAction = () => {
      navigate(targetScreen);
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigate, targetScreen]);

  return null;
};

