import { KeyboardTypeOptions } from 'react-native'

interface InputProps {
  placeholder?: string
  keyboardType?: KeyboardTypeOptions
  value?: string
  warning?: string
  onChangeText?: (text: string) => void
  showWarning?: boolean
  emailFormatWarning?: string
  icon?: React.ReactNode
  titleShow?: boolean
  title?: string
  backgroundColor?: any
  rightIcon?: boolean | undefined | null | any
  onPress?: () => void
  secureText?: boolean
  borderColor?: string
  editable?: string | any,
  multiline?: any,
  iconText?: any,
  autoCapitalize?: any,
  style?: any;
  textAlignVertical?: string | number | any,
  numberOfLines?: number
  ref?:any
}

export default InputProps
