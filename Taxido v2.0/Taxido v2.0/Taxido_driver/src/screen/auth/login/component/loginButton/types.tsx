import { ImageSourcePropType } from 'react-native'

interface CustomButtonProps {
  imageSource: ImageSourcePropType
  buttonText: string
  onPress?: () => void
}

export default CustomButtonProps
