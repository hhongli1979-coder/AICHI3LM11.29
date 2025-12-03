import AsyncStorage from '@react-native-async-storage/async-storage';

const setValue = async (key: string, value: string) => {
  const item = await AsyncStorage.setItem(key, value);
  return item;
};

const getValue = async (val: string) => {
  const item = await AsyncStorage.getItem(val);
  return item;
};

const deleteValue = async (val: string) => {
  var item = await AsyncStorage.removeItem(val);
  return item;
};

const clearValue = async () => {
  await AsyncStorage.clear();
};

export { setValue, getValue, deleteValue, clearValue };
