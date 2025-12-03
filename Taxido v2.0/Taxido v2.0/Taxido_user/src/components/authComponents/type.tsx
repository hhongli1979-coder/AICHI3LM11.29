import { ReactNode } from "react";

export interface AuthContainerProps {
    container: ReactNode;
    topSpace: any,
    imageShow: boolean,
}


export interface AuthTextProps {
    title: string;
    subtitle: string;
}


export interface NewUserTextProps {
    title?: string;
    subtitle?: string;
    onPress?: () => void;
}

export interface SocialButtonProps {
    value: ReactNode;
    title: string;
}
