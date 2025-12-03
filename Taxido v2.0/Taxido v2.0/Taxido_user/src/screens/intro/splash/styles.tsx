import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get("window");


const styles = StyleSheet.create({
  img: {
    width: width,  
    height: height, 
    resizeMode: "contain",
  },
});
export { styles };
