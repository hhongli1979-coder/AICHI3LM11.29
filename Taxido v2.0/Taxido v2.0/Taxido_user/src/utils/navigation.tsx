import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "src/navigation/types";
import { useIsFocused, RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";


export const useAppNavigation = () => {
  return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
};


export const IsFocused = () => {
  return useIsFocused();
}

export const useAppRoute = <T extends keyof RootStackParamList>() => {
  return useRoute<RouteProp<RootStackParamList, T>>();
}