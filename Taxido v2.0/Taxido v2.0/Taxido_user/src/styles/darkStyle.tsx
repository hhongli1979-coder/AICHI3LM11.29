import { appColors } from "@src/themes";
export const bgFullStyle = (value: boolean): string => {
  var direction = value ? appColors.darkHeader : appColors.whiteColor;
  return direction;
};
export const bgFullLayout = (value: boolean): string => {
  var direction = value ? appColors.darkHeader : appColors.lightGray;
  return direction;
};
export const bgContainer = (value: boolean): string => {
  var direction = value ? appColors.darkPrimary: appColors.whiteColor;
  return direction;
};
export const lineContainer = (value: boolean): string => {
  var direction = value ? 'red' : appColors.lightGray;
  return direction;
};
export const ShadowContainer = (value: boolean): string => {
  var direction = value ?appColors.darkBorder : appColors.border;
  return direction;
};
export const textColorStyle = (value: boolean): string => {
  var direction = value ? appColors.whiteColor : appColors.primaryText;
  return direction;
};
export const iconColorStyle = (value: boolean): string => {
  var direction = value ? appColors.whiteColor : appColors.primaryText;
  return direction;
};
export const linearColorStyle = (value: boolean): string => {
  var direction = value ? appColors.primaryText : appColors.lightGray;
  return direction;
};
export const linearColorStyleTwo = (value: boolean): string => {
  var direction = value ? appColors.primaryText : appColors.whiteColor;
  return direction;
};
