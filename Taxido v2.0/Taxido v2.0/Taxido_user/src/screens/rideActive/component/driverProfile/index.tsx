import { View, Text, Image, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { Info, Star, Message, Call } from '@utils/icons'
import { commonStyles } from '@src/styles/commonStyle'
import styles from './styles'
import Images from '@utils/images';
import { useTheme } from '@react-navigation/native'
import { useValues } from '@src/utils/context/index';
import { useAppNavigation } from '@src/utils/navigation'
import { useSelector } from 'react-redux'


interface DriverProfileProps {
    borderRadius: number;
    backgroundColor: string;
    iconColor: string;
    showInfoIcon: boolean;
    showCarTitle?: boolean;
}
export function DriverProfile({ borderRadius, showInfoIcon, showCarTitle }: DriverProfileProps) {
    const { colors } = useTheme();
    const { viewRtlStyle } = useValues();
    const { navigate } = useAppNavigation();
    const { translateData } = useSelector((state) => state.setting);

    const gotoChat = () => {
        navigate('ChatScreen')
    };

    const gotoCall = () => {
        Linking.openURL(`tel`);
    };

    return (
        <View style={[styles.profile, { backgroundColor: colors.card, flexDirection: viewRtlStyle }]}>
            <View style={[styles.subProfile, { flexDirection: viewRtlStyle }]}>
                <Image source={Images.profileUser} style={[styles.userImage, { borderRadius: borderRadius }]} />
                <View>
                    <View style={[commonStyles.directionRow, { flexDirection: viewRtlStyle }]}>
                        <Text style={[styles.userName, { color: colors.text }]}>{translateData.name}</Text>
                        {showInfoIcon && (
                            <View style={commonStyles.iconSpace}>
                                <Info />
                            </View>
                        )}
                    </View>
                    <View style={{ flexDirection: viewRtlStyle }}>

                        {showCarTitle && (
                            <View style={{ flexDirection: viewRtlStyle }}>
                                <Text style={styles.carTitle}>{translateData.gvFewsf}</Text>
                                <View style={styles.line} />
                            </View>
                        )}
                        <View style={commonStyles.iconView}>
                            <Star />
                        </View>
                        <Text style={[commonStyles.rating, { color: colors.text }]}>4.8</Text>
                        <Text style={commonStyles.totalReview}>(127)</Text>
                    </View>
                </View>
            </View>
            <View style={[commonStyles.containerBtn, { flexDirection: viewRtlStyle }]}>
                <TouchableOpacity style={[commonStyles.iconButton, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={gotoChat} activeOpacity={0.7}
                >
                    <Message />
                </TouchableOpacity>
                <TouchableOpacity style={[commonStyles.iconButton, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={gotoCall} activeOpacity={0.7}
                >
                    <Call />
                </TouchableOpacity>
            </View>
        </View>
    )
}