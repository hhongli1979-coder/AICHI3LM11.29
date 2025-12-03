import { Text, View } from 'react-native';
import React from 'react';
import { styles } from '../messageContainer/styles';
import { external } from '../../../styles/externalStyle';
import { commonStyles } from '../../../styles/commonStyle';
import { useValues } from '@src/utils/context/index';
import { appColors, windowWidth } from '@src/themes';
import { Notification } from '@src/utils/icons';

export function MessageItem({ item }: any) {
    const { isDark, textColorStyle, textRTLStyle, viewRTLStyle } = useValues();

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
        if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
        if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };


    return (
        <View
            style={[
                styles.container,
                { backgroundColor: isDark ? appColors.darkPrimary : appColors.whiteColor },
                { borderColor: isDark ? appColors.darkBorder : appColors.border, flexDirection: viewRTLStyle },
            ]}>
            <View
                style={[
                    styles.viewText,
                    { backgroundColor: isDark ? appColors.greenColor : appColors.lightGreen },
                ]}>
                <Notification colors={appColors.primary} />
            </View>
            <View style={[external.ph_10, { maxWidth: windowWidth(350) }]}>
                <Text style={[styles.titleText, { color: textColorStyle, textAlign: textRTLStyle }]}>
                    {item?.data?.title}
                </Text>
                <Text style={[styles.subTitleText, { color: textColorStyle, textAlign: textRTLStyle }]}>
                    {item?.data?.message}
                </Text>
                <Text style={[commonStyles.regularText, external.pt_5, { textAlign: textRTLStyle }]}>
                    {formatTimeAgo(item?.created_at)}
                </Text>
            </View>
        </View>
    );
};
