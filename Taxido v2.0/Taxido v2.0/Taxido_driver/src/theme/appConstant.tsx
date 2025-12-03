import { Dimensions, PixelRatio, Platform } from 'react-native'

export let SCREEN_HEIGHT = Dimensions.get('window').height
export let SCREEN_WIDTH = Dimensions.get('window').width

export const IsIOS = Platform.OS === 'ios'
export const IsAndroid = Platform.OS === 'android'

export const windowHeight = (height: number | string): number => {
  const tempHeight = typeof height === 'number' ? height : parseFloat(height)
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * tempHeight) / 100)
}

export const windowWidth = (width: number | string): number => {
  const tempWidth = typeof width === 'number' ? width : parseFloat(width)
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * tempWidth) / 100)
}

export const fontSizes = {
  FONT1: windowWidth(1),
  FONT2: windowWidth(2),
  FONT2HALF: windowWidth(2.5),
  FONT3: windowWidth(3),
  FONT3SMALL: windowWidth(3.3),
  FONT3HALF: windowWidth(3.5),
  FONT4: windowWidth(4),
  FONT4HALF: windowWidth(4.5),
  FONT5: windowWidth(5),
  FONT5HALF: windowWidth(5.5),
  FONT6: windowWidth(6),
  FONT6HALF: windowWidth(6.5),
  FONT7: windowWidth(7),
  FONT7HALF: windowWidth(7.5),
  FONT8: windowWidth(8),
  FONT9: windowWidth(9),
  FONT10: windowWidth(10),
}
