export const textRTLStyle = (value: boolean): string => {
  var direction = value ? 'right' : 'left';
  return direction;
};
export const viewRTLStyle = (value: boolean): string => {
  var direction = value ? 'row-reverse' : 'row';
  return direction;
};
export const imageRTLStyle = (value: boolean): number => {
  var direction = value ? -1 : 1;
  return direction;
};
export const viewSelfRTLStyle = (value: boolean): string => {
  var direction = value ? 'flex-start' : 'flex-end';
  return direction;
};
