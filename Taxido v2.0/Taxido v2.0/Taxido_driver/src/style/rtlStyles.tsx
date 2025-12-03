export const textRtlStyle = (value: boolean) => {
  var textStyle = value ? 'right' : 'left'
  return textStyle
}

export const viewRtlStyle = (value: boolean) => {
  var viewStyle = value ? 'row-reverse' : 'row'
  return viewStyle
}

export const imageRtlStyle = (value: boolean) => {
  var imageStyle = value ? [{ scaleX: -1 }] : [{ scaleX: 1 }]
  return imageStyle
}

export const viewSelfRtlStyle = (value: boolean) => {
  var viewSelfStyle = value ? 'flex-start' : 'flex-end'
  return viewSelfStyle
}
