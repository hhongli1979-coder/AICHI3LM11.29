import { ReactNode } from "react";
import { DimensionValue, TextStyle } from "react-native";

export interface FilledBarsProps {
    fill: number;
    totalBars?: number;
}

export interface ButtonInterface {
    title?: string,
    onPress?: () => void,
    width?: number,
    height?: number,
    backgroundColor?: string,
    textColor?: string,
    loading?: string | boolean | any
    disabled?: string | boolean | any
}

export interface CheckBoxProps {
    isChecked: boolean,
    onPress: () => void,
    label: string,
    labelStyle?: TextStyle,
    style?:any
}

export interface CommonModelTypes {
    isVisible?: boolean;
    value?: React.ReactNode;
    animationType?: any;
    paddingTop?: DimensionValue;
    justifyContent?: any;
    closeModal?: any;
    onPress?: any;
    onBackdropPress?: any;
}

export interface DetailContainerProps {
    title: string;
    value: ReactNode;
}

export interface HeaderTypes {
    value?: string;
    container?: ReactNode;
    backgroundColor?: string;
}

export interface HeaderTabProps {
    tabName: string;
}

export interface HeaderPropType {
    value?: string;
    show?: boolean;
    icon?: ReactNode;
    onPressIcon?: () => void;
}

export interface IconBgPropType {
    onPress?: () => void;
    icon?: ReactNode;
    height?: number;
    backgroundColor?: string;
    borderColor: string;
}

export interface InputTextProps {
    title?: string;
    placeholder: string;
    icon?: ReactNode;
    show?: boolean;
    marginVertical?: number;
    backgroundColor?: string;
    placeholderTextColor?: string;
    rightIcon?: ReactNode;
    onPress?: () => void;
    value?: string;
    warningText?: string | number | boolean;
    keyboard?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | "number-pad";
    showTitle?: boolean;
    secureText?: boolean;
    onChangeText?: (text: string) => void;
    customColor?: string;
    borderColor?: string,
    editable?: boolean,
    autoCapitalize?: any,
}

export interface LocationDetailsPrpos {
    locationDetails: string
}

export interface HeaderPropType {
    value?: string;
    show?: boolean;
    icon?: ReactNode;
    onPressIcon?: () => void;
}

export interface MapViewProps {
    userLocation: string;
    driverId: string;
    markerImage?: string;
    driverLocation?: any; //  new prop
    setDriverLocation?: (value: any) => void; //  new prop
    waypoints?: Array<{ lat: number; lng: number }>; // Intermediate stops
    onDurationChange?: (duration: any) => void; // Duration callback
}

export interface CustomNotificationProps {
    title?: string | any,
    description?: any,
    alertType?: any
}

export interface ProgressbarProps {
    value?: any
}

export interface RadioButtonProps {
    onPress?: () => void | any;
    checked?: boolean;
    color?: string;
    label?: string;
    selected?: boolean;
}

export interface SolidLineProps {
    width?: number | string | 'auto';
    height?: number;
    color?: string;
    marginVertical?: number;
}

export interface SwitchProps {
    Enable: boolean;
    onPress: () => void;
}

export interface TitleProps {
    title: string;
}

export interface toggleMenuProp {
    title: string;
    options: any;
    onSelect: any;
    initialPlaceholder: string;
    position: boolean;
    iconShow: boolean;
    icon: ReactNode;
    titleShow: boolean;
}

export interface VerticalLineType {
    dynamicHeight: any;
}
